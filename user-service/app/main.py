from fastapi import FastAPI
from . import models, routes
from .database import engine

# Create the database tables
models.Base.metadata.create_all(bind=engine)

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
