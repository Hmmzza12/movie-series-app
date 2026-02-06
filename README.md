# Movie & TV Series Catalog Platform

A full-stack web application for browsing movies and TV series using the TMDB API. Users can discover trending content, search, save favorites, manage watchlists, and rate content. **NO video streaming** - this is a legally compliant catalog platform displaying metadata only.

## Features

### User Features
- 🎬 Browse trending movies and TV series
- 🔍 Search with debounced autocomplete
- 🎭 Filter by genre, year, and rating
- ⭐ Rate and review content (1-5 stars)
- 📺 View detailed information (cast, ratings, overview)
- ❤️ Save favorites and manage watchlist
- 📊 Track watch progress (fake percentage tracker)
- 🔐 User authentication with JWT

### Admin Features
- 📊 Admin dashboard with statistics
- ➕ Add/edit/delete movies and series
- ✅ Moderate user reviews (approve/reject)
- 👥 User management

### Technical Features
- 🎨 Netflix-style responsive UI with Tailwind CSS
- 🚀 Fast React + Vite frontend
- 🔒 Secure authentication with bcrypt password hashing
- 🌐 RESTful API with Express.js
- 💾 MongoDB database with Mongoose ODM
- 📡 TMDB API integration for movie/series data

## Tech Stack

**Frontend:**
- React 18
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- React Icons
- Headless UI

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT authentication
- Bcrypt for password hashing
- Axios for TMDB API calls
- Express Validator
- Helmet for security

## Prerequisites

Before you begin, ensure you have installed:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (Community Edition) - [Download](https://www.mongodb.com/try/download/community)
  - OR use **MongoDB Atlas** (free cloud database) - [Sign up](https://www.mongodb.com/cloud/atlas)
- **TMDB API Key** - [Get one here](https://www.themoviedb.org/settings/api)

## Installation & Setup

### 1. Clone or Navigate to Project

```bash
cd C:\Users\hamza\.gemini\antigravity\scratch\movie-catalog-platform
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies (already done if following guide)
npm install

# Create .env file by copying .env.example
copy .env.example .env

# Edit .env file and add your credentials:
# - MONGODB_URI (e.g., mongodb://localhost:27017/movie-catalog)
# - JWT_SECRET (use a long random string)
# - TMDB_API_KEY (from themoviedb.org)
```

**Backend `.env` configuration:**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/movie-catalog
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
TMDB_API_KEY=your_tmdb_api_key_here
TMDB_BASE_URL=https://api.themoviedb.org/3
CLIENT_URL=http://localhost:5173
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies (already done if following guide)
npm install

# Create .env file
copy .env.example .env

# Edit .env file if needed (defaults should work)
```

**Frontend `.env` configuration:**
```env
VITE_API_URL=http://localhost:5000/api
VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
```

### 4. Start MongoDB

**Option A: Local MongoDB**
```bash
# Start MongoDB service (Windows)
net start MongoDB

# Or if installed locally without service:
mongod
```

**Option B: MongoDB Atlas**
- Use your Atlas connection string in `MONGODB_URI`
- Format: `mongodb+srv://username:password@cluster.mongodb.net/movie-catalog`

### 5. Run the Application

**Terminal 1 - Start Backend:**
```bash
cd backend
npm run dev
```
Backend will run on `http://localhost:5000`

**Terminal 2 - Start Frontend:**
```bash
cd frontend  
npm run dev
```
Frontend will run on `http://localhost:5173`

### 6. Create Admin User (Optional)

To create an admin user, register normally through the UI, then manually update the user in MongoDB:

```javascript
// Using MongoDB Shell or Compass
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Movies
- `GET /api/movies/trending` - Get trending movies
- `GET /api/movies/search?query={query}` - Search movies
- `GET /api/movies/discover?genre={id}&year={year}&sortBy={sort}` - Filter movies
- `GET /api/movies/genres/list` - Get movie genres
- `GET /api/movies/tmdb/:tmdbId` - Get movie details from TMDB
- `GET /api/movies/:id` - Get movie from database
- `POST /api/movies` - Add movie (admin only)
- `PUT /api/movies/:id` - Update movie (admin only)
- `DELETE /api/movies/:id` - Delete movie (admin only)

### Series
- `GET /api/series/trending` - Get trending series
- `GET /api/series/search?query={query}` - Search series
- `GET /api/series/discover` - Filter series
- `GET /api/series/:seriesId/seasons/:seasonNumber` - Get season details
- Similar admin routes as movies

### Users
- `GET /api/users/profile` - Get user profile (protected)
- `PUT /api/users/profile` - Update profile (protected)
- `POST /api/users/watchlist` - Add to watchlist (protected)
- `DELETE /api/users/watchlist/:id` - Remove from watchlist (protected)
- `POST /api/users/favorites` - Add to favorites (protected)
- `DELETE /api/users/favorites/:id` - Remove from favorites (protected)
- `POST /api/users/progress` - Update watch progress (protected)

### Reviews
- `POST /api/reviews` - Create review (protected)
- `GET /api/reviews/:contentId` - Get reviews for content
- `PUT /api/reviews/:id` - Update review (protected)
- `DELETE /api/reviews/:id` - Delete review (protected)

### Admin
- `GET /api/admin/stats` - Dashboard statistics (admin only)
- `GET /api/admin/reviews/pending` - Pending reviews (admin only)
- `PUT /api/admin/reviews/:id/approve` - Approve review (admin only)
- `DELETE /api/admin/reviews/:id` - Delete review (admin only)
- `GET /api/admin/users` - List all users (admin only)

## Project Structure

```
movie-catalog-platform/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Auth, validation, error handling
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── services/        # TMDB API service
│   └── server.js        # Express app entry point
└── frontend/
    ├── src/
    │   ├── api/         # Axios instance
    │   ├── components/  # React components
    │   ├── context/     # Auth context
    │   ├── hooks/       # Custom hooks
    │   ├── pages/       # Page components
    │   └── utils/       # Helper functions
    └── public/          # Static assets
```

## Deployment

### Backend (Render, Railway, etc.)
1. Set environment variables in your hosting platform
2. Update `MONGODB_URI` to MongoDB Atlas connection string
3. Set `CLIENT_URL` to your frontend URL
4. Deploy from repository

### Frontend (Vercel, Netlify, etc.)
1. Update `VITE_API_URL` to your backend URL
2. Build command: `npm run build`
3. Output directory: `dist`
4. Deploy from repository

## Legal Disclaimer

⚠️ **IMPORTANT**: This application does NOT host, stream, or provide links to copyrighted video content. It only displays metadata (titles, descriptions, posters, ratings) from the TMDB API for educational and cataloging purposes.

## TMDB Attribution

This product uses the TMDB API but is not endorsed or certified by TMDB.

![TMDB Logo](https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg)

## License

ISC

## Contributing

This is a demonstration project. Feel free to fork and modify for your own use.

## Troubleshooting

**MongoDB Connection Error:**
- Ensure MongoDB is running (`net start MongoDB`)
- Check MongoDB URI in `.env` file
- For Atlas, verify IP whitelist settings

**TMDB API Errors:**
- Verify API key is correct in `.env`
- Check you haven't exceeded rate limits (1000 requests/day for free tier)

**Frontend Not Connecting to Backend:**
- Verify both servers are running
- Check `VITE_API_URL` in frontend `.env`
- Ensure CORS is properly configured (backend allows frontend URL)

## Contact & Support

For issues or questions, please refer to the implementation plan and API documentation above.

---

**Built with ❤️ using React, Node.js, MongoDB, and TMDB API**
