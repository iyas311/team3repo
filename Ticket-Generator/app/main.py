from fastapi import FastAPI
import asyncio
from contextlib import asynccontextmanager
import os

from app.database import init_db, close_db
from app.rabbitmq_consumer import start_consuming
from app.routes.tickets import router as tickets_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB connection
    await init_db()
    
    # Start RabbitMQ consumer mapping
    task = asyncio.create_task(start_consuming())
    yield
    # Cleanup on shutdown
    task.cancel()
    await close_db()

app = FastAPI(title="Ticket Generation Service", lifespan=lifespan)

app.include_router(tickets_router, prefix="/tickets", tags=["Tickets"])

@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "ticket-generation-service"}
