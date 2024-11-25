<template>
  <div class="container-fluid">
    <div class="row">
      <!-- SideMenu -->
      <SideMenu />
      <div class="col-md-10">
        <div class="card mt-4">
          <div class="card-header text-highlight">
            <h3>Historial Académico</h3>
          </div>
          <!-- HistoryView -->
          <HistoryView />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SideMenu from '../components/SideMenu.vue';
import HistoryView from '../views/HistoryView.vue';
</script>

<style scoped>
body {
  background-color: #f8f9fa;
}

.sidebar {
  background-color: #eaf3ff;
  height: 100vh;
  padding-top: 20px;
}

.sidebar h5 {
  font-weight: bold;
  margin-bottom: 20px;
}

.sidebar a {
  font-size: 16px;
  font-weight: 500;
}

.plantel-name {
  font-weight: 600;
}

.card-header {
  font-weight: bold;
  font-size: 18px;
  border-bottom: 2px solid black;
  background-color: transparent;
}

.text-highlight {
  color: black;
  font-weight: bold;
}
</style>
