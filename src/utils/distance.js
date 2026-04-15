// Haversine formula to calculate distance between two coordinates in km
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1); 
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const d = R * c; // Distance in km
  return d.toFixed(1); // Return string with 1 decimal place
}

function deg2rad(deg) {
  return deg * (Math.PI/180);
}

export const CHANDIGARH_LOCATIONS = [
  { name: 'Chandigarh City Center', lat: 30.7333, lng: 76.7794 },
  { name: 'Kharar', lat: 30.7360, lng: 76.6434 },
  { name: 'Panchkula', lat: 30.6942, lng: 76.8606 },
  { name: 'Zirakpur', lat: 30.6425, lng: 76.8173 },
  { name: 'Mohali Phase 8', lat: 30.7130, lng: 76.7093 }
];
