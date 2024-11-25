// import { CobachApi } from "@/api/CobachApi";
// import { useAuthStore } from "@/modules/auth/stores/auth.store";

// export const getStudent = async () => {
//   try {
//     const authStore = useAuthStore();

//     const matricula = authStore.studentname;
//     // console.log(matricula)
//     // if (!matricula) {
//     //   throw new Error('No hay información del estudiante disponible.');
//     // }

//     const { data } = await CobachApi.get(`/students/${matricula}`);
//     console.log(data);

//     return data;
//   } catch (error) {
//     console.error(error);
//     throw new Error('Error al obtener estudiante');
//   }
// };
