import baseApi from "./baseApi";

const slotApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAvailableSlot: builder.query({
      query: () => ({
        url: `/slot/available-slots`,
        method: "GET",
      }),
      providesTags: ["slot"],
    }),
    getAllEvents: builder.query({
      query: ({ page, limit }) => ({
        url: `/event/all?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["slot"],
    }),
    getEventDetails: builder.query({
      query: (id) => ({
        url: `/event/details/${id}`,
        method: "GET",
      }),
      providesTags: ["slot"],
    }),
  }),
});

export const { useGetAvailableSlotQuery, useGetAllEventsQuery, useGetEventDetailsQuery } = slotApi;
