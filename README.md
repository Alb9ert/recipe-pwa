# MERN Boilerplate

Full-stack TypeScript boilerplate with React, Express, MongoDB, and authentication.

## Tech Stack

**Frontend:** React 19, TypeScript, Vite, Tailwind CSS, React Router, React Query  
**Backend:** Node.js, Express, TypeScript, MongoDB, JWT, bcrypt  
**Tools:** ESLint, Jest, Nodemon

## Setup

1. **Install dependencies**
```bash
npm run install-all
```

2. **Environment variables**
View .env.example in the root of the project.

3. **Start development**

```bash
npm run dev  # Both frontend and backend
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3001

## Features

- ✅ User authentication (login/signup/logout)
- ✅ Protected routes
- ✅ Form validation with Zod
- ✅ Google OAuth integration
- ✅ JWT token management
- ✅ Password hashing
- ✅ CORS configuration
- ✅ TypeScript throughout
- ✅ Backend tests with Jest

## Testing

```bash
cd backend
npm test
```

**Test user required in database:**
- Email: `test@test.com`
- Password: `test123`

## Commands

```bash
npm run dev          # Start both servers
cd backend & npm run dev   # Backend only
cd frontend & npm run dev  # Frontend only
cd backend & npm test            # Backend tests
npm run install-all # Install all dependencies in the root
```

## Starting a New Project

### 1. **Clone & Setup New Repository**
```bash
# Clone this boilerplate
git clone <this-repo-url> your-new-project
cd your-new-project

# Remove old git history and start fresh
rm -rf .git
git init

# Create your new repository on GitHub/GitLab first, then:
git remote add origin <your-new-repo-url>
```

### 2. **Install & Configure**
```bash
# Install all dependencies
npm run install-all

# View .env.example and edit the .env files with your settings
# Start development
npm run dev
```

### 4. **First Commit**
```bash
git add .
git commit -m "Initial commit: MERN boilerplate setup"
git push -u origin main
```

## Made by
Albert Hansen @alb9ert
Mikkel Bruun Larsen @mewkel
