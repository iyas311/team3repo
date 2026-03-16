import pika
import json
import time

def simulate_payment():
    print("Connecting to RabbitMQ...")
    # Give rabbitmq some time to start if running via compose
    connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
    channel = connection.channel()

    queue_name = 'payment_completed_queue'
    channel.queue_declare(queue=queue_name, durable=True)

    message = {
        "booking_id": "B111",
        "event_id": "E101",
        "user_id": "U501"
    }

    channel.basic_publish(
        exchange='',
        routing_key=queue_name,
        body=json.dumps(message),
        properties=pika.BasicProperties(
            delivery_mode=2,  # make message persistent
        ))
    
    print(f" [x] Sent {message}")
    connection.close()

if __name__ == "__main__":
    simulate_payment()
