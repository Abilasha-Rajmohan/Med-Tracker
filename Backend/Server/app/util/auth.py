from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from app.core.config import SECRET_KEY
from pydantic import BaseModel
from fastapi import HTTPException

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 90


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


class TokenData(BaseModel):
    username: str | None = None


def verify_access_token(token: str) -> TokenData:
    try:
        # Decode the JWT
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        # Extract username (or "sub" claim)
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Token does not contain 'sub'")

        # Token is valid, return the username
        return TokenData(username=username)

    except JWTError as e:
        # Handle invalid or expired tokens
        raise HTTPException(status_code=401, detail="Invalid or expired token") from e

