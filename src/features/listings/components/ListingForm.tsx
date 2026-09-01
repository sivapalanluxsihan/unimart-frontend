import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  InputAdornment,
  Paper,
  Typography,
  CircularProgress,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import type { ListingInput, Category } from '../listingTypes';
import { useGetCategoriesQuery } from '../listingsApi';

const DEFAULT_CATEGORIES: Category[] = [
  { id: 1, name: 'Textbooks & Study Materials' },
  { id: 2, name: 'Electronics & Gadgets' },
  { id: 3, name: 'Furniture & Dorm Living' },
  { id: 4, name: 'Clothing & Apparel' },
  { id: 5, name: 'Stationery & Supplies' },
  { id: 6, name: 'Tutoring & Campus Services' },
  { id: 7, name: 'Other / Miscellaneous' },
];

const listingSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(160, 'Title must not exceed 160 characters'),
  description: z
    .string()
    .trim()
    .min(1, 'Description is required')
    .max(5000, 'Description must not exceed 5000 characters'),
  price: z.coerce
    .number({ message: 'Price must be a valid number' })
    .min(0, 'Price must be greater than or equal to 0'),
  categoryId: z.coerce
    .number({ message: 'Please select a category' })
    .int('Category ID must be an integer')
    .positive('Please select a category'),
});

type ListingFormData = z.infer<typeof listingSchema>;

interface ListingFormProps {
  initialValues?: Partial<ListingInput>;
  isEditMode?: boolean;
  isLoading?: boolean;
  serverError?: string | null;
  onSubmit: (data: ListingInput) => Promise<void> | void;
}

export default function ListingForm({
  initialValues,
  isEditMode = false,
  isLoading = false,
  serverError,
  onSubmit,
}: ListingFormProps) {
  const navigate = useNavigate();
  const { data: categoriesData } = useGetCategoriesQuery();

  const categories: Category[] =
    categoriesData && categoriesData.length > 0
      ? categoriesData
      : DEFAULT_CATEGORIES;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema) as any,
    defaultValues: {
      title: initialValues?.title || '',
      description: initialValues?.description || '',
      price: initialValues?.price != null ? initialValues.price : ('' as any),
      categoryId: initialValues?.categoryId || ('' as any),
    },
  });

  useEffect(() => {
    if (initialValues) {
      reset({
        title: initialValues.title || '',
        description: initialValues.description || '',
        price: initialValues.price != null ? initialValues.price : ('' as any),
        categoryId: initialValues.categoryId || ('' as any),
      });
    }
  }, [initialValues, reset]);

  const handleFormSubmit = (data: ListingFormData) => {
    onSubmit({
      title: data.title.trim(),
      description: data.description.trim(),
      price: data.price,
      categoryId: data.categoryId,
    });
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, sm: 5 },
        borderRadius: 3,
        border: '1px solid #e2e8f0',
        backgroundColor: '#ffffff',
        maxWidth: 700,
        mx: 'auto',
      }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
          {isEditMode ? 'Edit Listing' : 'Create New Listing'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {isEditMode
            ? 'Update the details of your campus item.'
            : 'Fill in the details below to publish your item to the UniMart student marketplace.'}
        </Typography>
      </Box>

      {serverError && (
        <Box
          sx={{
            mb: 3,
            p: 2,
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: 2,
            color: '#b91c1c',
            fontSize: '0.875rem',
          }}
        >
          {serverError}
        </Box>
      )}

      <Box
        component="form"
        onSubmit={handleSubmit(handleFormSubmit)}
        noValidate
        sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
      >
        {/* Title */}
        <Box>
          <TextField
            {...register('title')}
            id="listing-title"
            label="Listing Title"
            fullWidth
            required
            variant="outlined"
            placeholder="e.g. Calculus: Early Transcendentals (8th Edition)"
            error={!!errors.title}
            helperText={errors.title?.message || 'Keep it clear and descriptive (up to 160 characters)'}
            disabled={isLoading}
            slotProps={{
              inputLabel: { shrink: true },
            }}
          />
        </Box>

        {/* Category */}
        <Box>
          <Controller
            name="categoryId"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth required error={!!errors.categoryId}>
                <InputLabel id="listing-category-label" shrink>
                  Category
                </InputLabel>
                <Select
                  {...field}
                  labelId="listing-category-label"
                  id="listing-category"
                  label="Category"
                  disabled={isLoading}
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    <em>Select a category</em>
                  </MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  {errors.categoryId?.message || 'Choose the best matching category'}
                </FormHelperText>
              </FormControl>
            )}
          />
        </Box>

        {/* Price */}
        <Box>
          <TextField
            {...register('price')}
            id="listing-price"
            label="Price (LKR)"
            type="number"
            fullWidth
            required
            variant="outlined"
            placeholder="0.00"
            disabled={isLoading}
            error={!!errors.price}
            helperText={errors.price?.message || 'Set 0 for free/donation'}
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                startAdornment: <InputAdornment position="start">LKR</InputAdornment>,
                inputProps: { min: 0, step: 'any' },
              },
            }}
          />
        </Box>

        {/* Description */}
        <Box>
          <TextField
            {...register('description')}
            id="listing-description"
            label="Detailed Description"
            fullWidth
            required
            multiline
            rows={5}
            variant="outlined"
            placeholder="Describe item condition, edition, pickup location on campus, or reason for selling..."
            disabled={isLoading}
            error={!!errors.description}
            helperText={errors.description?.message || 'Provide helpful details (up to 5000 characters)'}
            slotProps={{
              inputLabel: { shrink: true },
            }}
          />
        </Box>

        {/* Action Buttons */}
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
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
            disabled={isLoading}
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              px: 4,
              py: 1,
              fontWeight: 600,
              backgroundColor: '#1f4e78',
              '&:hover': { backgroundColor: '#153654' },
            }}
          >
            {isLoading ? 'Saving...' : isEditMode ? 'Update Listing' : 'Publish Listing'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
