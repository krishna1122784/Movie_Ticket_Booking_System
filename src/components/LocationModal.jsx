import { useState, useEffect } from 'react';
import { X, MapPin, Navigation, Search } from 'lucide-react';

export default function LocationModal({ isOpen, onClose, onLocationSet }) {
  const [customCity, setCustomCity] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      const query = customCity.trim();
      if (query.length > 2) {
        setIsSearching(true);
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`);
          if (response.ok) {
            const data = await response.json();
            setSuggestions(data);
          }
        } catch (err) {
          console.error("Suggestions fetch failed", err);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSuggestions([]);
      }
    }, 600); // 600ms debounce buffer to prevent rate-limiting
    return () => clearTimeout(timer);
  }, [customCity]);

  if (!isOpen) return null;

  const handleAutoDetect = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    
    navigator.geolocation.getCurrentPosition(async (position) => {
      let locationName = "Current Location";
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`);
        if (response.ok) {
          const data = await response.json();
          locationName = data.address.city || data.address.town || data.address.village || data.address.county || data.address.state || "Current Location";
        }
      } catch (err) {
        console.error("Reverse geocoding failed", err);
      }

      onLocationSet({
        name: locationName,
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });
      onClose();
    }, () => {
      alert("Unable to retrieve your location. Please check browser permissions.");
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-[#111] border border-red-900/50 w-full max-w-md rounded-2xl shadow-2xl animate-slide-up">
        <div className="flex justify-between items-center p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <MapPin className="text-[#ff0033]" />
            Set Your Location
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <button 
            onClick={handleAutoDetect}
            className="w-full flex items-center justify-center gap-2 bg-[#ff0033]/20 border border-[#ff0033]/50 hover:bg-[#ff0033]/30 text-[#ff0033] font-bold py-3 rounded-lg transition-colors cursor-pointer"
          >
            <Navigation className="h-5 w-5" />
            Auto-Detect with GPS
          </button>

          <div className="relative">
            <form onSubmit={async (e) => {
              e.preventDefault();
              const query = customCity.trim();
              if (query) {
                try {
                  const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
                  if (response.ok) {
                    const data = await response.json();
                    if (data && data.length > 0) {
                      onLocationSet({ 
                        name: data[0].display_name.split(',')[0], 
                        lat: parseFloat(data[0].lat), 
                        lng: parseFloat(data[0].lon) 
                      });
                    } else {
                      alert("Location not found! Please check spelling.");
                      return;
                    }
                  }
                } catch (err) {
                  console.error("Geocoding lookup failed", err);
                  alert("Cannot connect to mapping server.");
                  return;
                }
                setCustomCity('');
                setSuggestions([]);
                onClose();
              }
            }} className="flex gap-2">
              <input 
                type="text" 
                placeholder="Search any City or State..." 
                value={customCity}
                onChange={(e) => setCustomCity(e.target.value)}
                className="flex-grow bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff0033]"
              />
              <button type="submit" className="bg-[#111] border border-slate-700 hover:border-[#ff0033] text-white px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center">
                 <Search className={`h-5 w-5 ${isSearching ? 'animate-spin' : 'hover:text-[#ff0033]'}`} />
              </button>
            </form>

            {/* Suggestions Dropdown */}
            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 w-full mt-2 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl overflow-hidden z-[200]">
                 {suggestions.map((sugg, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => {
                        onLocationSet({ name: sugg.display_name.split(',')[0], lat: parseFloat(sugg.lat), lng: parseFloat(sugg.lon) });
                        setCustomCity('');
                        setSuggestions([]);
                        onClose();
                      }}
                      className="px-4 py-3 hover:bg-slate-800 text-sm text-slate-300 cursor-pointer border-b border-slate-800 last:border-0 flex items-center gap-3 transition-colors"
                    >
                      <MapPin className="h-4 w-4 text-[#ff0033] flex-shrink-0" />
                      <span className="truncate">{sugg.display_name}</span>
                    </div>
                 ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
