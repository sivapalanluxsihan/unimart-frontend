import { baseApi } from '../../services/baseApi';
import type { Review, ReviewInput, UpdateReviewInput } from './reviewTypes';

export const reviewsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReviews: builder.query<Review[], number>({
      query: (listingId) => `/listings/${listingId}/reviews`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Review' as const, id })),
              { type: 'Review' as const, id: 'LIST' },
            ]
          : [{ type: 'Review' as const, id: 'LIST' }],
    }),

    createReview: builder.mutation<Review, ReviewInput>({
      query: (body) => ({
        url: '/reviews',
        method: 'POST',
        body,
      }),
      invalidatesTags: [
        { type: 'Review' as const, id: 'LIST' },
        { type: 'Listing' as const, id: 'LIST' },
      ],
    }),

    updateReview: builder.mutation<Review, UpdateReviewInput>({
      query: ({ id, ...body }) => ({
        url: `/reviews/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Review' as const, id },
        { type: 'Review' as const, id: 'LIST' },
      ],
    }),

    deleteReview: builder.mutation<void, number>({
      query: (id) => ({
        url: `/reviews/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Review' as const, id },
        { type: 'Review' as const, id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetReviewsQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} = reviewsApi;
