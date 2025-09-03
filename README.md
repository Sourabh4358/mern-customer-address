# MERN Customer-Address App

This project is a **MERN stack application** to manage customers and their addresses.  
It demonstrates a **one-to-many relationship** (One Customer → Many Addresses) using MongoDB and Mongoose.

---

## 🚀 Features
- Create customers with basic info (name, email, phone).
- Add multiple addresses for each customer.
- Fetch customers along with their addresses.
- Backend REST API with Express + MongoDB.
- Frontend with React + Axios.
- Deployed with **Render (backend)** and **Vercel (frontend)**.

---

## 🛠 Tech Stack
- **Frontend**: React, Axios, React Router
- **Backend**: Node.js, Express.js, Mongoose
- **Database**: MongoDB Atlas
- **Deployment**: Render (backend) + Vercel (frontend)

---

## 📂 Project Structure
mern-customer-address/
│── client/ # React frontend
│── server/ # Express backend
│── README.md
│── .gitignore


---

## ⚙️ Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/mern-customer-address.git
cd mern-customer-address
cd server
npm install
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/mern_customer_db
CLIENT_URL=http://localhost:3000


Run backend:

npm start

Frontend (client)
cd client
npm install

Create a .env file inside client/:

REACT_APP_API_URL=http://localhost:5000/api


Run frontend:

npm start


Frontend will run on: http://localhost:3000