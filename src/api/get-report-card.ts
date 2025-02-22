import { CobachApi } from "./CobachApi";

export const getAcademicReport = async (matricula: string) => {
  try {
    const { data } = await CobachApi.get(`/students/${matricula}/loads`);
    return data;
  } catch (error) {
    console.error('Periodo académico no completado o no existe el registro.', error);
    throw new Error('Periodo académico no completado o no existe el registro.');
  }
};

export const getHistories = async (matricula: string, rank: number, partial: number) => {
  try {
    const { data } = await CobachApi.get(`/students/${matricula}/histories/?rank=${rank}&partial=${partial}`);
    console.log(data)
    return data;
  } catch (error) {
    console.error('Periodo académico no completado o no existe el registro.', error);
    throw new Error('Periodo académico no completado o no existe el registro.');
  }
};
