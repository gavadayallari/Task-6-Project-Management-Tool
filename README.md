# SyncFlow — Modern Project Management & Kanban Collaboration Platform

[![React](https://img.shields.io/badge/Frontend-React_18_%2B_Vite-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS_v3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js_Express-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB_Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/Security-JWT_%26_Bcrypt-black?logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Postman](https://img.shields.io/badge/API_Testing-Postman_v2.1-FF6C37?logo=postman&logoColor=white)](https://www.postman.com/)
[![Status](https://img.shields.io/badge/Status-Fully_Functional_%26_Verified-success)](#)

> **Task 5: Project Management & Kanban Collaboration Web Application**  
> *Developed by **Yallari Gavada** for the Full Stack Development Internship at **Auspify Technologies**.*

---

## 📌 Executive Summary

**SyncFlow** is an enterprise-grade, responsive, full-stack Project Management and Kanban Collaboration web application engineered with the **MERN (MongoDB, Express, React, Node.js)** architecture. Inspired by industry-standard systems such as Jira and Linear, SyncFlow enables software engineering teams, product managers, and executives to orchestrate sprints, manage multi-column task pipelines, monitor milestone deadlines, track subtask checklists, collaborate through discussion threads, and audit workspace activities.

---

## 🚀 Key Features

### 📋 1. Interactive Kanban Sprint Board
- **5-Column Workflow Lifecycle**:
  - `Backlog`: Future scope and feature ideas.
  - `To Do`: Prioritized tasks queued for the upcoming sprint.
  - `In Progress`: Actively developed deliverables.
  - `In Review`: Code review, design critique, and QA staging.
  - `Done`: Completed deliverables with visual celebrations.
- **Dual Status Transition Options**:
  - **HTML5 Drag & Drop**: Native, smooth card dragging across column drop targets with reactive drop-highlight styling.
  - **1-Click Quick Move Menu**: Accessible dropdown menu on every task card for rapid status changes on touchscreens and mobile devices.
- **Rich Task Cards**:
  - Dynamic task key identifier (e.g., `SYNC-101`, `PULSE-102`).
  - Priority pills with semantic icons (`Urgent 🔥`, `High ⬆`, `Medium ➡`, `Low ⬇`).
  - Subtask checklist progress bar with real-time percentage indicators.
  - Due date tracking with automatic red **Overdue Alert** badges.
  - Assignee avatar bubbles with color-coded initials.

### 🏢 2. Multi-Workspace & Project Management
- **Project Workspaces**: Categorized by domain (*Web Development*, *Mobile App*, *Cloud & DevOps*, *UI/UX Design*, *Data & AI*, *General*).
- **Workspace Navigation**: Instant 1-click project switching in the top navigation bar.
- **Automated Sprint Progress**: Live recalculation of overall project completion percentages based on done vs. total tasks.
- **Cascade Deletion Protection**: Deleting a project safely purges all associated tasks, checklist subtasks, and audit activities.

### 📝 3. Task Specifications & Dynamic Checklists
- **Full Task Editor Drawer**:
  - Task title, rich description, and acceptance criteria.
  - Project reassignment, status column selector, and priority level.
  - Estimated hours and actual spent hours tracking.
  - Tagging system with removable label badges.
- **Interactive Checklists**:
  - Add subtasks dynamically.
  - 1-click checkbox toggling with live strikethrough and progress recalculation.
  - Remove subtasks with confirmation.

### 💬 4. Real-Time Team Discussions & Comments
- Built-in comment threads attached to every task.
- Author avatars, role badges, and formatted timestamps.
- Author-only comment deletion permissions (Admin bypass enabled).

### 🔍 5. Workspace Audit Trail & Activity Feed
- Real-time event recording for every critical project action:
  - Task creation and key generation.
  - Kanban status movements (e.g., *"moved SYNC-101 to IN PROGRESS"*).
  - Task completions.
  - Comment submissions and member assignments.

### 📊 6. Task Directory & 1-Click CSV Export
- Comprehensive data table displaying all tasks across all projects.
- Live full-text keyword search across titles, descriptions, and task keys.
- Multi-criteria filtering by Status, Priority, and Project.
- Sorting by Creation Date, Due Date, Priority, and Title.
- **Export to CSV**: Generates a standard `.csv` spreadsheet file formatted for Microsoft Excel or Google Sheets.

### 👥 7. Team Directory & Role-Based Access Control (RBAC)
- **Role Hierarchy**:
  - 👑 **Admin**: Full access across all workspaces, task management, and system stats.
  - 🚀 **Project Manager**: Project creation, member assignments, and sprint reviews.
  - 💻 **Member / Developer**: Task updates, Kanban status moves, checklists, and discussions.
- Team directory displaying email addresses, departments, and live task allocation counts.

### ⚡ 8. 1-Click Demo Accounts Auto-Fill
- Instant login auto-fill buttons for testing without typing credentials:
  - **👑 Administrator**: `admin@auspify.com` / `password123`
  - **🚀 Project Manager**: `pm@auspify.com` / `password123`
  - **💻 Lead Developer**: `dev@auspify.com` / `password123`

---

## 🛠️ Technology Stack & Architecture

```
┌────────────────────────────────────────────────────────┐
│             SyncFlow Client (React 18 + Vite)          │
│       Tailwind CSS • Context API • Lucide Icons        │
│                http://localhost:5176                   │
└───────────────────────────┬────────────────────────────┘
                            │ REST API Requests (JWT Auth)
                            ▼
┌────────────────────────────────────────────────────────┐
│           Express.js & Node.js Backend Server          │
│     CORS • Morgan • Centralized Error Handler • RBAC   │
│                http://localhost:5002                   │
└───────────────────────────┬────────────────────────────┘
                            │ Mongoose ODM
                            ▼
┌────────────────────────────────────────────────────────┐
│             MongoDB Database (syncflow_db)             │
│        Users • Projects • Tasks • Comments • Activity  │
└────────────────────────────────────────────────────────┘
```

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React.js (v18), Vite, React Router DOM (v6), Tailwind CSS (v3), Lucide React |
| **Backend** | Node.js, Express.js (v4), Morgan, Dotenv, CORS |
| **Database** | MongoDB, Mongoose ODM (v8) |
| **Security** | JSON Web Tokens (JWT), Bcrypt.js password hashing, RBAC middleware |
| **Testing** | Postman Collection v2.1, Browser Subagent Automated Verification |

---

## ⚙️ Environment Variables Setup

### Backend Configuration (`project-management-tool/backend/.env`)
```env
# Server Configuration
PORT=5002
NODE_ENV=development

# MongoDB Connection String (Local MongoDB Compass / Server)
MONGODB_URI=mongodb://127.0.0.1:27017/syncflow_db

# JWT Secret & Expiration
JWT_SECRET=auspify_syncflow_task5_production_secure_jwt_token_secret_key_2026
JWT_EXPIRE=30d

# Client URL (for CORS)
CLIENT_URL=http://localhost:5176
```

---

## 🚀 Installation & Local Execution Guide

### Prerequisites
- **Node.js** (v18+ recommended, v22 tested)
- **npm** (v9+)
- **MongoDB Compass / Community Server** running on `mongodb://127.0.0.1:27017`

### 1. Backend Setup
```bash
# Navigate to backend directory
cd project-management-tool/backend

# Install dependencies
npm install

# Seed the database with realistic demo projects, tasks, checklists, and users
npm run seed

# Start development server (Port 5002)
npm run dev
```

### 2. Frontend Setup
```bash
# In a new terminal, navigate to frontend directory
cd project-management-tool/frontend

# Install dependencies
npm install

# Start Vite development server (Port 5176)
npm run dev
```

Open your browser and navigate to:  
👉 **`http://localhost:5176`**

---

## 🔑 Pre-Seeded Demo Test Accounts

| Role | Email Address | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@auspify.com` | `password123` | Full administrative control, all projects, cascade deletion |
| **Project Manager** | `pm@auspify.com` | `password123` | Workspace management, task creation, member assignment |
| **Lead Developer** | `dev@auspify.com` | `password123` | Task pipeline updates, drag & drop, checklists, comments |
| **Product Designer** | `designer@auspify.com` | `password123` | Design workspace tasks, reviews, and checklists |
| **QA Specialist** | `qa@auspify.com` | `password123` | Testing verification, bug tasks, checklist completions |

---

## 📡 REST API Reference

All protected endpoints require the HTTP Header:  
`Authorization: Bearer <your_jwt_token>`

### 1. Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Service health status check | Public |
| `POST` | `/api/auth/register` | Register new user with role | Public |
| `POST` | `/api/auth/login` | Authenticate and obtain JWT token | Public |
| `GET` | `/api/auth/me` | Get authenticated user profile | Private |
| `PUT` | `/api/auth/profile` | Update user name, title, department | Private |
| `GET` | `/api/auth/users` | List team directory for assignment | Private |

### 2. Projects & Workspaces (`/api/projects`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/projects` | Get all projects with live completion % | Private |
| `GET` | `/api/projects/stats` | Dashboard metrics (total, overdue, rates) | Private |
| `GET` | `/api/projects/:id` | Get single project with tasks | Private |
| `POST` | `/api/projects` | Create new project workspace | Private |
| `PUT` | `/api/projects/:id` | Update project settings and members | Private |
| `DELETE` | `/api/projects/:id` | Delete project and cascade delete tasks | Private |

### 3. Tasks & Kanban Pipeline (`/api/tasks`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/tasks` | Get tasks with project/status/priority filters | Private |
| `GET` | `/api/tasks/:id` | Get single task with checklist and comments | Private |
| `POST` | `/api/tasks` | Create task with auto-generated key (`SYNC-101`) | Private |
| `PUT` | `/api/tasks/:id` | Update full task details and checklist | Private |
| `PATCH` | `/api/tasks/:id/status` | Fast Kanban card column move | Private |
| `DELETE` | `/api/tasks/:id` | Delete task permanently | Private |
| `POST` | `/api/tasks/:id/checklist` | Add subtask to checklist | Private |
| `PATCH` | `/api/tasks/:id/checklist/:itemId` | Toggle checklist item completion | Private |
| `DELETE` | `/api/tasks/:id/checklist/:itemId` | Delete checklist item | Private |
| `POST` | `/api/tasks/:id/comments` | Post comment on discussion thread | Private |
| `DELETE` | `/api/tasks/:id/comments/:commentId` | Delete discussion comment | Private |

### 4. Audit & Activities (`/api/activities`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/activities` | List recent workspace audit events | Private |

---

## 📮 Postman API Verification Guide

A complete Postman Collection is included in the repository at:  
📁 `project-management-tool/postman/SyncFlow_API.postman_collection.json`

### Verification Steps:
1. **Launch Postman** and click the **Import** button in the top left.
2. Select `postman/SyncFlow_API.postman_collection.json`.
3. Open folder **1. Authentication** and execute **1.2 Login (Admin)**.
   - The response test script automatically captures the returned JWT token and sets the `{{token}}` collection variable.
4. Open folder **2. Projects & Workspaces** and run **2.1 Get All Projects**.
   - Automatically captures the first project ID into `{{projectId}}`.
5. Open folder **3. Tasks & Kanban Pipeline** and run **3.4 Fast Move Kanban Status (PATCH)** or **3.6 Add Discussion Comment**.
6. Verify status `200 OK` or `201 Created` across all endpoints!

---

## 👨‍💻 Author & Internship Details

- **Developer:** Yallari Gavada
- **Role:** Full Stack Development Intern
- **Organization:** Auspify Technologies
- **Internship Task:** Task 5 – Project Management & Kanban Collaboration Web Application
- **Repository Structure:**
  - `Portfolio` (Task 1: Personal Portfolio)
  - `student-management-system` (Task 2: StudentHub)
  - `expense-tracker` (Task 3: FinFlow)
  - `ecommerce-platform` (Task 4: NovaCart)
  - `project-management-tool` (Task 5: SyncFlow)

---
*Developed with ❤️ as part of the Auspify Technologies Full Stack Development Internship.*
