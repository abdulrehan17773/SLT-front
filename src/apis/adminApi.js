import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    // 1. Add New User
    addUser: builder.mutation({
      query: (userData) => ({
        url: "/admin/addUser",
        method: "POST",
        body: userData,
      }),
    }),

    // ✅ 2. Get All Users (with pagination)
    getAllUsers: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: `/admin/getAllUsers?page=${page}&limit=${limit}`,
        method: "GET",
      }),
    }),

    // 3. Update User
    updateUser: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/admin/updateUser/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),

    // 4. Soft Delete User
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/admin/deleteUser/${id}`,
        method: "PATCH",
      }),
    }),

    // 5. Dashboard Counts
    getUserCounts: builder.query({
      query: () => "/admin/getUserCounts",
    }),

    // 6. Recent Users
    getRecentUsers: builder.query({
      query: () => "/admin/getRecentUsers",
    }),

    // 7. Users in last 7 days
    getLast7DaysUsers: builder.query({
      query: () => "/admin/getLast7DaysUsers",
    }),

    // 8. Users in last 4 weeks
    getLast4WeeksUsers: builder.query({
      query: () => "/admin/getLast4WeeksUsers",
    }),

    // 9. Users feedback
    getAllFeedbacks: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: `/admin/getAllFeedbacks?page=${page}&limit=${limit}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useAddUserMutation,
  useGetAllUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetUserCountsQuery,
  useGetRecentUsersQuery,
  useGetLast7DaysUsersQuery,
  useGetLast4WeeksUsersQuery,
  useGetAllFeedbacksQuery
} = adminApi;
