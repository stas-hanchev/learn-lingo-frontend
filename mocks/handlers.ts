import { http, HttpResponse } from 'msw'

import { LoginRequestBody, RegisterRequestBody, Teacher } from '@/lib/types'
import { mockUser, teachersCatalog } from './teachers'

const API = '/api'

let favoriteIds = new Set<string>()

export const seedFavorites = (favorites: Teacher[]) => {
    favoriteIds = new Set(favorites.map((teacher) => teacher._id))
}

export const errorResponse = (status: number, message: string) =>
    HttpResponse.json({ message }, { status })

export const teachersHandlers = [
    http.get(`${API}/teachers`, ({ request }) => {
        const params = new URL(request.url).searchParams
        const page = Number(params.get('page') ?? 1)
        const perPage = Number(params.get('perPage') ?? 3)
        const language = params.get('language')
        const level = params.get('level')
        const price = params.get('price')

        const filtered = teachersCatalog.filter(
            (teacher) =>
                (!language || teacher.languages.includes(language)) &&
                (!level || teacher.levels.includes(level)) &&
                (!price || teacher.price_per_hour <= Number(price))
        )

        return HttpResponse.json({
            page,
            perPage,
            totalItems: filtered.length,
            totalPages: Math.ceil(filtered.length / perPage),
            teachers: filtered.slice((page - 1) * perPage, page * perPage),
        })
    }),
]

export const favoritesHandlers = [
    http.get(`${API}/favorites`, () =>
        HttpResponse.json(teachersCatalog.filter((teacher) => favoriteIds.has(teacher._id)))
    ),

    http.post<{ id: string }>(`${API}/favorites/:id`, ({ params }) => {
        favoriteIds.add(params.id)
        return HttpResponse.json({ message: 'Added to favorites' }, { status: 201 })
    }),

    http.delete<{ id: string }>(`${API}/favorites/:id`, ({ params }) => {
        favoriteIds.delete(params.id)
        return new HttpResponse(null, { status: 204 })
    }),
]

export const authHandlers = [
    http.post<never, LoginRequestBody>(`${API}/auth/login`, async ({ request }) => {
        const { email } = await request.json()
        return HttpResponse.json({ ...mockUser, email })
    }),

    http.post<never, RegisterRequestBody>(`${API}/auth/register`, async ({ request }) => {
        const { name, email } = await request.json()
        return HttpResponse.json({ ...mockUser, name, email }, { status: 201 })
    }),

    http.post(`${API}/auth/logout`, () => new HttpResponse(null, { status: 204 })),
]

export const handlers = [...teachersHandlers, ...favoritesHandlers, ...authHandlers]
