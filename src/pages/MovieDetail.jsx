import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { Clock, Video, Users, Star, Clapperboard, Globe } from 'lucide-react';

export default function MovieDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const movie = location.state?.movie;

  if (!movie) {
    return <div className="text-white text-center py-20">Movie or Selection Not Found. Return home.</div>;
  }

  const castList = movie.cast ? movie.cast.split(',').map(s => s.trim()) : [];

  return (
    <div className="w-full flex-grow pb-12">
      {/* Dynamic Banner */}
      <div className="relative h-[65vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25 scale-110 blur-xl"
          style={{ backgroundImage: `url('${movie.posterUrl}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/80 to-transparent" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col md:flex-row gap-8 items-center md:items-start pt-12">
          {/* Poster */}
          <div className="flex-shrink-0">
            <img 
              src={movie.posterUrl} 
              alt={movie.title} 
              className="w-64 md:w-72 h-[24rem] md:h-[28rem] object-cover rounded-2xl shadow-2xl border border-white/10"
            />
          </div>
          
          {/* Metadata */}
          <div className="flex-1 text-center md:text-left text-white mt-2 md:mt-10">
            <h1 className="text-4xl md:text-5xl font-black mb-4 leading-none">{movie.title}</h1>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-6">
              <span className="flex items-center gap-1.5 bg-amber-500/15 text-amber-400 px-3 py-1.5 rounded-full border border-amber-500/30 font-bold text-sm">
                <Star className="h-4 w-4 fill-amber-400" /> {movie.rating}/10
              </span>
              {movie.duration && (
                <span className="flex items-center gap-1.5 bg-slate-800 text-slate-300 px-3 py-1.5 rounded-full border border-slate-700 font-semibold text-sm">
                  <Clock className="h-4 w-4" /> {movie.duration}
                </span>
              )}
              <span className="bg-white/10 text-white px-3 py-1.5 rounded-full font-bold text-xs border border-white/20 tracking-wider">
                {movie.language || 'Multi-Language'}
              </span>
              <span className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#ff0033]/15 text-[#ff0033] rounded-full border border-[#ff0033]/30">
                {movie.genre}
              </span>
            </div>
            
            <div className="mb-6 max-w-2xl">
              <h3 className="text-lg font-bold text-slate-300 mb-2">About the movie</h3>
              <p className="text-slate-400 leading-relaxed">{movie.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Extended Details Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Director & Cast */}
        <div className="md:col-span-2 space-y-8">
          {movie.director && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-white font-black uppercase tracking-wide mb-4 flex items-center gap-2">
                <Clapperboard className="h-5 w-5 text-[#ff0033]" /> Director
              </h3>
              <p className="text-slate-300 font-bold text-xl">{movie.director}</p>
            </div>
          )}

          {castList.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-white font-black uppercase tracking-wide mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-amber-500" /> Cast
              </h3>
              <div className="flex flex-wrap gap-3">
                {castList.map((actor, i) => (
                  <span key={i} className="bg-slate-800 border border-slate-700 text-slate-300 px-4 py-2 rounded-full text-sm font-semibold hover:border-[#ff0033]/50 hover:text-white transition-colors">
                    {actor}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Info Box */}
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
            <h3 className="text-white font-black uppercase tracking-wide flex items-center gap-2">
              <Video className="h-5 w-5 text-blue-400" /> Movie Info
            </h3>
            <div className="space-y-4 divide-y divide-slate-800">
              {[
                { label: 'Genre',    value: movie.genre },
                { label: 'Language', value: movie.language || 'N/A' },
                { label: 'Duration', value: movie.duration || 'N/A' },
                { label: 'Rating',   value: `${movie.rating} / 10 ⭐` },
                { label: 'Format',   value: '2D · 3D · IMAX' },
              ].map(item => (
                <div key={item.label} className="flex justify-between items-center pt-4 first:pt-0">
                  <span className="text-slate-500 text-sm font-semibold uppercase tracking-wider">{item.label}</span>
                  <span className="text-white font-bold text-sm">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={() => navigate(`/buytickets/${movie.id}`, { state: { movie } })}
            className="w-full bg-[#ff0033] hover:bg-red-700 text-white py-4 rounded-xl font-black text-lg tracking-wide transition-all hover:scale-105 shadow-xl shadow-red-900/40 cursor-pointer"
          >
            Book Tickets
          </button>
        </div>
      </div>
    </div>
  );
}
