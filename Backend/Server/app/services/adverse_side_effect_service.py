from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.models import Patient, AdverseSideEffect, AdverseSideEffectDetail
from app.schemas.models import AdverseSideEffectCreate, AdverseSideEffectSummary
from datetime import datetime


async def create_adverse_side_effect(patient_id: int, side_effect_summary: AdverseSideEffectCreate, db: AsyncSession):
    new_adverse_effect = AdverseSideEffect(
        patient_id=patient_id,
        symptom=side_effect_summary.symptom,
        notes=side_effect_summary.notes,
        onset_date=side_effect_summary.onset_date,
        created_on=datetime.utcnow(),
        updated_on=datetime.utcnow()
    )
    db.add(new_adverse_effect)
    await db.commit()
    await db.refresh(new_adverse_effect)
    return new_adverse_effect

async def get_adverse_side_effects_for_patient(patient_id: int, db: AsyncSession):
    # checking if patient exists
    patient = await db.execute(select(Patient).where(Patient.patient_id == patient_id))
    patient = patient.scalar_one_or_none()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found!")

    result = await db.execute(select(AdverseSideEffect).filter(AdverseSideEffect.patient_id == patient_id))
    adverse_effects = result.scalars().all()
    if not adverse_effects:
        raise HTTPException(status_code=404, detail=f"No adverse side effects found for patient ID {patient_id}")

    # creating summaries for each adverse side effect
    summaries = []
    for effect in adverse_effects:

        # Fetch details for the current adverse side effect
        details_result = await db.execute(
            select(AdverseSideEffectDetail).filter(AdverseSideEffectDetail.adverse_side_effect_id == effect.adverse_side_effect_id)
        )
        details = details_result.scalars().all()

        # Convert details to the response model (AdverseSideEffectDetailRead)
        details_data = []
        for detail in details:
            detail_data = {
                "adverse_side_effect_detail_id": detail.adverse_side_effect_detail_id,
                "adverse_side_effect_id": detail.adverse_side_effect_id,
                "observation": detail.observation,
                "observation_value": detail.observation_value,
                "intensity_type": detail.intensity_type,
                "intensity_score": detail.intensity_score,
                "intensity_value": detail.intensity_value,
                "time_of_occcurence": detail.time_of_occcurence,
                "notes": detail.notes,
                "created_on": detail.created_on,
                "updated_on": detail.updated_on,
                "active": detail.active
            }
            details_data.append(detail_data)

        summary = AdverseSideEffectSummary(
            adverse_side_effect_id=effect.adverse_side_effect_id,
            patient_id=effect.patient_id,
            patient_name=f"{effect.patient.first_name} {effect.patient.last_name}",
            symptom=effect.symptom,
            notes=effect.notes,
            onset_date=effect.onset_date,
            created_on=effect.created_on,
            updated_on=effect.updated_on,
            active=effect.active,
            details=details_data
        )
        summaries.append(summary)
    return summaries
