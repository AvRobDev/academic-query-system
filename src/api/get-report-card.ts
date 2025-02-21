import { CobachApi } from "./CobachApi";

export const getAcademicReport = async (matricula: string) => {
  try {
    const { data } = await CobachApi.get(`/students/${matricula}/loads`);
    return data;
  } catch (error) {
    console.error('Error al obtener estudiante', error);
    throw new Error('Error al obtener estudiante');
  }
};

export const getHistories = async (matricula: string, rank: number) => {
  try {
    const { data } = await CobachApi.get(`/students/${matricula}/histories/semiannual?rank=${rank}`);
    return data;
  } catch (error) {
    console.error('Error al obtener el historial', error);
    throw new Error('Error al obtener el historial');
  }
};
