from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .database import get_db
from .models import Payment
from .schemas import PaymentCreate, PaymentResponse
import pika
import json
import os

router = APIRouter()

RABBITMQ_URL = os.getenv("RABBITMQ_URL", "amqp://guest:guest@rabbitmq:5672/")

def publish_event(event_type: str, data: dict):
    """Publish an event to RabbitMQ using synchronous pika."""
    try:
        parameters = pika.URLParameters(RABBITMQ_URL)
        connection = pika.BlockingConnection(parameters)
        channel = connection.channel()
        channel.queue_declare(queue="payment_completed_queue", durable=True)
        channel.basic_publish(
            exchange='',
            routing_key="payment_completed_queue",
            body=json.dumps(data),
            properties=pika.BasicProperties(delivery_mode=2)  # persistent
        )
        connection.close()
        print(f"Published event: {event_type}")
    except Exception as e:
        print(f"WARNING: Failed to publish event '{event_type}' to RabbitMQ: {e}")

@router.post("/payments", response_model=PaymentResponse)
def create_payment(payment: PaymentCreate, db: Session = Depends(get_db)):
    db_payment = Payment(
        booking_id=payment.booking_id,
        user_id=payment.user_id,
        event_id=payment.event_id,
        amount=payment.amount,
        status="completed"
    )
    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)

    # Publish event for Ticket-Generator to consume
    publish_event("PaymentCompleted", {
        "booking_id": db_payment.booking_id,
        "user_id": db_payment.user_id,
        "event_id": db_payment.event_id,
        "amount": db_payment.amount
    })

    return db_payment

@router.get("/payments/{booking_id}", response_model=PaymentResponse)
def get_payment(booking_id: str, db: Session = Depends(get_db)):
    payment = db.query(Payment).filter(Payment.booking_id == booking_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    return payment