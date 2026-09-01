import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Chip,
  Button,
  Paper,
  Divider,
  CircularProgress,
  Snackbar,
  Alert,
  Tooltip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import ArchiveIcon from '@mui/icons-material/Archive';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CategoryIcon from '@mui/icons-material/Category';
import {
  useGetListingQuery,
  useDeleteListingMutation,
} from '../listingsApi';
import type { ListingStatus } from '../listingTypes';
import { formatCurrency } from '../../../utils/formatCurrency';
import { formatDate } from '../../../utils/formatDate';
import ReviewList from '../../reviews/components/ReviewList';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import ErrorState from '../../../components/common/ErrorState';
import EmptyState from '../../../components/common/EmptyState';
import { useAppSelector } from '../../../app/hooks';

const getStatusColor = (
  status: ListingStatus
): 'success' | 'warning' | 'info' | 'default' => {
  switch (status) {
    case 'AVAILABLE':
      return 'success';
    case 'RESERVED':
      return 'warning';
    case 'SOLD':
      return 'info';
    case 'ARCHIVED':
      return 'default';
    default:
      return 'default';
  }
};

export function Component() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const listingId = id ? Number(id) : 0;

  const { user } = useAppSelector((state) => state.auth);

  const {
    data: listing,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetListingQuery(listingId, {
    skip: !listingId,
  });

  const [deleteListing, { isLoading: isArchiving }] = useDeleteListingMutation();

  const [confirmArchiveOpen, setConfirmArchiveOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isOwner = Boolean(
    listing && user && Number(listing.sellerId) === Number(user.id)
  );

  const handleArchive = async () => {
    if (!listing) return;
    try {
      await deleteListing(listing.id).unwrap();
      setToastMessage('Listing archived successfully.');
      setConfirmArchiveOpen(false);
    } catch (err: any) {
      setToastMessage(err?.data?.message || 'Failed to archive listing.');
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 450 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    const errorStatus = (error as any)?.status;
    if (errorStatus === 404) {
      return (
        <EmptyState
          title="Listing Not Found"
          message="The listing you are looking for does not exist or may have been removed."
          actionText="Back to Listings"
          onAction={() => navigate('/')}
        />
      );
    }

    return (
      <ErrorState
        title="Could not load listing details"
        error={error}
        onRetry={refetch}
      />
    );
  }

  if (!listing) {
    return (
      <EmptyState
        title="Listing Not Found"
        message="The listing you are looking for does not exist."
        actionText="Back to Listings"
        onAction={() => navigate('/')}
      />
    );
  }

  return (
    <Box sx={{ py: 2 }}>
      {/* Navigation Breadcrumb / Back Button */}
      <Box sx={{ mb: 3 }}>
        <Button
          component={Link}
          to="/"
          startIcon={<ArrowBackIcon />}
          sx={{ textTransform: 'none', color: '#64748b', '&:hover': { color: '#1f4e78' } }}
        >
          Back to Listings
        </Button>
      </Box>

      {/* Main Listing Details Card */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 5 },
          borderRadius: 3,
          border: '1px solid #e2e8f0',
          backgroundColor: '#ffffff',
          mb: 4,
        }}
      >
        {/* Header Badges & Owner Action Buttons */}
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
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
            <Chip
              icon={<CategoryIcon fontSize="small" />}
              label={listing.categoryName || 'General'}
              variant="outlined"
              sx={{ fontWeight: 500 }}
            />
            <Chip
              label={listing.status}
              color={getStatusColor(listing.status)}
              sx={{ fontWeight: 600 }}
            />
          </Box>

          {isOwner && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                component={Link}
                to={`/listings/${listing.id}/edit`}
                variant="outlined"
                color="primary"
                size="small"
                startIcon={<EditIcon />}
                sx={{ textTransform: 'none', borderRadius: 2 }}
              >
                Edit Listing
              </Button>

              {listing.status !== 'ARCHIVED' && (
                <Tooltip title="Archive listing">
                  <Button
                    variant="outlined"
                    color="warning"
                    size="small"
                    startIcon={<ArchiveIcon />}
                    onClick={() => setConfirmArchiveOpen(true)}
                    sx={{ textTransform: 'none', borderRadius: 2 }}
                  >
                    Archive
                  </Button>
                </Tooltip>
              )}
            </Box>
          )}
        </Box>

        {/* Title */}
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
          {listing.title}
        </Typography>

        {/* Price */}
        <Typography
          variant="h4"
          component="div"
          sx={{
            fontWeight: 800,
            color: '#1f4e78',
            my: 2,
          }}
        >
          {formatCurrency(listing.price)}
        </Typography>

        <Divider sx={{ my: 3 }} />

        {/* Description */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 600, color: '#1e293b', mb: 1 }}>
            Description
          </Typography>
          <Typography
            variant="body1"
            color="#334155"
            sx={{
              whiteSpace: 'pre-wrap',
              lineHeight: 1.8,
            }}
          >
            {listing.description}
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Seller and Meta Details */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 2,
            backgroundColor: '#f8fafc',
            p: 2.5,
            borderRadius: 2,
            border: '1px solid #e2e8f0',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <PersonIcon sx={{ color: '#64748b' }} />
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                Seller
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                {listing.sellerName || `Seller #${listing.sellerId}`}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <CalendarTodayIcon sx={{ color: '#64748b' }} />
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                Listed On
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                {formatDate(listing.createdAt)}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Reviews Section */}
      <ReviewList listingId={listing.id} />

      {/* Confirm Archive Dialog */}
      <ConfirmDialog
        open={confirmArchiveOpen}
        title="Archive this listing?"
        message={`Are you sure you want to archive "${listing.title}"? It will no longer be visible in searches or active listings.`}
        confirmText="Archive"
        confirmColor="warning"
        isLoading={isArchiving}
        onConfirm={handleArchive}
        onClose={() => setConfirmArchiveOpen(false)}
      />

      {/* Toast Notification */}
      <Snackbar
        open={Boolean(toastMessage)}
        autoHideDuration={4000}
        onClose={() => setToastMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setToastMessage(null)}
          severity="info"
          sx={{ width: '100%', borderRadius: 2 }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Component;
