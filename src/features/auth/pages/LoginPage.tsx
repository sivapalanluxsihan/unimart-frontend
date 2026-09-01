import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Divider,
  Chip,
  CircularProgress,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { useAppDispatch } from '../../../app/hooks';
import { setCredentials } from '../authSlice';

export function Component() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tokenInput, setTokenInput] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';
      const res = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        const token = data.token || data.accessToken || 'mock-jwt-token';
        const user = data.user || {
          id: 1,
          name: email.split('@')[0] || 'User',
          email,
          role: 'SELLER',
        };
        dispatch(setCredentials({ user, token }));
        navigate(from, { replace: true });
        return;
      }

      // If backend returns 401, check if user provided direct token or fallback demo
      if (tokenInput.trim()) {
        const user = {
          id: 1,
          name: email ? email.split('@')[0] : 'UniMart User',
          email: email || 'user@unimart.com',
          role: 'SELLER',
        };
        dispatch(setCredentials({ user, token: tokenInput.trim() }));
        navigate(from, { replace: true });
        return;
      }

      setErrorMsg('Invalid email or password. You can also sign in using a demo campus account below.');
    } catch {
      setErrorMsg('Network error connecting to authentication server. You may use a demo account below.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (role: 'SELLER' | 'BUYER', id: number, name: string, emailStr: string) => {
    const demoUser = {
      id,
      name,
      email: emailStr,
      role,
    };
    // Standard mock token for local development session
    const demoToken = `mock-jwt-token-user-${id}-${Date.now()}`;
    dispatch(setCredentials({ user: demoUser, token: demoToken }));
    navigate(from, { replace: true });
  };

  return (
    <Box sx={{ maxWidth: 480, mx: 'auto', py: 4 }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4 },
          borderRadius: 3,
          border: '1px solid #e2e8f0',
          backgroundColor: '#ffffff',
        }}
      >
        {/* Brand Icon & Heading */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box
            sx={{
              display: 'inline-flex',
              p: 1.5,
              borderRadius: '50%',
              backgroundColor: '#eff6ff',
              color: '#1f4e78',
              mb: 1.5,
            }}
          >
            <LockOutlinedIcon sx={{ fontSize: 32 }} />
          </Box>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700, color: '#1e293b' }}>
            Sign in to UniMart
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Access listings, sell items, and submit verified reviews
          </Typography>
        </Box>

        {errorMsg && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {errorMsg}
          </Alert>
        )}

        <Box component="form" onSubmit={handleLogin} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField
            id="login-email"
            label="Email address"
            type="email"
            required
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="student@university.edu"
            autoComplete="email"
            autoFocus
          />

          <TextField
            id="login-password"
            label="Password"
            type="password"
            required
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
          />

          {showTokenInput && (
            <TextField
              id="login-token"
              label="Custom JWT Access Token (Optional)"
              type="text"
              fullWidth
              multiline
              rows={2}
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="Paste Bearer JWT token if available..."
            />
          )}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              size="small"
              onClick={() => setShowTokenInput(!showTokenInput)}
              sx={{ textTransform: 'none', fontSize: '0.8rem', color: '#64748b' }}
            >
              {showTokenInput ? 'Hide token field' : 'Have a custom JWT token?'}
            </Button>
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              py: 1.2,
              fontWeight: 600,
              backgroundColor: '#1f4e78',
              '&:hover': { backgroundColor: '#153654' },
            }}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </Box>

        <Divider sx={{ my: 3 }}>
          <Chip label="Quick Campus Demo Profiles" size="small" sx={{ fontSize: '0.75rem' }} />
        </Divider>

        {/* Demo profiles */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<StorefrontIcon sx={{ color: '#1f4e78' }} />}
            onClick={() => handleDemoLogin('SELLER', 1, 'John Seller', 'seller@university.edu')}
            sx={{
              justifyContent: 'flex-start',
              textTransform: 'none',
              py: 1,
              borderRadius: 2,
              borderColor: '#cbd5e1',
              color: '#1e293b',
              '&:hover': { borderColor: '#1f4e78', backgroundColor: '#f8fafc' },
            }}
          >
            <Box sx={{ textAlign: 'left', ml: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Demo Seller (ID: 1)
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Can create, edit, and archive Seller #1 listings
              </Typography>
            </Box>
          </Button>

          <Button
            variant="outlined"
            fullWidth
            startIcon={<ShoppingBagIcon sx={{ color: '#059669' }} />}
            onClick={() => handleDemoLogin('BUYER', 2, 'Jane Buyer', 'buyer@university.edu')}
            sx={{
              justifyContent: 'flex-start',
              textTransform: 'none',
              py: 1,
              borderRadius: 2,
              borderColor: '#cbd5e1',
              color: '#1e293b',
              '&:hover': { borderColor: '#059669', backgroundColor: '#f0fdf4' },
            }}
          >
            <Box sx={{ textAlign: 'left', ml: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Demo Buyer (ID: 2)
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Can browse, leave reviews, and test non-owner views
              </Typography>
            </Box>
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default Component;
