import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { api } from '../../api'
import { errorResponse, getProxyHeaders } from '../../_lib/proxy'

export async function GET(req: NextRequest) {
    const cookieStore = await cookies()

    try {
        const { data } = await api.get('/auth/me', {
            headers: getProxyHeaders(req, cookieStore),
        })

        return NextResponse.json(data)
    } catch (error) {
        return errorResponse(error)
    }
}
