<template>
  <div>
    <div v-if="loading">Cargando datos...</div>
    <div v-else-if="error" class="text-danger">Error: {{ error }}</div>
    <div v-else>
      <div class="col-md-10">
        <h5>Concentrado de calificaciones correspondiente al semestre {{ user?.GRADO }}</h5>
      </div>
      <!-- Selector de semestre (rank) -->
      <div class="mb-3">
        <label for="rank-select" class="form-label">Seleccionar semestre:</label>
        <select
          id="rank-select"
          v-model="selectedRank"
          class="form-select w-auto"
          aria-label="Seleccionar semestre"
        >
          <option disabled value="">Seleccionar semestre</option>
          <option v-for="rank in ranks" :key="rank" :value="rank">
            {{ rank }}
          </option>
        </select>
      </div>
      <div class="card-body col-md-12">
        <h6 class="card-title text-secondary">Semestre B 2024</h6>
        <div class="table-responsive">
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
                  Estatus académico - {{ user?.STATUSA }}
                </td>
              </tr>
              <tr v-for="(carga, index) in academicHistory" :key="index">
                <td>{{ carga.ASIGNATURA }}</td>
                <td class="text-center">{{ carga.OBSERVA || 'N/A' }}</td>
                <td class="text-center">{{ carga.PARCIAL_1 || 'Sin datos' }}</td>
                <td class="text-center">{{ carga.PARCIAL_2 || 'Sin datos' }}</td>
                <td class="text-center">{{ carga.PARCIAL_3 || 'Sin datos' }}</td>
                <td>{{ carga.OBSERVA || 'Sin observaciones' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="text-center">
          <h5 class="text-secondary">Promedio Final: {{ averageFinal }}</h5>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useAuthStore } from '@/stores/auth.store';
import { getHistoriesSemiannual } from '@/api/get-academic-history'; // Asegúrate de importar la función correcta
import { useToast } from 'vue-toastification';

const authStore = useAuthStore();
const user = authStore.user;
const matricula = user?.MATRICULA;

const academicHistory = ref<any[]>([]); // Almacena los datos del historial
const loading = ref(true);
const error = ref<string | null>(null);
const toast = useToast();
const selectedRank = ref<number | null>(null); // Semestre seleccionado

// Opciones para el selector de semestre
const ranks = ref([1, 2, 3, 4, 5, 6]); // Semestres disponibles

// Obtener datos del historial semestral (desde la API)
const fetchHistoriesSemiannual = async (rank: number) => {
  loading.value = true;
  error.value = null;

  try {
    if (!matricula) {
      throw new Error('No se pudo obtener la matrícula del usuario.');
    }

    const data = await getHistoriesSemiannual(matricula, rank);
    academicHistory.value = data.HISTORIAL; // Almacena los datos del historial
    console.log('Datos recibidos:', data);
  } catch (err) {
    toast.error('Error con la conexión a la API');
    error.value = 'Periodo académico no completado o no existe el registro.';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

// Observar cambios en el semestre seleccionado
watch(selectedRank, (newRank) => {
  if (newRank !== null) {
    fetchHistoriesSemiannual(newRank); // Realiza la consulta a la API con el semestre seleccionado
  }
});

// Calcular el promedio final
const averageFinal = computed(() => {
  if (academicHistory.value.length === 0) return 0;

  const total = academicHistory.value.reduce((sum, carga) => {
    return sum + parseFloat(carga.PROMEDIO || 0);
  }, 0);

  return (total / academicHistory.value.length).toFixed(2); // Promedio con 2 decimales
});

onMounted(() => {
  // Inicializar con el primer semestre si es necesario
  if (ranks.value.length > 0) {
    selectedRank.value = ranks.value[2];
  }
});
</script>
