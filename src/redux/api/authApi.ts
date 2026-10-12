import baseApi from "./baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createUser: builder.mutation({
      query: (data) => ({
        url: `/user/create`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["auth"],
    }),
    userLogin: builder.mutation({
      query: (data) => ({
        url: `/auth/auth-login`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["auth"],
    }),
    createUserVerification: builder.mutation({
      query: (data) => ({
        url: `/user/signup-verification`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["auth"],
    }),
    forgetPassword: builder.mutation({
      query: (data) => ({
        url: `/auth/forget-password`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["auth"],
    }),
    forgetOtpVerification: builder.mutation({
      query: (data) => ({
        url: `/auth/verify-forget-otp`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["auth"],
    }),
    resetPassword: builder.mutation({
      query: ({ data, token }) => ({
        url: `/auth/reset-password`,
        method: "PATCH",
        body: data,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ["auth"],
    }),
    googleLogin: builder.mutation({
      query: ({ data }) => ({
        url: `/auth/google-login`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["auth"],
    }),
  }),
});

export const {
  useCreateUserMutation,
  useUserLoginMutation,
  useCreateUserVerificationMutation,
  useForgetPasswordMutation,
  useForgetOtpVerificationMutation,
  useResetPasswordMutation,
  useGoogleLoginMutation,
} = authApi;
