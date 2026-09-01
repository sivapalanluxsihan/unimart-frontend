import { Typography, Button, Paper, Alert } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import RefreshIcon from '@mui/icons-material/Refresh';

interface ErrorStateProps {
  title?: string;
  message?: string;
  error?: any;
  onRetry?: () => void;
}

export default function ErrorState({
  title = 'Something went wrong',
  message,
  error,
  onRetry,
}: ErrorStateProps) {
  let displayMessage = message;

  if (!displayMessage && error) {
    if (typeof error === 'string') {
      displayMessage = error;
    } else if (error?.status === 401) {
      displayMessage = 'You must be logged in to view this content.';
    } else if (error?.status === 403) {
      displayMessage = 'You do not have permission to perform this action.';
    } else if (error?.status === 404) {
      displayMessage = 'The requested resource was not found.';
    } else if (error?.status === 409) {
      displayMessage = error?.data?.message || 'A business conflict occurred. Please review the state.';
    } else if (error?.data?.message) {
      displayMessage = error.data.message;
    } else if (error?.error) {
      displayMessage = error.error;
    } else {
      displayMessage = 'A network or server error occurred. Please check your connection and try again.';
    }
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        textAlign: 'center',
        backgroundColor: '#fff5f5',
        border: '1px solid #fed7d7',
        borderRadius: 3,
        my: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <ErrorIcon color="error" sx={{ fontSize: 56, mb: 1 }} />
      <Typography variant="h6" component="h2" color="error" sx={{ fontWeight: 600, mb: 1 }}>
        {title}
      </Typography>
      <Alert severity="error" sx={{ maxWidth: 550, width: '100%', mb: 3, textAlign: 'left' }}>
        {displayMessage || 'An unexpected error occurred.'}
      </Alert>
      {onRetry && (
        <Button
          variant="contained"
          color="primary"
          startIcon={<RefreshIcon />}
          onClick={onRetry}
          sx={{ textTransform: 'none' }}
        >
          Try Again
        </Button>
      )}
    </Paper>
  );
}
