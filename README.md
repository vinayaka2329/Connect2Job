# 🚀 Connect2Job - Modern Job Portal & Career Platform

[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Container-Docker%20Compose-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**Connect2Job** is a full-stack MERN (MongoDB, Express, React, Node.js) web application designed to connect job seekers with top recruiters and employment opportunities. It provides intuitive job searching, application submission with Cloudinary-backed resume uploads, real-time application status tracking, user profile management, and a comprehensive admin control panel.

---

## 📌 Table of Contents

- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Project Directory Structure](#-project-directory-structure)
- [API Endpoints](#-api-endpoints)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Configuration](#environment-configuration)
  - [Run with Docker Compose (Recommended)](#run-with-docker-compose-recommended)
  - [Run Locally (Manual Setup)](#run-locally-manual-setup)
- [Responsive UI & Mobile Support](#-responsive-ui--mobile-support)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Project Overview

Connect2Job bridges the gap between talent and enterprise hiring. Built with modern web standards, it ensures high responsiveness, fast loading speeds via Vite, secure user authentication with JWT and bcrypt, and modular scalability through containerized deployment.

Whether a candidate is applying for their first tech role or an administrator is managing job postings and applicant pipelines, Connect2Job delivers a seamless end-to-end workflow.

---

## ✨ Key Features

### 👤 For Job Seekers
- **Job Discovery & Filtering**: Browse curated listings, filter by job title, category, location, and requirements.
- **Easy Applications**: Apply with personal details, portfolio links, and resume uploads directly stored securely via Cloudinary.
- **Real-Time Application Tracker**: Track the live review status (`Pending`, `Reviewed`, `Accepted`, `Rejected`) of all submitted applications using your registered email address.
- **User Dashboard & Profile**: View application history, saved jobs, and account activity with inline profile editing.
- **Interactive Auth Experience**: Responsive Login and Registration with mascot animations and secure token-based session handling.

### 🏢 For Recruiters & Administrators
- **Admin Control Panel**: View comprehensive application metrics, post and manage active job listings, update application statuses, and manage user accounts.
- **Applicant Review**: Access and review candidates' uploaded resumes, contact details, and qualifications.
- **Subscriber & Contact Management**: Monitor newsletter subscriptions and contact form inquiries.

---

## 🛠 Tech Stack

### Frontend
- **Framework**: [React 18](https://react.dev/) with [Vite](https://vitejs.dev/) for high-speed builds and HMR
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & modular CSS with custom responsive breakpoints
- **Routing**: [React Router v6](https://reactrouter.com/)
- **Icons & UI Enhancements**: [Lucide React](https://lucide.dev/), [React Icons](https://react-icons.github.io/react-icons/), [Heroicons](https://heroicons.com/)
- **Animations & Carousels**: [Framer Motion](https://www.framer.com/motion/), [AOS (Animate On Scroll)](https://michalsnik.github.io/aos/), [Swiper](https://swiperjs.com/)
- **HTTP Client**: [Axios](https://axios-http.com/)

### Backend
- **Runtime & Framework**: [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose ODM](https://mongoosejs.com/)
- **Authentication**: [JSON Web Tokens (JWT)](https://jwt.io/) & [Bcrypt.js](https://github.com/dcodeIO/bcrypt.js)
- **File Uploads**: [Multer](https://github.com/expressjs/multer) & [Cloudinary](https://cloudinary.com/) storage
- **Security & Logging**: [Helmet](https://helmetjs.github.io/), [CORS](https://github.com/expressjs/cors), and [Morgan](https://github.com/expressjs/morgan)

### DevOps & Tooling
- **Containerization**: [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)

---

## 🏗 System Architecture

```text
┌────────────────────────────────────────────────────────┐
│                   Client (Browser)                     │
│           React 18 + Vite (Port: 5173)                 │
└───────────────────────────┬────────────────────────────┘
                            │ REST API (JSON / FormData)
                            ▼
┌────────────────────────────────────────────────────────┐
│               Connect2Job Express Server               │
│                  Node.js (Port: 5000)                  │
├────────────────────────────────────────────────────────┤
│  • Auth Middleware (JWT Verification)                  │
│  • Multer + Cloudinary Pipeline (Resume Uploads)       │
│  • Routes: /auth, /jobs, /applications, /contacts      │
└──────────────┬──────────────────────────┬──────────────┘
               │                          │
               ▼                          ▼
     ┌───────────────────┐      ┌──────────────────┐
     │   MongoDB Atlas   │      │ Cloudinary Media │
     │  (Data Storage)   │      │ (Resume Storage) │
     └───────────────────┘      └──────────────────┘
```

---

## 📁 Project Directory Structure

```text
Connect2Job/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── cloudinary.js     # Cloudinary configuration
│   │   │   └── database.js       # MongoDB connection logic
│   │   ├── middleware/
│   │   │   └── auth.js           # JWT protection & role verification
│   │   ├── models/
│   │   │   ├── Application.js    # Job application schema
│   │   │   ├── Contact.js        # Contact message schema
│   │   │   ├── Job.js            # Job listing schema
│   │   │   ├── Subscriber.js     # Newsletter subscriber schema
│   │   │   └── User.js           # User account schema with password hashing
│   │   ├── routes/
│   │   │   ├── applications.js   # Application submission & tracking
│   │   │   ├── auth.js           # Register, login, profile routes
│   │   │   ├── contacts.js       # Contact form submissions
│   │   │   ├── jobs.js           # Job CRUD operations
│   │   │   └── subscribers.js    # Newsletter subscriptions
│   │   └── server.js             # Express app setup & middleware
│   ├── Dockerfile                # Backend container definition
│   └── package.json
│
├── frontend/
│   ├── images/                   # Static branding & mascot assets
│   ├── public/                   # Public assets & icons
│   ├── src/
│   │   ├── components/           # Reusable components (Navbar, Footer, TrustedCompanies)
│   │   ├── context/              # React Context (AuthContext, AppContext)
│   │   ├── pages/                # Home, Jobs, Services, About, Profile, TrackApplication, Admin, Login, Register
│   │   ├── services/             # Axios API service handlers
│   │   ├── styles/               # Global CSS, utilities, page animations
│   │   ├── App.jsx               # Route definitions & app layout shell
│   │   └── main.jsx              # React DOM entrypoint
│   ├── Dockerfile                # Frontend container definition
│   ├── vite.config.js            # Vite configuration
│   └── package.json
│
├── docker-compose.yml            # Multi-container orchestration
└── README.md                     # Project documentation
```

---

## 📡 API Endpoints

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user | Public |
| `POST` | `/api/auth/login` | Authenticate user & receive JWT | Public |
| `GET` | `/api/auth/me` | Fetch currently authenticated user | Protected (User) |
| `PUT` | `/api/auth/update` | Update user profile details | Protected (User) |
| `GET` | `/api/auth/users` | List all registered users | Protected (Admin) |
| `DELETE`| `/api/auth/users/:id` | Delete a user account | Protected (Admin) |

### 💼 Job Postings (`/api/jobs`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/jobs` | Retrieve all job listings | Public |
| `GET` | `/api/jobs/:id` | Retrieve single job by ID | Public |
| `POST` | `/api/jobs` | Create a new job listing | Protected (Admin) |
| `PUT` | `/api/jobs/:id` | Update an existing job listing | Protected (Admin) |
| `DELETE`| `/api/jobs/:id` | Delete a job listing | Protected (Admin) |

### 📝 Applications (`/api/applications`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/applications` | Submit application with resume upload | Public / User |
| `GET` | `/api/applications` | Fetch all applications | Protected (Admin) |
| `GET` | `/api/applications/status/:email` | Track applications by applicant email | Public |
| `PUT` | `/api/applications/:id` | Update application review status | Protected (Admin) |
| `DELETE`| `/api/applications/:id` | Remove an application record | Protected (Admin) |

### 📬 Communications & Inquiries
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/contacts` | Submit a contact / support message | Public |
| `POST` | `/api/subscribers` | Subscribe to job alerts & newsletter | Public |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js (v18 or v20+)](https://nodejs.org/)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB Atlas](https://www.mongodb.com/) cluster or a local MongoDB instance
- [Cloudinary Account](https://cloudinary.com/) (for resume file uploads)
- [Docker & Docker Compose](https://www.docker.com/) *(optional, for containerized run)*

---

### Environment Configuration

#### 1. Backend (`backend/.env`)
Create a `.env` file in the `backend/` folder:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d

# Allowed CORS Origins
CLIENT_URL=http://localhost:5173

# Cloudinary Storage
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

#### 2. Frontend (`frontend/.env`)
Create a `.env` file in the `frontend/` folder:

```env
VITE_API_URL=http://localhost:5000/api
```

---

### Run with Docker Compose (Recommended)

1. **Build and start all services**:
   ```bash
   docker compose up --build
   ```

2. Access the applications:
   - **Frontend**: [http://localhost:5173](http://localhost:5173)
   - **Backend API**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

3. **Stop the containers**:
   ```bash
   docker compose down
   ```

---

### Run Locally (Manual Setup)

#### 1. Start the Backend
```bash
cd backend
npm install
npm run dev
```
The backend server will run on `http://localhost:5000`.

#### 2. Start the Frontend
Open a new terminal:
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```
The client app will launch at `http://localhost:5173`.

---

## 📱 Responsive UI & Mobile Support

Connect2Job is engineered to adapt flawlessly across viewports:
- **Desktop (>1024px)**: Full multi-column dashboard, animated mascots with side-card alignment, and marquee partner logos.
- **Mobile Desktop-Site Mode (500px – 1024px)**: Specifically calibrated layout, calculated card offsets, and optimized mascot scaling to prevent horizontal or vertical clipping when mobile users toggle "Desktop View".
- **Compact Mobile (<500px)**: Compact, touch-friendly single-column layout with optimized input sizes and streamlined navigation.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
