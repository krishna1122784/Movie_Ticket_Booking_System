import { useState } from 'react';
import MovieCard from './MovieCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PAGE_SIZE = 8;

export default function MovieList({ movies, isLoading }) {
  const [currentPage, setCurrentPage] = useState(1);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff0033]"></div>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="text-center py-20">
        <h3 className="text-2xl font-bold text-slate-300">No movies found</h3>
        <p className="text-slate-500 mt-2">Try a different filter or check back later.</p>
      </div>
    );
  }

  const totalPages = Math.ceil(movies.length / PAGE_SIZE);
  const paginated = movies.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const goTo = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: document.getElementById('movies-section')?.offsetTop - 80 || 0, behavior: 'smooth' });
  };

  return (
    <div id="movies-section">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
        {paginated.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4 pb-4">
          <button
            onClick={() => goTo(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center gap-1 px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:border-[#ff0033] hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer font-semibold"
          >
            <ChevronLeft className="h-4 w-4" /> Prev
          </button>

          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => goTo(page)}
                className={`w-10 h-10 rounded-lg text-sm font-black transition-all cursor-pointer ${
                  page === currentPage
                    ? 'bg-[#ff0033] text-white shadow-lg shadow-red-500/30 scale-110'
                    : 'bg-slate-900 border border-slate-700 text-slate-400 hover:border-[#ff0033]/50 hover:text-white'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => goTo(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:border-[#ff0033] hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer font-semibold"
          >
            Next <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      <p className="text-center text-slate-600 text-xs mt-2">
        Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, movies.length)} of {movies.length} movies
      </p>
    </div>
  );
}
