import pika
import json
import time

credentials = pika.PlainCredentials("guest", "guest")

connection = pika.BlockingConnection(
    pika.ConnectionParameters(
        host="localhost",
        port=5672,
        credentials=credentials,
        heartbeat=600,
        blocked_connection_timeout=300
    )
)

channel = connection.channel()

channel.queue_declare(queue="notifications", durable=True)

events = [

{
"type": "user.registered",
"email": "user@test.com",
"name": "John"
},

{
"type": "event.updated",
"email": "user@test.com",
"eventName": "AI Hackathon"
},

{
"type": "event.registration.success",
"email": "user@test.com",
"eventName": "AI Hackathon"
},

{
"type": "event.reminder",
"email": "user@test.com",
"eventName": "AI Hackathon"
},

{
"type": "result.published",
"email": "user@test.com",
"eventName": "AI Hackathon"
},

{
"type": "admin.announcement",
"email": "user@test.com",
"message": "Platform maintenance tonight"
},

{
"type": "payment.success",
"email": "user@test.com",
"eventName": "AI Hackathon"
}

]

for event in events:

    channel.basic_publish(
        exchange="",
        routing_key="notifications",
        body=json.dumps(event)
    )

    print("Sent:", event["type"])

    time.sleep(2)

connection.close()
