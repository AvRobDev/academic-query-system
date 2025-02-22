<template>
  <div class="col-md-2 sidebar">
    <div class="text-center mb-3">
      <img src="/src/icons/cobach-logo.png" alt="Logo COBACH 217" class="img-fluid" style="max-width: 100px;">
    </div>
    <div class="p-1 mb-2 bg-transparent text-body"></div>
    <h5 class="sidebar-title text-center">Plantel 217</h5>
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
    </ul>
  </div>
</template>
