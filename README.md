# 📝 Blog App — Microservices Architecture

A full-stack blogging platform built using a scalable microservices architecture.
The system includes authentication, user management, blog services, and event-driven communication.

---

## ✨ Key Features

- Secure authentication (JWT + Clerk)
- Event-driven microservices with RabbitMQ
- AI-powered content processing (Gemini)
- Redis caching & rate limiting
- Cloudinary media management
- Modular & scalable architecture

---

## 🏗️ Project Structure

````bash
BLOG-APP/
├── frontend/
├── services/
│   ├── author/   (Port 5001)
│   ├── blog/     (Port 5002)
│   └── user/     (Port 5000)
└── .gitignore

## 🚀 Services Overview

### 👤 User Service — `localhost:5000`

* Clerk
* MongoDB Atlas
* Cloudinary

### 🔐 Author Service — `localhost:5001`

* PostgreSQL
* Cloudinary
* Google Gemini API
* RabbitMQ


### 📄 Blog Service — `localhost:5002`

* PostgreSQL
* Upstash Redis
* User Service Integration

## 🔗 Inter-Service Communication

┌─────────────┐     HTTP      ┌─────────────┐
│ Blog Service│ ────────────► │ User Service│
└─────────────┘               └─────────────┘
       │
       │        RabbitMQ
       ▼
┌─────────────────┐
│  Message Broker │
└─────────────────┘
       ▲
       │
┌─────────────────┐
│ Author Service  │
└─────────────────┘


## ⚙️ Environment Variables

### User Service (`services/user/.env`)

```env
PORT=
MONGO_URI=
JWT_SEC=
Cloud_Name=
Cloud_Api_Key=
Cloud_Api_Secret=
Google_Client_ID=
Google_Client_Secret=

### Author Service (`services/author/.env`)

```env
PORT=
DB_URL=
JWT_SEC=
Cloud_Name=
Cloud_Api_Key=
Cloud_Api_Secret=
Gemini_Api_Key=
RABBITMQ_URL=


### Blog Service (`services/blog/.env`)

```env
PORT=
DB_URL=
USER_SERVICE_URL=
REDIS_URL=
RABBITMQ_URL=
JWT_SEC=

## 🛠️ Getting Started

### Prerequisites

* Node.js v18+
* Docker (for local RabbitMQ)

---

### Installation

```bash
git clone <repository-url>
cd blog-app

cd services/user && npm install
cd ../author && npm install
cd ../blog && npm install
cd ../../frontend && npm install
````

---

### Running the Application

Open separate terminals:

```bash
cd services/user && npm run dev
cd services/author && npm run dev
cd services/blog && npm run dev
cd frontend && npm run dev
```

Frontend runs at:
http://localhost:3000
