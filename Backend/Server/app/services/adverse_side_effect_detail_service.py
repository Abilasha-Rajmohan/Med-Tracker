from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import exists
from app.db.models import AdverseSideEffect, AdverseSideEffectDetail
from app.schemas.models import AdverseSideEffectDetailCreate
from datetime import datetime


async def get_adverse_side_effect_details(adverse_side_effect_id: int, db: AsyncSession):
    # first, cehcking if the adverse_side_effect_id exists in the AdverseSideEffect table
    exists_check = await db.execute(select(exists().where(AdverseSideEffect.adverse_side_effect_id == adverse_side_effect_id)))
    adverse_side_effect_exists = exists_check.scalar()
    if not adverse_side_effect_exists:
        raise HTTPException(status_code=404, detail="Given adverse side effect ID does not exist!")
    
    # then, try to get details, if details exists
    result = await db.execute(select(AdverseSideEffectDetail).filter(
        AdverseSideEffectDetail.adverse_side_effect_id == adverse_side_effect_id
    ))
    details = result.scalars().all()
    if not details:
        raise HTTPException(status_code=404, detail="No details found for this adverse side effect!")
    return details


async def create_adverse_side_effect_detail(effect_detail_data: AdverseSideEffectDetailCreate, db: AsyncSession):
    new_effect_detail = AdverseSideEffectDetail(
        adverse_side_effect_id=effect_detail_data.adverse_side_effect_id,
        observation=effect_detail_data.observation,
        observation_value=effect_detail_data.observation_value,
        intensity_type=effect_detail_data.intensity_type,
        intensity_score=effect_detail_data.intensity_score,
        intensity_value=effect_detail_data.intensity_value,
        time_of_occurrence=effect_detail_data.time_of_occurrence,
        notes=effect_detail_data.notes,
        created_on=datetime.utcnow(),
        updated_on=datetime.utcnow(),
        active=effect_detail_data.active
    )
    db.add(new_effect_detail)
    await db.commit()
    await db.refresh(new_effect_detail)
    return new_effect_detail