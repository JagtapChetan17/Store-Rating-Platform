# Store Rating Platform (React + Express + MySQL) — Roxiler Systems

**Assignment for:** Full Stack Development Internship (Roxiler Systems)

Full-stack store rating application where users can register, log in, browse stores, and submit ratings (1–5). Supports role-based authentication for Admins, Normal Users, and Store Owners, with dashboards and CRUD functionalities.

---

## Demo / Live Links

* **Frontend (Live):** https://store-rating-platform-eight.vercel.app/
* **Admin / Backend (Hosted):** https://store-rating-platform-gc3l.onrender.com
* **Demo Video:** 📹 Watch Demo https://drive.google.com/file/d/16T3tsmsUUse88c6B6SsBK1kZwL32lL1g/view?usp=sharing

> ⚠️ **Note:** The hosted database is valid for **30 days only** and will expire on **04 January 2026**. After this date, the database service will be automatically deactivated. Meanwhile, you can download and run the project locally by following the setup steps below.

---

## Assignment Notice

This project was created as an **assignment from Roxiler Systems** for the **Full Stack Development Internship**. It demonstrates role-based authentication, user and store management, ratings, dashboards, and full frontend–backend integration.

---

## Test Login Credentials

Use the following test accounts to explore role-based features:

**Admin**

```json
{
  "email": "admin@gstore.com",
  "password": "Admin@1711"
}
```

**Store Owner**

```json
{
  "email": "Sahil@store.com",
  "password": "Sahil@1711"
}
```

**Normal User**

```json
{
  "email": "yash@store.com",
  "password": "Yash@1711"
}
```

---

## Table of contents

* What is Store Rating Platform?
* Features
* Tech stack
* Prerequisites
* Folder structure
* Setup & Run (Backend)
* Setup & Run (Frontend)
* Environment variables
* Building / Release notes
* Contributing
* Troubleshooting
* License

---

## What is Store Rating Platform?

The Store Rating Platform is a web app that allows users to browse stores and submit ratings (1–5).

* **Admins** can manage users and stores with a dashboard view of key stats.
* **Normal Users** can register, log in, browse/search stores, and leave ratings.
* **Store Owners** can view ratings for their stores and track average performance.

This implementation was completed as the **Roxiler Systems Full Stack Development internship assignment**.

---

## Features

* 🔑 Role-based authentication (Admin, User, Store Owner)
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

Frontend runs at: `http://localhost:3000`

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

**Frontend — frontend/.env** (optional)

```
REACT_APP_API_URL=http://localhost:5000/api
```

---

## Building / Release notes

For production, build the React frontend:

```bash
cd frontend
npm run build
```

Deploy backend to Render/Heroku and frontend to Netlify/Vercel. Ensure .env values are set correctly in production.

---

## Contributing

1. Fork the repo
2. Create a branch: `git checkout -b feat/your-feature`
3. Commit changes: `git commit -m "Added feature"`
4. Push: `git push origin feat/your-feature`
5. Open a PR

---

## Troubleshooting

* **DB connection failed** → Check `.env` DB credentials and `schema.sql` import.
* **Frontend not loading data** → Verify `REACT_APP_API_URL` matches backend.
* **Auth errors** → Ensure JWT secret matches across backend services.

---

## License

Specify your preferred license (e.g., **MIT**).
