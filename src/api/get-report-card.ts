import { CobachApi } from "./CobachApi";
import { useAuthStore } from "@/modules/auth/stores/auth.store";

const authStore = useAuthStore();
const matricula = authStore.student?.MATRICULA
// console.log(matricula)

export const getAcademicReport = async () => {

  try {

    const { data } = await CobachApi.get(`/students/${matricula}/loads`)

    console.log("trae peticion", data)

    return data

  } catch (error) {
    console.log(error);
    throw new Error('Error al obtener estudiante')
  }

}
