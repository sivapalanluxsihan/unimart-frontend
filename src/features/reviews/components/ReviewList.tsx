import {
  Box,
  Typography,
  Rating,
  Skeleton,
  Paper,
  Divider,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import { useGetReviewsQuery } from '../reviewsApi';
import type { Review } from '../reviewTypes';
import ReviewItem from './ReviewItem';
import ErrorState from '../../../components/common/ErrorState';

interface ReviewListProps {
  listingId: number;
}

export default function ReviewList({ listingId }: ReviewListProps) {
  const { data: reviews, isLoading, isError, error, refetch } = useGetReviewsQuery(listingId);

  if (isLoading) {
    return (
      <Box sx={{ mt: 3 }}>
        <Skeleton variant="text" width="40%" height={32} sx={{ mb: 2 }} />
        {Array.from(new Array(2)).map((_, idx) => (
          <Paper key={idx} elevation={0} sx={{ p: 2.5, mb: 2, border: '1px solid #e2e8f0', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Skeleton variant="circular" width={36} height={36} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width={120} height={20} />
                <Skeleton variant="text" width={80} height={16} />
              </Box>
              <Skeleton variant="rounded" width={90} height={20} />
            </Box>
            <Skeleton variant="rectangular" height={40} sx={{ borderRadius: 1 }} />
          </Paper>
        ))}
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ mt: 3 }}>
        <ErrorState
          title="Could not load reviews"
          error={error}
          onRetry={refetch}
        />
      </Box>
    );
  }

  const reviewItems: Review[] = reviews || [];
  const reviewCount = reviewItems.length;
  const averageRating =
    reviewCount > 0
      ? reviewItems.reduce((acc, r) => acc + (r.rating || 0), 0) / reviewCount
      : 0;

  return (
    <Box sx={{ mt: 4 }}>
      {/* Header & Rating Summary */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          mb: 3,
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 700, color: '#1e293b' }}>
            Reviews & Ratings
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Verified feedback from university buyers
          </Typography>
        </Box>

        {reviewCount > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Rating
                value={averageRating}
                precision={0.1}
                readOnly
                emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
              />
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e293b' }}>
                {averageRating.toFixed(1)}
              </Typography>
            </Box>
            <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
            <Typography variant="body2" color="text.secondary">
              {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Reviews List or Empty State */}
      {reviewCount === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: 'center',
            backgroundColor: '#f8fafc',
            border: '1px dashed #cbd5e1',
            borderRadius: 3,
          }}
        >
          <RateReviewOutlinedIcon sx={{ fontSize: 48, color: '#94a3b8', mb: 1 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#475569', mb: 0.5 }}>
            No reviews yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto' }}>
            Buyers who purchase this item can leave feedback and ratings after their transaction is complete.
          </Typography>
        </Paper>
      ) : (
        <Box>
          {reviewItems.map((review: Review) => (
            <ReviewItem key={review.id} review={review} />
          ))}
        </Box>
      )}
    </Box>
  );
}
