import { defineStore } from 'pinia';
import { loginAction } from '@/modules/auth/actions';
import type { StudentData } from '@/modules/auth/interfaces';

// Almacenamiento del estado de autenticación
interface AuthState {
  user: StudentData | null;
  token: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
  }),
  actions: {
    setUser(user: StudentData) {
      this.user = user;
      localStorage.setItem('user', JSON.stringify(user));
    },
    setToken(token: string) {
      this.token = token;
      localStorage.setItem('token', token);
    },
    // logout funcion
    clearUser() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
    restoreAuthState() {
      const user = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      if (user && token) {
        this.user = JSON.parse(user);
        this.token = token;
      }
    },
    async login(username: string, password: string): Promise<boolean> {
      try {
        const result = await loginAction(username, password);
        if (result.ok) {
          this.setUser(result.user);
          this.setToken(result.token);
          return true;
        } else {
          return false;
        }
      } catch (error) {
        console.error('Error during login:', error);
        return false;
      }
    },
  },
});
