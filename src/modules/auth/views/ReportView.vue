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
            <select class="form-select w-auto" aria-label="Default select example">
              <option selected>Seleccionar periodo</option>
              <option value="0">1°</option>
            </select>
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
                  1° parcial
                </th>
              </tr>
              <tr v-for="(carga, index) in academiReport?.CARGA" :key="index">
                <th scope="row">{{ carga.DATOS_MATERIA.ASIGNATURA }}</th>
                <td>N</td>
                <td>{{ carga.PARCIAL_1 }}</td>
                <td>{{ carga.FALTAS_1 }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { getAcademicReport } from '@/api/get-report-card';
import { useAuthStore } from '@/modules/auth/stores/auth.store';
import jsPDF from 'jspdf';

const authStore = useAuthStore();
const user = authStore.user; // Accede a los datos del usuario desde el store
const matricula = user?.MATRICULA;

const academiReport = ref(null);
const student = ref(null);
const loading = ref(true);
const error = ref<string | null>(null);
const toast = useToast();

// Obtener datos del estudiante (desde la API)
const fetchStudentData = async () => {
  loading.value = true;
  error.value = null;

  try {
    const data = await getAcademicReport(matricula);
    academiReport.value = data;
    console.log(data);
  } catch (err) {
    toast.error('Error con la conexión a la API');
    error.value = 'No se pudo obtener el historial académico.';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchStudentData);

// Generar PDF (No esta configurado aun para obtener la informacion de la API)
const generatePDF = () => {
  if (!academiReport.value) return;

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Configuración inicial
  const marginX = 10;
  let cursorY = 10;

  // Título del documento
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(16);
  pdf.text('Historial Académico', marginX, cursorY);
  cursorY += 10;

  // Información del estudiante
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Nombre: ${student.value.NOMBRES} ${student.value.APELLIDOS}`, marginX, cursorY);
  cursorY += 6;
  pdf.text(`Matrícula: ${student.value.MATRICULA}`, marginX, cursorY);
  cursorY += 6;
  pdf.text(`CURP: ${student.value.CURP}`, marginX, cursorY);
  cursorY += 10;

  // Tabla de calificaciones
  pdf.setFont('helvetica', 'bold');
  pdf.text('Calificaciones:', marginX, cursorY);
  cursorY += 6;

  const tableHeaders = [
    'Asignatura',
    'Parcial 1',
    'Parcial 2',
    'Parcial 3',
    'Promedio',
    'Observaciones',
  ];
  const columnWidths = [50, 25, 25, 25, 25, 40];

  // Dibujar encabezados
  let startX = marginX;
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  tableHeaders.forEach((header, index) => {
    pdf.text(header, startX + 2, cursorY);
    startX += columnWidths[index];
  });
  cursorY += 6;

  // Dibujar contenido
  pdf.setFont('helvetica', 'normal');
  student.value.CARGA.forEach((carga) => {
    startX = marginX;
    const row = [
      carga.DATOS_MATERIA.ASIGNATURA,
      carga.PARCIAL_1,
      carga.PARCIAL_2,
      carga.PARCIAL_3,
      carga.PROMEDIO.toFixed(2),
      carga.OBSERVA,
    ];

    row.forEach((cell, index) => {
      pdf.text(String(cell), startX + 2, cursorY);
      startX += columnWidths[index];
    });
    cursorY += 6;

    // Salto de página si es necesario
    if (cursorY > 280) {
      pdf.addPage();
      cursorY = 10;
    }
  });

  // Promedio final
  cursorY += 10;
  pdf.setFont('helvetica', 'bold');
  pdf.text(`Promedio Final: ${student.value.DETALLES.PROMEDIO_FINAL.toFixed(2)}`, marginX, cursorY);

  // Descargar PDF
  pdf.save(`historial_academico_${student.value.MATRICULA}.pdf`);
};
</script>
