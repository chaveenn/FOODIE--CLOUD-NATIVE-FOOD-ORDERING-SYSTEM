# 🍽️ Foodie App – A Microservices-Based Food Delivery Platform

A full-stack, modular food delivery application designed using a microservices architecture. Foodie brings together restaurant management, user roles, authentication, and real-time operations in a scalable ecosystem.

> 🚧 Note: The **Payment** and **Delivery** services are currently under development. Stay tuned for more updates!

---

## 🚀 Tech Stack

### 🔹 Frontend
- React.js
- Material UI (MUI)
- Axios for API consumption

### 🔹 Backend (Microservices)
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for secure authentication
- http-proxy-middleware (API Gateway)

### 🔹 DevOps
- Docker
- Docker Compose
- Nginx (Reverse Proxy)
- dotenv for environment configs

---

## 🧩 Microservices Architecture

| Service             | Port  | Description                                        |
|---------------------|-------|----------------------------------------------------|
| API Gateway         | 8000  | Routes requests to respective services             |
| Auth Service        | 8090  | Handles login, registration, token generation      |
| User Service        | 8090  | Manages user data and role-based access            |
| Restaurant Service  | 5001  | CRUD operations for restaurants and menus          |
| Order Service       | 5002  | (Planned) Handles order placement and tracking     |
| Payment Service     | 5003  | 🚧 In Progress – Stripe-based payment integration   |
| Delivery Service    | 5004  | 🚧 In Progress – Real-time delivery coordination    |
| Frontend App        | 3000  | React.js SPA for all user roles                    |

---

## 📁 Folder Structure

```
Foodie/
├── api-gateway/
├── auth-service/
├── user-service/
├── restaurant-service/
├── order-service/
├── payment-service/       # Coming Soon
├── delivery-service/      # Coming Soon
├── frontend/
├── nginx/
├── docker-compose.yml
└── README.md
```

---

## 📌 Key Features

- 🔐 **Secure JWT Authentication**
- 🍴 **Restaurant & Menu Management**
- 🧑‍🍳 **Role-Based Dashboards** for users and restaurant admins
- 🧾 **API Gateway** for centralized request routing
- ⚙️ **Modular Docker Setup** for scalable deployments
- 📊 **Future Scope**: Payments, delivery tracking, real-time updates

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/chaveenn/Foodie.git
cd Foodie
```

### 2. Environment Variables

Create a `.env` file in each service folder. Sample keys for `auth-service`:

```env
MONGODB_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/UserDB
JWT_SECRET=your_jwt_secret
PORT=8090
```

Set similar environment variables for other services as needed.

---

### 3. Running with Docker

Ensure you have Docker & Docker Compose installed.

```bash
docker-compose up --build
```

This spins up all backend services and the frontend UI.

Access the app at: [http://localhost:3000](http://localhost:3000)

---

## 🌐 NGINX Configuration (Production Ready)

Example `nginx/default.conf`:

```nginx
server {
  listen 80;

  location / {
    root /usr/share/nginx/html;
    index index.html index.htm;
    try_files $uri $uri/ /index.html;
  }

  location /auth {
    proxy_pass http://auth-service:8090;
  }

  location /users {
    proxy_pass http://user-service:8090;
  }

  location /restaurants {
    proxy_pass http://restaurant-service:5001;
  }
}
```

---

## 📦 Sample Docker Compose

```yaml
version: '3'
services:
  api-gateway:
    build: ./api-gateway
    ports:
      - "8000:8000"
    env_file:
      - ./api-gateway/.env
    depends_on:
      - auth-service
      - user-service
      - restaurant-service

  auth-service:
    build: ./auth-service
    ports:
      - "8090:8090"
    env_file:
      - ./auth-service/.env

  user-service:
    build: ./user-service
    ports:
      - "8090:8090"
    env_file:
      - ./user-service/.env

  restaurant-service:
    build: ./restaurant-service
    ports:
      - "5001:5001"
    env_file:
      - ./restaurant-service/.env

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
```

---

## 🧪 Test & Development

- Use [Postman](https://www.postman.com/) or [Thunder Client](https://www.thunderclient.com/) for API testing
- Use JWT tokens in headers for protected routes
- Hot reload enabled via Docker volumes (during development)

---

## ✅ To-Do (Progress Tracker)

- [x] Build Auth, User & Restaurant Services
- [x] Develop Frontend with React + MUI
- [x] Setup API Gateway
- [ ] Implement Order Service
- [ ] Integrate Stripe Payment
- [ ] Build Delivery Tracking Module
- [ ] Production NGINX deployment config

---

## 📸 Screenshots

Coming soon...

---

## 👤 Author

**Chaveen Sewni**  
🎓 Software Engineering Undergraduate  
🔗 [LinkedIn](https://linkedin.com/in/chaveen)  
💻 [GitHub](https://github.com/chaveenn)

---

## 📜 License

This project is licensed under the **MIT License**.  
Feel free to use, fork, and improve it with attribution.
