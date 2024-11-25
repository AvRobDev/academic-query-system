import { CobachApi } from "@/api/CobachApi";


export const getStudent = async () => {

  try {

    const { data } = await CobachApi.get(`/students/${'22A0710217M0001'}`)

    console.log(data)

    return data

  } catch (error) {
    console.log(error);
    throw new Error('Error al obtener estudiante')
  }

}
