import { CobachApi } from "./CobachApi";

export const getAcademicReport = async (matricula: string) => {
  try {
    const { data } = await CobachApi.get(`/students/${matricula}/loads`);
    console.log("trae peticion", data);
    return data;
  } catch (error) {
    console.error('Error al obtener estudiante', error);
    throw new Error('Error al obtener estudiante');
  }
}
