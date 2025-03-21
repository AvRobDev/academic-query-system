<template>
  <div>
    <div v-if="loading">Cargando datos...</div>
    <div v-else>
      <!-- Selector de semestre (rank) -->
      <div class="p-2 mb-1">
        <label for="rank-select" class="form-label">Seleccionar semestre</label>
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

      <!-- Mensaje de error -->
      <div v-if="error" class="error-container">
        <button @click="reloadPage" class="btn btn-retry" aria-label="Regresar">
          <i class="bi bi-arrow-clockwise"></i>
          <span>{{ error }}</span>
        </button>
      </div>

      <!-- Card body -->
      <div v-if="!error" class="card-body col-md-12">
        <h6 class="card-title text-secondary"></h6>
        <div class="table-responsive">
          <table class="table table-bordered table-striped table-hover">
            <thead class="table">
              <tr>
                <th scope="col" class="text-center">Asignatura</th>
                <th scope="col" class="text-center">Estatus</th>
                <th scope="col" class="text-center">Parcial 1</th>
                <th scope="col" class="text-center">Parcial 2</th>
                <th scope="col" class="text-center">Parcial 3</th>
                <th scope="col" class="text-center">Observaciones</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="text-white bg-secondary" colspan="6">
                  SEMESTRE {{ selectedRank }}
                </td>
              </tr>
              <tr v-for="(carga, index) in academicHistory" :key="index">
                <td>{{ carga.ASIGNATURA }}</td>
                <td class="text-center">{{ carga.OBSERVA || 'N/A' }}</td>
                <td class="text-center">{{ carga.PARCIAL_1 || 'Sin datos' }}</td>
                <td class="text-center">{{ carga.PARCIAL_2 || 'Sin datos' }}</td>
                <td class="text-center">{{ carga.PARCIAL_3 || 'Sin datos' }}</td>
                <td class="text-center">{{ carga.OBSERVA || 'Sin observaciones' }}</td>
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

const reloadPage = () => {
  window.location.reload();
};

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
  } catch (err) {
    toast.error(' Periodo académico no completado o no existe el registro.');
    error.value = ' Periodo académico no completado o no existe el registro.';
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
    selectedRank.value = ranks.value[0];
  }
});
</script>

<style scoped>
/* Estilos para el contenedor del error */
.error-container {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff; /* Fondo rojo claro similar a la imagen */
  border: 1px solid #ffffff;
  border-radius: 4px;
  padding: 10px 15px;
  margin: 1rem 0;
  color: #721c24; /* Color de texto rojo oscuro */
}

/* Estilo para el mensaje de error */
.error-message {
  margin-right: 15px; /* Espacio entre el mensaje y el botón */
  font-weight: 500;
}

/* Estilo para el botón */
.btn-retry {
  background-color: #dc3545; /* Color rojo similar al de la imagen */
  border: none;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-retry:hover {
  background-color: #c82333; /* Tono más oscuro al pasar el mouse */
}
</style>
