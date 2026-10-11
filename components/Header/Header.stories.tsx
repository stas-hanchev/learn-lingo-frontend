import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect } from 'storybook/test'

import Header from './Header'

const meta = {
    title: 'Layout/Header',
    component: Header,
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component:
                    'Site header: logo, navigation and `AuthNavigation`. The "Favorites" link is shown only to logged-in users. ' +
                    'Storybook replaces `next/link` with a mock: a click does not leave the story and is logged in the Actions panel as `next/link::Link`.',
            },
        },
    },
} satisfies Meta<typeof Header>

export default meta
type Story = StoryObj<typeof meta>

export const Guest: Story = {
    play: async ({ canvas }) => {
        await expect(canvas.getByRole('link', { name: 'Teachers' })).toBeVisible()
        await expect(canvas.queryByRole('link', { name: 'Favorites' })).not.toBeInTheDocument()
        await expect(canvas.getByRole('button', { name: 'Log in' })).toBeVisible()
    },
}

export const Authorized: Story = {
    parameters: {
        auth: 'authenticated',
    },
    play: async ({ canvas }) => {
        await expect(canvas.getByRole('link', { name: 'Favorites' })).toHaveAttribute(
            'href',
            '/favorites'
        )
        await expect(canvas.getByText('Student')).toBeVisible()
    },
}

export const LinkClickStaysInStory: Story = {
    play: async ({ canvas, userEvent }) => {
        const link = canvas.getByRole('link', { name: 'Teachers' })
        const urlBefore = window.location.href
        let navigationPrevented = false

        window.addEventListener(
            'click',
            (event) => {
                navigationPrevented = event.defaultPrevented
            },
            { once: true }
        )
        await userEvent.click(link)

        await expect(link).toHaveAttribute('href', '/teachers')
        await expect(navigationPrevented).toBe(true)
        await expect(window.location.href).toBe(urlBefore)
    },
}
