import { CobachApi } from "./CobachApi";

/**
 * @description Función para obtener el historial académico del estudiante
 * @param {string} matricula - Matrícula del estudiante
 * @returns {Promise} - Promesa con el historial académico del estudiante
 */
export const getAcademicReport = async (matricula: string) => {
  try {
    const { data } = await CobachApi.get(`/students/${matricula}/loads`);
    return data;
  } catch (error) {
    console.error('Periodo académico no completado o no existe el registro.', error);
    throw new Error('Periodo académico no completado o no existe el registro.');
  }
};

/**
 * @description Función para obtener el historial académico del estudiante por semestre y parcial
 * @param {string} matricula - Matrícula del estudiante
 * @param {number} rank - Rango de semestres a obtener
 * @param {number} partial - Rango de parciales a obtener
 * @returns {Promise} - Promesa con el historial académico del estudiante
 */
export const getHistories = async (matricula: string, rank: number, partial: number) => {
  try {
    const { data } = await CobachApi.get(`/students/${matricula}/histories/?rank=${rank}&partial=${partial}`);
    return data;
  } catch (error) {
    console.error('Periodo académico no completado o no existe el registro.', error);
    throw new Error('Periodo académico no completado o no existe el registro.');
  }
};
