'use client'

import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from './baseApi'

export const appApi = createApi({
  reducerPath: 'appApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Admin', 'Policy', 'User', 'Auth', 'Toolkit'],
  endpoints: builder => ({
    adminLogin: builder.mutation({
      query: body => ({ url: '/public/api/v1/admin/login', method: 'POST', data: body })
    }),
    adminProfile: builder.query({
      query: () => ({ url: '/api/v1/admin/get-profile', method: 'GET' }),
      providesTags: ['Auth']
    }),
    adminUpdateProfile: builder.mutation({
      query: body => ({ url: '/api/v1/admin/update-profile', method: 'POST', data: body }),
      invalidatesTags: ['Auth']
    }),
    adminUpdatePassword: builder.mutation({
      query: body => ({ url: '/api/v1/admin/update-password', method: 'POST', data: body }),
      invalidatesTags: ['Auth']
    }),
    adminDashboard: builder.query({
      query: () => ({ url: '/api/v1/admin/dashboards', method: 'GET' }),
      providesTags: ['Admin']
    }),
    adminList: builder.query({
      query: params => ({ url: '/api/v1/admin/admin-list', method: 'GET', params }),
      providesTags: ['Admin']
    }),
    adminToolkit: builder.query({
      query: () => ({ url: '/api/v1/admin/toolkit', method: 'GET' }),
      providesTags: ['Toolkit']
    }),
    adminDetails: builder.query({
      query: secretId => ({ url: '/api/v1/admin/details', method: 'POST', data: { secretId } }),
      providesTags: ['Admin']
    }),
    updateAdmin: builder.mutation({
      query: body => ({ url: '/api/v1/admin/update-admin', method: 'POST', data: body }),
      invalidatesTags: ['Admin', 'Toolkit']
    }),
    deleteAdmin: builder.mutation({
      query: body => ({ url: '/api/v1/admin/delete-admin', method: 'POST', data: body }),
      invalidatesTags: ['Admin', 'Toolkit']
    }),
    registerAdmin: builder.mutation({
      query: body => ({ url: '/api/v1/admin/register', method: 'POST', data: body }),
      invalidatesTags: ['Admin', 'Toolkit']
    }),
    policyByType: builder.query({
      query: type => ({ url: `/public/api/v1/policies/by-type/${type}`, method: 'GET' }),
      providesTags: (result, error, type) => [{ type: 'Policy', id: type }]
    }),
    policiesList: builder.query({
      query: () => ({ url: '/api/v1/policies', method: 'GET' }),
      providesTags: ['Policy']
    }),
    policyUpdate: builder.mutation({
      query: body => ({ url: `/api/v1/policies/${body.id}`, method: 'PUT', data: { type: body.type, content: body.content } }),
      invalidatesTags: (result, error, body) => ['Policy', { type: 'Policy', id: body?.type }]
    }),
    userList: builder.query({
      query: params => ({ url: '/api/v1/admin/user-list', method: 'GET', params }),
      providesTags: ['User']
    }),
    deleteUser: builder.mutation({
      query: body => ({ url: '/api/v1/admin/delete-user', method: 'POST', data: body }),
      invalidatesTags: ['User', 'Admin', 'Toolkit']
    }),
    deleteUserEmailOtp: builder.mutation({
      query: body => ({ url: '/public/api/v1/user/delete-user', method: 'POST', data: body })
    }),
    deleteUserEmailVerifyOtp: builder.mutation({
      query: body => ({ url: '/public/api/v1/user/delete-user-verify-otp', method: 'POST', data: body })
    }),
    authLogoutAll: builder.mutation({
      query: () => ({ url: '/api/v1/auth/logout-all', method: 'POST' })
    })
  })
})

export const {
  useAdminLoginMutation,
  useAdminProfileQuery,
  useAdminUpdateProfileMutation,
  useAdminUpdatePasswordMutation,
  useAdminDashboardQuery,
  useAdminListQuery,
  useAdminToolkitQuery,
  useAdminDetailsQuery,
  useUpdateAdminMutation,
  useDeleteAdminMutation,
  useRegisterAdminMutation,
  usePolicyByTypeQuery,
  usePoliciesListQuery,
  usePolicyUpdateMutation,
  useUserListQuery,
  useLazyUserListQuery,
  useDeleteUserMutation,
  useDeleteUserEmailOtpMutation,
  useDeleteUserEmailVerifyOtpMutation,
  useAuthLogoutAllMutation
} = appApi
