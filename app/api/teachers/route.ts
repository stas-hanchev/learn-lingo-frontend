import { NextRequest, NextResponse } from 'next/server'
import { api } from '../api'
import { errorResponse, getProxyHeaders } from '../_lib/proxy'

const ALLOWED_PARAMS = ['page', 'perPage', 'language', 'level', 'price', 'sortBy', 'sortOrder']

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams
    const params = Object.fromEntries(
        ALLOWED_PARAMS.flatMap((key) => {
            const value = searchParams.get(key)
            return value !== null ? [[key, value]] : []
        })
    )

    try {
        const { data } = await api.get('/teachers', {
            params,
            headers: getProxyHeaders(req),
        })

        return NextResponse.json(data)
    } catch (error) {
        return errorResponse(error)
    }
}
