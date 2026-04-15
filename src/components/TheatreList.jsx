import React, { useMemo, useState } from 'react';
import { useLocationContext } from '../context/LocationContext';
import { calculateDistance } from '../utils/distance';
import { useNavigate } from 'react-router-dom';
import { X, Ticket, MapPin } from 'lucide-react';

const THEATRES_DATA = [
  { id: 1, name: "Krishna LUXE: Cosmo Mall", address: "Cosmo Mall, Kharar, Mohali", tags: ["IMAX", "LUXE"], status: "Open Now", isOpen: true, lat: 30.7380, lng: 76.6558 },
  { id: 2, name: "Krishna 4DX: TDI Mall", address: "TDI City Mall, Sector 118, Mohali", tags: ["4DX", "3D"], status: "Closed", isOpen: false, lat: 30.7371, lng: 76.6713 },
  { id: 3, name: "Krishna INOX: Omaxe Chandigarh Ext.", address: "Omaxe New Chandigarh, Mullanpur", tags: ["3D", "IMAX"], status: "Open Now", isOpen: true, lat: 30.7937, lng: 76.7118 },
  { id: 4, name: "Krishna: Sector 70 Mohali", address: "Sector 70, Mohali", tags: ["3D", "2D"], status: "Open Now", isOpen: true, lat: 30.7095, lng: 76.7183 },
  { id: 5, name: "Krishna: Aerocity Mall", address: "Aerocity, Mohali", tags: ["2D", "LUXE"], status: "Open Now", isOpen: true, lat: 30.6235, lng: 76.7441 },
];

// Sample movies showing at each theatre (2-3 per theatre)
const THEATRE_MOVIES = {
  1: [
    { id: 2, title: 'Dune: Part Two', genre: 'Sci-Fi', rating: 9.1, language: 'Hollywood', duration: '2h 46m', posterUrl: 'https://images.unsplash.com/photo-1618336753974-aae8e02d6199?q=80&w=400&auto=format&fit=crop', description: 'Paul Atreides unites with Chani and the Fremen to enact his revenge.', director: 'Denis Villeneuve', cast: 'Timothée Chalamet, Zendaya' },
    { id: 5, title: 'Animal', genre: 'Action', rating: 8.1, language: 'Bollywood', duration: '3h 21m', posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=400&auto=format&fit=crop', description: 'A son\'s unwavering love for his father transforms into a violent obsession.', director: 'Sandeep Reddy Vanga', cast: 'Ranbir Kapoor, Anil Kapoor' },
    { id: 11, title: 'Oppenheimer', genre: 'Drama', rating: 9.0, language: 'Hollywood', duration: '3h 0m', posterUrl: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=400&auto=format&fit=crop', description: 'The story of J. Robert Oppenheimer and the atomic bomb.', director: 'Christopher Nolan', cast: 'Cillian Murphy, Emily Blunt' },
  ],
  2: [
    { id: 1, title: 'Jatt & Juliet 3', genre: 'Comedy', rating: 8.5, language: 'Punjabi', duration: '2h 20m', posterUrl: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?q=80&w=400&auto=format&fit=crop', description: 'The iconic Punjabi duo returns for another chaotic mission.', director: 'Jagdeep Sidhu', cast: 'Diljit Dosanjh, Neeru Bajwa' },
    { id: 8, title: 'John Wick: Chapter 4', genre: 'Action', rating: 8.4, language: 'Hollywood', duration: '2h 49m', posterUrl: 'https://images.unsplash.com/photo-1614059089988-1f198124d5ba?q=80&w=400&auto=format&fit=crop', description: 'John Wick uncovers a path to defeating The High Table.', director: 'Chad Stahelski', cast: 'Keanu Reeves, Donnie Yen' },
  ],
  3: [
    { id: 9, title: 'Kalki 2898 AD', genre: 'Sci-Fi', rating: 8.8, language: 'Tollywood', duration: '3h 0m', posterUrl: 'https://images.unsplash.com/photo-1633477189729-ea2bf941d62c?q=80&w=400&auto=format&fit=crop', description: 'A modern-day avatar of Vishnu descends to protect the world.', director: 'Nag Ashwin', cast: 'Prabhas, Deepika Padukone' },
    { id: 13, title: 'Fighter', genre: 'Action', rating: 7.4, language: 'Bollywood', duration: '2h 47m', posterUrl: 'https://images.unsplash.com/photo-1562575214-da9fcf59b907?q=80&w=400&auto=format&fit=crop', description: "India's first aerial action franchise.", director: 'Siddharth Anand', cast: 'Hrithik Roshan, Deepika Padukone' },
    { id: 12, title: 'Laapataa Ladies', genre: 'Comedy', rating: 8.3, language: 'Bollywood', duration: '2h 0m', posterUrl: 'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?q=80&w=400&auto=format&fit=crop', description: 'Two brides get accidentally swapped on a train.', director: 'Kiran Rao', cast: 'Nitanshi Goel, Pratibha Ranta' },
  ],
  4: [
    { id: 6, title: 'Rocky Aur Rani Kii Prem Kahaani', genre: 'Romantic', rating: 7.5, language: 'Bollywood', duration: '2h 48m', posterUrl: 'https://images.unsplash.com/photo-1585647347384-2593bc35786b?q=80&w=400&auto=format&fit=crop', description: 'Rocky and Rani fall in love despite vast differences.', director: 'Karan Johar', cast: 'Ranveer Singh, Alia Bhatt' },
    { id: 7, title: 'Shinda Shinda No Papa', genre: 'Comedy', rating: 8.0, language: 'Punjabi', duration: '2h 10m', posterUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400&auto=format&fit=crop', description: 'A frustrated father takes his mischievous son back to Punjab.', director: 'Amarjit Singh Saron', cast: 'Gippy Grewal, Hina Khan' },
  ],
  5: [
    { id: 4, title: 'Dada Lakhmi', genre: 'Drama', rating: 8.9, language: 'Haryanvi', duration: '2h 15m', posterUrl: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=400&auto=format&fit=crop', description: 'The inspirational tale of Haryana\'s legendary Pandit Lakhmi Chand.', director: 'Satish Kaushik', cast: 'Deepak Dobriyal, Ravi Kishan' },
    { id: 14, title: 'Ni Main Sass Kuttni', genre: 'Comedy', rating: 7.9, language: 'Punjabi', duration: '2h 5m', posterUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=400&auto=format&fit=crop', description: 'A feisty daughter-in-law takes on a scheming mother-in-law.', director: 'Smeep Kang', cast: 'Meenu Dhaliwal, Gurpreet Ghuggi' },
  ],
};

export default function TheatreList() {
  const { userLocation } = useLocationContext();
  const navigate = useNavigate();
  const [selectedTheatre, setSelectedTheatre] = useState(null);

  const sortedTheatres = useMemo(() => {
    return THEATRES_DATA.map(t => {
      const dist = calculateDistance(userLocation.lat, userLocation.lng, t.lat, t.lng);
      return { ...t, distance: dist };
    }).sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
  }, [userLocation]);

  return (
    <>
      <div className="w-full bg-[#0a0002] border border-red-900/30 rounded-2xl p-6 mb-12 shadow-2xl shadow-red-900/10">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
          <div>
            <h2 className="text-2xl font-bold text-white uppercase tracking-wide">
              THEATRES <span className="text-[#ff0033]">NEAR YOU</span>
            </h2>
            <p className="text-slate-400 text-sm mt-1 flex items-center flex-wrap gap-1">
              Showing 5 theatres near{' '}
              <span className="text-amber-500 font-bold border-b border-amber-500/30 pb-0.5 ml-1 mr-1">
                {userLocation.name}
              </span>
              {' '}· Sorted by distance
            </p>
          </div>
          {/* Change Location has moved to Navbar */}
        </div>

        <div className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide">
          {sortedTheatres.map((theatre) => (
            <div
              key={theatre.id}
              onClick={() => setSelectedTheatre(theatre)}
              className="min-w-[280px] md:min-w-[320px] bg-[#111] border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-[#ff0033]/50 hover:shadow-[0_0_20px_rgba(255,0,51,0.1)] transition-all cursor-pointer group"
            >
              <div>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-white font-bold text-base leading-tight pr-4 group-hover:text-[#ff0033] transition-colors">{theatre.name}</h3>
                  <span className="text-amber-500 font-bold text-sm tracking-wide whitespace-nowrap">{theatre.distance} km</span>
                </div>
                <p className="text-slate-500 text-xs mb-4">{theatre.address}</p>
                <p className="text-slate-600 text-xs font-semibold uppercase tracking-wide">
                  {(THEATRE_MOVIES[theatre.id] || []).length} movies running
                </p>
              </div>
              
              <div className="flex justify-between items-center mt-2">
                <div className="flex gap-2">
                  {theatre.tags.map(tag => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 rounded border border-slate-700 text-slate-300 font-medium tracking-wider">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${theatre.isOpen ? 'bg-green-500' : 'bg-[#ff0033]'}`}></div>
                  <span className={`text-xs font-medium tracking-wide ${theatre.isOpen ? 'text-green-500' : 'text-[#ff0033]'}`}>
                    {theatre.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 bg-[#110505] border border-red-900/40 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span>🎉</span>
            <p className="text-slate-300 text-sm">Use code <span className="text-[#ff0033] font-bold">KRISHNA200</span> — Get ₹200 off on your first booking!</p>
          </div>
          <button className="bg-[#111] border border-red-900/50 hover:bg-red-950/30 text-amber-500 font-bold tracking-wider text-sm px-6 py-2 rounded transition-colors whitespace-nowrap cursor-pointer">
            KRISHNA200
          </button>
        </div>
      </div>

      {/* Theatre Movie Modal */}
      {selectedTheatre && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-[#111] border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
            <div className="flex justify-between items-center p-6 border-b border-slate-800">
              <div>
                <h2 className="text-xl font-black text-white">{selectedTheatre.name}</h2>
                <p className="text-slate-400 text-sm flex items-center gap-1 mt-1">
                  <MapPin className="h-3.5 w-3.5 text-[#ff0033]" />
                  {selectedTheatre.address} · {selectedTheatre.distance} km away
                </p>
              </div>
              <button onClick={() => setSelectedTheatre(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              <h3 className="text-slate-400 text-xs uppercase tracking-widest font-bold mb-4">Now Showing</h3>
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                {(THEATRE_MOVIES[selectedTheatre.id] || []).map(movie => (
                  <div
                    key={movie.id}
                    onClick={() => { setSelectedTheatre(null); navigate(`/movie/${movie.id}`, { state: { movie } }); }}
                    className="flex gap-4 bg-slate-900 border border-slate-800 hover:border-[#ff0033]/50 rounded-xl p-4 cursor-pointer transition-all group"
                  >
                    <img src={movie.posterUrl} alt={movie.title} className="w-16 h-24 object-cover rounded-lg flex-shrink-0 border border-slate-700" />
                    <div className="flex flex-col justify-between flex-grow">
                      <div>
                        <h4 className="text-white font-black group-hover:text-[#ff0033] transition-colors leading-tight">{movie.title}</h4>
                        <div className="flex flex-wrap gap-2 mt-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wide bg-slate-800 text-slate-400 px-2 py-0.5 rounded">{movie.genre}</span>
                          <span className="text-[10px] font-bold uppercase tracking-wide bg-slate-800 text-slate-400 px-2 py-0.5 rounded">{movie.language}</span>
                          <span className="text-[10px] font-bold text-amber-500">⭐ {movie.rating}</span>
                          <span className="text-[10px] text-slate-500">{movie.duration}</span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/buytickets/${movie.id}`, { state: { movie, theatre: selectedTheatre } }); setSelectedTheatre(null); }}
                        className="mt-2 self-start flex items-center gap-1.5 bg-[#ff0033] hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider px-4 py-2 rounded-lg transition-colors cursor-pointer shadow-lg shadow-red-900/30"
                      >
                        <Ticket className="h-3.5 w-3.5" /> Book Tickets
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
