import { NextRequest, NextResponse } from 'next/server'
import { api } from '../../api'
import { badRequest, errorResponse, getProxyHeaders, isValidId } from '../../_lib/proxy'

type Props = {
    params: Promise<{ id: string }>
}

export async function GET(req: NextRequest, { params }: Props) {
    const { id } = await params
    if (!isValidId(id)) return badRequest('Invalid id')

    try {
        const { data } = await api.get(`/teachers/${id}`, {
            headers: getProxyHeaders(req),
        })

        return NextResponse.json(data)
    } catch (error) {
        return errorResponse(error)
    }
}
