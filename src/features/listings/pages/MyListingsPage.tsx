import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Snackbar,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Link } from 'react-router-dom';
import { useGetListingsQuery, useDeleteListingMutation } from '../listingsApi';
import type { Listing, ListingStatus } from '../listingTypes';
import ListingCard from '../components/ListingCard';
import ListingSkeleton from '../components/ListingSkeleton';
import EmptyState from '../../../components/common/EmptyState';
import ErrorState from '../../../components/common/ErrorState';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import { useAppSelector } from '../../../app/hooks';

export function Component() {
  const { user } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState<'ALL' | ListingStatus>('ALL');

  // Query listings by sellerId if user.id is present, or fetch all listings
  const {
    data: pageData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetListingsQuery(
    user?.id ? { sellerId: user.id, size: 50 } : { size: 50 }
  );

  const [deleteListing, { isLoading: isArchiving }] = useDeleteListingMutation();
  const [listingToArchive, setListingToArchive] = useState<Listing | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const allListings: Listing[] = pageData?.content || [];

  // Filter for user's listings
  const userListings = allListings.filter((item: Listing) =>
    user?.id ? Number(item.sellerId) === Number(user.id) : true
  );

  // Filter by tab
  const filteredListings = userListings.filter((item: Listing) => {
    if (activeTab === 'ALL') return true;
    return item.status === activeTab;
  });

  const handleArchiveConfirm = async () => {
    if (!listingToArchive) return;
    try {
      await deleteListing(listingToArchive.id).unwrap();
      setToastMessage(`Listing "${listingToArchive.title}" was archived.`);
      setListingToArchive(null);
    } catch (err: any) {
      setToastMessage(err?.data?.message || 'Failed to archive listing.');
    }
  };

  return (
    <Box sx={{ py: 2 }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          mb: 4,
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: '#1e293b' }}>
            My Listings
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your items, edit active posts, or archive completed sales
          </Typography>
        </Box>

        <Button
          component={Link}
          to="/listings/new"
          variant="contained"
          color="primary"
          startIcon={<AddCircleIcon />}
          sx={{
            backgroundColor: '#1f4e78',
            '&:hover': { backgroundColor: '#153654' },
            textTransform: 'none',
            borderRadius: 2,
            px: 3,
            fontWeight: 600,
          }}
        >
          Create New Listing
        </Button>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, val) => setActiveTab(val)}
          aria-label="Filter listings by status tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label={`All (${userListings.length})`} value="ALL" sx={{ textTransform: 'none' }} />
          <Tab
            label={`Available (${userListings.filter((i: Listing) => i.status === 'AVAILABLE').length})`}
            value="AVAILABLE"
            sx={{ textTransform: 'none' }}
          />
          <Tab
            label={`Reserved (${userListings.filter((i: Listing) => i.status === 'RESERVED').length})`}
            value="RESERVED"
            sx={{ textTransform: 'none' }}
          />
          <Tab
            label={`Sold (${userListings.filter((i: Listing) => i.status === 'SOLD').length})`}
            value="SOLD"
            sx={{ textTransform: 'none' }}
          />
          <Tab
            label={`Archived (${userListings.filter((i: Listing) => i.status === 'ARCHIVED').length})`}
            value="ARCHIVED"
            sx={{ textTransform: 'none' }}
          />
        </Tabs>
      </Box>

      {/* Content */}
      {isLoading ? (
        <ListingSkeleton count={4} />
      ) : isError ? (
        <ErrorState
          title="Could not load your listings"
          error={error}
          onRetry={refetch}
        />
      ) : filteredListings.length === 0 ? (
        <EmptyState
          title={activeTab === 'ALL' ? 'No Listings Yet' : `No ${activeTab.toLowerCase()} listings`}
          message={
            activeTab === 'ALL'
              ? 'You have not created any campus marketplace listings yet. Put your unused books, gadgets, or dorm items up for sale!'
              : `You have no listings marked as ${activeTab.toLowerCase()}.`
          }
          actionText={activeTab === 'ALL' ? 'Create Your First Listing' : undefined}
          onAction={activeTab === 'ALL' ? () => (window.location.href = '/listings/new') : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing: Listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              isOwner={true}
              onArchive={(item) => setListingToArchive(item)}
            />
          ))}
        </div>
      )}

      {/* Confirm Archive Dialog */}
      <ConfirmDialog
        open={Boolean(listingToArchive)}
        title="Archive Listing"
        message={`Are you sure you want to archive "${listingToArchive?.title}"?`}
        confirmText="Archive"
        confirmColor="warning"
        isLoading={isArchiving}
        onConfirm={handleArchiveConfirm}
        onClose={() => setListingToArchive(null)}
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
