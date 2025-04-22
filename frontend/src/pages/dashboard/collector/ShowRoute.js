import React, { useState, useEffect } from 'react';
import { useParams, useNavigate ,Link} from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  CircularProgress,
  Alert,
  Box,
  Snackbar,
} from '@mui/material';
import { styled } from '@mui/system';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import FitBounds from './FitBounds';


// import CustomAppBar from './CustomAppBar';

// Fix leaflet's default icon issue with webpack
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Styled Components using MUI's styled API
const StyledMapWrapper = styled(Box)(({ theme }) => ({
  height: 'calc(100vh - 64px)', // Subtract AppBar height (default MUI AppBar height is 64px)
  width: '100%',
  position: 'relative',
}));

const PickupButtonWrapper = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(4),
  left: '50%',
  transform: 'translateX(-50%)',
  width: '90%',
  maxWidth: 400,
  zIndex: 1000, // Ensure the button is above the map
}));

const ShowRoute = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [origin, setOrigin] = useState(''); // User's current location or entered origin
  const [destination, setDestination] = useState(''); // Schedule's address
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // const ORS_API_KEY = process.env.REACT_APP_ORS_API_KEY;

  const ORS_API_KEY = '5b3ce3597851110001cf6248f4ef0527882745cebad6265966f7d059';

  // Custom Icons for Markers
  const customIcon = new L.Icon({
    iconUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    shadowSize: [41, 41],
  });

  // Fetch schedule details
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await axios.get(`http://localhost:5002/api/schedules/${id}`);
        setDestination(res.data.address);
      } catch (err) {
        console.error('Error fetching schedule:', err);
        setError('Failed to fetch schedule details.');
        setOpenSnackbar(true);
      }
    };

    fetchSchedule();
  }, [id]);

  // Obtain user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = `${position.coords.latitude},${position.coords.longitude}`;
          setOrigin(coords);
          setLocationLoading(false);
        },
        (err) => {
          console.error('Geolocation Error:', err);
          setError('Unable to retrieve your location.');
          setLocationLoading(false);
          setOpenSnackbar(true);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
      setLocationLoading(false);
      setOpenSnackbar(true);
    }
  }, []);

  // Geocoding function
  const geocode = async (address) => {
    try {
      const response = await axios.get(
        'https://api.openrouteservice.org/geocode/search',
        {
          params: {
            api_key: ORS_API_KEY,
            text: address,
            size: 1,
          },
        }
      );

      if (
        response.data &&
        response.data.features &&
        response.data.features.length > 0
      ) {
        const [lng, lat] = response.data.features[0].geometry.coordinates;
        return { lat, lng };
      } else {
        throw new Error(`No results found for "${address}"`);
      }
    } catch (error) {
      console.error(
        `Geocoding Error for "${address}":`,
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  };

  // Fetch and display route automatically when origin and destination are available
  useEffect(() => {
    const fetchRoute = async () => {
      if (!origin || !destination) return;

      setLoading(true);
      setError('');

      try {
        let originCoords;
        // Check if origin is in "lat,lng" format
        if (/^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/.test(origin.trim())) {
          const [lat, lng] = origin.split(',').map(Number);
          originCoords = { lat, lng };
        } else {
          originCoords = await geocode(origin);
        }

        let destinationCoords;
        // Check if destination is in "lat,lng" format
        if (/^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/.test(destination.trim())) {
          const [lat, lng] = destination.split(',').map(Number);
          destinationCoords = { lat, lng };
        } else {
          destinationCoords = await geocode(destination);
        }

        setMarkers([originCoords, destinationCoords]);

        // Fetch route from ORS Directions API
        const directions = await axios.post(
          'https://api.openrouteservice.org/v2/directions/driving-car/geojson',
          {
            coordinates: [
              [originCoords.lng, originCoords.lat],
              [destinationCoords.lng, destinationCoords.lat],
            ],
          },
          {
            headers: {
              Authorization: ORS_API_KEY,
              'Content-Type': 'application/json',
            },
          }
        );

        if (
          directions.data &&
          directions.data.features &&
          directions.data.features.length > 0
        ) {
          const coords = directions.data.features[0].geometry.coordinates.map(
            (coord) => [coord[1], coord[0]]
          );
          setRouteCoordinates(coords);
        } else {
          throw new Error('Could not fetch directions.');
        }
      } catch (err) {
        console.error('Error fetching route:', err);
        setError(
          err.response && err.response.data
            ? JSON.stringify(err.response.data)
            : err.message
        );
        setOpenSnackbar(true);
      } finally {
        setLoading(false);
      }
    };

    fetchRoute();
  }, [origin, destination, ORS_API_KEY]);

  // Handle Pickup button click
  const handlePickup = () => {
    navigate(`dashboard/qr-scan/${id}`);
  };

  // Handle Snackbar Close
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' ,mt:-2, mb:-9 , p:-3}}>
      {/* <CustomAppBar name="Pickup Route" showBackButton={true} showMenu={true} /> */}

      {/* Main Content */}
      <StyledMapWrapper>
        {/* Display loading message while retrieving location */}
        {locationLoading && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1000, // Ensure loading overlay is above all elements
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              padding: 2,
              borderRadius: 2,
            }}
          >
            <CircularProgress />
            <Typography variant="body1" sx={{ marginLeft: 2 }}>
              Retrieving your location...
            </Typography>
          </Box>
        )}

        {/* Map Container */}
        <MapContainer
          center={[6.9271, 79.8612]} // Default center (e.g., Colombo)
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {/* Render Markers */}
          {markers.map((position, idx) => (
            <Marker
              key={idx}
              position={[position.lat, position.lng]}
              icon={customIcon}
            >
              {/* Optional: Add popups if needed */}
            </Marker>
          ))}
          {/* Render Polyline */}
          {routeCoordinates.length > 0 && (
            <Polyline positions={routeCoordinates} color="#1976d2" weight={5} />
          )}
          {/* Fit the map bounds to the route */}
          <FitBounds routeCoordinates={routeCoordinates} />
        </MapContainer>

        {/* Pickup Button */}
        {routeCoordinates.length > 0 && (
          <PickupButtonWrapper>
            <Button
              variant="contained"
              color="success"
              size="large"
              fullWidth
              component={Link}
              to={`/dashboard/qr-scan/${id}`} 
              sx={{
                paddingY: 1.5,
                borderRadius: 2,
                boxShadow: 3,
                fontSize: '1.1rem',
                mb:1

              }}
            >
              Pickup
            </Button>
          </PickupButtonWrapper>
        )}

        {/* Display error message if any */}
        {error && (
          <Alert
            severity="error"
            sx={{
              position: 'absolute',
              top: 80,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1000, // Ensure error alert is above the map
              width: '90%',
              maxWidth: 400,
            }}
          >
            {error}
          </Alert>
        )}

        {/* Snackbar for errors */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity="error"
            sx={{ width: '100%' }}
          >
            {error}
          </Alert>
        </Snackbar>
      </StyledMapWrapper>

      {/* Optional: Additional Footer or Controls */}
    </Box>
  );
};

export default ShowRoute;