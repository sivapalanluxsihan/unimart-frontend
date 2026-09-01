import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Snackbar, Alert, CircularProgress, Typography, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ListingForm from '../components/ListingForm';
import {
  useGetListingQuery,
  useCreateListingMutation,
  useUpdateListingMutation,
} from '../listingsApi';
import type { ListingInput } from '../listingTypes';
import { useAppSelector } from '../../../app/hooks';
import ErrorState from '../../../components/common/ErrorState';

export function Component() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const listingId = id ? Number(id) : undefined;

  const { user } = useAppSelector((state) => state.auth);

  // Queries & Mutations
  const {
    data: existingListing,
    isLoading: isLoadingListing,
    isError: isListingError,
    error: listingFetchError,
    refetch,
  } = useGetListingQuery(listingId!, {
    skip: !isEditMode || !listingId,
  });

  const [createListing, { isLoading: isCreating }] = useCreateListingMutation();
  const [updateListing, { isLoading: isUpdating }] = useUpdateListingMutation();

  const [serverError, setServerError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isLoading = isCreating || isUpdating;

  // Check ownership in edit mode (frontend usability check)
  const isOwner =
    !isEditMode ||
    (existingListing && user && Number(existingListing.sellerId) === Number(user.id)) ||
    !existingListing?.sellerId;

  const handleSubmit = async (formData: ListingInput) => {
    setServerError(null);
    try {
      if (isEditMode && listingId) {
        const result = await updateListing({ id: listingId, body: formData }).unwrap();
        setToastMessage('Listing updated successfully!');
        setTimeout(() => {
          navigate(`/listings/${result.id || listingId}`);
        }, 800);
      } else {
        const result = await createListing(formData).unwrap();
        setToastMessage('Listing created successfully!');
        setTimeout(() => {
          navigate(`/listings/${result.id}`);
        }, 800);
      }
    } catch (err: any) {
      if (err?.status === 401) {
        setServerError('Your session has expired. Please log in again.');
      } else if (err?.status === 403) {
        setServerError('You do not have permission to modify this listing.');
      } else if (err?.status === 409) {
        setServerError(err?.data?.message || 'A conflict occurred while saving the listing.');
      } else if (err?.data?.message) {
        setServerError(err.data.message);
      } else if (err?.data?.fieldErrors) {
        const fields = Object.entries(err.data.fieldErrors)
          .map(([k, v]) => `${k}: ${v}`)
          .join(', ');
        setServerError(`Validation error: ${fields}`);
      } else {
        setServerError('Failed to save listing. Please check your network and try again.');
      }
    }
  };

  if (isEditMode && isLoadingListing) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isEditMode && isListingError) {
    return (
      <ErrorState
        title="Could not load listing for editing"
        error={listingFetchError}
        onRetry={refetch}
      />
    );
  }

  if (isEditMode && existingListing && user && !isOwner) {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', textAlign: 'center', py: 6 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            Permission Denied
          </Typography>
          You are not the owner of this listing and cannot edit it.
        </Alert>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/listings')}
          sx={{ textTransform: 'none' }}
        >
          Back to Listings
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 2 }}>
      <ListingForm
        isEditMode={isEditMode}
        initialValues={
          existingListing
            ? {
                title: existingListing.title,
                description: existingListing.description,
                price: existingListing.price,
                categoryId: existingListing.categoryId,
              }
            : undefined
        }
        isLoading={isLoading}
        serverError={serverError}
        onSubmit={handleSubmit}
      />

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
