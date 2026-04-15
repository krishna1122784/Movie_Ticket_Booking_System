import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginModal from '../components/LoginModal';
import CheckoutModal from '../components/CheckoutModal';

const SEAT_ROWS = [
  { tier: "RECLINER",  price: 400, rows: ['A', 'B'],             color: 'amber' },
  { tier: "EXECUTIVE", price: 250, rows: ['C', 'D', 'E', 'F'],   color: 'blue' },
  { tier: "STANDARD",  price: 150, rows: ['G', 'H', 'I', 'J'],   color: 'slate' }
];
const SEATS_PER_ROW = 12;

// Realistic pre-occupied seats with a person silhouette emoji
const BOOKED_SEATS = [
  'A-3','A-4','A-9','A-10',
  'B-1','B-5','B-6','B-11',
  'C-2','C-3','C-7','C-8','C-9',
  'D-4','D-5','D-10','D-11',
  'E-1','E-6','E-7','E-12',
  'F-3','F-8','F-9',
  'G-2','G-5','G-10',
  'H-4','H-6','H-11',
  'I-3','I-7','I-8',
  'J-1','J-9','J-10','J-11'
];

export default function SeatSelection() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { movie, theatre, time } = location.state || {};
  const { user }  = useAuth();

  const [selectedSeats, setSelectedSeats]   = useState([]);
  const [hoveredSeat, setHoveredSeat]       = useState(null);
  const [showLogin, setShowLogin]           = useState(false);
  const [showCheckout, setShowCheckout]     = useState(false);

  const handlePayClick = () => { if (!user) setShowLogin(true); else setShowCheckout(true); };
  const handleLoginSuccess = () => { setShowLogin(false); setShowCheckout(true); };

  const handleSeatClick = (seatId, price, tier) => {
    if (BOOKED_SEATS.includes(seatId)) return;
    setSelectedSeats(prev => {
      const isSelected = prev.find(s => s.id === seatId);
      return isSelected ? prev.filter(s => s.id !== seatId) : [...prev, { id: seatId, price, tier }];
    });
  };

  const totalPrice = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  if (!movie) return <div className="text-white text-center py-20">Session Expired</div>;

  return (
    <div className="w-full flex-grow bg-[#06090f] min-h-screen">

      {/* Header */}
      <div className="bg-[#0d1117] border-b border-slate-800 p-4 sticky top-0 z-10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black text-white">{movie.title}</h2>
            <p className="text-slate-400 text-sm">{theatre?.name} &nbsp;·&nbsp; {time}</p>
          </div>
          <span className="text-amber-400 font-bold text-sm border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 rounded-full">
            {selectedSeats.length > 0 ? `${selectedSeats.length} seat${selectedSeats.length > 1 ? 's' : ''} selected` : 'Select seats below'}
          </span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-4 py-10 flex flex-col items-center">

        {/* ── SCREEN ── */}
        <div className="w-full max-w-3xl mb-12 flex flex-col items-center">
          <div
            className="w-full h-4 rounded-[50%]"
            style={{
              background: 'linear-gradient(to bottom, rgba(255,200,80,0.55), transparent)',
              boxShadow: '0 0 60px 20px rgba(255,200,80,0.18), 0 0 120px 60px rgba(255,200,80,0.06)'
            }}
          />
          <p className="text-amber-400/60 text-xs font-black uppercase tracking-[0.5em] mt-3">SCREEN</p>
        </div>

        {/* ── LEGEND ── */}
        <div className="flex flex-wrap gap-4 mb-10 justify-center text-xs font-bold">
          {[
            { label: 'Available',  bg: 'bg-slate-500',  text: 'text-white'      },
            { label: 'Selected',   bg: 'bg-[#ff0033]',  text: 'text-white'      },
            { label: 'Occupied',   bg: 'bg-slate-800',  text: 'text-slate-500'  },
          ].map(l => (
            <div key={l.label} className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-md ${l.bg} flex items-center justify-center ${l.text} text-[10px]`}>
                {l.label === 'Occupied' ? '👤' : ''}
              </div>
              <span className="text-slate-400 uppercase tracking-wider">{l.label}</span>
            </div>
          ))}
        </div>

        {/* ── SEAT MAP ── */}
        <div className="w-full overflow-x-auto pb-24 scrollbar-hide">
          <div className="min-w-[620px] flex flex-col gap-8 items-center">
            {SEAT_ROWS.map((section) => {
              const tierColors = {
                amber: { badge: 'text-amber-400 border-amber-500/30 bg-amber-500/10', available: 'bg-amber-700/70 hover:bg-amber-400 hover:shadow-[0_0_12px_rgba(245,158,11,0.6)] text-white border-amber-600' },
                blue:  { badge: 'text-blue-400 border-blue-500/30 bg-blue-500/10',    available: 'bg-blue-800/70  hover:bg-blue-400  hover:shadow-[0_0_12px_rgba(59,130,246,0.6)]  text-white border-blue-600'  },
                slate: { badge: 'text-slate-300 border-slate-600 bg-slate-700/30',    available: 'bg-slate-600/80 hover:bg-slate-400 hover:shadow-[0_0_12px_rgba(148,163,184,0.5)] text-white border-slate-500' },
              }[section.color];

              return (
                <div key={section.tier} className="w-full">
                  {/* Tier Label */}
                  <div className="flex justify-between items-center mb-3 px-10">
                    <span className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full border ${tierColors.badge}`}>
                      {section.tier}
                    </span>
                    <span className="text-slate-500 text-xs font-bold">₹ {section.price} / seat</span>
                  </div>

                  {/* Rows */}
                  <div className="flex flex-col gap-2 items-center">
                    {section.rows.map(row => (
                      <div key={row} className="flex items-center gap-3">
                        <span className="text-slate-600 w-5 text-sm font-black text-right shrink-0">{row}</span>
                        <div className="flex gap-1.5">
                          {Array.from({ length: SEATS_PER_ROW }).map((_, i) => {
                            const seatId   = `${row}-${i + 1}`;
                            const isBooked = BOOKED_SEATS.includes(seatId);
                            const isSelected = !!selectedSeats.find(s => s.id === seatId);
                            const isHovered  = hoveredSeat === seatId;

                            // aisle gap after seat 4 and 8
                            const aisle = i === 3 || i === 7;

                            let cls = '';
                            if (isBooked) {
                              cls = 'bg-slate-800 border border-slate-700 text-slate-500 cursor-not-allowed opacity-70';
                            } else if (isSelected) {
                              cls = 'bg-[#ff0033] border border-red-400 text-white scale-110 shadow-[0_0_14px_rgba(255,0,51,0.7)] z-10';
                            } else {
                              cls = `${tierColors.available} border transition-all duration-150`;
                            }

                            return (
                              <button
                                key={seatId}
                                onClick={() => handleSeatClick(seatId, section.price, section.tier)}
                                onMouseEnter={() => !isBooked && setHoveredSeat(seatId)}
                                onMouseLeave={() => setHoveredSeat(null)}
                                disabled={isBooked}
                                title={isBooked ? 'Already booked' : `Seat ${seatId} — ₹${section.price}`}
                                className={`
                                  relative w-8 h-8 rounded-t-xl rounded-b-sm text-[10px] font-black
                                  transition-all duration-200 cursor-pointer flex items-center justify-center
                                  ${cls} ${aisle ? 'mr-4' : ''}
                                `}
                              >
                                {isBooked
                                  ? <span className="text-xs leading-none">👤</span>
                                  : isSelected
                                    ? '✓'
                                    : <span className="opacity-70">{i + 1}</span>
                                }

                                {/* Hover Tooltip */}
                                {isHovered && !isBooked && !isSelected && (
                                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 text-white text-[10px] font-bold px-2 py-1 rounded-lg whitespace-nowrap z-50 shadow-xl pointer-events-none">
                                    {seatId} · ₹{section.price}
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-700" />
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                        <span className="text-slate-600 w-5 text-sm font-black text-left shrink-0">{row}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Floating Action Bar ── */}
      {selectedSeats.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#0d1117]/95 backdrop-blur-xl border-t border-slate-800 p-4 z-50 animate-slide-up shadow-2xl">
          <div className="max-w-5xl mx-auto flex justify-between items-center">
            <div>
              <span className="text-slate-400 text-xs font-bold mb-1 block uppercase tracking-wider">
                {selectedSeats.length} Seat{selectedSeats.length > 1 ? 's' : ''} &nbsp;·&nbsp; {selectedSeats.map(s => s.id).join(', ')}
              </span>
              <span className="text-white text-3xl font-black leading-none">₹{totalPrice}</span>
            </div>
            <button
              onClick={handlePayClick}
              className="bg-[#ff0033] hover:bg-red-600 text-white px-10 py-3.5 rounded-xl font-black uppercase tracking-widest transition-all hover:scale-105 cursor-pointer shadow-[0_0_30px_rgba(255,0,51,0.4)] text-sm"
            >
              Pay Now →
            </button>
          </div>
        </div>
      )}

      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} onSuccess={handleLoginSuccess} />
      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        totalAmount={totalPrice}
        bookingDetails={{ movie, theatre, time, seats: selectedSeats }}
      />
    </div>
  );
}
