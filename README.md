# CineLog — Movie & TV Series Catalog

A full-stack web app for browsing, rating, and bookmarking movies and TV series. Powered by the TMDB API — metadata only, no streaming.

## Features

### User
- Trending feed and content discovery
- Search with autocomplete
- Filter by genre and year
- Rate content (1–5 stars)
- Detailed pages with cast, reviews, and trailers
- Bookmark favorites and build a watchlist
- Viewing history with simulated progress tracking

### Admin
- Dashboard analytics
- Content management (create, edit, delete entries)
- Review moderation
- User administration

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, React Router |
| Backend | Node.js, Express.js, TypeScript |
| Database | MongoDB |
| Auth | JWT + bcrypt |
| External API | [TMDB API](https://www.themoviedb.org/documentation/api) |

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or [Atlas](https://www.mongodb.com/atlas))
- TMDB API key — [get one free](https://www.themoviedb.org/settings/api)

### 1. Clone & install

```bash
git clone https://github.com/Hmmzza12/movie-series-app.git
cd movie-series-app
```

**Backend:**
```bash
cd backend
npm install
cp .env.example .env   # fill in values (see below)
npm run dev            # runs on http://localhost:5000
```

**Frontend:**
```bash
cd frontend
npm install
cp .env.example .env   # fill in values (see below)
npm run dev            # runs on http://localhost:5173
```

### 2. Environment variables

**`backend/.env`**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cinelog
JWT_SECRET=your_jwt_secret
TMDB_API_KEY=your_tmdb_api_key
```

**`frontend/.env`**
```env
VITE_API_URL=http://localhost:5000/api
VITE_TMDB_API_KEY=your_tmdb_api_key
```

## API Endpoints

| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/movies` | Browse movies |
| GET | `/api/series` | Browse TV series |
| GET | `/api/movies/:id` | Movie detail |
| POST | `/api/reviews` | Submit a review |
| GET/PUT | `/api/users/profile` | View / update profile |
| GET/POST | `/api/users/watchlist` | Manage watchlist |
| GET | `/api/admin/analytics` | Admin dashboard data |

## License

MIT
