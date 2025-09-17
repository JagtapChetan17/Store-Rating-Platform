# Store Rating Platform (React + Express + MySQL)

Full-stack store rating application where users can register, log in, browse stores, and submit ratings (1–5).
Supports **role-based authentication** for **Admins, Normal Users, and Store Owners**, with dashboards and CRUD functionalities.

---

## Demo / Live Links

* **Frontend (Live):** [Store Rating Platform](https://store-rating-platform-eight.vercel.app/login)
* **Admin / Backend (Hosted):** *add link here if deployed*

---

## Table of contents

* [What is Store Rating Platform?](#what-is-store-rating-platform)
* [Features](#features)
* [Tech stack](#tech-stack)
* [Prerequisites](#prerequisites)
* [Folder structure](#folder-structure)
* [Setup & Run (Backend)](#setup--run-backend)
* [Setup & Run (Frontend)](#setup--run-frontend)
* [Environment variables](#environment-variables)
* [Building / Release notes](#building--release-notes)
* [Contributing](#contributing)
* [Troubleshooting](#troubleshooting)
* [License](#license)

---

## What is Store Rating Platform?

The **Store Rating Platform** is a web app that allows users to browse stores and submit ratings (1–5).

* **Admins** can manage users and stores with a dashboard view of key stats.
* **Normal Users** can register, log in, browse/search stores, and leave ratings.
* **Store Owners** can view ratings for their stores and track average performance.

---

## Features

* 🔑 **Role-based authentication** (Admin, User, Store Owner)
* 👤 User registration & login (JWT-based auth)
* 🏪 Store management (CRUD operations)
* ⭐ Rating system (1–5, add/modify ratings)
* 📊 Admin dashboard with stats (users, stores, ratings)
* 🔍 Search & filtering by name, email, address
* 🔐 Secure password hashing (bcrypt)
* ✅ Form validations (name length, password rules, etc.)

---

## Tech stack

* **Frontend:** React.js (frontend folder)
* **Backend:** Node.js + Express (backend folder)
* **Database:** MySQL
* **Authentication:** JWT + bcrypt

---

## Prerequisites

* Node.js (16+)
* npm or Yarn
* MySQL server
* Git

---

## Folder structure

```
store-rating-platform/
├── backend/          # Express.js backend
│   ├── config/       # DB connection
│   ├── controllers/  # Route handlers
│   ├── middleware/   # Auth & validation
│   ├── models/       # User, Store, Rating
│   ├── routes/       # API routes
│   ├── utils/        # Helpers
│   └── server.js     # Entry point
├── frontend/         # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/ # Role-based UI
│   │   ├── contexts/   # Auth context
│   │   ├── services/   # API calls
│   │   └── App.js
├── database/
│   └── schema.sql    # DB schema setup
└── README.md
```

---

## Setup & Run — Backend

```bash
cd backend
npm install
```

Import schema:

```bash
mysql -u root -p store_rating < ../database/schema.sql
```

Create `.env` file inside `backend/`:

```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASS=yourpassword
DB_NAME=store_rating
JWT_SECRET=your_jwt_secret
```

Run backend:

```bash
npm run dev
# or
npm start
```

---

## Setup & Run — Frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs at 👉 `http://localhost:3000`

---

## Environment variables

**Backend — backend/.env**

```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASS=yourpassword
DB_NAME=store_rating
JWT_SECRET=your_jwt_secret
```

**Frontend — frontend/.env (optional)**

```
REACT_APP_API_URL=http://localhost:5000/api
```

---

## Building / Release notes

* For production, build React frontend:

```bash
cd frontend
npm run build
```

* Deploy backend to Render/Heroku and frontend to Netlify/Vercel.
* Ensure `.env` values are set correctly in production.

---

## Contributing

1. Fork the repo
2. Create a branch: `git checkout -b feat/your-feature`
3. Commit changes: `git commit -m "Added feature"`
4. Push: `git push origin feat/your-feature`
5. Open a PR

---

## Troubleshooting

* **DB connection failed** → Check `.env` DB credentials and schema.sql import.
* **Frontend not loading data** → Verify `REACT_APP_API_URL` matches backend.
* **Auth errors** → Ensure JWT secret matches across backend services.

---

## License

Specify your preferred license (e.g., MIT).

---

⚡ Done! This is **copy-paste ready** for your repo.

Do you also want me to prepare a small **`.env.example` file** (backend + frontend) so recruiters/testers can set up faster?
