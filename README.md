# 🌴 Date Production & Storage Management System

A full-stack web application designed to manage the production, fumigation, storage, and sorting of dates.
This project was developed as part of an academic internship and aims to replace manual processes with a modern, reliable, and secure digital system.

## � Project Overview

The application helps date-exporting companies efficiently manage:
- Date production workflow
- Fumigation operations
- Cold storage rooms
- Suppliers
- Stock entries and exits

The system improves traceability, data accuracy, and operational efficiency.

## 🚀 Key Features

### 🔐 Authentication
- Secure login system
- Role-based access (Stock Manager)

### 📊 Dashboard
- Overview of production and stock activities

### 🌾 Production Management
- Date product records
- Supplier management
- Sorting (Triage) tracking
- Fumigation records

### 🏬 Stock Management
- Real-time stock tracking
- Entry & exit operations
- Multi-room cold storage (Room 1, 2, 3)

### 🎨 User Interface
- Responsive design
- Clean and intuitive UI
- Modern layout with glassmorphism effects

## 🧱 Technical Architecture

The application follows a 3-tier architecture:
**Frontend (React) → Backend API (PHP) → Database (MySQL)**

### 1️⃣ Frontend
Responsible for user interaction and UI rendering.
*   **Technologies:** React.js, Tailwind CSS / Bootstrap, React Router, Axios
*   **Responsibilities:** Display data, Handle user interactions, Communicate with backend APIs

### 2️⃣ Backend
Handles business logic and data processing.
*   **Technologies:** PHP (Native), REST API architecture, PDO / MySQLi (secure database access)
*   **Responsibilities:** Process requests, Validate data, Apply business rules, Communicate with database

### 3️⃣ Database
Stores all application data.
*   **Technology:** MySQL
*   **Data includes:** Users, Suppliers, Date products, Stock records, Fumigation and sorting data

## 🛠 Technologies Used

### Frontend
*   React.js
*   Tailwind CSS / Bootstrap
*   Axios
*   React Router

### Backend
*   PHP
*   Composer
*   vlucas/phpdotenv

### Database
*   MySQL
*   phpMyAdmin

### Tools
*   Git & GitHub
*   Postman (API testing)
*   Visual Paradigm (UML diagrams)
*   MAMP / XAMPP (local server)

## ⚙️ Installation & Setup

### Prerequisites
*   Node.js & npm
*   PHP & Composer
*   MySQL Server (MAMP / XAMPP / WAMP)

### 🔧 Backend Setup
```bash
cd api
composer install
```

Create `.env` file:
```env
DB_HOST=localhost
DB_NAME=Dates
DB_USER=root
DB_PASS=root
```
*Adjust host/port if using MAMP (e.g. localhost:8889)*

### 🎨 Frontend Setup
```bash
cd frontend/system-dattes
npm install
npm start
```

Application will be available at: `http://localhost:3000`

## 📁 Project Structure

```
project/
├── api/                     # Backend (PHP Native)
│   ├── .env                 # Environment variables
│   ├── vendor/              # Composer dependencies
│   └── *.php                # API endpoints (stock, chambre, fumigation, etc.)
│
└── frontend/
    └── system-dattes/       # React application
        ├── src/
        │   ├── componentForm/       # Forms for data entry
        │   ├── componentLogin/      # Authentication components
        │   ├── componentprincipale/ # Main functional components
        │   ├── components/          # Shared Layout & UI components
        │   └── consulter de produit/ # Visualization tables (Stock, Prods, etc.)
```

## � Security
*   Passwords hashed using `password_hash()`
*   Secure database access with prepared statements
*   Environment variables stored in `.env`
*   Role-based access control
*   API tested using Postman

## 📊 UML & Documentation
*   Use Case Diagram
*   Class Diagram
*   Sequence Diagrams
*   *Full technical documentation included in internship report*

## 🎓 Academic Context

This project was developed during a technical internship at:

*   **Company:** BEN HASSEN FRÈRES
*   **Period:** January 2025 – February 2025
*   **Student:** Mohamed Dhiab

## 📄 License
This project is developed for educational purposes as part of an academic internship.
All rights reserved.

## ✅ Future Improvements
*   Advanced reporting & analytics
*   User management (multi-role)
*   Deployment to cloud (Docker / VPS)
*   Migration to modern backend (NestJS / Laravel)
