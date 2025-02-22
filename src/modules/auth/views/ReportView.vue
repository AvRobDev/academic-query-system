<template>
  <div>
    <!-- Mensajes de carga y error -->
    <div v-if="loading">Cargando datos...</div>
    <div v-else-if="error" class="text-danger">Error: {{ error }}</div>
    <div v-else>
      <div class="card" ref="reportContent">
        <div class="card-header">
          <div class="d-flex justify-content-between align-items-center">
            <!-- Nombre del estudiante -->
            <p class="mb-0">{{ academiReport.NOMBRES }} {{ academiReport.APELLIDOS }}</p>
            <!-- Botón para descargar PDF -->
            <button type="button" class="btn btn-primary w-40" @click="generatePDF">
              Descargar PDF
            </button>
            <div class="d-flex gap-2">
              <!-- Selector de grado -->
              <select v-model="selectedRank" class="form-select w-auto" aria-label="Seleccionar grado">
                <option disabled value="">Seleccionar semestre</option>
                <option v-for="rank in ranks" :key="rank" :value="rank">
                  {{ rank }}
                </option>
              </select>
              <!-- Selector de parcial -->
              <select v-model="selectedPartial" class="form-select w-auto" aria-label="Seleccionar parcial">
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
              <!-- Encabezado de la tabla con el parcial seleccionado -->
              <tr>
                <th scope="row" class="text-white" style="background-color: #adadad" colspan="4">
                  {{ selectedPartial }}
                </th>
              </tr>
              <!-- Datos de calificaciones -->
              <tr v-for="(carga, index) in filteredData" :key="index">
                <th scope="row">{{ carga.ASIGNATURA }}</th>
                <td>{{ carga.OBSERVA }}</td>
                <td>{{ carga[selectedPartial] }}</td>
                <td>{{ carga.FALTAS }}</td>
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
import autoTable from 'jspdf-autotable';

const authStore = useAuthStore();
const user = authStore.user;
const matricula = user?.MATRICULA;

const academiReport = ref<any>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const toast = useToast();
const selectedRank = ref<number | null>(null);
const selectedPartial = ref<string | null>(null);
const histories = ref<any[]>([]);
const ranks = ref([1, 2, 3, 4, 5]);
const partials = ref(['PARCIAL_1', 'PARCIAL_2', 'PARCIAL_3']);

// Mapeo de parciales a números
const partialToNumberMap = {
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
  const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  const parseDate = currentDate.toLocaleDateString('es-ES', dateOptions).toUpperCase();

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('EDUCACIÓN MEDIA SUPERIOR A DISTANCIA - COLEGIO DE BACHILLERES', 15, 15);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('EMSAD 217 SOCONUSCO  TURNO MATUTINO  CLAVE 07EMS0152W  PERIODO', 25, 25);
  doc.text(`SOCONUSCO, CHIAPAS. A ${parseDate}`, 60, 35);
  doc.setFontSize(9);
  doc.text(`CONCETRADO DE CALIFICACIONES CORRESPONDIENTE AL ${selectedPartial.value}           GRADO: ${selectedRank.value} GRUPO: ${academiReport.value.GRUPO} `, 25, 45);

  if (academiReport.value) {
    doc.setFontSize(9);
    doc.text(`Alumno: ${academiReport.value.NOMBRES} ${academiReport.value.APELLIDOS}                           Matrícula: ${matricula}`, 50, 60);
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

  doc.save(`Boleta_de_Calificaciones_${matricula}.pdf`);
};

onMounted(() => {
  if (ranks.value.length > 0 && partials.value.length > 0) {
    selectedRank.value = ranks.value[0];
    selectedPartial.value = partials.value[0];
  }
  fetchStudentData();
});
</script>
