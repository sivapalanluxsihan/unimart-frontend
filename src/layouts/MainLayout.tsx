import { Box, Container, Typography, Link as MuiLink } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function MainLayout() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
      }}
    >
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, py: { xs: 2, sm: 4 } }}>
        <Container maxWidth="lg">
          <Outlet />
        </Container>
      </Box>
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: '#0f172a',
          color: '#94a3b8',
          textAlign: 'center',
          borderTop: '1px solid #1e293b',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2">
            UniMart &copy; {new Date().getFullYear()} — Campus Marketplace for Students & Faculty
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: '#64748b' }}>
            Built with React, RTK Query, Material UI & Tailwind CSS
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
