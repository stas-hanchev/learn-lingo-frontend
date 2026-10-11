import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { delay, http } from 'msw'
import { expect, fn, screen, waitFor } from 'storybook/test'

import FavoriteButton from './FavoriteButton'
import { janeSmith } from '@/mocks/teachers'
import { errorResponse } from '@/mocks/handlers'

const meta = {
    title: 'Teachers/FavoriteButton',
    component: FavoriteButton,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
        auth: 'authenticated',
        docs: {
            description: {
                component:
                    'Heart button on a teacher card. For a logged-in user it reads `GET /api/favorites` and toggles the teacher ' +
                    'with `POST` / `DELETE /api/favorites/:id`, then refetches the list. Requests are served by MSW: ' +
                    'the default handlers keep favorites in memory, and stories override them in `beforeEach` with `msw.use()`.',
            },
        },
    },
    args: {
        teacherId: janeSmith._id,
    },
} satisfies Meta<typeof FavoriteButton>

export default meta
type Story = StoryObj<typeof meta>

export const NotFavorite: Story = {
    play: async ({ canvas, userEvent }) => {
        await userEvent.click(await canvas.findByRole('button', { name: 'Add to favorites' }))

        await expect(
            await canvas.findByRole('button', { name: 'Remove from favorites' })
        ).toHaveAttribute('aria-pressed', 'true')
        await expect(await screen.findByText('Teacher added to favorites')).toBeVisible()
    },
}

export const Favorite: Story = {
    parameters: {
        favorites: [janeSmith],
    },
    play: async ({ canvas, userEvent }) => {
        await userEvent.click(
            await canvas.findByRole('button', { name: 'Remove from favorites' })
        )

        await expect(
            await canvas.findByRole('button', { name: 'Add to favorites' })
        ).toHaveAttribute('aria-pressed', 'false')
        await expect(await screen.findByText('Teacher removed from favorites')).toBeVisible()
    },
}

export const ServerError: Story = {
    beforeEach: ({ msw }) => {
        msw.use(
            http.post('/api/favorites/:id', () => errorResponse(500, 'Internal server error'))
        )
    },
    play: async ({ canvas, userEvent }) => {
        const button = await canvas.findByRole('button', { name: 'Add to favorites' })
        await userEvent.click(button)

        await expect(await screen.findByText('Internal server error')).toBeVisible()
        await expect(button).toHaveAttribute('aria-pressed', 'false')
        await expect(button).toBeEnabled()
    },
}

export const SessionExpired: Story = {
    parameters: {
        docs: {
            description: {
                story:
                    'The store still says "logged in", but the server rejects the request with 401. The message from the response body is shown.',
            },
        },
    },
    beforeEach: ({ msw }) => {
        msw.use(http.post('/api/favorites/:id', () => errorResponse(401, 'Session expired')))
    },
    play: async ({ canvas, userEvent }) => {
        await userEvent.click(await canvas.findByRole('button', { name: 'Add to favorites' }))

        await expect(await screen.findByText('Session expired')).toBeVisible()
    },
}

export const Saving: Story = {
    beforeEach: ({ msw }) => {
        msw.use(http.post('/api/favorites/:id', () => delay('infinite')))
    },
    play: async ({ canvas, userEvent }) => {
        const button = await canvas.findByRole('button', { name: 'Add to favorites' })
        await userEvent.click(button)

        await waitFor(() => expect(button).toBeDisabled())
    },
}

const favoritesApiSpy = fn()

export const Guest: Story = {
    parameters: {
        auth: 'guest',
    },
    beforeEach: ({ msw }) => {
        favoritesApiSpy.mockClear()
        msw.use(
            http.all('/api/favorites*', ({ request }) => {
                favoritesApiSpy(request.method, request.url)
                return errorResponse(401, 'Missing session credentials')
            })
        )
    },
    play: async ({ canvas, userEvent }) => {
        await userEvent.click(canvas.getByRole('button', { name: 'Add to favorites' }))

        await expect(
            await screen.findByText('Log in to add teachers to favorites.')
        ).toBeVisible()
        await expect(favoritesApiSpy).not.toHaveBeenCalled()
    },
}
