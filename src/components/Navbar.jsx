import { Film, Search, Ticket, MapPin } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocationContext } from '../context/LocationContext';
import LocationModal from './LocationModal';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user, bookings, logout } = useAuth();
  const { userLocation, setLocation } = useLocationContext();
  const [isLocModalOpen, setIsLocModalOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <nav className="sticky top-0 z-50 w-full bg-slate-950/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-widest text-white uppercase">
              <span className="text-[#ff0033]">KRISHNA</span> CINEMAS
            </span>
          </div>
          <div className="flex-1 max-w-sm ml-8 hidden sm:block">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-slate-700 rounded-md leading-5 bg-slate-800 text-slate-300 placeholder-slate-400 focus:outline-none focus:bg-slate-900 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 sm:text-sm transition-all"
                placeholder="Search movies..."
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => setIsLocModalOpen(true)} className="hidden sm:flex items-center gap-1.5 text-slate-300 hover:text-[#ff0033] font-semibold text-sm transition-colors cursor-pointer mr-2 border border-slate-700/50 hover:border-[#ff0033]/50 px-4 py-1.5 rounded-full bg-slate-900 shadow-md">
              <MapPin className="h-4 w-4" />
              {userLocation.name}
            </button>
            
            {user ? (
              <div className="flex items-center gap-4 bg-slate-900 border border-slate-700 hover:border-slate-500 transition-colors rounded-lg pl-4 pr-2 py-1 shadow-lg">
                <div 
                  onClick={() => navigate('/profile')} 
                  className="flex flex-col items-end cursor-pointer group"
                >
                  <span className="text-white font-bold text-sm leading-tight text-transform capitalize group-hover:text-amber-500 transition-colors">Hi, {user.name}</span>
                  <span className="text-amber-500 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 group-hover:text-white transition-colors">
                    <Ticket className="h-3 w-3" /> {bookings.length} Tickets
                  </span>
                </div>
                <div className="w-px h-6 bg-slate-700 mx-1"></div>
                <button onClick={logout} className="text-slate-400 hover:text-red-500 text-xs font-bold transition-colors cursor-pointer uppercase">
                  Logout
                </button>
              </div>
            ) : (
              <button className="bg-[#ff0033] hover:bg-red-700 text-white px-5 py-1.5 rounded font-bold tracking-wide text-sm transition-colors shadow-lg shadow-red-500/10 cursor-pointer">
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
      <LocationModal isOpen={isLocModalOpen} onClose={() => setIsLocModalOpen(false)} onLocationSet={setLocation} />
    </nav>
  );
}
