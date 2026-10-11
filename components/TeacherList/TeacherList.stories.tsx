import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect } from 'storybook/test'

import TeacherList from './TeacherList'
import { Level } from '@/lib/types'
import { janeSmith, johnDoe, teachers } from '@/mocks/teachers'
import { withTeachersPage } from '@/.storybook/decorators'

const meta = {
    title: 'Teachers/TeacherList',
    component: TeacherList,
    tags: ['autodocs'],
    decorators: [withTeachersPage],
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component:
                    'List of `TeacherCard`s on the teachers page. The cards share one favorites list, ' +
                    'so marking a teacher as favorite in `parameters.favorites` affects only that card.',
            },
        },
    },
    argTypes: {
        teachers: {
            description: 'Teachers to render, in order.',
        },
        levelValue: {
            description: 'Level selected in the filter; passed to every card to highlight the matching badge.',
            control: 'select',
            options: [undefined, ...Object.values(Level).filter((level) => level !== Level.all)],
        },
    },
    args: {
        teachers,
    },
} satisfies Meta<typeof TeacherList>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    play: async ({ args, canvas }) => {
        await expect(canvas.getAllByRole('button', { name: 'Read more' })).toHaveLength(
            args.teachers.length
        )
    },
}

export const FilteredByLevel: Story = {
    args: {
        teachers: [janeSmith, johnDoe],
        levelValue: Level.intermediate,
    },
}

export const AuthorizedWithFavorite: Story = {
    parameters: {
        auth: 'authenticated',
        favorites: [johnDoe],
    },
    play: async ({ canvas }) => {
        await expect(await canvas.findAllByRole('button', { name: 'Remove from favorites' })).toHaveLength(1)
        await expect(canvas.getAllByRole('button', { name: 'Add to favorites' })).toHaveLength(2)
    },
}
