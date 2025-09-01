import { api } from './api';
import { 
  ApplicationUser, 
  ProfileResponse, 
  UpdateProfileImageRequest, 
  UpdateProfileImageResponse 
} from '@/store/types/user';

export const profileAPI = api.injectEndpoints({
  endpoints: (build) => ({
    getProfile: build.query<ApplicationUser, void>({
      query: () => ({
        url: '/auth/profile',
        method: 'GET',
      }),
      providesTags: ['Profile'],
      // Forzar que siempre se ejecute la query
      keepUnusedDataFor: 0,
    }),
    
    updateProfileImage: build.mutation<UpdateProfileImageResponse, UpdateProfileImageRequest>({
      query: (body) => ({
        url: '/auth/profile/image',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Profile'],
    }),
    
    updateProfile: build.mutation<ApplicationUser, Partial<ApplicationUser>>({
      query: (body) => ({
        url: '/auth/profile',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Profile'],
    }),
  }),
});

export const { 
  useGetProfileQuery, 
  useLazyGetProfileQuery,
  useUpdateProfileImageMutation,
  useUpdateProfileMutation 
} = profileAPI;
