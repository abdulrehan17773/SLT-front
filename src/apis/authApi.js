import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (userData) => ({
        url: "/users/register",
        method: "POST",
        body: userData,
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: "/users/login",
        method: "POST",
        body: credentials,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/users/logout",
        method: "POST",
      }),
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/users/update-profile",
        method: "PUT",
        body: data,
      }),
    }),
    addFeedback: builder.mutation({
      query: (feedbackData) => ({
        url: "/users/feedback",
        method: "POST",
        body: feedbackData,
      }),
    }),

    // ✅ New: Send reset code to email
    sendResetCode: builder.mutation({
      query: (emailData) => ({
        url: "/users/send-code",
        method: "POST",
        body: emailData,
      }),
    }),

    // ✅ New: Reset password using code
    resetPassword: builder.mutation({
      query: (resetData) => ({
        url: "/users/reset",
        method: "POST",
        body: resetData,
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useUpdateProfileMutation,
  useAddFeedbackMutation,
  useSendResetCodeMutation,     // ← Exported
  useResetPasswordMutation,     // ← Exported
} = authApi;
