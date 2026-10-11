import type { Decorator } from '@storybook/nextjs-vite'
import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import ToastProvider from '../components/ToastProvider/ToastProvider'
import { Teacher } from '../lib/types'

export const withQueryClient: Decorator = (Story, { id, parameters }) => (
    <StoryQueryClientProvider
        key={id}
        favorites={(parameters.favorites as Teacher[] | undefined) ?? []}
    >
        <Story />
    </StoryQueryClientProvider>
)

function StoryQueryClientProvider({
    favorites,
    children,
}: {
    favorites: Teacher[]
    children: React.ReactNode
}) {
    const [queryClient] = useState(() => {
        const client = new QueryClient({
            defaultOptions: {
                queries: { retry: false, staleTime: Infinity },
                mutations: { retry: false },
            },
        })
        client.setQueryData(['favorites'], favorites)
        return client
    })

    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

export const withToaster: Decorator = (Story) => (
    <>
        <Story />
        <ToastProvider />
    </>
)

export const withTeachersPage: Decorator = (Story) => (
    <div style={{ background: '#f8f8f8', padding: 32, minWidth: 1296 }}>
        <Story />
    </div>
)
