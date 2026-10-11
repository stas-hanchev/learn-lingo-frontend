import type { Preview } from '@storybook/nextjs-vite'
import toast from 'react-hot-toast'
import { setupWorker } from 'msw/browser'
import { mswLoader } from 'msw-storybook-addon/csf3'

import 'modern-normalize/modern-normalize.css'
import '../app/globals.css'
import { roboto } from '../lib/fonts'
import { useAuthStore } from '../lib/store/authStore'
import { useAuthModalStore } from '../lib/store/authModalStore'
import { mockUser } from '../mocks/teachers'
import { handlers, seedFavorites } from '../mocks/handlers'
import { Teacher } from '../lib/types'
import { withQueryClient, withToaster } from './decorators'

document.body.classList.add(roboto.variable)

const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },

        a11y: {
            test: 'todo',
        },
    },

    decorators: [withToaster, withQueryClient],

    loaders: [
        mswLoader(async () => {
            const worker = setupWorker(...handlers)
            await worker.start({
                quiet: true,
                onUnhandledRequest: (request, print) => {
                    if (new URL(request.url).pathname.startsWith('/api/')) print.error()
                },
            })
            return worker
        }),
    ],

    beforeEach: ({ parameters }) => {
        const isAuthenticated = parameters.auth === 'authenticated'

        useAuthStore.setState({
            isAuthenticated,
            user: isAuthenticated ? mockUser : null,
        })
        seedFavorites((parameters.favorites as Teacher[] | undefined) ?? [])

        return () => {
            useAuthStore.setState({ isAuthenticated: false, user: null })
            useAuthStore.persist.clearStorage()
            useAuthModalStore.setState({ openedModal: null })
            toast.remove()
        }
    },
}

export default preview
