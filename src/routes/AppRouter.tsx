import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ProtectedRoute from './ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        lazy: () => import('../features/listings/pages/ListingsPage'),
      },
      {
        path: 'listings/new',
        element: (
          <ProtectedRoute>
            <ListingFormWrapper />
          </ProtectedRoute>
        ),
      },
      {
        path: 'listings/:id',
        lazy: () => import('../features/listings/pages/ListingDetailsPage'),
      },
      {
        path: 'listings/:id/edit',
        element: (
          <ProtectedRoute>
            <ListingFormWrapper />
          </ProtectedRoute>
        ),
      },
      {
        path: 'orders/:orderId/review',
        element: (
          <ProtectedRoute>
            <ReviewFormWrapper />
          </ProtectedRoute>
        ),
      },
      {
        path: 'my/listings',
        element: (
          <ProtectedRoute>
            <MyListingsWrapper />
          </ProtectedRoute>
        ),
      },
      {
        path: 'login',
        lazy: () => import('../features/auth/pages/LoginPage'),
      },
      {
        path: '*',
        lazy: () => import('../features/listings/pages/ListingsPage'),
      },
    ],
  },
]);

// Helper lazy wrappers for Protected routes
import { lazy, Suspense } from 'react';
import { CircularProgress, Box } from '@mui/material';

const LazyListingForm = lazy(() => import('../features/listings/pages/ListingFormPage'));
const LazyReviewForm = lazy(() => import('../features/reviews/pages/ReviewFormPage'));
const LazyMyListings = lazy(() => import('../features/listings/pages/MyListingsPage'));

function PageLoader() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
      <CircularProgress />
    </Box>
  );
}

function ListingFormWrapper() {
  return (
    <Suspense fallback={<PageLoader />}>
      <LazyListingForm />
    </Suspense>
  );
}

function ReviewFormWrapper() {
  return (
    <Suspense fallback={<PageLoader />}>
      <LazyReviewForm />
    </Suspense>
  );
}

function MyListingsWrapper() {
  return (
    <Suspense fallback={<PageLoader />}>
      <LazyMyListings />
    </Suspense>
  );
}

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
