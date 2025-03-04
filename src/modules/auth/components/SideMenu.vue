<template>
  <div class="col-md-2 sidebar" :class="{ expanded: isExpanded }">
    <div class="text-center mb-3">
      <img
        src="/src/icons/cobach-logo.png"
        alt="Logo COBACH 217"
        class="img-fluid"
        style="max-width: 100px"
      />
    </div>
    <div class="p-1 mb-2 bg-transparent text-body"></div>
    <h5 class="sidebar-title text-center fw-bold">Plantel 217</h5>
    <h5 class="sidebar-title text-center fw-bold">Soconusco</h5>
    <div class="p-2 mb-2 bg-transparent text-body"></div>
    <ul class="nav flex-column">
      <li class="nav-item mb-3">
        <router-link class="nav-link text-dark d-flex align-items-center" to="/profile">
          <i class="bi bi-person me-2"></i> Perfil
        </router-link>
      </li>
      <li class="nav-item mb-3">
        <router-link class="nav-link text-dark d-flex align-items-center" to="/grades">
          <i class="bi bi-file-earmark-text me-2"></i> Boletas
        </router-link>
      </li>
      <li class="nav-item">
        <router-link class="nav-link text-dark d-flex align-items-center" to="/history">
          <i class="bi bi-clock-history me-2"></i> Historial Académico
        </router-link>
      </li>
      <div class="p-1 mb-2 bg-transparent text-body"></div>
      <!-- Botón de Logout -->
      <li class="nav-item">
        <button class="nav-link text-dark d-flex align-items-center" @click="logout">
          <i class="bi bi-box-arrow-left me-2"></i> Cerrar Sesión
        </button>
      </li>
    </ul>
    <button class="toggle-btn" @click="toggleSidebar" aria-label="Toggle Sidebar" v-if="isMobile">
      <i class="bi" :class="isExpanded ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useAuthStore } from '@/stores/auth.store';

// Estado reactivo
const isExpanded = ref(true);
const isMobile = ref(false);

// Instancia del store de autenticación
const authStore = useAuthStore();

// Función de logout
const logout = () => {
  authStore.clearUser();
  window.location.href = '/login';
};

const toggleSidebar = () => {
  isExpanded.value = !isExpanded.value;
};

const checkIfMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};

onMounted(() => {
  checkIfMobile();
  window.addEventListener('resize', checkIfMobile);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkIfMobile);
});
</script>

<style scoped>

@media (max-width: 768px) {
  .sidebar {
    max-height: 180px;
    overflow-y: hidden;
    transition: max-height 0.3s ease-in-out;
  }

  .sidebar.expanded {
    max-height: 480px;
    overflow-y: auto;
  }

  .toggle-btn {
    background-color: transparent;
    border: none;
    padding: 10px;
    cursor: pointer;
    position: absolute;
    top: 20px;
    right: 10px;
  }

  .toggle-btn i {
    font-size: 1.5rem;
  }

  .toggle-btn {
    display: block;
  }
}

@media (min-width: 769px) {
  .toggle-btn {
    display: none;
  }
}
</style>
