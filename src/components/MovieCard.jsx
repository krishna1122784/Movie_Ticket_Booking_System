import { memo } from 'react';
import { Star, Ticket, PlayCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MovieCard = memo(({ movie }) => {
  const navigate = useNavigate();
  return (
    <div 
      onClick={() => navigate(`/movie/${movie.id}`, { state: { movie } })}
      className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_15px_40px_-15px_rgba(255,0,51,0.3)] cursor-pointer"
    >
      <div className="aspect-[2/3] w-full overflow-hidden relative">
        <img 
          src={movie.posterUrl || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000&auto=format&fit=crop'} 
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
        />
        
        {/* Dynamic Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent opacity-40 group-hover:opacity-80 transition-opacity duration-500"></div>
        
        {/* Animated Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-50 group-hover:scale-100 z-10">
          <PlayCircle className="h-16 w-16 text-white drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)] group-hover:text-[#ff0033] transition-colors" />
        </div>

        <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10 flex items-center gap-1.5 z-20 transition-all group-hover:bg-[#ff0033]/20 group-hover:border-[#ff0033]/50">
          <Star className="h-4 w-4 text-amber-500 fill-amber-500 group-hover:animate-pulse" />
          <span className="text-sm font-black text-white">{movie.rating}</span>
        </div>
      </div>
      
      <div className="p-5 relative z-20 bg-slate-900 border-t border-slate-800 group-hover:border-[#ff0033]/30 transition-colors">
        {/* Ambient Top Glow on hover */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[2px] bg-gradient-to-r from-transparent via-[#ff0033] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        <div className="flex items-center flex-wrap gap-2 mb-3">
          <span className="px-2 py-0.5 text-xs font-bold uppercase tracking-wider bg-slate-800 text-slate-300 rounded border border-slate-700 group-hover:border-[#ff0033]/40 group-hover:text-[#ff0033] transition-colors shadow-sm">
            {movie.genre}
          </span>
          {movie.language && (
            <span className="px-2 py-0.5 text-xs font-bold uppercase tracking-wider bg-slate-800 text-slate-300 rounded border border-slate-700 shadow-sm">
              {movie.language}
            </span>
          )}
        </div>
        
        <h3 className="text-xl font-black text-white mb-2 line-clamp-1 group-hover:text-[#ff0033] transition-colors tracking-tight">
          {movie.title}
        </h3>
        <p className="text-slate-400 text-sm line-clamp-2 mb-5 h-10 leading-relaxed font-medium">
          {movie.description}
        </p>
        
        <button className="w-full bg-slate-800 hover:bg-[#ff0033] hover:shadow-[0_0_20px_rgba(255,0,51,0.5)] text-white font-black uppercase tracking-widest py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 z-30 overflow-hidden relative">
          <Ticket className="h-5 w-5" /> 
          <span>Book Tickets</span>
        </button>
      </div>
    </div>
  );
});

// Setting displayName for debugging
MovieCard.displayName = 'MovieCard';

export default MovieCard;
