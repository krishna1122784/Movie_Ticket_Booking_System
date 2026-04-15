import { useLocation, useNavigate } from 'react-router-dom';

const SHOWTIMES_DATA = [
  { id: 1, name: "Krishna LUXE: Cosmo Mall", distance: "2.1 km", times: ["10:30 AM", "01:15 PM", "04:30 PM", "08:45 PM"] },
  { id: 2, name: "Krishna 4DX: TDI Mall", distance: "9.3 km", times: ["11:00 AM", "02:00 PM", "09:00 PM"] },
  { id: 3, name: "Krishna INOX: Omaxe Chandigarh Ext.", distance: "9.8 km", times: ["09:30 AM", "12:15 PM", "03:45 PM", "07:30 PM", "10:15 PM"] },
  { id: 4, name: "Krishna: Sector 70 Mohali", distance: "9.8 km", times: ["01:00 PM", "06:30 PM"] },
];

export default function Showtimes() {
  const location = useLocation();
  const navigate = useNavigate();
  const movie = location.state?.movie;
  
  // Fallback to avoid crash if accessed directly during dev
  const activeMovie = movie || { title: "Unknown Movie", id: "0" };

  const handleTimeSelect = (theatre, time) => {
    navigate('/seat-layout', { 
      state: { movie: activeMovie, theatre, time } 
    });
  };

  return (
    <div className="w-full flex-grow p-4 sm:p-8 bg-slate-950">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">{activeMovie.title} - Select Showtime</h1>
        <p className="text-slate-400 mb-8 border-b border-slate-800 pb-4">
          Click on a timing to proceed to seat selection.
        </p>

        <div className="space-y-6">
          {SHOWTIMES_DATA.map(theatre => (
            <div key={theatre.id} className="bg-[#111] border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                
                {/* Theatre details */}
                <div className="md:w-1/3">
                  <h3 className="text-white font-bold text-lg leading-tight">{theatre.name}</h3>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-amber-500 font-bold text-sm tracking-widest">{theatre.distance}</span>
                    <span className="text-green-500 flex items-center gap-1 text-sm font-semibold tracking-wide">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> M-Ticket
                    </span>
                  </div>
                </div>

                {/* Timings */}
                <div className="md:w-2/3 flex flex-wrap gap-3">
                  {theatre.times.map(time => (
                    <button 
                      key={time}
                      onClick={() => handleTimeSelect(theatre, time)}
                      className="border border-green-500/50 hover:bg-green-500 text-green-500 hover:text-slate-950 px-4 py-2 rounded font-semibold text-sm transition-colors shadow-lg shadow-green-500/10 cursor-pointer"
                    >
                      {time}
                    </button>
                  ))}
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
