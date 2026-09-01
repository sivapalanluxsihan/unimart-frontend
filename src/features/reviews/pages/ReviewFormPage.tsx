import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Paper,
  Typography,
  Rating,
  TextField,
  Button,
  FormHelperText,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RateReviewIcon from '@mui/icons-material/RateReview';
import { useCreateReviewMutation } from '../reviewsApi';

const reviewSchema = z.object({
  rating: z.coerce
    .number({ message: 'Please select a star rating' })
    .min(1, 'Please select at least 1 star')
    .max(5, 'Maximum rating is 5 stars'),
  comment: z
    .string()
    .max(1000, 'Comment must not exceed 1000 characters')
    .optional(),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

export function Component() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const [createReview, { isLoading }] = useCreateReviewMutation();
  const [serverError, setServerError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema) as any,
    defaultValues: {
      rating: 5,
      comment: '',
    },
  });

  const onSubmit = async (data: ReviewFormData) => {
    if (!orderId) {
      setServerError('Missing order ID.');
      return;
    }

    setServerError(null);
    try {
      await createReview({
        orderId: Number(orderId),
        rating: data.rating,
        comment: data.comment?.trim() || undefined,
      }).unwrap();

      setToastMessage('Thank you! Your review has been submitted.');
      setTimeout(() => {
        navigate(-1);
      }, 1200);
    } catch (err: any) {
      if (err?.status === 401) {
        setServerError('Please log in to submit a review.');
      } else if (err?.status === 403) {
        setServerError('You do not have permission to review this order.');
      } else if (err?.status === 409) {
        setServerError(err?.data?.message || 'A review has already been submitted for this order.');
      } else if (err?.data?.message) {
        setServerError(err.data.message);
      } else {
        setServerError('Failed to submit review. Please try again later.');
      }
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', py: 4 }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4 },
          borderRadius: 3,
          border: '1px solid #e2e8f0',
          backgroundColor: '#ffffff',
        }}
      >
        {/* Title and Intro */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
            Leave a Review
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Share your experience for Order #{orderId}. Your rating helps maintain a trusted campus community.
          </Typography>
        </Box>

        {serverError && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {serverError}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
        >
          {/* Star Rating */}
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1e293b', mb: 1 }}>
              Your Overall Rating *
            </Typography>
            <Controller
              name="rating"
              control={control}
              render={({ field }) => (
                <Rating
                  id="review-rating"
                  name="review-rating"
                  value={Number(field.value) || 0}
                  onChange={(_, val) => field.onChange(val || 1)}
                  size="large"
                  emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                />
              )}
            />
            {errors.rating && (
              <FormHelperText error>{errors.rating.message}</FormHelperText>
            )}
          </Box>

          {/* Comment */}
          <Box>
            <TextField
              {...register('comment')}
              id="review-comment"
              label="Written Feedback (Optional)"
              placeholder="Tell others about the item condition, communication with the seller, and overall transaction..."
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              disabled={isLoading}
              error={!!errors.comment}
              helperText={errors.comment?.message || 'Max 1000 characters'}
              slotProps={{
                inputLabel: { shrink: true },
              }}
            />
          </Box>

          {/* Actions */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              pt: 2,
              borderTop: '1px solid #f1f5f9',
            }}
          >
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
              disabled={isLoading}
              sx={{ textTransform: 'none', borderRadius: 2 }}
            >
              Back
            </Button>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <RateReviewIcon />}
              sx={{
                textTransform: 'none',
                borderRadius: 2,
                px: 3,
                py: 1,
                fontWeight: 600,
                backgroundColor: '#1f4e78',
                '&:hover': { backgroundColor: '#153654' },
              }}
            >
              {isLoading ? 'Submitting...' : 'Submit Review'}
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Success Toast */}
      <Snackbar
        open={Boolean(toastMessage)}
        autoHideDuration={3000}
        onClose={() => setToastMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setToastMessage(null)}
          severity="success"
          sx={{ width: '100%', borderRadius: 2 }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Component;
