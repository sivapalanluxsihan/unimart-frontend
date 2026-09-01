import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Button,
  Box,
  IconButton,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ArchiveIcon from '@mui/icons-material/Archive';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Link } from 'react-router-dom';
import type { Listing, ListingStatus } from '../listingTypes';
import { formatCurrency } from '../../../utils/formatCurrency';
import { formatDate } from '../../../utils/formatDate';

interface ListingCardProps {
  listing: Listing;
  isOwner?: boolean;
  onArchive?: (listing: Listing) => void;
}

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

export default function ListingCard({
  listing,
  isOwner = false,
  onArchive,
}: ListingCardProps) {
  const {
    id,
    title,
    description,
    price,
    status,
    categoryName,
    sellerName,
    createdAt,
  } = listing;

  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        border: '1px solid #e2e8f0',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          borderColor: '#93c5fd',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.07), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          transform: 'translateY(-2px)',
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
        {/* Top Badges: Category & Status */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
          <Chip
            label={categoryName || 'General'}
            size="small"
            variant="outlined"
            sx={{
              fontWeight: 500,
              fontSize: '0.75rem',
              borderColor: '#cbd5e1',
              color: '#475569',
              backgroundColor: '#f8fafc',
            }}
          />
          <Chip
            label={status}
            size="small"
            color={getStatusColor(status)}
            sx={{ fontWeight: 600, fontSize: '0.7rem' }}
          />
        </Box>

        {/* Title */}
        <Typography
          variant="h6"
          component={Link}
          to={`/listings/${id}`}
          sx={{
            fontWeight: 600,
            fontSize: '1.1rem',
            lineHeight: 1.35,
            color: '#1e293b',
            textDecoration: 'none',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            mb: 1,
            '&:hover': { color: '#1f4e78' },
          }}
        >
          {title}
        </Typography>

        {/* Price */}
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontWeight: 700,
            color: '#1f4e78',
            fontSize: '1.25rem',
            mb: 1.5,
          }}
        >
          {formatCurrency(price)}
        </Typography>

        {/* Description Excerpt */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            mb: 2,
            lineHeight: 1.5,
          }}
        >
          {description}
        </Typography>

        {/* Meta details */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, pt: 1, borderTop: '1px solid #f1f5f9' }}>
          {sellerName && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: '#64748b', fontSize: '0.8rem' }}>
              <PersonOutlineIcon sx={{ fontSize: 16 }} />
              <Typography variant="caption" color="text.secondary">
                Seller: <strong style={{ color: '#334155' }}>{sellerName}</strong>
              </Typography>
            </Box>
          )}
          {createdAt && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: '#64748b', fontSize: '0.8rem' }}>
              <AccessTimeIcon sx={{ fontSize: 16 }} />
              <Typography variant="caption" color="text.secondary">
                Posted {formatDate(createdAt)}
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>

      {/* Card Actions */}
      <CardActions sx={{ px: 2.5, pb: 2.5, pt: 0, justifyContent: 'space-between' }}>
        <Button
          component={Link}
          to={`/listings/${id}`}
          variant="contained"
          size="small"
          startIcon={<VisibilityIcon />}
          sx={{
            textTransform: 'none',
            borderRadius: 2,
            px: 2,
            backgroundColor: '#1f4e78',
            '&:hover': { backgroundColor: '#153654' },
          }}
        >
          View Details
        </Button>

        {isOwner && (
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title="Edit listing">
              <IconButton
                component={Link}
                to={`/listings/${id}/edit`}
                size="small"
                color="primary"
                aria-label={`Edit ${title}`}
                sx={{ border: '1px solid #cbd5e1', borderRadius: 1.5 }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            {status !== 'ARCHIVED' && onArchive && (
              <Tooltip title="Archive listing">
                <IconButton
                  size="small"
                  color="warning"
                  onClick={() => onArchive(listing)}
                  aria-label={`Archive ${title}`}
                  sx={{ border: '1px solid #fed7aa', borderRadius: 1.5 }}
                >
                  <ArchiveIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        )}
      </CardActions>
    </Card>
  );
}
