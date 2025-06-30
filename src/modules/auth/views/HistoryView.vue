<template>
  <div>
    <div v-if="loading">Cargando datos...</div>
    <div v-else>
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
      <div v-if="error" class="error-container">
        <button @click="reloadPage" class="btn btn-retry" aria-label="Regresar">
          <i class="bi bi-arrow-clockwise"></i>
          <span>{{ error }}</span>
        </button>
      </div>
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
              <tr v-for="(asignatura, index) in academicHistory" :key="index">
                <td>{{ asignatura.ASIGNATURA }}</td>
                <td class="text-center">{{ asignatura.OBSERVA || 'N/A' }}</td>
                <td class="text-center">{{ asignatura.PARCIAL_1 || 'Sin datos' }}</td>
                <td class="text-center">{{ asignatura.PARCIAL_2 || 'Sin datos' }}</td>
                <td class="text-center">{{ asignatura.PARCIAL_3 || 'Sin datos' }}</td>
                <td class="text-center">{{ asignatura.OBSERVA || 'Sin observaciones' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="text-center">
          <h5 class="text-secondary">
            Promedio Final:
            <span v-if="PROMEDIO !== null">{{ PROMEDIO }}</span>
            <span v-else>Cargando promedio...</span>
          </h5>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';
import { useAuthStore } from '@/stores/auth.store';
import { getHistoriesSemiannual } from '@/api/get-academic-history';
import { useToast } from 'vue-toastification';

const authStore = useAuthStore();
const user = authStore.user;
const matricula = user?.MATRICULA;

const academicHistory = ref<any[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const toast = useToast();

const selectedRank = ref<number | null>(null);
const PROMEDIO = ref<number | null>(null); //
const ranks = ref([1, 2, 3, 4, 5, 6]);

const reloadPage = () => window.location.reload();

const fetchHistoriesSemiannual = async (rank: number) => {
  loading.value = true;
  error.value = null;

  try {
    if (!matricula) {
      throw new Error('No se pudo obtener la matrícula del usuario.');
    }

    const data = await getHistoriesSemiannual(matricula, rank);
    academicHistory.value = data.ASIGNATURAS;
    PROMEDIO.value = data.PROMEDIO_FINAL;
  } catch (err) {
    toast.error('Periodo académico no completado o no existe el registro.');
    error.value = 'Periodo académico no completado o no existe el registro.';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

// Reactualizar datos si el usuario cambia el semestre
watch(selectedRank, async (newRank) => {
  if (newRank !== null) {
    await fetchHistoriesSemiannual(newRank);
  }
});

// Cargar semestre 1 automáticamente al montar
onMounted(async () => {
  if (ranks.value.length > 0) {
    selectedRank.value = ranks.value[0];
    await fetchHistoriesSemiannual(selectedRank.value);
  }
});
</script>

<style scoped>
.error-container {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff; 
  border: 1px solid #ffffff;
  border-radius: 4px;
  padding: 10px 15px;
  margin: 1rem 0;
  color: #721c24; 
}


.error-message {
  margin-right: 15px; 
  font-weight: 500;
}

.btn-retry {
  background-color: #dc3545; 
  border: none;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-retry:hover {
  background-color: #c82333; 
}
</style>
