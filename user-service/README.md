# User Service

This repository contains the **User Service microservice** for the Event Management system.
The service is responsible for handling **user registration, authentication, and user management**.

The service is built using **FastAPI**, **SQLAlchemy**, and **MySQL**, and is containerized using **Docker**.

---

## Tech Stack

* FastAPI
* Python 3.11
* SQLAlchemy
* MySQL
* Docker
* Uvicorn

---

## Project Structure

```
user-service
│
├── app
│   ├── main.py
│   ├── models.py
│   ├── routes.py
│   └── ...
│
├── Dockerfile
├── requirements.txt
└── README.md
```

---

## Running the Service with Docker

### 1. Create Docker Network

```
docker network create user-network
```

### 2. Start MySQL Container

```
docker run -d \
--name mysql-local \
--network user-network \
-e MYSQL_ROOT_PASSWORD=root \
-e MYSQL_DATABASE=users \
-p 3306:3306 \
mysql:8.0
```

### 3. Build the User Service Image

```
docker build -t userservice:latest .
```

### 4. Run the User Service Container

```
docker run -d \
-p 8000:8000 \
--name userservice \
--network user-network \
-e DB_HOST=mysql-local \
-e DB_USER=root \
-e DB_PASSWORD=root \
-e DB_NAME=users \
userservice:latest
```

---

## API Documentation

Once the service is running, the API documentation can be accessed at:

```
http://localhost:8000/docs
```

This opens the **FastAPI Swagger UI**, where all endpoints can be tested.

---

## Example API

### Register User

```
POST /users/register
```

Example request body:

```
{
  "name": "Mahesh",
  "email": "mahesh@test.com",
  "password": "123456"
}
```

---

## Checking Database Data

To verify stored users:

```
docker exec -it mysql-local mysql -u root -p
```

Then run:

```
USE users;
SELECT * FROM users;
```

---

## Architecture

```
Client
   ↓
FastAPI User Service
   ↓
MySQL Database
```

The service exposes REST APIs which interact with the MySQL database using SQLAlchemy.

---

## Author

Mahesh
