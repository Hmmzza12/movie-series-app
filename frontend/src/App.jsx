import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import PrivateRoute from './components/auth/PrivateRoute';
import Home from './pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Movies from './pages/Movies';
import Series from './pages/Series';
import Search from './pages/Search';
import ContentDetails from './pages/ContentDetails';
import Profile from './pages/Profile';
import './index.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-netflix-black">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/series" element={<Series />} />
            <Route path="/search" element={<Search />} />
            <Route path="/movie/:id" element={<ContentDetails type="movie" />} />
            <Route path="/series/:id" element={<ContentDetails type="series" />} />
            <Route path="/tv/:id" element={<ContentDetails type="series" />} />

            {/* Protected Routes */}
            <Route path="/profile" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />
            <Route path="/watchlist" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />
            <Route path="/favorites" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
