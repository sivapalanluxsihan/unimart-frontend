import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Avatar,
} from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ListAltIcon from '@mui/icons-material/ListAlt';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { logout } from '../features/auth/authSlice';

export default function Navbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleCloseUserMenu();
    dispatch(logout());
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <AppBar position="sticky" elevation={1} sx={{ backgroundColor: '#1f4e78' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          {/* Brand Logo & Name */}
          <Box
            component={Link}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'white',
              gap: 1,
            }}
          >
            <StorefrontIcon sx={{ fontSize: 32, color: '#f59e0b' }} />
            <Typography
              variant="h6"
              noWrap
              sx={{
                fontWeight: 700,
                letterSpacing: '.05rem',
                color: 'inherit',
                fontSize: { xs: '1.1rem', sm: '1.4rem' },
              }}
            >
              UniMart
            </Typography>
          </Box>

          {/* Navigation Links */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
            <Button
              component={Link}
              to="/"
              variant={isActive('/') ? 'contained' : 'text'}
              sx={{
                color: 'white',
                backgroundColor: isActive('/') ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                textTransform: 'none',
                fontWeight: 500,
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
                },
              }}
            >
              Listings
            </Button>

            {isAuthenticated && (
              <>
                <Button
                  component={Link}
                  to="/listings/new"
                  startIcon={<AddCircleIcon />}
                  variant={isActive('/listings/new') ? 'contained' : 'text'}
                  sx={{
                    color: 'white',
                    backgroundColor: isActive('/listings/new') ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                    textTransform: 'none',
                    fontWeight: 500,
                    borderRadius: 2,
                    display: { xs: 'none', sm: 'inline-flex' },
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.25)',
                    },
                  }}
                >
                  Post Listing
                </Button>

                <Button
                  component={Link}
                  to="/my/listings"
                  startIcon={<ListAltIcon />}
                  variant={isActive('/my/listings') ? 'contained' : 'text'}
                  sx={{
                    color: 'white',
                    backgroundColor: isActive('/my/listings') ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                    textTransform: 'none',
                    fontWeight: 500,
                    borderRadius: 2,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.25)',
                    },
                  }}
                >
                  My Listings
                </Button>
              </>
            )}

            {/* Auth section */}
            {isAuthenticated ? (
              <Box sx={{ ml: 1 }}>
                <IconButton
                  onClick={handleOpenUserMenu}
                  aria-label="User account menu"
                  aria-controls="user-menu"
                  aria-haspopup="true"
                  sx={{ p: 0.5 }}
                >
                  <Avatar sx={{ bgcolor: '#f59e0b', width: 34, height: 34, fontSize: '0.9rem' }}>
                    {user?.name ? user.name[0].toUpperCase() : 'U'}
                  </Avatar>
                </IconButton>
                <Menu
                  id="user-menu"
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleCloseUserMenu}
                  sx={{ mt: '45px' }}
                  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                  <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {user?.name || 'User'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {user?.email}
                    </Typography>
                    {user?.role && (
                      <Box sx={{ mt: 0.5 }}>
                        <Chip label={user.role} size="small" color="primary" variant="outlined" />
                      </Box>
                    )}
                  </Box>
                  <MenuItem
                    component={Link}
                    to="/listings/new"
                    onClick={handleCloseUserMenu}
                    sx={{ display: { sm: 'none' } }}
                  >
                    <AddCircleIcon fontSize="small" sx={{ mr: 1 }} />
                    Post Listing
                  </MenuItem>
                  <MenuItem component={Link} to="/my/listings" onClick={handleCloseUserMenu}>
                    <ListAltIcon fontSize="small" sx={{ mr: 1 }} />
                    My Listings
                  </MenuItem>
                  <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                    <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                    Logout
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              <Button
                component={Link}
                to="/login"
                variant="contained"
                startIcon={<LoginIcon />}
                sx={{
                  backgroundColor: '#f59e0b',
                  color: '#1e293b',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: '#d97706',
                  },
                }}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
