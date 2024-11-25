import { authRoutes } from '@/modules/auth/routes'
// import UserProfile from '@/modules/auth/layouts/UserProfile.vue'
// import UserProfile from '@/modules/auth/layouts/UserProfile.vue'
import { createRouter, createWebHistory } from 'vue-router'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'auth',
      redirect: { name: 'login' },
      component: () => import('@/modules/auth/layouts/AuthLayout.vue'),
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import('@/modules/auth/views/LoginView.vue')

        }
      ]
    },

    // //Auth Routes
    ...authRoutes,
  ],
})

export default router
