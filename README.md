# DriveX Motors - Premium Car Dealership Web Application

A complete, production-ready car dealership web application with a modern UI inspired by premium automotive websites.

## 🚀 Features

### User Features
- **Responsive Homepage** with engaging hero sections and featured cars
- **Advanced Search & Filtering** by multiple attributes
- **Car Listings & Details** dynamically fetched from Firebase
- **Car Comparison Tool** to compare different models side by side
- **Wishlist Functionality** built-in with React Context
- **Book a Test Drive** module
- **Authentication system** via Firebase Auth
- **Dark/Light Mode** support with dynamic Tailwind styling

### Admin Features
- **Secure Admin Panel** restricted to authorized admin users
- **Car Management Dashboard** for comprehensive auto-inventory CRM
- **Booking Management** system to handle test drive requests

### Technical Highlights
- **Serverless Architecture** relying on Firebase for backend services
- **Client-Side Routing** with React Router DOM
- **Optimized UI** with Framer Motion animations & dynamic interactions

## 🛠 Technology Stack

### Frontend & Core
- **React 18** with **TypeScript** for safety
- **Tailwind CSS** for robust and rapid styling
- **Framer Motion** for elegant layout animations
- **React Router DOM v6** for seamless single-page-app navigation
- **React Hook Form** for efficient, validated form handling
- **React Hot Toast** for premium, non-blocking notifications

### Backend (Serverless)
- **Firebase Authentication** for user and admin login
- **Firebase Realtime Database / Firestore** for live inventory tracking
- **Firebase Storage** for image handling

## 📁 Project Structure

```
DriveX-Motors/
├── frontend/                 # React frontend
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── config/          # Firebase & environment config
│   │   ├── context/         # React Contexts (Auth, Theme, Wishlist)
│   │   ├── pages/          # App pages
│   │   ├── hooks/          # Custom utility hooks
│   │   ├── types/          # Global TypeScript interfaces
│   │   └── App.tsx         # Main entry component
│   ├── .env                # Firebase environment variables
│   └── vercel.json         # Vercel deployment routing rules
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- A Firebase project with Auth, Database, and Storage enabled.

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd DriveX-Motors
cd frontend
```

2. **Install frontend dependencies**
```bash
npm install
```

3. **Environment Setup**
Create a `.env` file in the `frontend` directory and add your Firebase configurations:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
REACT_APP_FIREBASE_DATABASE_URL=your_database_url
```

4. **Start the development server**
```bash
npm start
```

The application will now be running on `http://localhost:3000`.

## 🚀 Deployment (Vercel)

Deploying DriveX Motors to Vercel is highly recommended due to its seamless React integration.
1. Ensure your code is pushed to a Git repository.
2. In Vercel, import your repository.
3. Change the **Root Directory** setting to `frontend` so Vercel knows where your `package.json` is.
4. Copy your Firebase keys from your local `.env` and paste them into the **Environment Variables** section in Vercel.
5. Click **Deploy**. Vercel will automatically build the site using `npm run build`. Client-side routing is handled via the included `vercel.json`!


