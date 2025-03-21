import { CobachApi } from "@/api/CobachApi";
import { useAuthStore } from "@/stores/auth.store";

/**
 * @description - Obteniendo la información del estudiante dede la API utilizando su matrícula.
 * La matricula se obtiene del store de autenticación (authStore).
 *
 * @throws {Error} - Error que se lanza si no se puede obtener la información del estudiante, ya sea por un error en la petición o por no encontrar el estudiante.
 * @returns {Promise<Object>} - Retorna los datos del estudiante obtenidos desde la API.
 *
 * @example
 * // Ejemplo de uso:
 * try {
 * const studentData = await getStudent();
 * console.log(studentData);
 * } catch (error) {
 * console.error('Error al obtener estudiante:', error);
 * }
 */

// Obteniendo la instancia desde el store de autenticacion
const authStore = useAuthStore();
// Obteniendo la matricula desde el store de autenticacion
const matricula = authStore.user?.MATRICULA

// Solicitud para obtener los datos del estudiante a la API
export const getStudent = async () => {
  try {
    const { data } = await CobachApi.get(`/students/${matricula}`)
    console.log(data)
    return data // Retorna los datos obtenidos
  } catch (error) {
    console.log(error);
    throw new Error('Error al obtener estudiante') // Lanza un error si no se puede obtener la información del estudiante
  }

}
