import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import Footer from './Footer'

const meta = {
    title: 'Layout/Footer',
    component: Footer,
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component:
                    'Platform statistics block shown below the hero section on the home page.',
            },
        },
    },
} satisfies Meta<typeof Footer>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
