import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { api } from '../../api'
import {
    badRequest,
    errorResponse,
    forbidden,
    getProxyHeaders,
    isSameOrigin,
    isValidId,
} from '../../_lib/proxy'

type Props = {
    params: Promise<{ id: string }>
}

const proxyFavorite = async (
    method: 'post' | 'delete',
    req: NextRequest,
    { params }: Props
) => {
    if (!isSameOrigin(req)) return forbidden()

    const { id } = await params
    if (!isValidId(id)) return badRequest('Invalid id')

    const cookieStore = await cookies()

    try {
        const { data, status } = await api.request({
            method,
            url: `/favorites/${id}`,
            headers: getProxyHeaders(req, cookieStore),
        })

        return status === 204
            ? new NextResponse(null, { status })
            : NextResponse.json(data, { status })
    } catch (error) {
        return errorResponse(error)
    }
}

export async function POST(req: NextRequest, props: Props) {
    return proxyFavorite('post', req, props)
}

export async function DELETE(req: NextRequest, props: Props) {
    return proxyFavorite('delete', req, props)
}
