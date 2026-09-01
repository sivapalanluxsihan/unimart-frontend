import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Pagination,
  Snackbar,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Link } from 'react-router-dom';
import {
  useGetListingsQuery,
  useGetCategoriesQuery,
  useDeleteListingMutation,
} from '../listingsApi';
import type { Listing, ListingStatus, Category } from '../listingTypes';
import ListingCard from '../components/ListingCard';
import ListingSkeleton from '../components/ListingSkeleton';
import EmptyState from '../../../components/common/EmptyState';
import ErrorState from '../../../components/common/ErrorState';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import { useAppSelector } from '../../../app/hooks';

const DEFAULT_CATEGORIES: Category[] = [
  { id: 1, name: 'Textbooks & Study Materials' },
  { id: 2, name: 'Electronics & Gadgets' },
  { id: 3, name: 'Furniture & Dorm Living' },
  { id: 4, name: 'Clothing & Apparel' },
  { id: 5, name: 'Stationery & Supplies' },
  { id: 6, name: 'Tutoring & Campus Services' },
  { id: 7, name: 'Other / Miscellaneous' },
];

export function Component() {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | string>('');
  const [selectedStatus, setSelectedStatus] = useState<ListingStatus | ''>('AVAILABLE');
  const [page, setPage] = useState(0); // 0-indexed for backend
  const pageSize = 9;

  // Active query params
  const queryParams = useMemo(
    () => ({
      q: searchTerm ? searchTerm.trim() : undefined,
      categoryId: selectedCategory !== '' ? Number(selectedCategory) : undefined,
      status: selectedStatus !== '' ? selectedStatus : undefined,
      page,
      size: pageSize,
    }),
    [searchTerm, selectedCategory, selectedStatus, page]
  );

  const {
    data: pageData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetListingsQuery(queryParams);

  const { data: categoriesData } = useGetCategoriesQuery();
  const categories: Category[] =
    categoriesData && categoriesData.length > 0
      ? categoriesData
      : DEFAULT_CATEGORIES;

  // Archive mutation
  const [deleteListing, { isLoading: isArchiving }] = useDeleteListingMutation();
  const [listingToArchive, setListingToArchive] = useState<Listing | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value - 1); // MUI is 1-indexed, backend is 0-indexed
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedStatus('AVAILABLE');
    setPage(0);
  };

  const hasActiveFilters = searchTerm !== '' || selectedCategory !== '' || selectedStatus !== 'AVAILABLE';

  const handleArchiveConfirm = async () => {
    if (!listingToArchive) return;
    try {
      await deleteListing(listingToArchive.id).unwrap();
      setToastMessage(`Listing "${listingToArchive.title}" was successfully archived.`);
      setListingToArchive(null);
    } catch (err: any) {
      setToastMessage(err?.data?.message || 'Failed to archive listing. Please try again.');
    }
  };

  const listings: Listing[] = pageData?.content || [];
  const totalPages = pageData?.totalPages || 0;

  return (
    <Box>
      {/* Header Banner */}
      <Box
        sx={{
          mb: 4,
          p: { xs: 3, sm: 4 },
          background: 'linear-gradient(135deg, #1f4e78 0%, #2e75b6 100%)',
          borderRadius: 3,
          color: 'white',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
            Campus Marketplace
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: 600 }}>
            Buy, sell, and exchange textbooks, electronics, dorm essentials, and services with fellow university members.
          </Typography>
        </Box>
        <Button
          component={Link}
          to={isAuthenticated ? '/listings/new' : '/login'}
          variant="contained"
          size="large"
          startIcon={<AddCircleIcon />}
          sx={{
            backgroundColor: '#f59e0b',
            color: '#0f172a',
            fontWeight: 700,
            textTransform: 'none',
            borderRadius: 2,
            px: 3,
            '&:hover': { backgroundColor: '#d97706' },
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
        >
          Post a Listing
        </Button>
      </Box>

      {/* Filter and Search Bar */}
      <Box
        sx={{
          mb: 4,
          p: 2.5,
          backgroundColor: '#ffffff',
          borderRadius: 3,
          border: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2,
          alignItems: 'center',
        }}
      >
        {/* Search Input */}
        <TextField
          id="search-listings-input"
          label="Search listings"
          placeholder="Search by title, keywords, or description..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(0);
          }}
          size="small"
          fullWidth
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: searchTerm ? (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    aria-label="Clear search"
                    onClick={() => {
                      setSearchTerm('');
                      setPage(0);
                    }}
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ) : null,
            },
          }}
        />

        {/* Category Filter */}
        <FormControl size="small" sx={{ minWidth: { xs: '100%', md: 220 } }}>
          <InputLabel id="category-filter-label">Category</InputLabel>
          <Select
            labelId="category-filter-label"
            id="category-filter-select"
            value={selectedCategory}
            label="Category"
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setPage(0);
            }}
          >
            <MenuItem value="">All Categories</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Status Filter */}
        <FormControl size="small" sx={{ minWidth: { xs: '100%', md: 160 } }}>
          <InputLabel id="status-filter-label">Status</InputLabel>
          <Select
            labelId="status-filter-label"
            id="status-filter-select"
            value={selectedStatus}
            label="Status"
            onChange={(e) => {
              setSelectedStatus(e.target.value as ListingStatus | '');
              setPage(0);
            }}
          >
            <MenuItem value="">All Statuses</MenuItem>
            <MenuItem value="AVAILABLE">Available</MenuItem>
            <MenuItem value="RESERVED">Reserved</MenuItem>
            <MenuItem value="SOLD">Sold</MenuItem>
            <MenuItem value="ARCHIVED">Archived</MenuItem>
          </Select>
        </FormControl>

        {/* Reset Filter Button */}
        {hasActiveFilters && (
          <Tooltip title="Reset all filters">
            <Button
              variant="outlined"
              size="small"
              onClick={handleResetFilters}
              startIcon={<FilterListIcon />}
              sx={{
                textTransform: 'none',
                whiteSpace: 'nowrap',
                minWidth: { xs: '100%', md: 'auto' },
              }}
            >
              Clear Filters
            </Button>
          </Tooltip>
        )}
      </Box>

      {/* Content Area */}
      {isLoading ? (
        <ListingSkeleton count={pageSize} />
      ) : isError ? (
        <ErrorState
          title="Could not load listings"
          error={error}
          onRetry={refetch}
        />
      ) : listings.length === 0 ? (
        <EmptyState
          title="No listings found"
          message={
            hasActiveFilters
              ? 'No campus listings match your current filters. Try changing or clearing your search criteria.'
              : 'There are currently no listings posted. Be the first to sell something on UniMart!'
          }
          actionText={hasActiveFilters ? 'Clear Filters' : 'Post the First Listing'}
          onAction={hasActiveFilters ? handleResetFilters : () => (window.location.href = '/listings/new')}
        />
      ) : (
        <>
          {/* Results Summary */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Showing <strong>{listings.length}</strong> of{' '}
              <strong>{pageData?.totalElements || listings.length}</strong> listings
              {isFetching && ' (updating...)'}
            </Typography>
          </Box>

          {/* Listings Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing: Listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                isOwner={user?.id === listing.sellerId}
                onArchive={(item) => setListingToArchive(item)}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, mb: 2 }}>
              <Pagination
                count={totalPages}
                page={page + 1}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      )}

      {/* Confirm Archive Dialog */}
      <ConfirmDialog
        open={Boolean(listingToArchive)}
        title="Archive Listing?"
        message={`Are you sure you want to archive "${listingToArchive?.title}"? It will no longer appear in active searches.`}
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
