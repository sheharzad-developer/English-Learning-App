import React from 'react';
import { Container, Typography, Button, Grid, Box, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          backgroundColor: '#1976d2',
          color: 'white',
          py: 10,
          textAlign: 'center'
        }}
      >
        <Container>
          <Typography variant="h2" gutterBottom>
            Welcome to the English Learning App
          </Typography>
          <Typography variant="h5" gutterBottom>
            Practice. Progress. Succeed.
          </Typography>
          <Button variant="contained" color="secondary" size="large" onClick={() => navigate('/login')}>
            Get Started
          </Button>
        </Container>
      </Box>

      {/* Features Section */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h4" gutterBottom textAlign="center">
          Features
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6">🗣 Speaking Practice</Typography>
              <Typography variant="body1">
                Record and improve your pronunciation with instant feedback.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6">📊 Progress Tracking</Typography>
              <Typography variant="body1">
                Monitor your performance with visual analytics and feedback.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6">🎮 Gamified Learning</Typography>
              <Typography variant="body1">
                Earn points, badges, and climb leaderboards to stay motivated.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Testimonial Section */}
      <Box sx={{ backgroundColor: '#f5f5f5', py: 6, textAlign: 'center' }}>
        <Container>
          <Typography variant="h5" gutterBottom>
            "This app made learning English fun and effective!"
          </Typography>
          <Typography variant="subtitle1">— Ayesha, Student</Typography>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ backgroundColor: '#1976d2', color: 'white', py: 2, textAlign: 'center' }}>
        <Typography variant="body2">© 2025 English Learning App | Built with ❤️</Typography>
      </Box>
    </Box>
  );
};

export default Home;
