from app.services import patient_service, adverse_side_effect_service, adverse_side_effect_detail_service
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.db.models import HealthCondition
from fastapi import APIRouter, status, Depends
from typing import List
from app.schemas.models import PatientCreate, HealthConditionCreate, MedicationCreate, AdverseSideEffectCreate, AdverseSideEffectSummary, AdverseSideEffectDetailRead, AdverseSideEffectDetailCreate, ProviderCreate, PatientCreateResponse, LoginRequest
from fastapi.security import OAuth2PasswordBearer

router = APIRouter()

# Define the OAuth2PasswordBearer scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


"""
    TODO: remove later
    For debugging purposes only as it 
    will be a possible security risk
"""
@router.get('/patient/all', summary='Get Patients List', description='Lists all patients available in the system')
async def read_all_patients(db: AsyncSession = Depends(get_db)):
    return await patient_service.get_all_patients(db)


@router.post("/patient/login", status_code=status.HTTP_200_OK, summary='Authenticate a registered patient')
async def login_user(login_request: LoginRequest, db: AsyncSession = Depends(get_db)):
    return await patient_service.patient_login(login_request, db)


@router.post('/patient', response_model=PatientCreateResponse, status_code=status.HTTP_201_CREATED, summary='Add new patient', description='Add a new patient to the system')
async def create_patient(patient: PatientCreate, db: AsyncSession = Depends(get_db)):
    return await patient_service.create_patient(patient, db)


@router.get('/patient/{patient_email}', status_code=status.HTTP_200_OK, summary='Get patient by email', description='Get a specific patient by their registered email address')
async def get_patient_details(patient_email: str, db: AsyncSession = Depends(get_db), token: str = Depends(oauth2_scheme)):
    return await patient_service.get_patient_by_email(patient_email, db, token)


@router.get('/patient/{patient_id}/health_conditions', status_code=status.HTTP_200_OK, summary='Get list of health conditions for specified patient', description='Get a detailed list of all health conditions for the specific patient')
async def get_health_conditions(patient_id: int, db: AsyncSession = Depends(get_db), token: str = Depends(oauth2_scheme)):
    return await patient_service.get_health_conditions_for_patient(patient_id, db, token)


@router.post('/patient/{patient_id}/health_condition', response_model=HealthConditionCreate, status_code=status.HTTP_201_CREATED, summary='Add health condition', description='Add health condition for a particular patient')
async def add_health_condition(patient_id: int, health_condition: HealthConditionCreate, db: AsyncSession = Depends(get_db), token: str = Depends(oauth2_scheme)):
    return await patient_service.create_health_condition(patient_id, health_condition, db, token)


@router.get('/patient/{patient_id}/medications', status_code=status.HTTP_200_OK, summary='Get list of medications for specified patient', description='Get a detailed list of all medications for the specific patient')
async def get_medications(patient_id: int, db: AsyncSession = Depends(get_db), token: str = Depends(oauth2_scheme)):
    return await patient_service.get_medications_for_patient(patient_id, db, token)


@router.post('/patient/{patient_id}/medication', response_model=MedicationCreate, status_code=status.HTTP_201_CREATED, summary='Add medication for patient', description='Add medication for a particular patient')
async def add_medication(patient_id: int, medication: MedicationCreate, db: AsyncSession = Depends(get_db), token: str = Depends(oauth2_scheme)):
    return await patient_service.add_medication(patient_id, medication.dict(), db, token)


@router.get('/adverse_side_effects/{patient_id}', response_model=list[AdverseSideEffectSummary])
async def get_adverse_side_effects_for_patient_endpoint(patient_id: int, db: AsyncSession = Depends(get_db)):
    return await adverse_side_effect_service.get_adverse_side_effects_for_patient(patient_id, db)


@router.post('/patient/{patient_id}/adverse_side_effect', response_model=AdverseSideEffectCreate, status_code=status.HTTP_201_CREATED, summary='Add side effect for patient', description='Add an adverse side effect for a particular patient')
async def add_adverse_side_effect(patient_id: int, side_effect_summary: AdverseSideEffectCreate, db: AsyncSession = Depends(get_db)):
    return await adverse_side_effect_service.create_adverse_side_effect(patient_id, side_effect_summary, db)


@router.put('/patient/{patient_id}/provider', response_model=ProviderCreate, status_code=status.HTTP_201_CREATED, summary='Add provider for patient', description='Add a provider for a particular patient.')
async def add_provider(patient_id: int, provider: ProviderCreate, db: AsyncSession = Depends(get_db), token: str = Depends(oauth2_scheme)):
    return await patient_service.create_provider_for_patient(patient_id, provider, db, token)


@router.get('/patient/{patient_id}/provider', status_code=status.HTTP_200_OK, summary='Get provider for patient', description='Get the provider for a particular patient.')
async def get_provider(patient_id: int, db: AsyncSession = Depends(get_db), token: str = Depends(oauth2_scheme)):
    return await patient_service.get_provider_for_patient(patient_id, db, token)


@router.get('/adverse_side_effect/{adverse_side_effect_id}/details', response_model=list[AdverseSideEffectDetailRead])
async def get_adverse_side_effect_details_endpoint(adverse_side_effect_id: int, db: AsyncSession = Depends(get_db)):
    return await adverse_side_effect_detail_service.get_adverse_side_effect_details(adverse_side_effect_id, db)


@router.post('/adverse_side_effect/details', response_model=AdverseSideEffectDetailRead, status_code=201)
async def create_adverse_side_effect_detail_endpoint(detail: AdverseSideEffectDetailCreate, db: AsyncSession = Depends(get_db)):
    return await adverse_side_effect_detail_service.create_adverse_side_effect_detail(detail, db)
