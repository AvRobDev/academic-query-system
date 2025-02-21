import { CobachApi } from "@/api/CobachApi";

export const getAcademicHistory = async (matricula: string) => {
  try {
    const { data } = await CobachApi.get(`/students/${matricula}/loads/semiannual`);
    console.log("trae peticion", data);
    return data;
  } catch (error) {
    console.error('Error al obtener estudiante', error);
    throw new Error('Error al obtener estudiante');
  }
}
