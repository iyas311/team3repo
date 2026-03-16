import asyncio
from contextlib import asynccontextmanager
from threading import Event

from fastapi import FastAPI

from app.consumers.rabbitmq_consumer import start_consumer


@asynccontextmanager
async def lifespan(app: FastAPI):
    stop_event = Event()
    consumer_task = asyncio.create_task(asyncio.to_thread(start_consumer, stop_event))

    try:
        yield
    finally:
        stop_event.set()
        await consumer_task


app = FastAPI(lifespan=lifespan)


@app.get("/health")
def health():
    return {"status": "running"}
