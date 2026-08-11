# 🛒 ShopEase — Full-Stack E-Commerce Website

> A modern full-stack e-commerce platform built with **React + Vite** for the frontend and **Python + Flask** for the backend.

ShopEase provides a complete online shopping experience with product browsing, authentication, cart management, wishlist, orders, payments, reviews, coupons, notifications, invoice generation, and an administrative management panel.

---

## 🔗 Quick Navigation

| Section | Link |
|---|---|
| 🏠 Project Overview | [View Overview](#-project-overview) |
| 🎬 Project Demo | [View Demo](#-project-demo) |
| 🛍️ Frontend | [Open Frontend](./frontend) |
| 👤 User Features | [View User Features](#-user-features) |
| 👨‍💼 Admin Features | [View Admin Features](#-admin-features) |
| ⚙️ Backend | [Open Backend](./backend) |
| 🗄️ Database | [Open Database](./database) |
| 📚 Documentation | [Open Documentation](./docs) |
| 🖼️ Screenshots | [View Screenshots](./screenshots) |
| 🚀 Getting Started | [Setup Project](#-getting-started) |
| 🧰 Technologies | [View Technologies](#-technologies-used) |
| 📁 Project Structure | [View Structure](#-project-structure) |

---
> **Note:** User and Admin functionality are implemented inside the React frontend. Their pages are organized under `frontend/src/pages`.

---
## 🌐 Project Access

| Application | Description |
|---|---|
| 🛍️ **User Application** | Customer shopping experience |
| 👨‍💼 **Admin Panel** | Product, user, order, coupon and review management |
| ⚙️ **Backend API** | Flask REST API |
| 🗄️ **Database** | SQLAlchemy / SQL database |

> The application currently runs locally using React + Vite and Flask.

## 📌 Project Overview

ShopEase is designed as a complete e-commerce platform where users can:

- 🔐 Register and log in
- 👤 Manage their profile
- 🛍️ Browse products
- 🔎 Search products
- 📦 View product details
- 🛒 Add products to cart
- ❤️ Manage wishlist
- 💳 Complete online payments
- 📋 Place and track orders
- ⭐ Write product reviews
- 🎟️ Apply coupons
- 🔔 Receive notifications
- 🧾 Generate and download invoices

The project also includes an **Admin Panel** for managing products, users, orders, coupons, reviews, and dashboard information.

---

# ✨ Features

## 👤 User Features

- User Registration
- User Login
- User Profile Management
- Product Browsing
- Product Search
- Product Details
- Product Categories
- Product Sorting
- Product Filtering
- Product Pagination
- Shopping Cart
- Wishlist
- Checkout
- Online Payments
- Order Management
- Order Tracking
- Product Reviews
- Coupon Management
- Notifications
- Invoice Generation

## 👨‍💼 Admin Features

- Admin Login
- Admin Dashboard
- Product Management
- User Management
- Order Management
- Coupon Management
- Review Management
- Dashboard Statistics

---

# 🧰 Technologies Used

### 🎨 Frontend

- React
- Vite
- JavaScript
- HTML5
- CSS3

### ⚙️ Backend

- Python
- Flask
- Flask REST API
- JWT Authentication
- Flask-CORS

### 🗄️ Database

- SQL Database
- SQLAlchemy
- Flask-SQLAlchemy

### 🛠️ Development Tools

- Visual Studio Code
- Git
- GitHub
- npm
- Python Virtual Environment

---

# 🏗️ Project Architecture

```text
ECOMMERCE_WEBSITE/
│
├── backend/
│   ├── controllers/
│   ├── database/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── app.py
│   ├── config.py
│   ├── extensions.py
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   ├── package.json
│   └── vite.config.js
│
├── database/
├── docs/
├── public/
├── screenshots/
├── .gitignore
├── README.md
└── ...
```

---

# 🚀 Getting Started

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/Harikrishna772003/ECOMMERCE_WEBSITE.git
```

## 2️⃣ Move into the Project

```bash
cd ECOMMERCE_WEBSITE
```

---

# ⚙️ Backend Setup

Open a terminal in:

```text
ECOMMERCE_WEBSITE\backend
```

Create and activate the virtual environment:

### Windows PowerShell

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

Install dependencies:

```powershell
pip install -r requirements.txt
```

Start the Flask server:

```powershell
python .\app.py
```

Backend server:

```text
http://127.0.0.1:5000
```

---

# 🎨 Frontend Setup

Open another terminal in:

```text
ECOMMERCE_WEBSITE\frontend
```

Install dependencies:

```powershell
npm install
```

Start the Vite development server:

```powershell
npm run dev
```

Vite will display the local frontend address in the terminal.

---

# 🔄 Application Flow

```text
                    ┌─────────────────────┐
                    │      ShopEase        │
                    │    E-Commerce App    │
                    └──────────┬──────────┘
                               │
              ┌────────────────┴────────────────┐
              │                                 │
       ┌──────▼──────┐                   ┌──────▼──────┐
       │ User Frontend│                   │ Admin Panel │
       │ React + Vite │                   │   React     │
       └──────┬──────┘                   └──────┬──────┘
              │                                 │
              └────────────────┬────────────────┘
                               │
                        ┌──────▼──────┐
                        │ Flask REST  │
                        │     API     │
                        └──────┬──────┘
                               │
                        ┌──────▼──────┐
                        │ SQLAlchemy  │
                        │  Database   │
                        └─────────────┘
```

---

# 📁 Main Project Areas

### 🛍️ Frontend

The React + Vite customer interface containing reusable components, pages, services, and the shopping experience.

### 👤 User

The user workflow includes registration, login, profile management, browsing, cart, wishlist, checkout, orders, reviews, coupons, notifications, and invoices.

### 👨‍💼 Admin

The admin workflow provides management functionality for products, users, orders, coupons, reviews, and dashboard information.

### ⚙️ Backend

The Flask backend contains the REST API, routes, controllers, models, services, authentication, database integration, and utilities.

---

# 🖼️ Screenshots

Application screenshots are available in the `screenshots/` directory.

---

# 🔐 Authentication

ShopEase uses:

- JWT authentication
- Protected API routes
- User authentication
- Admin authentication
- Access-token based authorization

---

# 🧪 Project Status

| Area | Status |
|---|---|
| Frontend | ✅ Completed |
| Backend | ✅ Completed |
| Database | ✅ Configured |
| Authentication | ✅ Implemented |
| Product Management | ✅ Implemented |
| Shopping Cart | ✅ Implemented |
| Wishlist | ✅ Implemented |
| Orders | ✅ Implemented |
| Payments | ✅ Implemented |
| Reviews | ✅ Implemented |
| Coupons | ✅ Implemented |
| Notifications | ✅ Implemented |
| Invoice Generation | ✅ Implemented |
| Admin Panel | ✅ Implemented |
| Testing | ✅ Completed |

---

# 👨‍💻 Development

The project follows a separated frontend/backend architecture:

```text
React + Vite
      ↓
Frontend Services
      ↓
Flask REST API
      ↓
SQLAlchemy
      ↓
SQL Database
```

---
# 🚀 Live Deployment

ShopEase is successfully deployed and available online.

## 🌐 Application Links

| Component | URL | Status |
|-----------|-----|--------|
| 🛍️ Frontend | https://shopease-frontend-harikrishna.onrender.com | 🟢 Live |
| ⚙️ Backend API | https://shopease-backend-vq6k.onrender.com | 🟢 Live |
| 📦 GitHub Repository | https://github.com/Harikrishna772003/ECOMMERCE_WEBSITE | 🟢 Available |

### 🛍️ Frontend

The **React + Vite frontend** is deployed on Render.

**Live Website:**  
https://shopease-frontend-harikrishna.onrender.com

### ⚙️ Backend

The **Python + Flask REST API** is deployed on Render.

**Live API:**  
https://shopease-backend-vq6k.onrender.com

### 🗄️ Database

The application uses **Aiven MySQL** as the production database.

### 🔗 Production Flow

```text
React + Vite Frontend
        │
        │ API Requests
        ▼
Flask REST API
        │
        │ Database Queries
        ▼
Aiven MySQL Database

---

# 📄 License

This project is intended for learning, development, and portfolio purposes.

---

###👨‍💻 Designed & Developed By

## **HARIKRISHNA THUMULA**

> 🛒 ShopEase — Full-Stack E-Commerce Website

Designed and developed by **HARIKRISHNA THUMULA** using modern full-stack web technologies including **React, Vite, Python, Flask, SQLAlchemy, and SQL**.

---

⭐ **Thank you for visiting the ShopEase project!**
