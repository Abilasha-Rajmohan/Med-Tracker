import logging

from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import and_
from app.db.models import Patient, HealthCondition, Medication, Provider, PatientProviderXref
from app.schemas.models import PatientCreate, HealthConditionCreate, MedicationCreate, ProviderCreate, PatientCreateResponse, LoginRequest
from app.util.auth import hash_password, verify_password, create_access_token, verify_access_token
from datetime import datetime

logger = logging.getLogger(__name__)


async def create_patient(patient_data: PatientCreate, db: AsyncSession):

    # Checking if patient with the same email already exists
    patient = await db.execute(select(Patient).where(Patient.email == patient_data.email))
    patient = patient.scalar_one_or_none()
    if patient:
        raise HTTPException(status_code=400, detail="Patient with email already exists")

    if not patient_data.password:
        raise HTTPException(status_code=400, detail="Patient needs a password to register")

    hashed_password = hash_password(patient_data.password)

    new_patient = Patient(
        first_name=patient_data.first_name,
        last_name=patient_data.last_name,
        gender=patient_data.gender,
        date_of_birth=patient_data.date_of_birth,
        phone=patient_data.phone,
        email=patient_data.email,
        hashed_password=hashed_password,
        address=patient_data.address,
        created_on=datetime.now(),
        updated_on=datetime.now(),
    )
    db.add(new_patient)
    await db.commit()
    await db.refresh(new_patient)  # Refresh to get the ID and other generated fields

    patient_create_response = PatientCreateResponse(
        patient_id=new_patient.patient_id,
        first_name=new_patient.first_name,
        last_name=new_patient.last_name,
        email=new_patient.email
    )

    return patient_create_response


async def patient_login(login_request: LoginRequest, db: AsyncSession):
    # Checking if patient with the same email already exists
    email = login_request.email
    password = login_request.password
    patient = await db.execute(select(Patient).where(Patient.email == email))
    patient = patient.scalar_one_or_none()
    if not patient or not verify_password(password, patient.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": patient.email})
    del patient.hashed_password
    return {
        "token": token,
        "token_type": "bearer",
        "patient_details": patient
    }


async def get_patient_by_email(email: str, db: AsyncSession, token):
    # Checking if patient exists
    patient = await db.execute(select(Patient).where(Patient.email == email))
    patient = patient.scalar_one_or_none()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found!")
    # Validate token
    token_data = verify_access_token(token)
    if patient.email != token_data.username:
        raise HTTPException(status_code=401, detail="Current patient not authorized to retrieve this info")
    del patient.hashed_password
    return patient


async def get_all_patients(db: AsyncSession):
    result = await db.execute(select(Patient))
    patients = result.scalars().all()
    if not patients:
        raise HTTPException(status_code=404, detail="Patients not present!")
    return patients


async def create_health_condition(patient_id: int, health_condition_data: HealthConditionCreate, db: AsyncSession, token):
    # checking if patient exists
    patient = await db.execute(select(Patient).where(Patient.patient_id == patient_id))
    patient = patient.scalar_one_or_none()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found!")

    # Validate token
    token_data = verify_access_token(token)
    if patient.email != token_data.username:
        raise HTTPException(status_code=401, detail="Current patient not authorized to retrieve this info")

    # creating HealthCondition instance
    new_health_condition = HealthCondition(
        patient_id=patient_id,
        condition_name=health_condition_data.condition_name,
        code=health_condition_data.code,
        diagnosed_on=health_condition_data.diagnosed_on,
        condition_info=health_condition_data.condition_info,
        notes=health_condition_data.notes,
        created_on=datetime.utcnow(),
        updated_on=datetime.utcnow(),
        active=True
    )
    db.add(new_health_condition)
    await db.commit()
    await db.refresh(new_health_condition)
    return new_health_condition


async def get_health_conditions_for_patient(patient_id: int, db: AsyncSession, token):
    # checking if patient exists
    patient = await db.execute(select(Patient).where(Patient.patient_id == patient_id))
    patient = patient.scalar_one_or_none()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found!")

    # Validate token
    token_data = verify_access_token(token)
    if patient.email != token_data.username:
        raise HTTPException(status_code=401, detail="Current patient not authorized to retrieve this info")

    result = await db.execute(select(HealthCondition).where(HealthCondition.patient_id == patient_id))
    health_conditions = result.scalars().all()
    if not health_conditions:
        raise HTTPException(status_code=404, detail="No health conditions found for this patient!")
    return health_conditions


async def add_medication(patient_id: int, medication_data: MedicationCreate, db: AsyncSession, token):
    # checking if patient exists
    patient = await db.execute(select(Patient).where(Patient.patient_id == patient_id))
    patient = patient.scalar_one_or_none()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found!")

    # Validate token
    token_data = verify_access_token(token)
    if patient.email != token_data.username:
        raise HTTPException(status_code=401, detail="Current patient not authorized to retrieve this info")
    
    new_medication = Medication(
        patient_id=patient_id,
        medication_name=medication_data.medication_name,
        code=medication_data.code,
        dosage=medication_data.dosage,
        dosage_unit=medication_data.dosage_unit,
        dosage_form=medication_data.dosage_form,
        dosage_frequency=medication_data.dosage_frequency,
        medication_info=medication_data.medication_info,
        medication_start_date=medication_data.medication_start_date,
        notes=medication_data.notes,
        created_on=datetime.utcnow(),
        updated_on=datetime.utcnow(),
        active=medication_data.get("active", True)
    )
    db.add(new_medication)
    await db.commit()
    await db.refresh(new_medication)
    return new_medication


async def get_medications_for_patient(patient_id: int, db: AsyncSession, token):
    # checking if patient exists
    patient = await db.execute(select(Patient).where(Patient.patient_id == patient_id))
    patient = patient.scalar_one_or_none()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found!")

    # Validate token
    token_data = verify_access_token(token)
    if patient.email != token_data.username:
        raise HTTPException(status_code=401, detail="Current patient not authorized to retrieve this info")

    result = await db.execute(select(Medication).where(Medication.patient_id == patient_id))
    medications = result.scalars().all()
    if not medications:
        raise HTTPException(status_code=404, detail="No medications found for this patient!")
    return medications


async def create_provider_for_patient(patient_id: int, provider_data: ProviderCreate, db: AsyncSession, token):
    # Check if patient exists
    patient = await db.execute(select(Patient).where(Patient.patient_id == patient_id))
    patient = patient.scalar_one_or_none()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found!")

    # Validate token
    token_data = verify_access_token(token)
    if patient.email != token_data.username:
        raise HTTPException(status_code=401, detail="Current patient not authorized to retrieve this info")

    # Check if a provider exists with the same npi_number
    provider = await db.execute(select(Provider).where(Provider.npi_number == provider_data.npi_number))
    provider = provider.scalar_one_or_none()
    if not provider:  # Insert provider details if it does not exist
        logger.info(f"Creating a new provider with name {provider_data.name}")
        provider = Provider(
            name=provider_data.name,
            npi_number=provider_data.npi_number,
            speciality=provider_data.speciality,
            speciality_type=provider_data.speciality_type,
            phone=provider_data.phone,
            email=provider_data.email,
            primary_facility=provider_data.primary_facility,
            created_on=datetime.now(),
            updated_on=datetime.now(),
            active=True
        )
        db.add(provider)
        await db.commit()
        await db.refresh(provider)

    # Check if mapping is present for the patient and provider already
    patient_provider_xref = await db.execute(select(PatientProviderXref).where(and_(PatientProviderXref.patient_id == patient_id, PatientProviderXref.provider_id == provider.provider_id)))
    patient_provider_xref = patient_provider_xref.scalar_one_or_none()
    if not patient_provider_xref:
        # Add the patient-provider mapping
        patient_provider_xref = PatientProviderXref(
            patient_id=patient_id,
            provider_id=provider.provider_id,
            provider_portal_patient_id=provider_data.provider_portal_patient_id,
            patient_since=provider_data.patient_since,
            last_visit=provider_data.last_visit
        )
        db.add(patient_provider_xref)
        await db.commit()
        await db.refresh(patient_provider_xref)

    return provider_data


async def get_provider_for_patient(patient_id: int, db: AsyncSession, token):

    # Check if patient exists
    patient = await db.execute(select(Patient).where(Patient.patient_id == patient_id))
    patient = patient.scalar_one_or_none()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found!")

    # Validate token
    token_data = verify_access_token(token)
    if patient.email != token_data.username:
        raise HTTPException(status_code=401, detail="Current patient not authorized to retrieve this info")

    # Check if mapping is present for the patient and provider already
    patient_provider_xref = await db.execute(select(PatientProviderXref).where(PatientProviderXref.patient_id == patient_id));
    patient_provider_xref = patient_provider_xref.scalar_one_or_none()
    provider = None
    if patient_provider_xref:
        provider_id = patient_provider_xref.provider_id
        provider = await db.execute(select(Provider).where(Provider.provider_id == provider_id))
        provider = provider.scalar_one_or_none()

    return provider
