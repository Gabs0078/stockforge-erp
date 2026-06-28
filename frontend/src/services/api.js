import axios from 'axios';

export const api = axios.create({
  baseURL: '/api'
});

export function getErrorMessage(error) {
  return error.response?.data?.message || 'Erro inesperado. Verifique a API.';
}
