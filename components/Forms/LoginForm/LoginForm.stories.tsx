import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, waitFor } from 'storybook/test'

import LoginForm from './LoginForm'

const meta = {
    title: 'Forms/LoginForm',
    component: LoginForm,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component:
                    'Login form (Formik + Yup) shown inside the "Log in" modal. ' +
                    'Errors appear after a field is blurred or after the first submit attempt. ' +
                    'Every story below has a play function, so it doubles as an automated test.',
            },
        },
    },
    args: {
        onSubmit: fn(),
    },
} satisfies Meta<typeof LoginForm>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {
    play: async ({ args, canvas }) => {
        const email = canvas.getByPlaceholderText('Email')
        const password = canvas.getByPlaceholderText('Password')

        await expect(email).toHaveValue('')
        await expect(password).toHaveValue('')
        await expect(email).toHaveAttribute('aria-invalid', 'false')
        await expect(password).toHaveAttribute('aria-invalid', 'false')
        await expect(
            canvas.getByRole('button', { name: 'Log In' })
        ).toBeEnabled()
        await expect(args.onSubmit).not.toHaveBeenCalled()
    },
}

export const RequiredFields: Story = {
    play: async ({ args, canvas, userEvent }) => {
        const email = canvas.getByPlaceholderText('Email')
        const password = canvas.getByPlaceholderText('Password')

        await userEvent.click(canvas.getByRole('button', { name: 'Log In' }))

        await expect(
            await canvas.findByText('Please enter your email.')
        ).toBeVisible()
        await expect(
            canvas.getByText('Please enter your password.')
        ).toBeVisible()
        await expect(email).toHaveAttribute('aria-invalid', 'true')
        await expect(password).toHaveAttribute('aria-invalid', 'true')
        await expect(args.onSubmit).not.toHaveBeenCalled()
    },
}

export const InvalidEmail: Story = {
    play: async ({ args, canvas, userEvent, step }) => {
        const email = canvas.getByPlaceholderText('Email')
        const password = canvas.getByPlaceholderText('Password')

        await step(
            'Error appears when the email field loses focus',
            async () => {
                await userEvent.type(email, 'not-an-email')
                await userEvent.tab()

                await expect(
                    await canvas.findByText('Please enter a valid email.')
                ).toBeVisible()
                await expect(email).toHaveAttribute('aria-invalid', 'true')
                await expect(email).toHaveAccessibleDescription(
                    'Please enter a valid email.'
                )
            }
        )

        await step('Submit is blocked while the email is invalid', async () => {
            await userEvent.type(password, 'Secret123')
            await userEvent.click(
                canvas.getByRole('button', { name: 'Log In' })
            )

            await expect(password).toHaveAttribute('aria-invalid', 'false')
            await expect(args.onSubmit).not.toHaveBeenCalled()
        })
    },
}

export const SuccessfulSubmit: Story = {
    play: async ({ args, canvas, userEvent }) => {
        await userEvent.type(
            canvas.getByPlaceholderText('Email'),
            'jane@example.com'
        )
        await userEvent.type(
            canvas.getByPlaceholderText('Password'),
            'Secret123'
        )
        await userEvent.click(canvas.getByRole('button', { name: 'Log In' }))

        await waitFor(() =>
            expect(args.onSubmit).toHaveBeenCalledWith(
                { email: 'jane@example.com', password: 'Secret123' },
                expect.anything()
            )
        )
        await expect(args.onSubmit).toHaveBeenCalledTimes(1)
        await expect(
            canvas.queryByText(/please enter/i)
        ).not.toBeInTheDocument()
    },
}

export const Submitting: Story = {
    parameters: {
        docs: {
            description: {
                story: '`onSubmit` returns a promise that never settles, so Formik keeps `isSubmitting` and the button stays disabled.',
            },
        },
    },
    args: {
        onSubmit: fn(() => new Promise<void>(() => {})),
    },
    play: async ({ canvas, userEvent }) => {
        const button = canvas.getByRole('button', { name: 'Log In' })

        await userEvent.type(
            canvas.getByPlaceholderText('Email'),
            'jane@example.com'
        )
        await userEvent.type(
            canvas.getByPlaceholderText('Password'),
            'Secret123'
        )
        await userEvent.click(button)

        await waitFor(() => expect(button).toBeDisabled())
    },
}

export const TogglePasswordVisibility: Story = {
    play: async ({ canvas, userEvent }) => {
        const password = canvas.getByLabelText('Password')
        const toggle = canvas.getByRole('button', { name: 'Show password' })

        await userEvent.type(password, 'Secret123')
        await userEvent.tab()
        await expect(toggle).toHaveFocus()

        await userEvent.keyboard('{Enter}')
        await expect(password).toHaveAttribute('type', 'text')
        await expect(toggle).toHaveAttribute('aria-pressed', 'true')

        await userEvent.keyboard(' ')
        await expect(password).toHaveAttribute('type', 'password')
        await expect(toggle).toHaveAttribute('aria-pressed', 'false')
    },
}
