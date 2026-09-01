import { Card, Box, Skeleton } from '@mui/material';

interface ListingSkeletonProps {
  count?: number;
}

export default function ListingSkeleton({ count = 6 }: ListingSkeletonProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from(new Array(count)).map((_, index) => (
        <Card
          key={index}
          elevation={0}
          sx={{
            height: '100%',
            borderRadius: 3,
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            p: 2.5,
            backgroundColor: '#ffffff',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Skeleton variant="rounded" width={80} height={24} />
            <Skeleton variant="rounded" width={90} height={24} />
          </Box>
          <Skeleton variant="text" width="90%" height={32} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="60%" height={20} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" height={60} sx={{ borderRadius: 1.5, mb: 2 }} />
          <Box sx={{ mt: 'auto', pt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Skeleton variant="text" width={110} height={32} />
            <Skeleton variant="rounded" width={100} height={36} />
          </Box>
        </Card>
      ))}
    </div>
  );
}
