import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({baseUrl: "/api"}),
    endpoints: (builder) => ({
        register: builder.mutation({
            query: (userData) => ({
                url: "/users/register",
                method: "POST",
                body: userData
            })
        }),
        login: builder.mutation({
            query: (credentials) => ({
                url: "/users/login",
                method: "POST",
                body: credentials
            })
        }),
        logout: builder.mutation({
            query: () => ({
                url: "/users/logout",
                method: "POST"
            }) 
        })
    })
})

export const { useRegisterMutation, useLoginMutation, useLogoutMutation } = authApi;