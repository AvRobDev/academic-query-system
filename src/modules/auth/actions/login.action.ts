// modules/auth/actions/loginAction.ts
import { CobachApi } from '@/api/CobachApi';
import type { AuthResponse, StudentData } from '../interfaces';
import { isAxiosError } from 'axios';

export interface LoginError {
  ok: false;
  message: string;
}

export interface LoginSucces {
  ok: true;
  user: StudentData;
  token: string;
}

export const loginAction = async (
  username: string,
  password: string
): Promise<LoginError | LoginSucces> => {
  try {
    const { data } = await CobachApi.post<AuthResponse>('/auth/login', { username, password });

    return {
      ok: true,
      user: data.student_data,
      token: data.token,
    };
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 401) {
      return {
        ok: false,
        message: 'Usuario o Contraseña incorrectos',
      };
    }

    console.log(error);
    throw new Error('Hubo un error al realizar la petición');
  }
};
