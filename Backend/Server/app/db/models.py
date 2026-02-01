from sqlalchemy import Column, Integer, String, Boolean, Date, DateTime, DECIMAL, Enum, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class Patient(Base):
    __tablename__ = "patient"

    patient_id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    gender = Column(String)
    date_of_birth = Column(Date)
    phone = Column(String)
    email = Column(String, unique=True)
    hashed_password = Column(String)
    address = Column(String)
    created_on = Column(DateTime)
    updated_on = Column(DateTime)
    active = Column(Boolean, default=True)

    # Relationships
    health_conditions = relationship("HealthCondition", back_populates="patient")
    medications = relationship("Medication", back_populates="patient")
    adverse_side_effects = relationship("AdverseSideEffect", back_populates="patient")


class Provider(Base):
    __tablename__ = "provider"

    provider_id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    npi_number = Column(String, unique=True)
    speciality_type = Column(String)
    speciality = Column(String)
    phone = Column(String)
    email = Column(String)
    primary_facility = Column(String)
    created_on = Column(DateTime)
    updated_on = Column(DateTime)
    active = Column(Boolean, default=True)


class PatientProviderXref(Base):
    __tablename__ = "patient_provider_xref"

    patient_provider_xref_id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patient.patient_id"))
    provider_id = Column(Integer, ForeignKey("provider.provider_id"))
    provider_portal_patient_id = Column(String)
    patient_since = Column(DateTime)
    last_visit = Column(DateTime)


class HealthCondition(Base):
    __tablename__ = "health_condition"

    health_condition_id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patient.patient_id"))
    condition_name = Column(String, nullable=False)
    code = Column(String)
    diagnosed_on = Column(Date)
    condition_info = Column(JSON)
    notes = Column(String)
    created_on = Column(DateTime)
    updated_on = Column(DateTime)
    active = Column(Boolean, default=True)

    # Relationships
    patient = relationship("Patient", back_populates="health_conditions")


class Medication(Base):
    __tablename__ = "medication"

    medication_id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patient.patient_id"))
    medication_name = Column(String, nullable=False)
    code = Column(String)
    dosage = Column(DECIMAL)
    dosage_unit = Column(String)
    dosage_form = Column(String)
    dosage_frequency = Column(String)
    medication_info = Column(JSON)
    medication_start_date = Column(Date)
    notes = Column(String)
    created_on = Column(DateTime)
    updated_on = Column(DateTime)
    active = Column(Boolean, default=True)

    # Relationships
    patient = relationship("Patient", back_populates="medications")


class AdverseSideEffect(Base):
    __tablename__ = "adverse_side_effect"

    adverse_side_effect_id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patient.patient_id"))
    symptom = Column(String, nullable=False)
    notes = Column(String)
    onset_date = Column(Date)
    created_on = Column(DateTime)
    updated_on = Column(DateTime)
    active = Column(Boolean, default=True)

    # Relationships
    patient = relationship("Patient", back_populates="adverse_side_effects")
    details = relationship("AdverseSideEffectDetail", back_populates="side_effect")


class AdverseSideEffectDetail(Base):
    __tablename__ = "adverse_side_effect_detail"

    adverse_side_effect_detail_id = Column(Integer, primary_key=True, index=True)
    adverse_side_effect_id = Column(Integer, ForeignKey("adverse_side_effect.adverse_side_effect_id"))
    observation = Column(String)
    observation_value = Column(String)
    intensity_type = Column(String)
    intensity_score = Column(Integer)
    intensity_value = Column(String)
    time_of_occcurence = Column(DateTime)
    notes = Column(String)
    created_on = Column(DateTime)
    updated_on = Column(DateTime)
    active = Column(Boolean, default=True)

    # Relationships
    side_effect = relationship("AdverseSideEffect", back_populates="details")
