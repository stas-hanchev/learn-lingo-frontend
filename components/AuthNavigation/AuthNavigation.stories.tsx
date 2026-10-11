import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { http } from 'msw'
import { expect, screen, waitFor, within } from 'storybook/test'

import AuthNavigation from './AuthNavigation'
import { useAuthStore } from '@/lib/store/authStore'
import { errorResponse } from '@/mocks/handlers'

const meta = {
    title: 'Layout/AuthNavigation',
    component: AuthNavigation,
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component:
                    'Auth controls in the header. A guest sees "Log in" and "Registration", which open modals with the forms; ' +
                    'a logged-in user sees their name and "Log Out". Requests to `/api/auth/*` are served by MSW.',
            },
        },
    },
} satisfies Meta<typeof AuthNavigation>

export default meta
type Story = StoryObj<typeof meta>

export const Guest: Story = {
    play: async ({ canvas }) => {
        await expect(canvas.getByRole('button', { name: 'Log in' })).toBeVisible()
        await expect(canvas.getByRole('button', { name: 'Registration' })).toBeVisible()
    },
}

export const LoginSuccess: Story = {
    play: async ({ canvas, userEvent }) => {
        await userEvent.click(canvas.getByRole('button', { name: 'Log in' }))

        const dialog = within(await screen.findByRole('dialog'))
        await userEvent.type(dialog.getByPlaceholderText('Email'), 'student@example.com')
        await userEvent.type(dialog.getByPlaceholderText('Password'), 'Secret123')
        await userEvent.click(dialog.getByRole('button', { name: 'Log In' }))

        await expect(await screen.findByText('Welcome back, Student!')).toBeVisible()
        await expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
        await expect(canvas.getByText('Student')).toBeVisible()
        await expect(useAuthStore.getState().isAuthenticated).toBe(true)
    },
}

export const LoginInvalidCredentials: Story = {
    beforeEach: ({ msw }) => {
        msw.use(http.post('/api/auth/login', () => errorResponse(401, 'Invalid credentials')))
    },
    play: async ({ canvas, userEvent }) => {
        await userEvent.click(canvas.getByRole('button', { name: 'Log in' }))

        const dialog = within(await screen.findByRole('dialog'))
        await userEvent.type(dialog.getByPlaceholderText('Email'), 'student@example.com')
        await userEvent.type(dialog.getByPlaceholderText('Password'), 'wrong-password')
        await userEvent.click(dialog.getByRole('button', { name: 'Log In' }))

        await expect(await screen.findByText('Invalid credentials')).toBeVisible()
        await expect(screen.getByRole('dialog')).toBeVisible()
        await expect(dialog.getByRole('button', { name: 'Log In' })).toBeEnabled()
        await expect(useAuthStore.getState().isAuthenticated).toBe(false)
    },
}

export const RegistrationSuccess: Story = {
    play: async ({ canvas, userEvent }) => {
        await userEvent.click(canvas.getByRole('button', { name: 'Registration' }))

        const dialog = within(await screen.findByRole('dialog'))
        await userEvent.type(dialog.getByPlaceholderText('Name'), 'Jane')
        await userEvent.type(dialog.getByPlaceholderText('Email'), 'jane@example.com')
        await userEvent.type(dialog.getByPlaceholderText('Password'), 'Secret123')
        await userEvent.click(dialog.getByRole('button', { name: 'Sign Up' }))

        await expect(
            await screen.findByText('Welcome to LearnLingo, Jane! Your account has been created.')
        ).toBeVisible()
        await expect(canvas.getByText('Jane')).toBeVisible()
    },
}

export const RegistrationEmailInUse: Story = {
    beforeEach: ({ msw }) => {
        msw.use(http.post('/api/auth/register', () => errorResponse(409, 'Email in use')))
    },
    play: async ({ canvas, userEvent }) => {
        await userEvent.click(canvas.getByRole('button', { name: 'Registration' }))

        const dialog = within(await screen.findByRole('dialog'))
        await userEvent.type(dialog.getByPlaceholderText('Name'), 'Jane')
        await userEvent.type(dialog.getByPlaceholderText('Email'), 'taken@example.com')
        await userEvent.type(dialog.getByPlaceholderText('Password'), 'Secret123')
        await userEvent.click(dialog.getByRole('button', { name: 'Sign Up' }))

        await expect(await screen.findByText('Email in use')).toBeVisible()
        await expect(screen.getByRole('dialog')).toBeVisible()
    },
}

export const Authorized: Story = {
    parameters: {
        auth: 'authenticated',
    },
    play: async ({ canvas, userEvent }) => {
        await expect(canvas.getByText('Student')).toBeVisible()

        await userEvent.click(canvas.getByRole('button', { name: 'Log Out' }))

        await expect(await screen.findByText('You have been logged out.')).toBeVisible()
        await waitFor(() =>
            expect(canvas.getByRole('button', { name: 'Log in' })).toBeVisible()
        )
    },
}
