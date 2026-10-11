import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { delay, http } from 'msw'
import { expect, waitFor } from 'storybook/test'

import TeachersPage from './page'
import { errorResponse } from '@/mocks/handlers'
import { teachersCatalog } from '@/mocks/teachers'

const meta = {
    title: 'Pages/Teachers',
    component: TeachersPage,
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component:
                    'The `/teachers` page: filters, an infinite list (3 teachers per request) and "Load more". ' +
                    `\`GET /api/teachers\` is served by MSW from ${teachersCatalog.length} mock teachers with the same ` +
                    'filtering and pagination rules as the backend.',
            },
        },
    },
} satisfies Meta<typeof TeachersPage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    play: async ({ canvas, userEvent, step }) => {
        const readMoreButtons = () => canvas.getAllByRole('button', { name: 'Read more' })

        await step('First page', async () => {
            await waitFor(() => expect(readMoreButtons()).toHaveLength(3))
        })

        await step('Second page', async () => {
            await userEvent.click(canvas.getByRole('button', { name: 'Load more' }))
            await waitFor(() => expect(readMoreButtons()).toHaveLength(6))
        })

        await step('Last page hides "Load more"', async () => {
            await userEvent.click(canvas.getByRole('button', { name: 'Load more' }))
            await waitFor(() => expect(readMoreButtons()).toHaveLength(teachersCatalog.length))
            await expect(
                canvas.queryByRole('button', { name: 'Load more' })
            ).not.toBeInTheDocument()
        })
    },
}

export const Loading: Story = {
    beforeEach: ({ msw }) => {
        msw.use(http.get('/api/teachers', () => delay('infinite')))
    },
    play: async ({ canvas }) => {
        await expect(await canvas.findByRole('status')).toHaveTextContent('Loading teachers...')
    },
}

export const LoadingNextPage: Story = {
    beforeEach: ({ msw }) => {
        msw.use(
            http.get('/api/teachers', async ({ request }) => {
                if (new URL(request.url).searchParams.get('page') !== '1') await delay('infinite')
            })
        )
    },
    play: async ({ canvas, userEvent }) => {
        await userEvent.click(await canvas.findByRole('button', { name: 'Load more' }))

        await expect(await canvas.findByRole('button', { name: 'Loading...' })).toBeDisabled()
    },
}

export const FilteredByLanguage: Story = {
    play: async ({ canvas, userEvent }) => {
        await canvas.findByRole('button', { name: 'Load more' })

        await userEvent.click(canvas.getByRole('combobox', { name: 'Languages' }))
        await userEvent.click(await canvas.findByRole('option', { name: 'French' }))

        await waitFor(() =>
            expect(canvas.getAllByRole('button', { name: 'Read more' })).toHaveLength(2)
        )
        await expect(canvas.getByText('John Doe')).toBeVisible()
        await expect(canvas.getByText('Marie Dubois')).toBeVisible()
        await expect(canvas.queryByRole('button', { name: 'Load more' })).not.toBeInTheDocument()
    },
}

export const NoResults: Story = {
    play: async ({ canvas, userEvent }) => {
        await canvas.findByRole('button', { name: 'Load more' })

        await userEvent.click(canvas.getByRole('combobox', { name: 'Languages' }))
        await userEvent.click(await canvas.findByRole('option', { name: 'Polish' }))
        await userEvent.click(canvas.getByRole('combobox', { name: 'Level of knowledge' }))
        await userEvent.click(await canvas.findByRole('option', { name: 'C2 Proficient' }))

        await expect(
            await canvas.findByRole('heading', { name: 'No teachers found' })
        ).toBeVisible()
    },
}

export const ServerError: Story = {
    parameters: {
        docs: {
            description: {
                story:
                    'The page has no separate error state: a failed request looks the same as an empty result.',
            },
        },
    },
    beforeEach: ({ msw }) => {
        msw.use(http.get('/api/teachers', () => errorResponse(500, 'Internal server error')))
    },
    play: async ({ canvas }) => {
        await expect(
            await canvas.findByRole('heading', { name: 'No teachers found' })
        ).toBeVisible()
    },
}
