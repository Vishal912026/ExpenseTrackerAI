# 💸 ExpenseAI: AI Expense Tracker

Type your expenses in plain **Hindi, Hinglish or English** and let AI do the rest.
Write *"Yesterday I spent 80 rupees on tea and auto"* and ExpenseAI splits it into separate expenses, each with an amount, category and date.

**🔗 Live demo:** https://expenseai-app-vishal.netlify.app
**⚙️ API:** https://expenseai-api-kq7j.onrender.com

> The backend runs on a free Render instance, so the first request after a period of inactivity can take up to ~50 seconds to wake up.

## Features

- 🤖 **AI expense entry:** Gemini turns one sentence into multiple structured expenses (title, amount, category, date)
- 🔐 **Authentication:** JWT-based register/login with bcrypt-hashed passwords
- ✍️ **Manual entry** for when you prefer a form
- 📊 **Dashboard:** this month's total, category-wise pie chart and month-wise bar chart
- 🔎 **Filters** by category and month, and delete with confirmation
- 🛡️ **Rate limiting** on the AI route to protect API quota
- 🔁 **Resilient AI calls:** retry with a fallback model when the AI service is busy
- 🔒 **Per-user data isolation:** users can only read and delete their own expenses
- 📱 Responsive layout for mobile and desktop

## Tech Stack

| Layer | Tools |
|---|---|
| Frontend | React (Vite), React Router, Axios, Recharts |
| Backend | Node.js, Express, Mongoose, JWT, bcryptjs, express-rate-limit |
| AI | Google Gemini API (JSON output) |
| Database | MongoDB Atlas (dedicated database user with access to this database only) |
| Deployment | Netlify (frontend), Render (backend) |

## How It Works

```
React app --(JWT in header)--> Express API --> MongoDB Atlas
                                    |
                                    +--> Gemini API (sentence -> JSON expenses -> validated -> saved)
```

AI output is never trusted blindly. Every item is validated before it is saved: the amount must be greater than 0 and the category must be in the allowed list, otherwise it falls back to "Other".

## Project Structure

```
ExpenseTrackerAI/
├── backend/
│   ├── config/         # database connection
│   ├── controllers/    # auth, expense and AI logic
│   ├── middleware/     # JWT auth guard
│   ├── models/         # User and Expense schemas
│   ├── routes/         # API routes
│   └── server.js
└── frontend/
    └── src/
        ├── api/        # axios instance with auth interceptor
        ├── context/    # AuthContext
        ├── components/ # Navbar, AiInput, ExpenseForm, ExpenseList, Charts
        └── pages/      # Login, Register, Dashboard
```

## API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Create account | No |
| POST | `/api/auth/login` | Login, returns token | No |
| GET | `/api/expenses` | List expenses (`?month=2026-10&category=Food`) | Yes |
| POST | `/api/expenses` | Add expense manually | Yes |
| DELETE | `/api/expenses/:id` | Delete own expense | Yes |
| GET | `/api/expenses/summary` | Totals for dashboard charts | Yes |
| POST | `/api/ai/add` | Add expenses from a sentence | Yes |

## Run Locally

**Backend**

```bash
cd backend
npm install
npm run dev
```

Create `backend/.env`:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173
```

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

Create `frontend/.env`:

```
VITE_API_URL=http://localhost:5000/api
```

## Future Improvements

- Edit existing expenses
- Monthly budget limits with alerts
- Export expenses as CSV
- Receipt photo scanning

## Author

**Vishal Kumar Prajapati**
GitHub: [@Vishal912026](https://github.com/Vishal912026)