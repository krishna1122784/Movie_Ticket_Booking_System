import { useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';
import { LocationProvider } from './context/LocationContext';

const Home = lazy(() => import('./pages/Home'));
const MovieDetail = lazy(() => import('./pages/MovieDetail'));
const Showtimes = lazy(() => import('./pages/Showtimes'));
const SeatSelection = lazy(() => import('./pages/SeatSelection'));
const TicketConfirmation = lazy(() => import('./pages/TicketConfirmation'));
const UserProfile = lazy(() => import('./pages/UserProfile'));

function App() {
  return (
    <AuthProvider>
      <LocationProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-[#020617] font-sans">
            <Navbar />
            
            <Suspense fallback={
              <div className="min-h-[80vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-[#ff0033]"></div>
              </div>
            }>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/movie/:id" element={<MovieDetail />} />
                <Route path="/buytickets/:id" element={<Showtimes />} />
                <Route path="/seat-layout" element={<SeatSelection />} />
                <Route path="/confirmation" element={<TicketConfirmation />} />
                <Route path="/profile" element={<UserProfile />} />
              </Routes>
            </Suspense>

            <ToastContainer position="bottom-right" theme="dark" />
          </div>
        </Router>
      </LocationProvider>
    </AuthProvider>
  );
}

export default App;
