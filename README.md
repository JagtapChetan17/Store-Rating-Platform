Store Rating Platform
📖 Project Description

The Store Rating Platform is a full-stack web application that enables users to submit and manage ratings for stores.
It supports role-based authentication with three types of users:

System Administrator – Manage users, stores, and view overall statistics.

Normal User – Register, log in, browse stores, and submit/modify ratings (1–5).

Store Owner – View ratings submitted for their store and track the average rating.

This project is built using Express.js (backend), MySQL (database), and React.js (frontend) following best practices for scalability, validation, and clean architecture.

🚀 Tech Stack

Backend: Express.js

Database: MySQL

Frontend: React.js

Authentication: JWT (JSON Web Tokens), bcrypt

Styling: CSS (custom)

📂 Project Structure
store-rating-platform/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Business logic for routes
│   ├── middleware/      # Authentication & validation
│   ├── models/          # Database models (User, Store, Rating)
│   ├── routes/          # API route definitions
│   ├── utils/           # Helper functions
│   ├── package.json     
│   └── server.js        # Entry point for backend
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/  # UI components for Admin, User, Store Owner
│   │   ├── contexts/    # React Context (Auth)
│   │   ├── services/    # API integration
│   │   ├── styles/      # CSS files
│   │   ├── App.js       
│   │   └── index.js     
│   ├── package.json
│   └── package-lock.json
└── database/
    └── schema.sql       # Database schema and initial setup

⚙️ Installation & Setup
1️⃣ Clone Repository
git clone https://github.com/JagtapChetan17/store-rating-platform.git
cd store-rating-platform

2️⃣ Backend Setup
cd backend
npm install


Configure your MySQL database in backend/config/database.js.

Import schema from database/schema.sql.

mysql -u root -p store_rating < ../database/schema.sql


Run backend server:

npm start

3️⃣ Frontend Setup
cd ../frontend
npm install
npm start


Runs the app in development mode at:
👉 http://localhost:3000

🔑 User Roles & Functionalities
👨‍💻 System Administrator

Add stores, normal users, and other admins

Dashboard with total users, stores, and ratings

View and filter user/store lists

View detailed user info

🙍 Normal User

Register, log in, and update password

Browse/search stores (by name/address)

Submit or modify ratings (1–5)

See their submitted rating and store’s overall rating

🏪 Store OwneragtapCheta

Log in and update password

View list of users who rated their store

Check average rating of their store

✅ Form Validations

Name: 20–60 characters

Address: Up to 400 characters

Password: 8–16 characters, at least 1 uppercase and 1 special character

Email: Standard email format

📊 Features

✔ Role-based authentication (JWT)
✔ Secure password storage (bcrypt)
✔ MySQL relational schema with normalization
✔ Sorting & filtering in admin dashboards
✔ CRUD operations for users, stores, and ratings
✔ Responsive frontend with React.js

📝 License

This project is for educational and internship purposes.
