import { CobachApi } from "@/api/CobachApi";
import { useAuthStore } from "@/modules/auth/stores/auth.store";

const authStore = useAuthStore();
const matricula = authStore.student?.MATRICULA

export const getStudent = async () => {

  try {

    const { data } = await CobachApi.get(`/students/${matricula}`)

    console.log(data)

    return data

  } catch (error) {
    console.log(error);
    throw new Error('Error al obtener estudiante')
  }

}
