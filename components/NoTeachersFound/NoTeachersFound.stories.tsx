import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import NoTeachersFound from './NoTeachersFound'

const meta = {
    title: 'Feedback/NoTeachersFound',
    component: NoTeachersFound,
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component:
                    'Empty state shown when no teachers match the filters or the favorites list is empty. The image is served from `public/teacher.png` (staticDirs).',
            },
        },
    },
} satisfies Meta<typeof NoTeachersFound>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
