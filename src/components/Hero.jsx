import { Play, MapPin } from 'lucide-react';
import { useLocationContext } from '../context/LocationContext';

export default function Hero() {
  const { userLocation } = useLocationContext();

  return (
    <div className="relative h-[88vh] min-h-[560px] flex items-end justify-center overflow-hidden">

      {/* === BACKGROUND: dark cinema hall photo === */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=2070&auto=format&fit=crop')",
          filter: 'brightness(0.28) saturate(0.7)'
        }}
      />

      {/* Deep dark gradient overlays for cinema immersion */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#02040a] via-[#02040a]/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#02040a]/50 via-transparent to-[#02040a]/50" />

      {/* Subtle scanline texture for cinematic feel */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 4px)' }}
      />

      {/* Glowing screen light at very top — like the cinema screen above */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-32 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center top, rgba(255,200,80,0.12) 0%, transparent 70%)' }}
      />

      {/* === ANIMATED SILHOUETTE ROW === */}
      {/* Row of seated audience silhouettes near the bottom */}
      <div className="absolute bottom-[12%] left-0 right-0 flex justify-center pointer-events-none z-[2]">
        <div className="flex items-end gap-1 opacity-30" style={{ filter: 'blur(0.4px)' }}>
          {/* Generate 28 audience head silhouettes with slight height variety */}
          {Array.from({ length: 32 }).map((_, i) => {
            const heights     = [36, 40, 34, 42, 38, 36, 44, 38, 40, 36, 42, 34];
            const h           = heights[i % heights.length];
            const headW       = i % 5 === 2 ? 14 : 12; // slightly fatter heads
            return (
              <svg key={i} width={headW + 8} height={h + 10} viewBox={`0 0 ${headW + 8} ${h + 10}`} fill="none">
                {/* Body/torso */}
                <rect x="2" y={h - 6} width={headW + 4} height={16} rx="3" fill="#111827" />
                {/* Neck */}
                <rect x={headW / 2 - 1} y={h - 14} width="6" height="10" rx="2" fill="#111827" />
                {/* Head */}
                <ellipse cx={(headW + 8) / 2} cy={h - 18} rx={headW / 2} ry={headW / 2 + 1} fill="#111827" />
              </svg>
            );
          })}
        </div>
      </div>

      {/* Second darker back row */}
      <div className="absolute bottom-[19%] left-0 right-0 flex justify-center pointer-events-none z-[1]">
        <div className="flex items-end gap-1.5 opacity-20 scale-90" style={{ filter: 'blur(0.8px)' }}>
          {Array.from({ length: 28 }).map((_, i) => {
            const h = 30 + (i % 4) * 3;
            return (
              <svg key={i} width="18" height={h + 8} viewBox={`0 0 18 ${h + 8}`} fill="none">
                <rect x="1" y={h - 4} width="16" height="12" rx="2" fill="#0f172a" />
                <rect x="6" y={h - 10} width="6" height="8" rx="2" fill="#0f172a" />
                <ellipse cx="9" cy={h - 14} rx="6" ry="7" fill="#0f172a" />
              </svg>
            );
          })}
        </div>
      </div>

      {/* === FOREGROUND CONTENT === */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pb-20 animate-slide-up">

        {/* Location badge */}
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-slate-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
          <MapPin className="h-3.5 w-3.5 text-[#ff0033]" />
          Showing movies near <span className="text-amber-400 font-bold ml-1">{userLocation.name}</span>
        </div>

        <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-white mb-5 leading-none drop-shadow-2xl">
          Experience Cinema<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-[#ff0033] to-amber-500">
            Like Never Before
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 mb-10 max-w-xl mx-auto leading-relaxed font-medium">
          Book seats for the latest Bollywood, Hollywood & Regional blockbusters.
          Premium screens. Dolby Atmos. Real-time availability.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => document.getElementById('movies-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="flex items-center gap-2 bg-[#ff0033] hover:bg-red-600 text-white px-8 py-3.5 rounded-full font-black transition-all transform hover:scale-105 shadow-[0_0_30px_rgba(255,0,51,0.4)] uppercase tracking-wider text-sm"
          >
            <Play className="h-4 w-4 fill-current" />
            Book Tickets Now
          </button>
          <button
            onClick={() => document.getElementById('movies-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/20 text-white px-8 py-3.5 rounded-full font-bold transition-all hover:scale-105 backdrop-blur-sm text-sm"
          >
            Browse All Movies
          </button>
        </div>

        {/* Stats Row */}
        <div className="flex flex-wrap justify-center gap-8 mt-12 text-center">
          {[
            { val: '5', label: 'Premium Theatres' },
            { val: '40+', label: 'Movies Running' },
            { val: '4K', label: 'IMAX / Dolby' },
          ].map(({ val, label }) => (
            <div key={label}>
              <p className="text-2xl font-black text-white">{val}</p>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
