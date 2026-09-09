# 🌾 Crop Recommendation System (MERN Stack)

A full-stack web application that recommends the best crops to grow based on soil
nutrients (N, P, K), pH, and climate conditions (temperature, humidity, rainfall).
Built with **MongoDB, Express, React, Node.js** using a transparent, rule-based
matching engine (no external ML service required).

---

## ✨ Features

- **Authentication** — Register/Login with JWT, roles: `farmer` and `admin`
- **Crop Recommendation Engine** — Enter soil & climate data, get top-matching
  crops ranked by percentage match, with explanations
- **Recommendation History** — Every farmer can see their past recommendations
- **Admin Panel** — Full CRUD over the crop knowledge base (add/edit/delete crops
  and their ideal growing ranges)
- **Crop photos** — every crop shows a real photo in results, history, and the
  admin table (stored in `client/public/crop-images/`), with a graceful
  leaf-icon fallback if a photo is ever missing or broken
- **Protected Routes** — Role-based route guards on both API and frontend
- **Clean, distinctive UI** — Custom design system (no generic Bootstrap look)

---

## 🗂️ Project Structure

```
crop-recommendation-system/
├── server/                 # Express + MongoDB API
│   ├── config/db.js
│   ├── models/              # User, Crop, Recommendation
│   ├── controllers/
│   ├── routes/
│   ├── middleware/          # JWT auth + admin guard
│   ├── utils/recommendationEngine.js   # rule-based matching logic
│   ├── seed/seedCrops.js    # seeds 15 crops into MongoDB
│   ├── server.js
│   └── package.json
│
└── client/                 # React frontend (Create React App)
    ├── public/
    │   └── crop-images/      # crop photos, referenced by seedCrops.js
    ├── src/
    │   ├── api/axios.js
    │   ├── context/AuthContext.js
    │   ├── components/       # Navbar, PrivateRoute, AdminRoute, CropPhoto
    │   ├── pages/             # Login, Register, Dashboard, History, AdminCrops
    │   └── styles/
    └── package.json
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB running locally (or a MongoDB Atlas connection string)

### 1. Backend Setup

```bash
cd server
npm install
cp .env.example .env
# edit .env and set MONGO_URI and JWT_SECRET
npm run seed     # populates the crop knowledge base (24 crops, with photos)
npm run dev      # starts server on http://localhost:5000
```

### 2. Frontend Setup

```bash
cd client
npm install
npm start         # starts React app on http://localhost:3000
```

The React app is pre-configured (via `src/api/axios.js`) to call the API at
`http://localhost:5000/api`. Change this if your backend runs elsewhere.

### 3. Create an admin account

Register a normal account via the UI, then in MongoDB manually set that user's
`role` field to `"admin"` (or use `mongosh`):

```js
use crop_recommendation
db.users.updateOne({ email: "you@example.com" }, { $set: { role: "admin" } })
```

---

## 🧠 How the Recommendation Engine Works

`server/utils/recommendationEngine.js` scores every crop in the database against
the farmer's input (N, P, K, temperature, humidity, pH, rainfall). For each
parameter:

- If the input falls **inside** the crop's ideal range → full score for that parameter
- If it falls **outside** → partial score based on how far outside the range it is
  (the further off, the lower the score)

All 7 parameter scores are averaged into a single **match percentage**. The top 5
crops are returned, sorted highest match first, along with a short explanation of
which parameters matched well and which didn't.

This is intentionally transparent and explainable (versus a black-box ML model),
and it's trivial to swap out later for a trained model — the engine is isolated
in one file with a single `getRecommendations(input, crops)` function.

---

## 🔌 API Endpoints

| Method | Endpoint                  | Access        | Description                        |
|--------|----------------------------|---------------|-------------------------------------|
| POST   | `/api/auth/register`       | Public        | Create a new account                |
| POST   | `/api/auth/login`          | Public        | Login, returns JWT                  |
| GET    | `/api/auth/me`             | Private       | Get current user profile            |
| GET    | `/api/crops`                | Public        | List all crops                      |
| GET    | `/api/crops/:id`            | Public        | Get single crop                     |
| POST   | `/api/crops`                 | Admin         | Create a crop                       |
| PUT    | `/api/crops/:id`             | Admin         | Update a crop                       |
| DELETE | `/api/crops/:id`             | Admin         | Delete a crop                       |
| POST   | `/api/recommend`             | Private       | Get crop recommendations            |
| GET    | `/api/recommend/history`     | Private       | Get logged-in user's history        |

---

## 🛠️ Tech Stack

- **Frontend:** React 18, React Router v6, Axios, Context API
- **Backend:** Node.js, Express, Mongoose
- **Database:** MongoDB
- **Auth:** JWT + bcrypt
- **Styling:** Hand-written CSS design system (see `client/src/styles`)

---

## 📈 Ideas to Extend This Project

- Swap the rule-based engine for a trained ML model (Flask microservice)
- Live weather auto-fill via OpenWeatherMap API
- Fertilizer recommendation module
- Crop disease detection from leaf images (CNN)
- Multi-language support (i18next)
- SMS/email alerts (Twilio)
