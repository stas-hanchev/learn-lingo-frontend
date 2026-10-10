import type { Preview } from '@storybook/nextjs-vite'

import 'modern-normalize/modern-normalize.css'
import '../app/globals.css'
import { roboto } from '../lib/fonts'

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
}

export default preview
