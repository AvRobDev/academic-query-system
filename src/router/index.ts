import { authRoutes } from '@/modules/auth/routes';
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';

// Creando e importando las rutas de autenticación
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
    // Auth Routes
    ...authRoutes,
  ],
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const protectedRoutes = ['profile', 'grades', 'history']; // Rutas protegidas

  if (protectedRoutes.includes(to.name as string)) {
    if (!authStore.token) {
      // Si no hay token, redirige al login
      next({ name: 'login' });
    } else {
      // Permite el acceso si hay un token
      next();
    }
  } else {
    // Permite el acceso a rutas no protegidas
    next();
  }
});

export default router;
