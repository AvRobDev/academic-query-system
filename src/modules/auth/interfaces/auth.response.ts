// Creando interfaces para la respuesta de autenticación
export interface AuthResponse {
  token: string;
  student_data: StudentData;
}

export interface StudentData {
  MATRICULA: string | any;
  NOMBRES: string;
  APELLIDOS: string;
  CURP: string;
  GRADO: string;
  GRUPO: string;
  STATUSA: string;
}
