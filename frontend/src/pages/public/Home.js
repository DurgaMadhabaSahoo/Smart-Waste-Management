import React from 'react';
import { Box, Button, Typography, Container, Card, CardContent, CardMedia, Grid2 } from '@mui/material';
import { Link } from 'react-router-dom';
import EcoIcon from '@mui/icons-material/Recycling';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import RecyclingIcon from '@mui/icons-material/Recycling';
import { styled } from '@mui/system';
import logo from "../../assets/images/ecobin.png";

const features = [
  {
    title: 'Eco-Friendly Solutions',
    description: 'Implement sustainable waste management practices.',
    icon: <EcoIcon sx={{ fontSize: 50, color: 'green' }} />,
  },
  {
    title: 'Efficient Route Management',
    description: 'Optimize waste collection routes to reduce emissions.',
    icon: <LocalShippingIcon sx={{ fontSize: 50, color: 'blue' }} />,
  },
  {
    title: 'Recycling Initiatives',
    description: 'Encourage and manage recycling efforts within communities.',
    icon: <RecyclingIcon sx={{ fontSize: 50, color: 'orange' }} />,
  },
];

const BackgroundBox = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  color: '#fff',
  padding: '60px 20px',
  textAlign: 'center',
}));

const Home = () => {
  return (
    <Box>
      {/* Header Section */}
      <BackgroundBox boxShadow={8}>
        <Container maxWidth="lg">
        <Box
  component="img"
  sx={{
    p: 0.2,
    // Adjust the height and width for different screen sizes
    height: { xs: 100, md: 150 }, // Smaller height for XS, larger for MD
    width: { xs: 'auto', md: 'auto' }, // Smaller width for XS, larger for MD
    maxHeight: { xs: 100, md: 400 }, // Max height for XS and MD screens
    maxWidth: { xs: 150, md: 400 }, 
    
    mb:3// Max width for XS and MD screens
  }}
  alt="Image description"
  src={logo}
/>
          <Typography variant="h3" gutterBottom>
            Smart Waste Management System
          </Typography>
          <Typography variant="h6" sx={{ mb: 4 }}>
            Manage waste effectively and sustainably with our smart solutions
          </Typography>
          <Link to="/auth/sign-in" style={{ textDecoration: 'none' }}>
            <Button variant="contained" color="secondary" sx={{ px: 4, py: 1 }}>
              Get Started
            </Button>
          </Link>
        </Container>
      </BackgroundBox>

      {/* Features Section */}
      <Container sx={{ py: 8 }} maxWidth="lg">
        <Typography variant="h4" align="center" gutterBottom>
          Key Features
        </Typography>
        <Grid2 container spacing={4} justifyContent="center">
          {features.map((feature, index) => (
            <Grid2 item key={index} size={{ xs: 12, sm: 8, md:3 }}>
              <Card
                sx={{
                  textAlign: 'center',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderRadius: 3,
                  p: 2,
                }}
              >
                <CardMedia>{feature.icon}</CardMedia>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1">{feature.description}</Typography>
                </CardContent>
              </Card>
            </Grid2>
          ))}
        </Grid2>
      </Container>

      {/* Call-to-Action Section */}
      <Box sx={{ bgcolor: 'secondary.main', py:7}} boxShadow={10}>
        <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
          <Typography variant="h4" sx={{ mb: 4 }}>
            Join the Movement Towards a Greener Planet
          </Typography>
          <Link to="/auth/sign-up" style={{ textDecoration: 'none' }}>
            <Button variant="contained" color="primary" size="large">
              Sign Up Now
            </Button>
          </Link>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
