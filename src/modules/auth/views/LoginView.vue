<template>
  <div class="d-flex justify-content-center align-items-center vh-100">
    <div class="card shadow" style="width: 400px">
      <img :src="logo" class="card-img-top p-3" alt="Logo de la institución" />
      <div class="card-body">
        <h5 class="card-title text-center fw-bold">Iniciar sesión</h5>
        <p class="text-center">Accede con tu CURP y matrícula para continuar</p>
        <form @submit.prevent="onLogin">
          <div class="form-floating mb-3">
            <input
              v-model="loginForm.username"
              ref="usernameInputRef"
              type="text"
              id="username"
              name="username"
              class="form-control"
              placeholder="CURP"
            />
            <label for="username">CURP</label>
          </div>
          <div class="form-floating mb-3">
            <input
              v-model="loginForm.password"
              ref="passwordInputRef"
              type="password"
              class="form-control"
              id="password"
              name="password"
              placeholder="Matrícula"
            />
            <label for="password">Matrícula</label>
          </div>
          <div class="text-center">
            <button type="submit" class="btn btn-primary w-50">Ingresar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import logo from '@/icons/cobach-logo.png';
import { reactive, ref } from 'vue';
import { useAuthStore } from '../stores/auth.store';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const toast = useToast();
const usernameInputRef = ref<HTMLInputElement | null>(null);
const passwordInputRef = ref<HTMLInputElement | null>(null);
const router = useRouter();

const loginForm = reactive({
  username: '',
  password: '',
});

const onLogin = async () => {
  if (loginForm.username === '') {
    return usernameInputRef.value?.focus();
  }

  if (loginForm.password === '') {
    return passwordInputRef.value?.focus();
  }

  const ok = await authStore.login(loginForm.username, loginForm.password); // Llama a la acción `login` del store

  if (ok) {
    toast.success('Inicio de sesión correcto');
    router.push({ name: 'profile' });
  } else {
    toast.error('Usuario o Contraseña incorrectos');
  }
};
</script>

<style scoped>
.d-flex {
  background-color: #e0f2ff;
}

.card-img-top {
  width: 50%;
  margin: 0 auto;
  display: block;
}
</style>
