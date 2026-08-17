import { baseApi } from '../../services/baseApi';

export const reviewsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReviews: builder.query<any, string>({
      query: (listingId) => `/listings/${listingId}/reviews`,
    }),
  }),
});

export const { useGetReviewsQuery } = reviewsApi;
