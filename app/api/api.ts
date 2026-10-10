import axios, { AxiosError } from 'axios';

export type ApiError = AxiosError<{ message: string }>

export const api = axios.create({
  baseURL: process.env.TEACHERS_API_URL,
  timeout: 10000,
  maxRedirects: 0,
});
