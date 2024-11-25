<template>
  <div class="col-md-2 sidebar">
    <h5 class="text-primary text-center">COBACH 217</h5>
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
    </ul>
  </div>
</template>
