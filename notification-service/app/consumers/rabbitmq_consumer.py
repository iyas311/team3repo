import json
import time
from threading import Event

import pika

from app.config import RABBITMQ_HOST, RABBITMQ_QUEUE, RABBITMQ_RETRY_DELAY_SECONDS
from app.services.notification_service import process_notification


def callback(ch, method, properties, body):
    event = json.loads(body)

    print("================================")
    print("Event received:", event)
    print("================================")

    process_notification(event)


def start_consumer(stop_event: Event):
    print(f"Starting RabbitMQ consumer for queue '{RABBITMQ_QUEUE}'")

    while not stop_event.is_set():
        connection = None
        try:
            print(f"Connecting to RabbitMQ host '{RABBITMQ_HOST}'...")
            connection = pika.BlockingConnection(
                pika.ConnectionParameters(host=RABBITMQ_HOST)
            )
            channel = connection.channel()
            channel.queue_declare(queue=RABBITMQ_QUEUE, durable=True)
            channel.basic_qos(prefetch_count=1)

            for method_frame, properties, body in channel.consume(
                queue=RABBITMQ_QUEUE,
                inactivity_timeout=1,
                auto_ack=False,
            ):
                if stop_event.is_set():
                    break

                if method_frame is None:
                    continue

                try:
                    callback(channel, method_frame, properties, body)
                    channel.basic_ack(delivery_tag=method_frame.delivery_tag)
                except Exception as callback_error:
                    print("Failed to process message:", callback_error)
                    channel.basic_nack(delivery_tag=method_frame.delivery_tag, requeue=False)

            if connection.is_open:
                channel.cancel()

        except Exception as consumer_error:
            print("Consumer crashed:", consumer_error)
            if stop_event.is_set():
                break
            time.sleep(RABBITMQ_RETRY_DELAY_SECONDS)
        finally:
            if connection and connection.is_open:
                connection.close()

    print("RabbitMQ consumer stopped")
