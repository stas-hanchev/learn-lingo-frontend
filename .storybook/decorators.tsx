import type { Decorator } from '@storybook/nextjs-vite'
import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import ToastProvider from '../components/ToastProvider/ToastProvider'

export const withQueryClient: Decorator = (Story, { id }) => (
    <StoryQueryClientProvider key={id}>
        <Story />
    </StoryQueryClientProvider>
)

function StoryQueryClientProvider({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: { retry: false, staleTime: Infinity },
                    mutations: { retry: false },
                },
            })
    )

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
