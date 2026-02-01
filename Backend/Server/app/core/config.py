import os
#import subprocess

# DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgresuser:postgrespass@project_db:5432/projectdb")
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:postgres@localhost:5432/postgres")

#docker_ip_command = "docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' project_db"
#postgres_ip = subprocess.getoutput(docker_ip_command).strip()  # Fetch and strip any extra spaces/newlines

#DATABASE_URL = os.getenv("DATABASE_URL", f"postgresql+asyncpg://postgresuser:postgrespass@{postgres_ip}:5432/projectdb")

print(DATABASE_URL)

SECRET_KEY = os.getenv("SECRET_KEY", "GoodHealthForAll")
