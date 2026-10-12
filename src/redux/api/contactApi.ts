import baseApi from "./baseApi";

const contactApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    contact: builder.mutation({
      query: (contactData) => ({
        url: `/contact`,
        method: "POST",
        body: contactData,  
      }),
      invalidatesTags: ["contact"],
    }),
  }),
});

export const { useContactMutation } = contactApi;
