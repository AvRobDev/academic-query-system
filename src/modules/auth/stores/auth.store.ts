import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { AuthStatus, type StudentData } from '../interfaces';
import { loginAction } from '../actions';
import { useLocalStorage } from '@vueuse/core';

export const useAuthStore = defineStore('auth', () => {
  const authStatus = ref<AuthStatus>(AuthStatus.Checking);
  const student = ref<StudentData | null>(useLocalStorage<StudentData | null>('student', null)); // Usamos useLocalStorage
  const token = ref(useLocalStorage('token', ''));

  const login = async (username: string, password: string) => {
    try {
      const loginResp = await loginAction(username, password);
      if (!loginResp.ok) {
        logout();
        return false;
      }

      student.value = loginResp.user || null; // Se sincroniza automáticamente con localStorage
      token.value = loginResp.token;
      authStatus.value = AuthStatus.Authenticated;

      return true;
    } catch (error) {
      return logout();
    }
  };

  const logout = () => {
    authStatus.value = AuthStatus.Unauthenticated;
    student.value = null; // Se elimina automáticamente de localStorage
    token.value = '';
    return false;
  };

  const studentMatricula = computed(() => {
    return student.value ? student.value.MATRICULA : null;
  });

  return {
    student,
    token,
    authStatus,

    isChecking: computed(() => authStatus.value === AuthStatus.Checking),
    isAuthenticated: computed(() => authStatus.value === AuthStatus.Authenticated),
    studentMatricula,

    login,
    logout,
  };
});
