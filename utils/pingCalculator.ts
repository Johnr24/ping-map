// Constants
const EARTH_RADIUS_KM = 6371; // Earth radius in kilometers
const SPEED_OF_LIGHT = 299792.458; // Speed of light in km/s
const FIBER_OPTIC_FACTOR = 0.68; // Light travels slower in fiber optic cables (around 68% of c)

// Convert degrees to radians
export function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// Calculate the great-circle distance between two points on Earth
export function calculateGreatCircleDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const dLat = degreesToRadians(lat2 - lat1);
  const dLon = degreesToRadians(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degreesToRadians(lat1)) * Math.cos(degreesToRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = EARTH_RADIUS_KM * c;
  
  return distance;
}

// Calculate the theoretical minimum ping time between two points
export function calculateTheoreticalPingTime(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  // Calculate the great-circle distance in kilometers
  const distance = calculateGreatCircleDistance(lat1, lon1, lat2, lon2);
  
  // Calculate one-way travel time in milliseconds
  // Using the speed of light in fiber optic cables
  const oneWayTimeMs = (distance / (SPEED_OF_LIGHT * FIBER_OPTIC_FACTOR)) * 1000;
  
  // Ping is round-trip time (RTT)
  const pingTimeMs = oneWayTimeMs * 2;
  
  return pingTimeMs;
}

// Format ping time with appropriate units
export function formatPingTime(pingTimeMs: number): string {
  if (pingTimeMs < 1) {
    return `${(pingTimeMs * 1000).toFixed(2)} μs`;
  } else if (pingTimeMs < 1000) {
    return `${pingTimeMs.toFixed(2)} ms`;
  } else {
    return `${(pingTimeMs / 1000).toFixed(2)} s`;
  }
} 