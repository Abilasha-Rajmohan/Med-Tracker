from pydantic import BaseModel, EmailStr, constr, BaseConfig
from datetime import date, datetime
from typing import Optional, Dict
from app.db.models import Patient

BaseConfig.arbitrary_types_allowed = True


class PatientCreate(BaseModel):
    patient_id: Optional[int] = None
    first_name: str
    last_name: str
    gender: Optional[str] = None
    date_of_birth: Optional[date] = None
    phone: Optional[constr(min_length=10, max_length=15)] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    address: Optional[str] = None
    created_on: Optional[datetime] = datetime.now()
    updated_on: Optional[datetime] = datetime.now()
    active: Optional[bool] = True

class PatientCreateResponse(BaseModel):
    patient_id: int
    first_name: str
    last_name: str
    email: str

class HealthConditionCreate(BaseModel):
    health_condition_id: Optional[int] = None
    patient_id: int
    condition_name: str
    code: Optional[str] = None
    diagnosed_on: Optional[date] = None
    condition_info: Optional[Dict] = None
    notes: Optional[str] = None
    created_on: Optional[str] = date.today()
    updated_on: Optional[str] = date.today()
    active: Optional[bool] = True

class MedicationCreate(BaseModel):
    medication_id: Optional[int] = None
    patient_id: int
    medication_name: str
    code: Optional[str] = None
    dosage: Optional[float] = None
    dosage_unit: Optional[str] = None
    dosage_form: Optional[str] = None
    dosage_frequency: Optional[str] = None
    medication_info: Optional[Dict] = None
    medication_start_date: Optional[date] = None
    notes: Optional[str] = None
    created_on: Optional[str]
    updated_on: Optional[str]
    active: Optional[bool] = True

class AdverseSideEffectCreate(BaseModel):
    adverse_side_effect_id: Optional[int] = None
    patient_id: int
    symptom: str
    notes: Optional[str] = None
    onset_date: Optional[date] = None
    created_on: Optional[datetime] = None
    updated_on: Optional[datetime] = None
    active: Optional[bool] = True

class AdverseSideEffectSummary(BaseModel):
    adverse_side_effect_id: int
    patient_id: int
    patient_name: str
    symptom: str
    notes: Optional[str] = None
    onset_date: Optional[date] = None
    created_on: datetime
    updated_on: datetime
    active: bool
    details: Optional[list] = []

class ProviderCreate(BaseModel):
    provider_id: Optional[int] = None
    name: str
    npi_number: str
    speciality_type: str
    speciality: str
    phone: str
    email: str
    primary_facility: str
    active: Optional[bool] = True
    provider_portal_patient_id: Optional[str] = None
    patient_since: Optional[date] = None
    last_visit: Optional[date] = None

class AdverseSideEffectDetailRead(BaseModel):
    adverse_side_effect_detail_id: Optional[int] = None
    adverse_side_effect_id: int
    observation: Optional[str] = None
    observation_value: Optional[str] = None
    intensity_type: Optional[str] = None
    intensity_score: Optional[int] = None
    intensity_value: Optional[str] = None
    time_of_occurrence: Optional[datetime] = None
    notes: Optional[str] = None
    created_on: datetime
    updated_on: datetime
    active: Optional[bool] = True


# Schema for creating AdverseSideEffectDetail
class AdverseSideEffectDetailCreate(BaseModel):
    adverse_side_effect_id: int
    observation: Optional[str] = None
    observation_value: Optional[str] = None
    intensity_type: Optional[str] = None
    intensity_score: Optional[int] = None
    intensity_value: Optional[str] = None
    time_of_occurrence: Optional[datetime] = None
    notes: Optional[str] = None
    created_on: datetime
    updated_on: datetime
    active: bool


class LoginRequest(BaseModel):
    email: str
    password: str
