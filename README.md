# 🧠 AirdropX Backend – Personal Crypto Airdrop Tracker API

This is the **backend server** for **AirdropX**, a personal crypto airdrop tracker that allows users to manage and track all their airdrop rewards securely. Built using Node.js, Express.js, and MongoDB.

---

## ✅ Key Features

- User Signup with Secure Email Verification (via token)
- JWT Authentication and Protected Routes
- Create, Read, Update, Delete (CRUD) for Airdrops
- Search Airdrops by Project Name
- Filter Airdrops by Status or Minimum Reward
- Get Summary of Total Received Airdrops and Earnings
- Clean MVC Structure

---

## 🛠️ Tech Stack

- **Node.js + Express.js** – Server and routing
- **MongoDB + Mongoose** – Database and ORM
- **JWT** – Authentication
- **Nodemailer** – Email Verification
- **Dotenv** – Environment Variables
- **Bcrupt** – For Password Hashing

---
```
## 📂 Folder Structure

/backend
│
├── controller/
│ └── auth.controller.js
│ └── airdrop.controller.js
│
├── models/
│ └── userModel.js
│ └── airdropModel.js
│
├── routes/
│ └── auth.routes.js
│ └── airdrop.routes.js
│
├── middleware/
│ └── authMiddleware.js
│
├── config/
│ └── db.js
│
├── utils/
│ └── sendVerificationEmail.js
│
├── server.js
└── .env


---
```
## 🔐 Authentication Flow

- On Signup, a verification email is sent using a short random token.
- Users must click the email link to verify their account.
- Only verified users can log in and access airdrop features.
- JWT tokens are issued after login for securing API routes.

---

## 📡 API Endpoints

| Method | Route                             | Description                               |
|--------|-----------------------------------|-------------------------------------------|
| POST   | `/api/v1/auth/signup`            | Register new user                         |
| GET    | `/api/v1/auth/verify/:token`     | Verify account by token                   |
| POST   | `/api/v1/auth/login`             | Login with email & password               |
| GET    | `/api/v1/airdrop/get`            | Get all airdrops for logged-in user       |
| GET    | `/api/v1/airdrop/get/:id`        | Get airdrop by ID                         |
| POST   | `/api/v1/airdrop/create`         | Create a new airdrop                      |
| PATCH  | `/api/v1/airdrop/update/:id`     | Update airdrop info                       |
| DELETE | `/api/v1/airdrop/delete/:id`     | Delete a specific airdrop                 |
| GET    | `/api/v1/airdrop/search?keyword=xyz` | Search airdrops by project name       |
| GET    | `/api/v1/airdrop/filter?status=received&minReward=10` | Filter by status and reward |
| GET    | `/api/v1/airdrop/summary`        | Get total earnings and received count     |

---

## 🧪 Run Locally

### Clone the project

```bash
git clone https://github.com/Rizwan1131/-AirdropX-Personal-Crypto-Airdrop-Tracker/tree/main

### 👇.
npm install

👇. Add environment variables in .env file
MONGO_URI=your_mongodb_url
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
CLIENT_URL=http://localhost:3000

👇. Start the server
npm run dev


🔒 Environment Variables
| Key          | Description                       |
| ------------ | --------------------------------- |
| `MONGO_URI`  | MongoDB connection string         |
| `JWT_SECRET` | Secret key for JWT signing        |
| `EMAIL_USER` | Your email (for Nodemailer)       |
| `EMAIL_PASS` | App password / SMTP password      |
| `CLIENT_URL` | Frontend URL (used in email link) |

🧠 Author
Developed by Rizwan
GitHub: @Rizwan1131

⭐️ Show Support
If you like this backend project, consider giving it a ⭐ on GitHub and sharing with others!



