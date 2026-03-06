# 🏋️ Loyd's Fitness Gym Management System

A full-stack gym management app built with **React** (frontend) and **Flask + SQLite** (backend).

---

## 🚀 Quick Start

### 1. Backend (Flask)

```bash
cd backend
pip install flask flask-cors
python app.py
```

Flask will run at → **http://localhost:5000**

Default login: `admin` / `admin123`

---

### 2. Frontend (React)

```bash
cd frontend
npm install
npm start
```

React will run at → **http://localhost:3000**

---

## 📁 Project Structure

```
gym-app/
├── backend/
│   ├── app.py           # Flask API
│   ├── requirements.txt
│   └── gym.db           # SQLite DB (auto-created)
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── App.js
        ├── index.js
        ├── index.css
        ├── components/
        │   └── Layout.js
        └── pages/
            ├── Login.js
            ├── Dashboard.js
            ├── Members.js
            └── Alerts.js
```

---

## ✅ Features

- 🔐 Admin login/auth
- 📊 Dashboard with live stats (total, active, revenue, new this month)
- 👥 Members list with add, edit, delete
- 🔍 Search by name/email/phone + filter by plan
- ⚠️ Expiring & expired membership alerts (3/7/14/30 day filters)
- ⬇️ Export all members to CSV
- 🔒 Protected routes (redirects to login if not authenticated)

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /login | Admin login |
| GET | /members | Get all members |
| POST | /members | Add new member |
| PUT | /members/:id | Update member |
| DELETE | /members/:id | Delete member |
| GET | /stats | Dashboard stats |
| GET | /expiring?days=7 | Expiring/expired members |
| GET | /export/csv | Download members CSV |
