<template>
  <div>
    <div v-if="loading">Cargando datos...</div>
    <div v-else-if="error" class="text-danger">Error: {{ error }}</div>
    <div v-else>
      <div class="card" ref="reportContent">
        <div class="card-header">
          <div class="d-flex justify-content-between align-items-center">
            <p class="mb-0">{{ academiReport.NOMBRES }} {{ academiReport.APELLIDOS }}</p>
            <button type="button" class="btn btn-primary w-40" @click="generatePDF">
              Descargar PDF
            </button>
            <div class="d-flex gap-2">
              <!-- Selector de grado (rank) -->
              <select
                v-model="selectedRank"
                class="form-select w-auto"
                aria-label="Seleccionar grado"
              >
                <option disabled value="">Seleccionar grado</option>
                <option v-for="rank in ranks" :key="rank" :value="rank">
                  {{ rank }}
                </option>
              </select>
              <!-- Selector de parcial (partial) -->
              <select
                v-model="selectedPartial"
                class="form-select w-auto"
                aria-label="Seleccionar parcial"
              >
                <option disabled value="">Seleccionar parcial</option>
                <option v-for="partial in partials" :key="partial" :value="partial">
                  {{ partial }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <div class="card-body">
          <h6 class="card-title">Historial de las calificaciones</h6>
          <table class="table border mb-4">
            <thead>
              <tr>
                <th scope="col">Asignatura</th>
                <th scope="col">Estatus</th>
                <th scope="col">Calificación</th>
                <th scope="col">Faltas</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row" class="text-white" style="background-color: #adadad" colspan="4">
                  {{ selectedPartial }}
                </th>
              </tr>
              <tr v-for="(carga, index) in filteredData" :key="index">
                <th scope="row">{{ carga.ASIGNATURA }}</th>
                <td>{{ carga.OBSERVA }}</td>
                <td>{{ carga[selectedPartial] }}</td>
                <td>{{ carga.FALTAS }}</td>
                <!-- Asegúrate de que este campo exista en la API -->
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useToast } from 'vue-toastification';
import { getAcademicReport, getHistories } from '@/api/get-report-card';
import { useAuthStore } from '@/modules/auth/stores/auth.store';
import jsPDF from 'jspdf';

const authStore = useAuthStore();
const user = authStore.user;
const matricula = user?.MATRICULA;

const academiReport = ref<any>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const toast = useToast();
const selectedRank = ref<number | null>(null); // Grado seleccionado
const selectedPartial = ref<string | null>(null); // Parcial seleccionado
const histories = ref<any[]>([]); // Almacena los datos de la API

// Opciones para los selectores
const ranks = ref([1, 2, 3, 4, 5]); // Grados disponibles
const partials = ref(['PARCIAL_1', 'PARCIAL_2', 'PARCIAL_3']); // Parciales disponibles

// Obtener datos del estudiante (desde la API)
const fetchStudentData = async () => {
  loading.value = true;
  error.value = null;

  try {
    const data = await getAcademicReport(matricula);
    academiReport.value = data;
  } catch (err) {
    toast.error('Error con la conexión a la API');
    error.value = 'No se pudo obtener el historial académico.';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

// Obtener los historiales según el grado y parcial seleccionados
const fetchHistories = async (rank: number) => {
  try {
    const data = await getHistories(matricula, rank);
    histories.value = data.HISTORIAL; // Almacena los datos del historial
  } catch (err) {
    toast.error('Error al obtener el historial');
    console.error(err);
  }
};

// Observar cambios en el grado o parcial seleccionado
watch([selectedRank, selectedPartial], ([newRank, newPartial]) => {
  if (newRank !== null && newPartial !== null) {
    fetchHistories(newRank); // Realiza la consulta a la API con el grado seleccionado
  }
});

// Filtrar los datos según el grado y parcial seleccionados
const filteredData = computed(() => {
  if (selectedRank.value === null || selectedPartial.value === null) {
    return []; // No mostrar datos si no se selecciona un grado o parcial
  }
  return histories.value.map((historial) => ({
    ...historial,
    FALTAS: 0, // Asegúrate de que este campo exista en la API o ajústalo según sea necesario
  }));
});

onMounted(fetchStudentData);
</script>
