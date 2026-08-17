import { baseApi } from '../../services/baseApi';

export const listingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getListings: builder.query<any, void>({
      query: () => '/listings',
    }),
  }),
});

export const { useGetListingsQuery } = listingsApi;
