import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, screen } from 'storybook/test'

import Modal from './Modal'

const meta = {
    title: 'Overlays/Modal',
    component: Modal,
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component:
                    'Dialog wrapper used for the login, registration and booking forms. ' +
                    'It closes on the close button, on a backdrop click and on Escape, and locks page scroll while open. ' +
                    'Because it is portaled into `document.body`, play functions query it with `screen` instead of `canvas`, ' +
                    'and Docs renders each story in its own iframe so the backdrop does not cover the page.',
            },
            story: {
                inline: false,
                iframeHeight: 420,
            },
        },
    },
    argTypes: {
        children: {
            control: false,
            description: 'Modal content.',
        },
        label: {
            description: 'Accessible name of the dialog, announced by screen readers.',
        },
        onClose: {
            description:
                'Called on the close button, a backdrop click or Escape. The story does not unmount the modal, so it stays open.',
        },
    },
    args: {
        label: 'Log in',
        onClose: fn(),
        children: (
            <>
                <h2 style={{ marginTop: 0 }}>Log in</h2>
                <p style={{ margin: 0 }}>
                    Welcome back! Please enter your credentials to access your
                    account.
                </p>
            </>
        ),
    },
} satisfies Meta<typeof Modal>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    play: async ({ args }) => {
        const dialog = screen.getByRole('dialog')

        await expect(dialog).toHaveAttribute('aria-modal', 'true')
        await expect(dialog).toHaveAccessibleName('Log in')
        await expect(
            screen.getByRole('heading', { name: 'Log in' })
        ).toBeVisible()
        await expect(document.body.style.overflow).toBe('hidden')
        await expect(args.onClose).not.toHaveBeenCalled()
    },
}

export const CloseWithButton: Story = {
    play: async ({ args, userEvent }) => {
        await userEvent.click(
            screen.getByRole('button', { name: 'Close modal' })
        )

        await expect(args.onClose).toHaveBeenCalledTimes(1)
    },
}

export const CloseWithEscape: Story = {
    play: async ({ args, userEvent }) => {
        await userEvent.keyboard('{Escape}')

        await expect(args.onClose).toHaveBeenCalledTimes(1)
    },
}

export const CloseWithBackdropClick: Story = {
    play: async ({ args, userEvent }) => {
        await userEvent.click(screen.getByRole('dialog'))

        await expect(args.onClose).toHaveBeenCalledTimes(1)
    },
}

export const ClickInsideKeepsOpen: Story = {
    play: async ({ args, userEvent }) => {
        await userEvent.click(screen.getByRole('heading', { name: 'Log in' }))

        await expect(args.onClose).not.toHaveBeenCalled()
    },
}
