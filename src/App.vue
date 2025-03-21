<template>
  <RouterView />
  <VueQueryDevtools />
</template>

<script lang="ts" setup>
import { VueQueryDevtools } from '@tanstack/vue-query-devtools';
import { useAuthStore } from './stores/auth.store';
import { useRoute, useRouter } from 'vue-router';
import { onMounted } from 'vue';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

onMounted(() => {
  authStore.restoreAuthState();
});

// Suscripción a cambios en el store
authStore.$subscribe(
  (_, state) => {
    // Verifica si el usuario está autenticado (user y token no son null)
    const isAuthenticated = state.user !== null && state.token !== null;

    // Redirige si el usuario está autenticado y está en la página de login
    if (route.path.includes('/login') && isAuthenticated) {
      router.replace({ name: 'profile' });
    }

    // (Opcional) Redirige si el usuario no está autenticado y no está en la página de login
    if (!isAuthenticated && !route.path.includes('/login')) {
      router.replace({ name: 'login' });
    }
  },
  {
    immediate: true, // Ejecuta la suscripción inmediatamente
  },
);
</script>
