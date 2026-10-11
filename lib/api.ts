import axios from 'axios';

import { api } from '@/app/api/api';

import {
    TeachersResponse,
    Teacher,
    RegisterRequestBody,
    User,
    LoginRequestBody,
    CheckSessionRequest,
    TeacherQuery
} from '@/lib/types'

const nextServer = axios.create({
    baseURL: process.env.NEXT_PUBLIC_PROXY_API_URL,
    withCredentials: true
})

export const getTeachers = async (query: TeacherQuery) => {
    const res = await nextServer.get<TeachersResponse>('/teachers', 
        {
            params: query
        }
    );
    return res.data
}

export const getTeacherById = async (id: string) => {
    const res = await nextServer.get<Teacher>(`/teachers/${id}`)
    return res.data
}

export const getTeacherByIdWithoutProxy = async (id: string) => {
    const res = await api.get<Teacher>(`/teachers/${id}`)
    return res.data
}


export const getFavoriteTeachers = async () => {
    const res = await nextServer.get<Teacher[]>('/favorites')
    return res.data
}

export const getFavoriteTeachersWithoutProxy = async (headers?: Record<string, string>) => {
    const res = await api.get<Teacher[]>('/favorites', { headers })
    return res.data
}

export const addFavoriteTeacher = async (teacherId: string) => {
    const res = await nextServer.post(`/favorites/${teacherId}`)
    return res.data
}

export const removeFavoriteTeacher = async (teacherId: string) => {
    const res = await nextServer.delete(`/favorites/${teacherId}`)
    return res.data
}

export const register = async (data: RegisterRequestBody) => {
    const res = await nextServer.post<User>('/auth/register', data)
    return res.data
}

export const login = async (data: LoginRequestBody) => {
    const res = await nextServer.post<User>('/auth/login', data)
    return res.data
}

export const logout = async (): Promise<void> => {
  await nextServer.post('/auth/logout')
};

export const checkSession = async () => {
    const res = await nextServer.get<CheckSessionRequest>('/auth/session')
    return res.data.success
}

export const getMe = async () => {
  const { data } = await nextServer.get<User>('/auth/me');
  return data;
};
