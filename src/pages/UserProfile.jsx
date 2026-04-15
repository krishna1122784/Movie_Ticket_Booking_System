import { useAuth } from '../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { Ticket, Calendar, MapPin, UserCircle, LogOut } from 'lucide-react';

export default function UserProfile() {
  const { user, bookings, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return <Navigate to="/" />;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="w-full flex-grow bg-slate-950 p-4 md:p-12 animate-fade-in">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* User Sidebar */}
        <div className="w-full md:w-1/3">
          <div className="bg-[#111] border border-slate-800 rounded-2xl p-6 sticky top-24 shadow-2xl">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mb-4 border-2 border-[#ff0033] shadow-lg shadow-red-500/20">
                <UserCircle className="h-16 w-16 text-slate-400" />
              </div>
              <h2 className="text-2xl font-bold text-white capitalize tracking-wide">{user.name}</h2>
              <p className="text-slate-400 text-sm mb-6">{user.email}</p>
              
              <div className="w-full h-px bg-slate-800 mb-6"></div>
              
              <div className="flex justify-between w-full mb-6">
                <span className="text-slate-400 font-medium tracking-wide">Total Bookings</span>
                <span className="text-white font-black text-xl">{bookings.length}</span>
              </div>
              
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 bg-red-950/30 text-red-500 border border-red-900/50 hover:bg-red-900 hover:text-white py-3 rounded-lg font-bold transition-all cursor-pointer"
              >
                <LogOut className="h-5 w-5" /> Logout
              </button>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        <div className="w-full md:w-2/3">
          <h1 className="text-3xl font-black text-white mb-6 uppercase tracking-wide">My <span className="text-[#ff0033]">Bookings</span></h1>
          
          {bookings.length === 0 ? (
            <div className="bg-[#111] border border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center shadow-xl">
              <Ticket className="h-16 w-16 text-slate-700 mb-4" />
              <h3 className="text-xl font-bold text-slate-300 mb-2">No Past Bookings</h3>
              <p className="text-slate-500 mb-6">Looks like you haven't booked any movies yet.</p>
              <button onClick={() => navigate('/')} className="bg-[#ff0033] text-white px-8 py-3 rounded-lg font-bold hover:bg-red-700 transition cursor-pointer shadow-lg shadow-red-900/30">
                Book a Ticket Now
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {bookings.map((booking) => (
                <div key={booking.bookingId} className="bg-[#111] border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors flex flex-col sm:flex-row gap-6 relative overflow-hidden shadow-xl animate-slide-up">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-[#ff0033]"></div>
                  
                  <div className="flex-shrink-0 flex justify-center">
                    <img src={booking.movie?.posterUrl || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000'} alt="Poster" className="w-28 sm:w-24 h-40 sm:h-36 object-cover rounded-md shadow-lg border border-slate-800" />
                  </div>
                  
                  <div className="flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-black text-white leading-none">{booking.movie?.title}</h3>
                        <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded font-mono border border-slate-700">ID: {booking.bookingId}</span>
                      </div>
                      
                      <div className="space-y-1 mb-4">
                        <div className="text-slate-300 flex items-center gap-2 text-sm font-medium">
                          <MapPin className="h-4 w-4 text-[#ff0033]" /> {booking.theatre?.name}
                        </div>
                        <div className="text-slate-300 flex items-center gap-2 text-sm font-medium">
                          <Calendar className="h-4 w-4 text-amber-500" /> {new Date(booking.date).toLocaleDateString()}, {booking.time}
                        </div>
                        <div className="text-slate-300 flex items-start gap-2 text-sm mt-2 font-medium">
                          <Ticket className="h-4 w-4 text-blue-400 mt-0.5" /> 
                          <span>
                            <span className="font-bold text-white mr-1">{booking.seats.length} Seats:</span> 
                            {booking.seats.map(s => s.id).join(', ')} <span className="text-slate-500 text-xs">({booking.seats[0]?.tier})</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t border-slate-800 pt-4 flex justify-between items-center">
                      <span className="text-slate-400 text-sm font-bold tracking-wide uppercase">Total Paid</span>
                      <span className="text-white font-black text-2xl tracking-tight">₹{booking.amountPaid}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
