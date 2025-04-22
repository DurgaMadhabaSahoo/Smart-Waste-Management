import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Alert,
  Box,
  Tooltip,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { styled } from '@mui/system';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocalShippingIcon from '@mui/icons-material/LocalShipping'; 
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ScaleIcon from '@mui/icons-material/Scale';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import StarIcon from '@mui/icons-material/Star';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const StyledCard = styled(Card)(({ theme, status, special, datePassed }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: 'auto',
  minHeight: '60px',
  backgroundColor:
    special // Blue if it's marked as special
      ? '#007bff'
      : datePassed && status === 'notdone' // Red if overdue and not done
      ? '#f55d5d'
      : status === 'done' // Gray if done
      ? 'gray'
      : 'green', // Green for all other cases
  color: '#ffffff',
  boxShadow: theme.shadows[3],
  borderRadius: '16px',
  cursor: 'pointer',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: theme.shadows[6],
  },
  [theme.breakpoints.down('sm')]: {
    minHeight: '30px', 
  },
}));

const Schedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedCard, setExpandedCard] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all'); 
  const [filterSpecial, setFilterSpecial] = useState(false); 
  const [filterDatePassed, setFilterDatePassed] = useState(false); 

  const fetchSchedules = async () => {
    try {
      const res = await axios.get('http://localhost:5002/api/schedules');
      const sortedSchedules = res.data.sort((a, b) => {
        if (a.status === 'notdone' && b.status === 'done') return -1;
        if (a.status === 'done' && b.status === 'notdone') return 1;
        return 0;
      });
      setSchedules(sortedSchedules);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch schedules.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const handleCardClick = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  // Filter 
  const filteredSchedules = schedules.filter((schedule) => {
    const currentDate = new Date();
    const scheduleDate = new Date(schedule.time);
    const datePassed = scheduleDate < currentDate; 

    const statusMatch =
      filterStatus === 'all' ||
      (filterStatus === 'done' && schedule.status === 'done') ||
      (filterStatus === 'notdone' && schedule.status === 'notdone');

    const specialMatch = !filterSpecial || schedule.special;

    const datePassedMatch = !filterDatePassed || datePassed;

    return statusMatch && specialMatch && datePassedMatch;
  });

  const handleStatusChange = (event, newStatus) => {
    if (newStatus !== null) {
      setFilterStatus(newStatus);
    }
  };

  return (
    <Box>
      <Container maxWidth="md" sx={{ marginTop: { xs: '2rem', md: '7rem' }, marginBottom: '2rem' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1rem' }}>
          <ToggleButtonGroup
            value={filterStatus}
            exclusive
            onChange={handleStatusChange}
            aria-label="status filter"
            sx={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}
          >
            <ToggleButton value="all" sx={{ color: 'white', backgroundColor: '#007bff', '&.Mui-selected': { backgroundColor: '#0056b3' } }}>
              <Typography variant="body2">All</Typography>
            </ToggleButton>
            <ToggleButton value="done" sx={{ color: 'white', backgroundColor: 'gray', '&.Mui-selected': { backgroundColor: 'gray' } }}>
              <CheckCircleIcon fontSize="small" sx={{ marginRight: '0.5rem' }} />
              <Typography variant="body2">Done</Typography>
            </ToggleButton>
            <ToggleButton value="notdone" sx={{ color: 'white', backgroundColor: 'green', '&.Mui-selected': { backgroundColor: 'green' } }}>
              <HourglassEmptyIcon fontSize="small" sx={{ marginRight: '0.5rem' }} />
              <Typography variant="body2">Not Done</Typography>
            </ToggleButton>
          </ToggleButtonGroup>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '1rem' }}>
            <Button
              variant="contained"
              onClick={() => setFilterSpecial((prev) => !prev)}
              sx={{ backgroundColor: filterSpecial ? 'blue' : '#007bff', color: 'white' }}
              startIcon={<StarIcon />}
            >
              {filterSpecial ? 'Show All' : 'Show Special'}
            </Button>
            <Button
              variant="contained"
              onClick={() => setFilterDatePassed((prev) => !prev)}
              sx={{ backgroundColor: filterDatePassed ? '#ffc107' : '#f55d5d', color: 'white' }}
              startIcon={<CalendarTodayIcon />}
            >
              {filterDatePassed ? 'Show All Dates' : 'Show Passed Dates'}
            </Button>
          </Box>
        </Box>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Grid container spacing={1.5}>
            {filteredSchedules.map((schedule) => {
              const currentDate = new Date();
              const scheduleDate = new Date(schedule.time);
              const datePassed = scheduleDate < currentDate;
              const isExpanded = expandedCard === schedule._id;

              return (
                <Grid item xs={12} md={6} key={schedule._id}>
                  <StyledCard
                    status={schedule.status}
                    datePassed={datePassed}
                    special={schedule.special}
                    onClick={() => handleCardClick(schedule._id)}
                  >
                    <CardContent>
                    <Box display="flex" alignItems="center" mb={1}>
                        {schedule.status === 'done' ? (
                          <CheckCircleIcon fontSize="large" sx={{ marginRight: '0.5rem' }} />
                        ) : (
                          <HourglassEmptyIcon fontSize="large" sx={{ marginRight: '0.5rem' }} />
                        )}
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                          {new Date(schedule.time).toLocaleString([], {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true,
                          })}
                        </Typography>
                        {datePassed && schedule.status === 'notdone' && (
                          <Tooltip title="This schedule is overdue!">
                            <WarningAmberIcon color="error" sx={{ marginLeft: '0.8rem' }} />
                          </Tooltip>
                        )}
                      </Box>
                      <Box display="flex" alignItems="center" mb={1}>
                        <LocationOnIcon color="action" sx={{ marginRight: '0.5rem' }} />
                        <Typography variant="body1" color="inherit">
                          {schedule.address}
                        </Typography>
                      </Box>

                      {/* Truck Number Display */}
                      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1} sx={{ marginTop: '1rem' }}>
                        <Typography variant="body1" color="inherit" sx={{ flexGrow: 1 }}>
                          {/* Add truck number display */}
                          Truck Number: {schedule.truckNumber} {/* Display truck number here */}
                        </Typography>
                        <LocalShippingIcon color="white" sx={{ marginLeft: '0.5rem' }} />
                      </Box>
                      {isExpanded && (
                        <>
                          <Box display="flex" alignItems="center" mb={1}>
                            <Typography variant="body1" color="inherit">
                              Status: {schedule.status.charAt(0).toUpperCase() + schedule.status.slice(1)}
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center" mb={1}>
                            <Typography variant="body1" color="inherit">
                              Code: {schedule.code}
                            </Typography>
                          </Box>
                          {schedule.status === 'done' && (
                            <>
                              <Box display="flex" alignItems="center" mb={1}>
                                <ScaleIcon fontSize="small" sx={{ marginRight: '0.5rem', color: '#ffffff' }} />
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                  Weight: {schedule.weight} kg
                                </Typography>
                              </Box>
                              <Box display="flex" alignItems="center" mb={1}>
                                <DeleteSweepIcon fontSize="medium" sx={{ marginRight: '0.5rem', color: '#ffffff' }} />
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                  Type: {schedule.type}
                                </Typography>
                              </Box>
                            </>
                          )}
                        </>
                      )}
                    </CardContent>
                    {isExpanded && (
                      <CardActions sx={{ justifyContent: 'flex-end', paddingRight: '1rem', paddingBottom: '1rem' }}>
                        <Button
                          variant="contained"
                          color="secondary"
                          component={Link}
                          to={`/dashboard/show-route/${schedule._id}`}
                          sx={{ textTransform: 'none' }}
                        >
                          View Route
                        </Button>
                      </CardActions>
                    )}
                  </StyledCard>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default Schedules;