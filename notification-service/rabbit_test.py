import pika

credentials = pika.PlainCredentials('guest', 'guest')

connection = pika.BlockingConnection(
    pika.ConnectionParameters('localhost', 5672, '/', credentials)
)

print("Connected to RabbitMQ!")

connection.close()
