import { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import MovieList from '../components/MovieList';
import TheatreList from '../components/TheatreList';
import { MOVIES_DB } from '../data/movies';
import apiClient from '../api/apiClient';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Action', 'Romantic', 'Comedy', 'Sci-Fi', 'Thriller', 'Drama', 'Bollywood', 'Hollywood', 'Punjabi', 'Haryanvi', '2025', '2024', '2023'];

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const response = await apiClient.get('/movies');
        const data = response.data;
        // If backend returns real data, use it; otherwise fall back silently
        if (Array.isArray(data) && data.length > 0) {
          setMovies(data);
        } else {
          setMovies([...MOVIES_DB].sort((a, b) => b.year - a.year));
        }
      } catch {
        // Backend not reachable — use local data silently, no error toast
        setMovies([...MOVIES_DB].sort((a, b) => b.year - a.year));
      } finally {
        setIsLoading(false);
      }
    };
    loadMovies();
  }, []);

  const filteredMovies = movies.filter(m =>
    activeFilter === 'All' ||
    m.genre === activeFilter ||
    m.language === activeFilter ||
    String(m.year) === activeFilter
  );


  return (
    <div className="font-sans">
      <Hero />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <TheatreList />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white uppercase tracking-wide">
              <span className="text-[#ff0033]">NOW</span> SHOWING
            </h2>
            <p className="text-slate-400 mt-2">Discover the most popular movies this week.</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {filters.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors cursor-pointer ${
                  activeFilter === filter 
                  ? 'bg-[#ff0033] text-white border border-[#ff0033]' 
                  : 'bg-slate-900 text-slate-300 border border-slate-700 hover:border-amber-500'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
        
        <MovieList movies={filteredMovies} isLoading={isLoading} />
      </main>
    </div>
  );
}
