import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, screen, waitFor, within } from 'storybook/test'

import TeacherCard from './TeacherCard'
import { Level } from '@/lib/types'
import { useAuthModalStore } from '@/lib/store/authModalStore'
import { janeSmith, olhaKovalenko } from '@/mocks/teachers'
import { withQueryClient, withTeachersPage, withToaster } from '@/.storybook/decorators'

const meta = {
    title: 'Teachers/TeacherCard',
    component: TeacherCard,
    tags: ['autodocs'],
    decorators: [withTeachersPage, withToaster, withQueryClient],
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component:
                    'Teacher card from the teachers list. "Read more" expands the experience and reviews (`ReviewItem`); ' +
                    '"Book trial lesson" opens the booking modal for a logged-in user and shows a login prompt for a guest. ' +
                    'The auth state comes from the zustand store and is set per story with `parameters.auth`; ' +
                    'the favorites list for `FavoriteButton` is seeded with `parameters.favorites`.',
            },
        },
    },
    argTypes: {
        teacher: {
            description: 'Teacher object from the API (`Teacher` in `lib/types.ts`).',
        },
        levelValue: {
            description: 'Level selected in the filter; the matching level badge is highlighted.',
            control: 'select',
            options: [undefined, ...Object.values(Level).filter((level) => level !== Level.all)],
        },
    },
    args: {
        teacher: janeSmith,
        levelValue: undefined,
    },
} satisfies Meta<typeof TeacherCard>

export default meta
type Story = StoryObj<typeof meta>

export const Guest: Story = {
    play: async ({ canvas, userEvent, step }) => {
        await step('Avatar is requested straight from the remote domain', async () => {
            const avatar = canvas.getByAltText("Teacher Jane's avatar.")
            await expect(avatar.getAttribute('src')).toMatch(
                /^https:\/\/ftp\.goit\.study\/img\/avatars\/1\.jpg\?w=\d+&q=\d+$/
            )
        })

        await step('"Read more" shows the experience and reviews', async () => {
            await userEvent.click(canvas.getByRole('button', { name: 'Read more' }))

            await expect(canvas.getByText(janeSmith.experience)).toBeVisible()
            await expect(canvas.getByText('Frank')).toBeVisible()
            await expect(canvas.getByText('Eve')).toBeVisible()
            await expect(
                canvas.queryByRole('button', { name: 'Read more' })
            ).not.toBeInTheDocument()
        })

        await step('A guest gets a login prompt instead of the booking modal', async () => {
            await userEvent.click(canvas.getByRole('button', { name: 'Book trial lesson' }))

            await expect(
                await screen.findByText('Log in to book a trial lesson.')
            ).toBeVisible()
            await expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
        })

        await step('"Log in" in the prompt opens the login modal via the store', async () => {
            await userEvent.click(screen.getByRole('button', { name: 'Log in' }))

            await expect(useAuthModalStore.getState().openedModal).toBe('login')
        })
    },
}

export const Authorized: Story = {
    parameters: {
        auth: 'authenticated',
    },
    play: async ({ canvas, userEvent, step }) => {
        await userEvent.click(canvas.getByRole('button', { name: 'Read more' }))

        await step('"Book trial lesson" opens the booking modal', async () => {
            await userEvent.click(canvas.getByRole('button', { name: 'Book trial lesson' }))

            const dialog = within(await screen.findByRole('dialog'))
            await expect(
                dialog.getByRole('heading', { name: 'Book trial lesson' })
            ).toBeVisible()
            await expect(dialog.getByText('Jane Smith')).toBeVisible()
        })

        await step('Submitting the form closes the modal and confirms the booking', async () => {
            const form = within(screen.getByRole('dialog'))

            await userEvent.click(form.getByRole('radio', { name: 'Living abroad' }))
            await userEvent.type(form.getByPlaceholderText('Full Name'), 'Student Name')
            await userEvent.type(form.getByPlaceholderText('Email'), 'student@example.com')
            await userEvent.type(form.getByPlaceholderText('Phone number'), '+380 67 123 45 67')
            await userEvent.click(form.getByRole('button', { name: 'Book' }))

            await waitFor(() =>
                expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
            )
            await expect(
                await screen.findByText(
                    'Trial lesson with Jane Smith is booked! We will contact you at student@example.com.'
                )
            ).toBeVisible()
        })
    },
}

export const AuthorizedFavorite: Story = {
    parameters: {
        auth: 'authenticated',
        favorites: [janeSmith],
        docs: {
            description: {
                story: 'The teacher is already in the seeded favorites list, so the heart is active.',
            },
        },
    },
    play: async ({ canvas }) => {
        const favoriteButton = canvas.getByRole('button', { name: 'Remove from favorites' })
        await expect(favoriteButton).toHaveAttribute('aria-pressed', 'true')
    },
}

export const HighlightedLevel: Story = {
    args: {
        levelValue: Level.intermediate,
    },
}

export const WithoutReviews: Story = {
    args: {
        teacher: olhaKovalenko,
    },
    play: async ({ canvas, userEvent }) => {
        await userEvent.click(canvas.getByRole('button', { name: 'Read more' }))

        await expect(canvas.getByText(olhaKovalenko.experience)).toBeVisible()
        await expect(canvas.getByRole('button', { name: 'Book trial lesson' })).toBeVisible()
    },
}
