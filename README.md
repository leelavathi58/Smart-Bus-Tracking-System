# 🚌 Smart Bus Tracking System

A web-based Smart Bus Tracking System that allows passengers to track buses in real time, drivers to manage trips, and administrators to manage the entire transportation system through a secure dashboard.

---

## 📖 Project Overview

The Smart Bus Tracking System is designed to improve public transportation by providing real-time bus tracking and efficient management. It offers separate modules for Admin, Driver, and Passenger with secure authentication and an easy-to-use interface.

This project was developed as a **B.E. Electronics and Communication Engineering (ECE) Capstone Project**.

---

## ✨ Features

### 👨‍💼 Admin
- Secure Login
- Dashboard
- Manage Buses
- Manage Drivers
- Manage Passengers
- View Trip History
- Manage Routes
- Manage Users

### 🚍 Driver
- Secure Login
- Start Trip
- End Trip
- Update Trip Status
- Share Bus Location

### 👤 Passenger
- Register & Login
- View Available Buses
- Track Bus Location
- View Bus Route
- View Estimated Arrival Time (ETA)

### 🤖 AI Chatbot
- Gemini AI powered chatbot
- Answers passenger queries
- Assists users with bus-related information

---

## 🛠 Technology Stack

### Frontend
- React.js
- HTML5
- CSS3
- JavaScript
- React Router

### Backend
- ASP.NET Core Web API (.NET 9)

### Database
- MySQL

### Authentication
- JWT Authentication

### AI Integration
- Google Gemini API

### Tools
- Visual Studio 2022
- Visual Studio Code
- MySQL Workbench
- Postman
- Git
- GitHub

---

## 📂 Project Structure

```
Smart-Bus-Tracking-System
│
├── SmartBusTracking.API      # ASP.NET Core Web API
│
├── smartbus-app              # React Frontend
│
├── README.md
│
└── .gitignore
```

---

## 🚀 Getting Started

### Clone the Repository

```bash
git clone https://github.com/leelavathi58/Smart-Bus-Tracking-System.git
```

---

## Backend Setup

1. Open **SmartBusTracking.API** in Visual Studio.
2. Restore NuGet Packages.
3. Configure the MySQL connection string.
4. Add your Gemini API Key.
5. Run Database Migrations.
6. Run the API.

---

## Frontend Setup

Navigate to the frontend folder.

```bash
cd smartbus-app
```

Install dependencies.

```bash
npm install
```

Start the application.

```bash
npm start
```

---

## ⚙ Configuration

### Database

Update the MySQL connection string in:

```
appsettings.json
```

---

### Gemini API

Replace the placeholder with your own Gemini API Key.

```json
"Gemini": {
    "ApiKey": "YOUR_GEMINI_API_KEY"
}
```

> **Note:** The actual Gemini API key is not included in this repository for security reasons.

---

## 📸 Screenshots

Add screenshots of:

- Login Page
- Admin Dashboard
- Driver Dashboard
- Passenger Dashboard
- Bus Tracking Page
- AI Chatbot
- Trip History

---

## 🔒 Security Features

- JWT Authentication
- Password Hashing
- Role-Based Authorization
- Protected APIs

---

## 📈 Future Enhancements

- Live GPS Tracking
- Push Notifications
- Mobile Application
- QR Ticket Booking
- Bus Occupancy Prediction
- AI Route Optimization
- Offline Maps Support

---

## 👩‍💻 Author

**Leelavathi U**

B.E. Electronics and Communication Engineering

Capstone Project

---

## 📄 License

This project is developed for educational and academic purposes.

---

## ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.
