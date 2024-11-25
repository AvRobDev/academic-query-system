export interface SemiannualHistory {
  MATRICULA: string;
  NOMBRES: string;
  APELLIDOS: string;
  CURP: string;
  GRADO: string;
  GRUPO: string;
  STATUSA: string;
  CARGA: Carga[];
  DETALLES: Detalles;
}

export interface Carga {
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

export interface Detalles {
  PROMEDIO_FINAL: number;
}
