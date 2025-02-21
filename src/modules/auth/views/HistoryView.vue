<template>
  <div>
    <div v-if="loading">Cargando datos...</div>
    <div v-else-if="error" class="text-danger">Error: {{ error }}</div>
    <div v-else>
      <div class="col-md-10">
        <h5>Concentrado de calificaciones correspondiente al semestral {{ user?.GRADO }}</h5>
      </div>
      <!-- Aquí puedes renderizar el resto de los datos como en tu tabla -->
      <div class="card-body">
        <h6 class="card-title text-secondary">Semestre B 2024</h6>
        <table class="table table-bordered table-striped table-hover">
          <thead class="table">
            <tr>
              <th scope="col">Asignatura</th>
              <th scope="col" class="text-center">Estatus</th>
              <th scope="col" class="text-center">Parcial 1</th>
              <th scope="col" class="text-center">Parcial 2</th>
              <th scope="col" class="text-center">Parcial 3</th>
              <th scope="col">Observaciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="text-white bg-secondary" colspan="6">
                Estatus academico - {{ user?.STATUSA }}
              </td>
            </tr>
            <tr v-for="(carga, index) in academicHistory?.CARGA" :key="index">
              <td>{{ carga.DATOS_MATERIA.ASIGNATURA }}</td>
              <td class="text-center">{{ carga.STATUSA || 'N/A' }}</td>
              <td class="text-center">{{ carga.PARCIAL_1 || 'Sin datos' }}</td>
              <td class="text-center">{{ carga.PARCIAL_2 || 'Sin datos' }}</td>
              <td class="text-center">{{ carga.PARCIAL_3 || 'Sin datos' }}</td>
              <td>{{ carga.OBSERVA || 'Sin observaciones' }}</td>
            </tr>
          </tbody>
        </table>
        <div class="text-center">
          <h5 class="text-secondary">
            Promedio Final: {{ academicHistory?.DETALLES.PROMEDIO_FINAL }}
          </h5>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/modules/auth/stores/auth.store';
import { getAcademicHistory } from '@/api/get-academic-history';
import { useToast } from 'vue-toastification';

const authStore = useAuthStore();
const user = authStore.user;
const matricula = user?.MATRICULA;

const academicHistory = ref(null);
const loading = ref(true);
const error = ref<string | null>(null);
const toast = useToast();

// Obtener datos del estudiante (desde la API)
const fetchAcademicHistory = async () => {
  loading.value = true;
  error.value = null;

  try {
    if (!matricula) {
      throw new Error('No se pudo obtener la matrícula del usuario.');
    }

    const data = await getAcademicHistory(matricula);
    academicHistory.value = data;
  } catch (err) {
    toast.error('Error con la conexión a la API');
    error.value = 'No se pudo obtener el historial académico.';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchAcademicHistory);
</script>
