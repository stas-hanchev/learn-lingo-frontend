import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import ReviewItem from './ReviewItem'

const meta = {
    title: 'Reviews/ReviewItem',
    component: ReviewItem,
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component:
                    'Student review inside the expanded teacher card: avatar, name, rating and text.',
            },
        },
    },
    decorators: [
        (Story) => (
            <div style={{ maxWidth: 968 }}>
                <Story />
            </div>
        ),
    ],
    args: {
        review: {
            reviewer_name: 'Frank',
            reviewer_rating: 4,
            comment: "Jane's lessons were very helpful. I made good progress.",
        },
    },
} satisfies Meta<typeof ReviewItem>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const LowRating: Story = {
    args: {
        review: {
            reviewer_name: 'Eve',
            reviewer_rating: 1,
            comment: 'The lesson started late and we did not cover the topic.',
        },
    },
}

export const LongComment: Story = {
    args: {
        review: {
            reviewer_name: 'Maximilian',
            reviewer_rating: 5,
            comment:
                'Absolutely fantastic teacher! Every lesson was carefully prepared, with plenty of speaking practice, ' +
                'useful vocabulary and real-life examples. After three months I passed my B2 exam with confidence. ' +
                'I would recommend these lessons to anyone who wants structured and motivating learning.',
        },
    },
}
