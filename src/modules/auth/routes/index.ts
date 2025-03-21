
export const authRoutes = [
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/modules/auth/layouts/UserProfile.vue'),
  },
  {
    path: '/grades',
    name: 'grades',
    component: () => import('@/modules/auth/layouts/RepordCard.vue'),

  },
  {
    path: '/history',
    name: 'history',
    component: () => import('@/modules/auth/layouts/AcademicHistory.vue'),
  },

]

