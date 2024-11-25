<template>
  <div class="card shadow">
    <div class="card-header text-black">
      <div class="d-flex justify-content-between align-items-center">
        <h6 class="mb-0">
          Boleta de calificaciones correspondientes al semestral: {{ student?.GRADO }}
          {{ student?.GRUPO }}
        </h6>
        <select class="form-select form-select-sm w-auto" aria-label="Seleccionar semestre">
          <option selected>Seleccionar semestre</option>
          <option value="1">1°</option>
          <option value="2">2°</option>
        </select>
      </div>
    </div>
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
              Estatus academico - {{ student.STATUSA }}
            </td>
          </tr>
          <tr v-for="(carga, index) in student?.CARGA" :key="index">
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
        <h5 class="text-secondary">Promedio Final: {{ student?.DETALLES.PROMEDIO_FINAL }}</h5>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getAcademicHistory } from '@/api/get-academic-history';
import { useQuery } from '@tanstack/vue-query';

const { data: student } = useQuery({
  queryKey: ['student'],
  queryFn: () => getAcademicHistory(),
  staleTime: 1000 * 120,
});

console.log('Carga', student.value);
</script>
