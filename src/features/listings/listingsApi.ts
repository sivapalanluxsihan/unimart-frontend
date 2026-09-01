import { baseApi } from '../../services/baseApi';
import type {
  Listing,
  ListingInput,
  ListingQueryParams,
  Page,
  Category,
} from './listingTypes';

export const listingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getListings: builder.query<Page<Listing>, ListingQueryParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.q) queryParams.set('q', params.q);
        if (params?.categoryId) queryParams.set('categoryId', String(params.categoryId));
        if (params?.status) queryParams.set('status', params.status);
        if (params?.sellerId) queryParams.set('sellerId', String(params.sellerId));
        if (params?.page != null) queryParams.set('page', String(params.page));
        if (params?.size != null) queryParams.set('size', String(params.size));

        const queryString = queryParams.toString();
        return `/listings${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: (result) =>
        result?.content
          ? [
              ...result.content.map(({ id }) => ({ type: 'Listing' as const, id })),
              { type: 'Listing' as const, id: 'LIST' },
            ]
          : [{ type: 'Listing' as const, id: 'LIST' }],
    }),

    getListing: builder.query<Listing, number>({
      query: (id) => `/listings/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Listing', id }],
    }),

    createListing: builder.mutation<Listing, ListingInput>({
      query: (body) => ({
        url: '/listings',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Listing', id: 'LIST' }],
    }),

    updateListing: builder.mutation<Listing, { id: number; body: ListingInput }>({
      query: ({ id, body }) => ({
        url: `/listings/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Listing', id },
        { type: 'Listing', id: 'LIST' },
      ],
    }),

    deleteListing: builder.mutation<void, number>({
      query: (id) => ({
        url: `/listings/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Listing', id },
        { type: 'Listing', id: 'LIST' },
      ],
    }),

    getCategories: builder.query<Category[], void>({
      query: () => '/categories',
      providesTags: ['Category'],
    }),
  }),
});

export const {
  useGetListingsQuery,
  useGetListingQuery,
  useCreateListingMutation,
  useUpdateListingMutation,
  useDeleteListingMutation,
  useGetCategoriesQuery,
} = listingsApi;
