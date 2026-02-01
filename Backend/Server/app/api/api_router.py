from fastapi import APIRouter
from app.api.endpoints import health, patient

api_router = APIRouter()
api_router.include_router(health.router, prefix='/api', tags=['base', 'health'])
api_router.include_router(patient.router, prefix='', tags=['patient'])
