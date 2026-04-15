import { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [bookings, setBookings] = useState([]);

  // Restore session on page reload
  useEffect(() => {
    const savedUser     = sessionStorage.getItem('kc_user');
    const savedBookings = sessionStorage.getItem('kc_bookings');
    if (savedUser)     setUser(JSON.parse(savedUser));
    if (savedBookings) setBookings(JSON.parse(savedBookings));
  }, []);

  // ─── LOGIN ──────────────────────────────────────────────────────
  const login = async (email, name) => {
    const displayName = name || email.split('@')[0];
    const mockUser    = { email, name: displayName, id: Date.now() };
    setUser(mockUser);
    sessionStorage.setItem('kc_user', JSON.stringify(mockUser));

    // Try to fetch this user's past bookings from backend DB
    try {
      const res = await apiClient.get(`/bookings?email=${encodeURIComponent(email)}`);
      if (Array.isArray(res.data) && res.data.length > 0) {
        setBookings(res.data);
        sessionStorage.setItem('kc_bookings', JSON.stringify(res.data));
      }
    } catch {
      // Backend not available — use whatever is in session storage
    }
  };

  // ─── LOGOUT ─────────────────────────────────────────────────────
  const logout = () => {
    setUser(null);
    setBookings([]);
    sessionStorage.removeItem('kc_user');
    sessionStorage.removeItem('kc_bookings');
  };

  // ─── ADD BOOKING ─────────────────────────────────────────────────
  const addBooking = async (bookingData) => {
    const newBooking = {
      ...bookingData,
      bookingId:  `BK-${Date.now().toString().slice(-6)}`,
      userEmail:  user?.email,
      userName:   user?.name,
      movieTitle: bookingData.movie?.title,
      theatreName: bookingData.theatre?.name,
      seatIds:    bookingData.seats?.map(s => s.id).join(', '),
      seatTier:   bookingData.seats?.[0]?.tier,
      seatCount:  bookingData.seats?.length,
    };

    // 1. Always save locally first so UI never blocks
    const updatedBookings = [newBooking, ...bookings];
    setBookings(updatedBookings);
    sessionStorage.setItem('kc_bookings', JSON.stringify(updatedBookings));

    // 2. Try to persist to Spring Boot backend DB
    try {
      await apiClient.post('/bookings', {
        bookingId:   newBooking.bookingId,
        userEmail:   newBooking.userEmail,
        userName:    newBooking.userName,
        movieTitle:  newBooking.movieTitle,
        theatreName: newBooking.theatreName,
        seatIds:     newBooking.seatIds,
        seatTier:    newBooking.seatTier,
        seatCount:   newBooking.seatCount,
        amountPaid:  newBooking.amountPaid,
        showTime:    newBooking.time,
        bookingDate: newBooking.date,
      });
    } catch {
      // Backend not running — data is safely stored in sessionStorage
      console.info('Booking saved locally (backend unavailable).');
    }

    return newBooking;
  };

  // Only expose bookings belonging to the currently logged-in user
  const userBookings = user
    ? bookings.filter(b => b.userEmail === user.email)
    : [];

  return (
    <AuthContext.Provider value={{ user, bookings: userBookings, login, logout, addBooking }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
