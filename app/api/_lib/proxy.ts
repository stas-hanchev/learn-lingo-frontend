import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { splitCookiesString, parse as parseSetCookie } from 'set-cookie-parser'
import { ApiError } from '../api'

type CookieStore = Awaited<ReturnType<typeof cookies>>

const AUTH_COOKIES = ['sessionId', 'accessToken', 'refreshToken']

const OBJECT_ID_REGEX = /^[a-f\d]{24}$/i

export const isValidId = (id: string) => OBJECT_ID_REGEX.test(id)

export const getAuthCookieHeader = (cookieStore: CookieStore) =>
    AUTH_COOKIES.flatMap((name) => {
        const value = cookieStore.get(name)?.value
        return value ? [`${name}=${encodeURIComponent(value)}`] : []
    }).join('; ')

export const getProxyHeaders = (req: NextRequest, cookieStore?: CookieStore) => {
    const headers: Record<string, string> = {}
    const clientIp = req.headers.get('x-forwarded-for')?.split(',').at(-1)?.trim()

    if (clientIp) headers['X-Forwarded-For'] = clientIp
    if (cookieStore) headers.Cookie = getAuthCookieHeader(cookieStore)

    return headers
}

export const copyAuthCookies = (
    setCookie: string | string[] | undefined,
    cookieStore: CookieStore
) => {
    if (!setCookie) return false

    const cookieArray = Array.isArray(setCookie)
        ? setCookie
        : splitCookiesString(setCookie)

    for (const c of parseSetCookie(cookieArray)) {
        if (!AUTH_COOKIES.includes(c.name)) continue

        cookieStore.set(c.name, c.value, {
            expires: c.expires,
            path: '/',
            maxAge: c.maxAge,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
        })
    }

    return true
}

export const clearAuthCookies = (cookieStore: CookieStore) => {
    for (const name of AUTH_COOKIES) cookieStore.delete(name)
}

export const isSameOrigin = (req: NextRequest) => {
    const origin = req.headers.get('origin')
    if (!origin) return req.headers.get('sec-fetch-site') === 'same-origin'

    try {
        return new URL(origin).host === req.headers.get('host')
    } catch {
        return false
    }
}

export const forbidden = () =>
    NextResponse.json({ error: 'Forbidden' }, { status: 403 })

export const badRequest = (message = 'Bad request') =>
    NextResponse.json({ error: message }, { status: 400 })

export const errorResponse = (error: unknown) => {
    const apiError = error as ApiError

    return NextResponse.json(
        {
            error:
                apiError.response?.data?.message ??
                'Service is temporarily unavailable',
        },
        { status: apiError.response?.status ?? 502 }
    )
}

export const readJsonBody = async (req: NextRequest) => {
    if (!req.headers.get('content-type')?.includes('application/json')) {
        return null
    }

    try {
        return await req.json()
    } catch {
        return null
    }
}
