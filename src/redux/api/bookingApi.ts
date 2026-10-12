import baseApi from "./baseApi";

const bookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // bank transfer and kalma payment
    createBooking: builder.mutation({
      query: (bookingData) => ({
        url: `/booking/create`,
        method: "POST",
        body: bookingData,
      }),
      invalidatesTags: ["booking"],
    }),
    // paypal payment
    createBookingPaypal: builder.mutation({
      query: (bookingData) => ({
        url: `booking/create-with-paypal`,
        method: "POST",
        body: bookingData,
      }),
      invalidatesTags: ["booking"],
    }),
    // discount code validation
    getDiscountInfo: builder.query({
      query: (discountCode) => ({
        url: `/booking/discount-info/${discountCode}`,
        method: "GET",
      }),
      providesTags: ["booking"],
    }),
    getTicketDetails: builder.query({
      query: (id) => ({
        url: `/booking/ticket-details/${id}`,
        method: "GET",
      }),
      providesTags: ["booking"],
    }),
    getEventWiseTicket: builder.query({
      query: (id) => ({
        url: `/ticket/event/${id}`,
        method: "GET",
      }),
      providesTags: ["booking"],
    }),

    myTickets: builder.query({
      query: ({ browserId, userId }) => {
        if (browserId && userId) {
          return {
            url: `/booking/my-tickets/${browserId}/${userId}`,
            method: "GET",
          };
        }

        if (browserId) {
          return {
            url: `/booking/my-tickets/${browserId}`,
            method: "GET",
          };
        }

        if (userId) {
          return {
            url: `/booking/my-tickets/${userId}`,
            method: "GET",
          };
        }

        return {
          url: `/booking/my-tickets`,
          method: "GET",
        };
      },
      providesTags: ["booking"],
    }),
  }),
});

export const {
  useCreateBookingMutation,
  useCreateBookingPaypalMutation,
  useGetDiscountInfoQuery,
  useGetTicketDetailsQuery,
  useGetEventWiseTicketQuery,
  useMyTicketsQuery,
} = bookingApi;
