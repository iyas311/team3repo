import time
from fastapi import FastAPI
from sqlalchemy.exc import OperationalError
from . import models, routes
from .database import engine

# Retry loop for Database initialization (in case MySQL not ready yet)
MAX_RETRIES = 10
for i in range(MAX_RETRIES):
    try:
        models.Base.metadata.create_all(bind=engine)
        print("Successfully connected to the database and created tables!")
        break
    except OperationalError as e:
        print(f"Database not ready yet (Attempt {i+1}/{MAX_RETRIES}). Waiting 3 seconds... Error: {e}")
        time.sleep(3)
else:
    raise Exception("Could not connect to the database after several retries.")

app = FastAPI(
    title="User Service",
    description="User Management Microservice with JWT Authentication",
    version="1.0.0"
)

# Include the users router
app.include_router(routes.router, prefix="/users", tags=["Users"])

@app.get("/")
def health_check():
    return {"status": "User Service is running!"}
