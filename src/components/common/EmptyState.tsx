import { Box, Typography, Button, Paper } from '@mui/material';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  title?: string;
  message: string;
  icon?: ReactNode;
  actionText?: string;
  onAction?: () => void;
}

export default function EmptyState({
  title = 'No Items Found',
  message,
  icon,
  actionText,
  onAction,
}: EmptyStateProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 6,
        textAlign: 'center',
        backgroundColor: '#f8fafc',
        border: '1px dashed #cbd5e1',
        borderRadius: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        my: 4,
      }}
    >
      <Box sx={{ color: '#94a3b8', mb: 2, display: 'flex', justifyContent: 'center' }}>
        {icon || <InboxOutlinedIcon sx={{ fontSize: 64 }} />}
      </Box>
      <Typography variant="h6" component="h2" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 450, mb: actionText ? 3 : 0 }}>
        {message}
      </Typography>
      {actionText && onAction && (
        <Button variant="contained" color="primary" onClick={onAction} sx={{ px: 3, textTransform: 'none' }}>
          {actionText}
        </Button>
      )}
    </Paper>
  );
}
