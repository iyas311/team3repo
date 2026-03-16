import time
from fastapi import FastAPI
from sqlalchemy.exc import OperationalError
from .database import engine
from .models import Base
from .routes import router

# Create DB tables with retry loop
MAX_RETRIES = 10
for i in range(MAX_RETRIES):
    try:
        Base.metadata.create_all(bind=engine)
        print("Payment Service: DB tables created successfully!")
        break
    except OperationalError as e:
        print(f"Payment DB not ready yet (Attempt {i+1}/{MAX_RETRIES}). Waiting 3 seconds...")
        time.sleep(3)
else:
    raise Exception("Payment Service: Could not connect to database after several retries.")

app = FastAPI(title="Payment Service", version="1.0.0")

app.include_router(router)

@app.get("/")
def health_check():
    return {"status": "Payment Service is running!"}