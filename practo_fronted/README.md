# Practo Clone – Healthcare Services Platform

A  healthcare platform where users can book doctor appointments, order medicines, schedule lab tests, and manage digital health records.

---

# 🚀 Features

## 👨‍⚕️ Doctor Consultation
- Search doctors by specialization
- View doctor profiles
- Book appointments online
- Online & offline consultation support

## 💊 Medicine Ordering
- Upload prescription
- Add medicines to cart
- Place orders
- Track medicine delivery

## 🧪 Lab Test Booking
- Browse available lab tests
- Home sample collection
- View diagnostic reports

## 📁 Digital Health Records
- Upload reports
- Download prescriptions
- Secure medical history storage

## ⭐ Reviews & Ratings
- Doctor ratings and patient feedback

## 🔔 Notifications
- Appointment reminders
- Order updates
- Booking confirmations

---

# 🛠️ Tech Stack

## Frontend
- React.js
- Tailwind CSS
- React Router DOM
- Lucide React Icons
- Axios

## Backend
- Django
- Django REST Framework (DRF)

## Database
- MySQL

## Other Services
- OTP Authentication
- Payment Gateway

---

# 📂 Project Structure

```bash
practo-plus/
│
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── assets/
│   ├── routes/
│   ├── App.jsx
│   └── main.jsx
│
├── package.json
└── README.md
```

---

# 🔐 Authentication

- Email/Phone Registration
- OTP Verification
- Secure Login System

---

# 📅 Appointment Booking Flow

1. User Login
2. Search Doctor
3. Select Time Slot
4. Confirm Appointment
5. Payment
6. Consultation

---

# 📦 Installation

## Clone Repository

```bash
git clone https://github.com/your-username/practo-plus.git
```

## Move to Project Folder

```bash
cd practo-plus
```

## Install Frontend Dependencies

```bash
npm install
```

## Start Frontend

```bash
npm run dev
```

---

# ⚙️ Backend Setup (Django)

## Create Virtual Environment

```bash
python -m venv env
```

## Activate Environment

### Windows

```bash
env\Scripts\activate
```

### Mac/Linux

```bash
source env/bin/activate
```

## Install Backend Dependencies

```bash
pip install -r requirements.txt
```

## Run Django Server

```bash
python manage.py runserver
```

---

# 🌐 API Endpoints

## Authentication APIs

```http
POST /signup
POST /login
POST /verify-otp
```

---

## Doctor APIs

```http
GET    /doctors/
GET    /doctor/:id
POST   /doctors/
PUT    /doctors/:id
DELETE /doctors/:id
```

---

## Appointment APIs

```http
GET    /appointments/
POST   /appointments/
PUT    /appointments/:id
DELETE /appointments/:id
```

---

## Lab Test APIs

```http
GET    /lab-tests/
POST   /lab-tests/
```

---

## Lab Order APIs

```http
GET    /lab-orders/
POST   /lab-orders/
```

---

## Medicine Order APIs

```http
GET    /orders/
POST   /orders/
```

---

## Health Record APIs

```http
GET    /health-records/
POST   /health-records/
```

---

## Admin APIs

```http
GET    /admin-users/
```

---

## Payment APIs

```http
GET    /payments/
POST   /payments/
```

---

# 📊 Functional Modules

- User Management
- Doctor Discovery
- Appointment Booking
- Teleconsultation
- Pharmacy System
- Diagnostics
- Health Records
- Reviews & Ratings
- Notifications
- Payments

---

# 📈 Non-Functional Requirements

- High Scalability
- Secure Data Encryption
- Fast Response Time (<3 sec)
- 99.9% Uptime

---

# 🎯 Objectives

- Improve healthcare accessibility
- Digitize patient-doctor interactions
- Simplify medical services
- Enhance patient experience

---

# 🔮 Future Enhancements

- AI Symptom Checker
- Personalized Recommendations
- Wearable Device Integration
- Real-time Video Consultation

---

# 👥 Stakeholders

- Patients
- Doctors
- Clinics & Hospitals
- Labs & Pharmacies
- Admin Team
- Technology Team

---

# 📷 Screens Included

- Home Page
- Doctor Listing
- Appointment Booking
- Pharmacy
- Lab Test Booking
- Dashboard
- Payment Page

---

# 🔒 Security Features

- JWT Authentication
- Password Encryption
- Secure APIs
- Protected Routes

---

# 📄 License

This project is developed for educational and learning purposes.

---

# ❤️ Developed By

Practo Healthcare Platform Team