import React, { useState } from 'react';
import QrReader from 'react-qr-scanner';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Alert, Button } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const QRScan = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [scanResult, setScanResult] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  

  const handleScan = async (data) => {
    if (data) {
      const scannedCode = data.text || data; 
      setScanResult(scannedCode);
      setLoading(true);
      setMessage('');
      setError('');

      try {
        const res = await axios.get(`http://localhost:5002/api/schedules/${id}`);
        const schedule = res.data;

        if (scannedCode === schedule.code) {
          navigate(`/dashboard/collecting/${id}/${scannedCode}`);
        } else {
          setMessage('Error: Scanned code does not match.');
        }
      } catch (err) {
        console.error('Validation Error:', err);
        setError('An error occurred while validating the QR code.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleError = (err) => {
    console.error('QR Scan Error:', err);
    setError('Error accessing camera for QR scan.');
  };

  return (
    <Box> 
      <Box sx={styles.container}>
        <Box sx={styles.scannerContainer}>
          <Box sx={styles.scanner}>
            <QrReader
              delay={300}
              onError={handleError}
              onScan={handleScan}
              style={styles.qrReader}
            />
            <Box sx={styles.scanAnimation}></Box>
          </Box>
        </Box>

        {scanResult && (
          <Box sx={styles.result}>
            <Typography variant="body1"><strong>Scanned Code:</strong> {String(scanResult)}</Typography>
          </Box>
        )}

        {loading && (
          <Box sx={styles.loader}>
            <CircularProgress />
          </Box>
        )}

        {message && (
          <Alert severity={message.includes('Success') ? 'success' : 'error'} sx={styles.alert}>
            {message.includes('Success') ? <CheckCircleOutlineIcon /> : <ErrorOutlineIcon />}
            {message}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={styles.alert}>
            <ErrorOutlineIcon /> {error}
          </Alert>
        )}

<Button
  onClick={() => navigate('/dashboard/assigned-schedule')}
  type="submit"
  variant="contained"
  color="success"
  size="large"
  fullWidth
  sx={{
    paddingY: 1.5,
    borderRadius: 2,
    boxShadow: 3,
    fontSize: '1.1rem',
    mb: -10,
    mt: 30,
   
    '@media (max-width: 600px)': {
      width: '100%', 
    },
  
    '@media (min-width: 600px)': {
      width: 'auto', 
      maxWidth: '300px', 
    },
  }}
>
  Go Back
</Button>
      </Box>
    </Box>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    minHeight: '100vh',
    backgroundColor: '#f0f4f3',
  },
  scannerContainer: {
    position: 'relative',
    width: '300px',
    height: '300px',
    marginBottom: '20px',
  },
  scanner: {
    width: '100%',
    height: '100%',
    borderRadius: '10px',
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#ffffff',
    border: '4px solid #388e3c',
  },
  qrReader: {
    width: '100%',
    height: '100%',
  },
  scanAnimation: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderTop: '4px solid green',
    animation: 'scan 2s infinite',
    '@keyframes scan': {
      '0%': { top: 0 },
      '100%': { top: '100%' },
    },
  },
  result: {
    marginBottom: '20px',
    color: '#388e3c',
  },
  loader: {
    marginBottom: '20px',
  },
  alert: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
  }
 
};

export default QRScan;

