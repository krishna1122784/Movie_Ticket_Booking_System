import { createContext, useContext, useState } from 'react';
import { CHANDIGARH_LOCATIONS } from '../utils/distance';

const LocationContext = createContext();

export function LocationProvider({ children }) {
  const [userLocation, setUserLocation] = useState(() => {
    const saved = localStorage.getItem('kc_location');
    return saved ? JSON.parse(saved) : { name: 'Select Location', lat: 30.7380, lng: 76.7820 }; 
  });

  const setLocation = (loc) => {
    setUserLocation(loc);
    localStorage.setItem('kc_location', JSON.stringify(loc));
  };

  return (
    <LocationContext.Provider value={{ userLocation, setLocation }}>
      {children}
    </LocationContext.Provider>
  );
}

export const useLocationContext = () => useContext(LocationContext);
