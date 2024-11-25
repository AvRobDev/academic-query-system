import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { AuthStatus, type StudentData } from '../interfaces';
import { loginAction } from '../actions';
import { useLocalStorage } from '@vueuse/core';

export const useAuthStore = defineStore('auth', () => {
  const authStatus = ref<AuthStatus>(AuthStatus.Checking);
  const student = ref<StudentData | undefined>(); // Usamos useLocalStorage
  const token = ref(useLocalStorage('token', ''));

  const login = async (username: string, password: string) => {
    try {
      const loginResp = await loginAction(username, password);
      if (!loginResp.ok) {
        return false;
      }

      student.value = loginResp.user; // Se sincroniza automáticamente con localStorage
      token.value = loginResp.token;
      authStatus.value = AuthStatus.Authenticated;

      return true;
    } catch (error) {
      return logout();
    }
  };

  const logout = () => {
    authStatus.value = AuthStatus.Unauthenticated;
    student.value = undefined; // Se elimina automáticamente de localStorage
    token.value = '';
    return false;
  };

  // const studentMatricula = computed(() => {
  //   return student.value ? student.value.MATRICULA : undefined;
  // });

  return {
    student,
    token,
    authStatus,

    isChecking: computed(() => authStatus.value === AuthStatus.Checking),
    isAuthenticated: computed(() => authStatus.value === AuthStatus.Authenticated),
    usename: computed(() => student.value?.NOMBRES),
    // studentMatricula,

    login,
    logout,
  };
});
