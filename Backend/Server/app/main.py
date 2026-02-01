import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.api_router import api_router

app = FastAPI(
    title="HealthSync",
    description="Symptom and Side Effect Tracker <br/> Bridging Patients and Providers for Enhanced Healthcare Outcomes",
    version="1.0.0",
    contact={
        "name": "Team 86, CS6440",
        "url": "https://gatech.instructure.com/groups/438958",
    },
    license_info={
        "name": "MIT",
        "url": "https://opensource.org/licenses/MIT"
    }
)

allow_origins = [
    "http://localhost:3000",  # Local development
    "https://your-production-domain.com",  # Production domain
]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,  # Replace with the frontend's URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (e.g., GET, POST, DELETE)
    allow_headers=["*"],  # Allow all headers (e.g., Authorization, Content-Type)
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.StreamHandler(),        # Log to console
        logging.FileHandler("app.log")  # Log to file
    ]
)

# Include the main API router
app.include_router(api_router)
