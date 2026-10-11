import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import LiteralAvatar from './LiteralAvatar'

const meta = {
    title: 'Reviews/LiteralAvatar',
    component: LiteralAvatar,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component:
                    'Round avatar showing the first letter of a name. Used in reviews when the author has no photo.',
            },
        },
    },
    argTypes: {
        name: {
            control: 'text',
        },
    },
    args: {
        name: 'Frank',
    },
} satisfies Meta<typeof LiteralAvatar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const LowercaseName: Story = {
    args: {
        name: 'olga',
    },
}

export const CyrillicName: Story = {
    args: {
        name: 'Олена',
    },
}

export const EmptyName: Story = {
    args: {
        name: '',
    },
}
