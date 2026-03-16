import pika
import json

connection = pika.BlockingConnection(
    pika.ConnectionParameters("localhost")
)

channel = connection.channel()

channel.queue_declare(queue="notifications")

event = {
    "type": "event.registration.success",
    "email": "test@email.com",
    "eventName": "AI Hackathon"
}

channel.basic_publish(
    exchange="",
    routing_key="notifications",
    body=json.dumps(event)
)

print("Event sent to RabbitMQ")
