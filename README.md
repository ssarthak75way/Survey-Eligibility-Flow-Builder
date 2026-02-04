#  Survey Eligibility Flow Builder
A powerful **full-stack application** that enables users to visually build **survey flows with logic-based eligibility rules**.  
It is designed to help researchers, product teams, and market research platforms **screen users accurately before surveys or studies**.

---
## 📹 Demo Video

[Click here to watch the demo](https://drive.google.com/file/d/1SsS2RyQSAqFmlnemkxZusocNCqgUDQsG/view?usp=sharing)

---

### Demo



---
##  What This Project Does

- Build surveys using a **drag-and-drop flow editor**
- Define **conditional eligibility logic** (equals, greater than, contains, etc.)
- Preview eligibility outcomes in real time
- Securely manage surveys with authentication
- Export survey logic and mock results for external use

---

##  Tech Stack

### Backend
- **Node.js**
- **Express**
- **TypeScript**
- **MongoDB + Mongoose**
- **JWT Authentication** (Access & Refresh Tokens)
- **Zod** (schema validation)

### Frontend
- **React** (Vite + TypeScript)
- **Redux Toolkit**
- **React Router v7**
- **React Flow** (`@xyflow/react`)
- **Material UI (MUI)**
- **Framer Motion**

---

##  Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (Atlas or Local)
- **npm** or **yarn**

---

##  Getting Started

###  Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
MONGO_URI=your_mongodb_uri
PORT=5000

ACCESS_TOKEN_SECRET=your_access_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d

FRONTEND_URL=http://localhost:5173
```

Run backend:

```bash
npm run dev
```

---

###  Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

##  Application Usage Flow

### Register / Login
- Secure authentication with JWT & refresh tokens

### Dashboard
- View, create, edit surveys
- Draft & published states

### Flow Builder
- Drag & drop nodes: Start, Question, Condition, Eligible, Ineligible
- Configure logic visually
- Edit labels and conditions

### Real-Time Eligibility Preview
- Test logic instantly
- Simulate user answers

### Save & Export
- Save flows to MongoDB
- Export logic as JSON
- Export mock results as CSV (paginated)

---

##  Features

- Visual Logic Editor (React Flow)
- Modern responsive UI (MUI + Framer Motion)
- Secure JWT authentication
- End-to-end validation (Zod)
- Custom animated toasts
- Profile settings with avatar blob preview

---

##  Security Notes

- Passwords hashed with bcrypt
- Tokens never stored in plain text
- Protected routes on frontend & backend

---

##  Use Cases

- Market research platforms
- UX & product research screening
- Paid survey qualification
- Internal research tools

---

##  Why This Project Matters

This project demonstrates:
- Visual rule engines
- Conditional logic systems
- Scalable React architecture
- Production-grade backend patterns

It is **portfolio-ready and extensible**.

---
