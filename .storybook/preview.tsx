import type { Preview } from '@storybook/nextjs-vite'
import toast from 'react-hot-toast'

import 'modern-normalize/modern-normalize.css'
import '../app/globals.css'
import { roboto } from '../lib/fonts'
import { useAuthStore } from '../lib/store/authStore'
import { useAuthModalStore } from '../lib/store/authModalStore'
import { mockUser } from '../mocks/teachers'

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

    beforeEach: ({ parameters }) => {
        const isAuthenticated = parameters.auth === 'authenticated'

        useAuthStore.setState({
            isAuthenticated,
            user: isAuthenticated ? mockUser : null,
        })

        return () => {
            useAuthStore.setState({ isAuthenticated: false, user: null })
            useAuthStore.persist.clearStorage()
            useAuthModalStore.setState({ openedModal: null })
            toast.remove()
        }
    },
}

export default preview
