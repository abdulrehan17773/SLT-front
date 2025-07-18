# SLT Frontend

This is the frontend for the SLT (Sign Language Translator) application. It is built with React, Redux Toolkit, and Tailwind CSS, providing a modern UI for user authentication, dashboard, training, and more.

## Features
- User authentication (login/signup)
- Dashboard and profile management
- Training and sample modules
- Admin and user views
- Responsive design with Tailwind CSS

## Folder Structure
```
SLT-front/
├── src/
│   ├── apis/           # API request modules (authApi, adminApi)
│   ├── components/     # Reusable UI components (Header, Footer, SideBar, etc.)
│   ├── pages/          # Main pages (Home, Login, Signup, Dashboard, etc.)
│   ├── router/         # Routing setup (router.jsx, Layout.jsx)
│   ├── store/          # Redux store and slices
│   └── index.css       # Global styles
├── public/             # Static assets
├── index.html          # Main HTML file
├── package.json        # Project metadata and dependencies
└── Readme.md           # Project documentation
```

## Setup Instructions
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```

## Main Dependencies
- react
- react-dom
- react-router-dom
- @reduxjs/toolkit
- react-redux
- tailwindcss
- axios
- chart.js, recharts
- @mediapipe/hands, @tensorflow/tfjs

## Scripts
- `npm run dev` — Start the Vite development server
- `npm run build` — Build for production