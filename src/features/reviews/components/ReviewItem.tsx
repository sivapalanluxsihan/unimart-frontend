import { Box, Typography, Rating, Paper, Avatar } from '@mui/material';
import type { Review } from '../reviewTypes';
import { formatDate } from '../../../utils/formatDate';

interface ReviewItemProps {
  review: Review;
}

export default function ReviewItem({ review }: ReviewItemProps) {
  const { reviewerName, rating, comment, createdAt } = review;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        mb: 2,
        borderRadius: 2.5,
        border: '1px solid #e2e8f0',
        backgroundColor: '#ffffff',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar
            sx={{
              bgcolor: '#1f4e78',
              width: 36,
              height: 36,
              fontSize: '0.875rem',
              fontWeight: 600,
            }}
          >
            {reviewerName ? reviewerName[0].toUpperCase() : 'U'}
          </Avatar>
          <Box>
            <Typography variant="subtitle2" fontWeight={600} color="#1e293b">
              {reviewerName || 'Anonymous Buyer'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatDate(createdAt)}
            </Typography>
          </Box>
        </Box>

        <Rating value={rating} precision={0.5} readOnly size="small" />
      </Box>

      {comment && (
        <Typography
          variant="body2"
          color="#334155"
          sx={{
            mt: 1,
            lineHeight: 1.6,
            whiteSpace: 'pre-wrap',
          }}
        >
          {comment}
        </Typography>
      )}
    </Paper>
  );
}
