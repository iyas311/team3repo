# Payment Service

This is the Payment Service for the Event Management Platform.

## Requirements

- Python 3.11
- MySQL
- RabbitMQ

## Local Development

1. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

2. Set up MySQL database:
   - Create a database named `payment_service`
   - Update `DATABASE_URL` in `app/database.py` with your MySQL credentials

3. Set up RabbitMQ:
   - Ensure RabbitMQ is running on `amqp://guest:guest@localhost/`

4. Run the service:
   ```
   uvicorn app.main:app --reload
   ```

5. Access the API at `http://localhost:8000`

## Authentication

Use JWT for authentication. First, obtain a token:

```
POST /token
Content-Type: application/x-www-form-urlencoded

username=user&password=password
```

Use the token in the Authorization header: `Bearer <token>`

## APIs

### POST /payments

Create a new payment.

**Request:**
```json
{
  "booking_id": "123",
  "amount": 100.0
}
```

**Response:**
```json
{
  "id": 1,
  "booking_id": "123",
  "amount": 100.0,
  "status": "completed",
  "created_at": "2023-10-01T00:00:00"
}
```

### GET /payments/{booking_id}

Get payment by booking_id.

**Response:**
```json
{
  "id": 1,
  "booking_id": "123",
  "amount": 100.0,
  "status": "completed",
  "created_at": "2023-10-01T00:00:00"
}
```

## Docker

Build and run with Docker:

```
docker build -t payment-service .
docker run -p 8000:8000 payment-service
```

## Kubernetes

Deploy to Kubernetes:

```
kubectl apply -f k8s/
```