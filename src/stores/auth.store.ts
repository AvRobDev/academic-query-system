// stores/auth.store.ts
import { defineStore } from 'pinia';
import { loginAction } from '@/modules/auth/actions'; // Importa la función de inicio de sesión
import type { StudentData } from '@/modules/auth/interfaces'; // Asegúrate de importar la interfaz correcta

interface AuthState {
  user: StudentData | null; // Cambia User por StudentData
  token: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
  }),
  actions: {
    setUser(user: StudentData) { // Cambia User por StudentData
      this.user = user;
      localStorage.setItem('user', JSON.stringify(user)); // Almacena los datos del usuario en localStorage
    },
    setToken(token: string) {
      this.token = token;
      localStorage.setItem('token', token); // Almacena el token en localStorage
    },
    clearUser() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('user'); // Elimina los datos del usuario de localStorage
      localStorage.removeItem('token'); // Elimina el token de localStorage
    },
    restoreAuthState() {
      // Restaura el estado del usuario desde localStorage al cargar la aplicación
      const user = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      if (user && token) {
        this.user = JSON.parse(user);
        this.token = token;
      }
    },
    async login(username: string, password: string): Promise<boolean> {
      try {
        const result = await loginAction(username, password); // Llama a la función de inicio de sesión
        if (result.ok) {
          this.setUser(result.user); // Actualiza el estado del usuario
          this.setToken(result.token); // Actualiza el token
          return true; // Indica que el inicio de sesión fue exitoso
        } else {
          return false; // Indica que el inicio de sesión falló
        }
      } catch (error) {
        console.error('Error during login:', error);
        return false; // Indica que el inicio de sesión falló
      }
    },
  },
});
