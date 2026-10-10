import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { api } from '../../api'
import {
    badRequest,
    copyAuthCookies,
    errorResponse,
    forbidden,
    getProxyHeaders,
    isSameOrigin,
    readJsonBody,
} from '../../_lib/proxy'

export async function POST(req: NextRequest) {
    if (!isSameOrigin(req)) return forbidden()

    const body = await readJsonBody(req)
    if (!body) return badRequest()

    try {
        const apiRes = await api.post('auth/login', body, {
            headers: getProxyHeaders(req),
        })
        const cookieStore = await cookies()

        if (!copyAuthCookies(apiRes.headers['set-cookie'], cookieStore)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        return NextResponse.json(apiRes.data, { status: apiRes.status })
    } catch (error) {
        return errorResponse(error)
    }
}
