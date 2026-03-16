import os
import json
import asyncio
import aio_pika
from app.ticket_generator import generate_ticket

async def process_message(message: aio_pika.abc.AbstractIncomingMessage):
    async with message.process():
        try:
            body = json.loads(message.body.decode())
            print(f"Received message: {body}")
            
            booking_id = str(body.get("booking_id")) if body.get("booking_id") is not None else None
            event_id = str(body.get("event_id")) if body.get("event_id") is not None else None
            user_id = str(body.get("user_id")) if body.get("user_id") is not None else None
            
            if booking_id and event_id and user_id:
                await generate_ticket(booking_id, event_id, user_id)
            else:
                print("Invalid message format: missing required fields")
                
        except Exception as e:
            print(f"Error processing message: {e}")

async def start_consuming():
    rabbitmq_url = os.getenv("RABBITMQ_URL", "amqp://guest:guest@localhost:5672/")
    
    # Simple retry loop to handle startup connections wait
    while True:
        try:
            connection = await aio_pika.connect_robust(rabbitmq_url)
            channel = await connection.channel()
            
            queue = await channel.declare_queue("payment_completed_queue", durable=True)
            
            print("Connected to RabbitMQ! Waiting for messages...")
            await queue.consume(process_message)
            
            # Keep running indefinitely via Event
            await asyncio.Event().wait()
        except asyncio.CancelledError:
            # Task cancelled during shutdown
            break
        except Exception as e:
            print(f"Failed to connect to RabbitMQ: {e}. Retrying in 5 seconds...")
            await asyncio.sleep(5)
