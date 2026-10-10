import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import Loader from './Loader'

const meta = {
    title: 'Feedback/Loader',
    component: Loader,
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component:
                    'Full-screen loading indicator for the teachers list. It uses `position: fixed`, so Docs renders it in a separate iframe to avoid covering the documentation page.',
            },
            story: {
                inline: false,
                iframeHeight: 420,
            },
        },
    },
} satisfies Meta<typeof Loader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
