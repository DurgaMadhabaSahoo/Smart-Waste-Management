import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

const FitBounds = ({ routeCoordinates }) => {
  const map = useMap();

  useEffect(() => {
    if (routeCoordinates.length === 0) return;

    // Create a LatLngBounds object from the route coordinates
    const bounds = L.latLngBounds(routeCoordinates);

    // Fit the map to the bounds with some padding
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [routeCoordinates, map]);

  return null; // This component doesn't render anything
};

export default FitBounds;