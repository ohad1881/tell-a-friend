# 🍕 Tell A Friend 🍜

A web application that lets users rate restaurants, discover people with similar taste, and understand **why** they are (or aren't) similar based on rating analysis.

---

## 🚀 Features

- User authentication with JWT
- Rate restaurants (Food / Service / Atmosphere / Value)
- **Who’s Like Me?** – find users with similar taste
- **See Why** – detailed explanation of similarity / difference
- Clean UI built with React
- Backend API powered by Express

---

## 🛠 Tech Stack

### Frontend

- React
- React Router DOM
- CSS

### Backend

- Node.js + Express
- CORS
- JWT Authentication
- dotenv
- node-fetch

---

## 📦 Installation

### 1️⃣ Clone the project

```bash
git clone <repo-url>
cd tell-a-friend
```

### Install dependencies

npm install

### Start the backend server

npm run server

### Start the frontend

npm start

### Environment Variables - Create a .env file and configure:

JWT_SECRET=your_secret
DB_URL=your_database_url

### Project Structure (simplified)

    src/
    ├─ components/
    ├─ pages/
    ├─ restApi.js → Express server
    ├─ App.js
    public/
    README.md
    package.json
