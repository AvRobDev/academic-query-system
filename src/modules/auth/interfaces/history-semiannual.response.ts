// Creando la interfaz para la respuesta de historial semestral
export interface SemiannualHistory {
  MATRICULA: string;
  NOMBRES: string;
  APELLIDOS: string;
  CURP: string;
  GRADO: string;
  GRUPO: string;
  STATUSA: string;
  ASIGNATURA: Asignatura[];
  PROMEDIO_FINAL: number;
}

export interface Asignatura {
  MATRICULA: string;
  CLAVE_IN: string;
  CLAVEMAT: string;
  PARCIAL_1: string;
  FALTAS_1: string;
  PARCIAL_2: string;
  FALTAS_2: string;
  PARCIAL_3: string;
  FALTAS_3: string;
  PROMEDIO: number;
  OBSERVA: string;
  PALABRA: string;
  DATOS_MATERIA: DatosMateria;
}

export interface DatosMateria {
  ASIGNATURA: string;
  CLAVE: string;
  CLAVE_IN: string;
}
