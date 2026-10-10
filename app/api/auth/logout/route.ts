import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { api } from '../../api'
import { clearAuthCookies, forbidden, getProxyHeaders, isSameOrigin } from '../../_lib/proxy'

export async function POST(req: NextRequest) {
    if (!isSameOrigin(req)) return forbidden()

    const cookieStore = await cookies()

    try {
        await api.post('auth/logout', null, {
            headers: getProxyHeaders(req, cookieStore),
        })
    } catch (error) {
        console.error('Logout request failed:', (error as Error).message)
    }

    clearAuthCookies(cookieStore)

    return NextResponse.json({ message: 'Logged out successfully' })
}
