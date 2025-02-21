import { authRoutes } from '@/modules/auth/routes';
import { createRouter, createWebHistory } from 'vue-router';

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

// Guard para redirigir al login solo en rutas protegidas
router.beforeEach((to, from, next) => {
  // Lista de rutas protegidas (aquí puedes agregar las rutas que requieran redirección)
  const protectedRoutes = ['profile', 'grades', 'history']; // Nombres de las rutas protegidas

  // Verifica si la ruta actual es una ruta protegida
  if (protectedRoutes.includes(to.name as string)) {
    // Redirige al login si está en una ruta protegida
    next({ name: 'login' });
  } else {
    // Permite la navegación normal si no es una ruta protegida
    next();
  }
});

export default router;
