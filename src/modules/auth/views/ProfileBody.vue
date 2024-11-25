<template>
  <div class="card-body">
    <h1 class="text-center"><strong>COLEGIO DE BACHILLERES DE CHIAPAS No. 217</strong></h1>
    <h3 class="plantel-name text-center">SOCONUSCO, CHIAPAS</h3>
    <div class="p-4 mb-2 bg-transparent text-body"></div>
    <div class="row">
      <div class="col-md-6 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="300"
          height="300"
          fill="currentColor"
          class="bi bi-person-circle"
          viewBox="0 0 16 16"
        >
          <path
            d="M13.468 12.37C12.758 11.226 11.28 10.5 8 10.5s-4.758.726-5.468 1.87A7 7 0 1 1 13.468 12.37zM8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14z"
          />
          <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
        </svg>
        <div class="p-4 mb-2 bg-transparent text-body"></div>
        <h3><strong>Semestre:</strong> {{ student?.GRADO || 'Cargando...' }}</h3>
        <h3><strong>Nombre:</strong> {{ student?.GRUPO }}</h3>
      </div>
      <div class="col-md-6 my-4 text-center">
        <h2><strong>Nombre:</strong></h2>
        <h3>{{ student?.NOMBRES || 'Cargando..' }} {{ student?.APELLIDOS || 'Cargando..' }}</h3>
        <div class="p-2 mb-2 bg-transparent text-body"></div>
        <h2><strong>Matrícula:</strong></h2>
        <h3>{{ student?.MATRICULA || 'Cargando..' }}</h3>
        <div class="p-2 mb-2 bg-transparent text-body"></div>
        <h2><strong>Estatus Académico:</strong></h2>
        <h3>{{ student?.STATUSA || 'Cargando..' }}</h3>
        <div class="p-2 mb-2 bg-transparent text-body"></div>
        <h2><strong>CURP:</strong></h2>
        <h3>{{ student?.CURP || 'Cragando..' }}</h3>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getStudent } from '@/api/get-students';
import { useQuery } from '@tanstack/vue-query';

const { data: student } = useQuery({
  queryKey: ['student'],
  queryFn: () => getStudent(),
  staleTime: 1000 * 120,
});
</script>
