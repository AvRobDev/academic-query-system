<template>
  <RouterView />
  <VueQueryDevtools />
</template>

<script lang="ts" setup>
import { VueQueryDevtools } from '@tanstack/vue-query-devtools';
import { useAuthStore } from './modules/auth/stores/auth.store';
import { useRoute, useRouter } from 'vue-router';
import { AuthStatus } from './modules/auth/interfaces';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

authStore.$subscribe(
  (_, state) => {
    if (route.path.includes('/login') && state.authStatus === AuthStatus.Authenticated) {
      router.replace({ name: 'profile' });
    }
  },
  {
    immediate: true,
  },
);
</script>
