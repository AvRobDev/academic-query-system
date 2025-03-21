<template>
  <div>
    <!-- Mensajes de carga y error -->
    <div v-if="loading">Cargando datos...</div>
    <div v-else-if="error" class="text-danger">Error: {{ error }}</div>
    <div v-else>
      <div class="card" ref="reportContent">
        <div class="card-header">
          <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
            <p class="mb-2 mb-md-0 text-center text-md-start">
              {{ academiReport.NOMBRES }} {{ academiReport.APELLIDOS }}
            </p>
            <button type="button" class="btn btn-secondary w-40" @click="generatePDF">
              Descargar PDF
            </button>
            <div class="d-flex flex-column flex-sm-row gap-2">
              <select
                v-model="selectedRank"
                class="form-select w-auto"
                aria-label="Seleccionar semestre"
              >
                <option disabled value="">Seleccionar semestre</option>
                <option v-for="rank in ranks" :key="rank" :value="rank">
                  {{ rank }}
                </option>
              </select>
              <select
                v-model="selectedPartial"
                class="form-select w-auto"
                aria-label="Seleccionar parcial"
              >
                <option disabled value="">Seleccionar parcial</option>
                <option v-for="partial in partials" :key="partial" :value="partial">
                  {{ partial.replace('_', ' ') }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table border mb-4">
              <thead>
                <tr>
                  <th scope="col" class="text-center">Asignatura</th>
                  <th scope="col" class="text-center">Estatus</th>
                  <th scope="col" class="text-center">Calificación</th>
                  <th scope="col" class="text-center">Faltas</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th
                    scope="row"
                    class="text-white bg-secondary"
                    style="background-color: #adadad"
                    colspan="4"
                  >
                    {{ selectedPartial.replace('_', ' ') }}
                  </th>
                </tr>
                <tr v-for="(carga, index) in filteredData" :key="index">
                  <th scope="row">{{ carga.ASIGNATURA }}</th>
                  <td class="text-center">{{ carga.OBSERVA }}</td>
                  <td class="text-center">{{ carga[selectedPartial] }}</td>
                  <td class="text-center">{{ carga.FALTAS }}</td>
                </tr>
              </tbody>
            </table>
            <div class="text-center">
          <h5 class="text-secondary">Promedio Final: {{ scores.PROMEDIO_FINAL }}</h5>
        </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

@media (max-width: 576px) {
  .form-select {
    width: 100% !important;
  }
}
</style>

<script lang="ts" setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useToast } from 'vue-toastification';
import { getAcademicReport, getHistories } from '@/api/get-report-card';
import { useAuthStore } from '@/stores/auth.store';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const authStore = useAuthStore();
const user = authStore.user;
const matricula = user?.MATRICULA;

const academiReport = ref<any>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const toast = useToast();
const selectedRank = ref<number | null>(null);
const selectedPartial = ref<string | any>();
const histories = ref<any[]>([]);
const scores = ref<any>();
const ranks = ref([1, 2, 3, 4, 5, 6]);
const partials = ref(['PARCIAL_1', 'PARCIAL_2', 'PARCIAL_3']);


// Mapeo de parciales a números
type partialToNumberMap = {
  [key: string]: number;
};

const partialToNumberMap: partialToNumberMap = {
  PARCIAL_1: 1,
  PARCIAL_2: 2,
  PARCIAL_3: 3,
};

// Obtiene datos del estudiante desde la API
const fetchStudentData = async () => {
  loading.value = true;
  error.value = null;
  try {
    const data = await getAcademicReport(matricula);
    academiReport.value = data;
  } catch (err) {
    toast.error('Error con la conexión a la API');
    error.value = 'Periodo académico no completado o no existe el registro.';
  } finally {
    loading.value = false;
  }
};

// Obtiene el historial académico filtrado por grado y parcial
const fetchHistories = async (rank: number, partial: string) => {
  try {
    const partialNumber = partialToNumberMap[partial];
    const data = await getHistories(matricula, rank, partialNumber);
    histories.value = data.HISTORIAL;
    scores.value = data.DETALLES; //Constante para jalar promedio
  } catch (err) {
    toast.error('Periodo académico no completado o no existe el registro.');
  }
};

// Observa cambios en los selectores y actualiza los datos
watch([selectedRank, selectedPartial], ([newRank, newPartial]) => {
  if (newRank !== null && newPartial !== null) {
    fetchHistories(newRank, newPartial);
  }
});

// Filtra los datos para la tabla
const filteredData = computed(() => {
  if (selectedRank.value === null || selectedPartial.value === null) {
    return [];
  }
  return histories.value.map((historial) => ({
    ...historial,
    FALTAS: historial.FALTAS || 0,
  }));
});

// Genera el PDF con los datos de la boleta
const generatePDF = () => {
  const doc = new jsPDF();
  const currentDate = new Date();
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };
  const parseDate = currentDate.toLocaleDateString('es-ES', dateOptions).toUpperCase();

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('EDUCACIÓN MEDIA SUPERIOR A DISTANCIA - COLEGIO DE BACHILLERES', 15, 15);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('EMSAD 217 SOCONUSCO  TURNO MATUTINO  CLAVE 07EMS0152W', 53, 25);
  doc.text(`SOCONUSCO, CHIAPAS.  A ${parseDate}`, 60, 35);
  doc.setFontSize(9);
  doc.text(
    `CONCENTRADO DE CALIFICACIONES CORRESPONDIENTE AL ${selectedPartial.value?.replace('_', ' ')}           GRADO: ${selectedRank.value} GRUPO: ${academiReport.value.GRUPO} `,
    25,
    45,
  );

  if (academiReport.value) {
    doc.setFontSize(9);
    doc.text(
      `Alumno: ${academiReport.value.NOMBRES} ${academiReport.value.APELLIDOS}                           Matrícula: ${matricula}`,
      50,
      60,
    );
  }

  autoTable(doc, {
    startY: 70,
    head: [['Asignatura', 'Estatus', 'Calificación', 'Faltas']],
    body: filteredData.value.map((carga) => [
      carga.ASIGNATURA,
      carga.OBSERVA,
      carga[selectedPartial.value],
      carga.FALTAS,
    ]),
  });

  doc.text(`PROMEDIO FINAL: ${scores.value.PROMEDIO_FINAL}`, 90, 150);
  doc.save(`${matricula}_Boleta_de_Calificaciones.pdf`);
};

onMounted(() => {
  if (ranks.value.length > 0 && partials.value.length > 0) {
    selectedRank.value = ranks.value[0];
    selectedPartial.value = partials.value[0];
  }
  fetchStudentData();
});
</script>
