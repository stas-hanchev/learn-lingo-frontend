import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { api, ApiError } from '../../api'
import { clearAuthCookies, copyAuthCookies, getProxyHeaders } from '../../_lib/proxy'

export async function GET(req: NextRequest) {
    const cookieStore = await cookies()

    if (!cookieStore.get('sessionId')?.value) {
        return NextResponse.json({ success: false })
    }

    try {
        const apiRes = await api.get('auth/session', {
            headers: getProxyHeaders(req, cookieStore),
        })

        copyAuthCookies(apiRes.headers['set-cookie'], cookieStore)

        return NextResponse.json({ success: true })
    } catch (error) {
        if ((error as ApiError).response?.status === 401) {
            clearAuthCookies(cookieStore)
        } else {
            console.error('Session check failed:', (error as ApiError).message)
        }
        return NextResponse.json({ success: false })
    }
}
