import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, waitFor } from 'storybook/test'

import RegistrationForm from './RegistrationForm'

const meta = {
    title: 'Forms/RegistrationForm',
    component: RegistrationForm,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component:
                    'Sign-up form (Formik + Yup) shown inside the "Registration" modal. ' +
                    'The password must be at least 8 characters long and contain an uppercase letter, a lowercase letter and a digit.',
            },
        },
    },
    args: {
        onSubmit: fn(),
    },
} satisfies Meta<typeof RegistrationForm>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {}

export const RequiredFields: Story = {
    play: async ({ args, canvas, userEvent }) => {
        const name = canvas.getByPlaceholderText('Name')
        const email = canvas.getByPlaceholderText('Email')
        const password = canvas.getByPlaceholderText('Password')

        await userEvent.click(canvas.getByRole('button', { name: 'Sign Up' }))

        await expect(await canvas.findByText('Please enter your name.')).toBeVisible()
        await expect(name).toHaveAccessibleDescription('Please enter your name.')
        await expect(email).toHaveAccessibleDescription('Please enter your email.')
        await expect(password).toHaveAccessibleDescription(
            'Please enter your password.'
        )
        await expect(args.onSubmit).not.toHaveBeenCalled()
    },
}

export const WeakPassword: Story = {
    play: async ({ args, canvas, userEvent }) => {
        const password = canvas.getByPlaceholderText('Password')

        await userEvent.type(canvas.getByPlaceholderText('Name'), 'Jane')
        await userEvent.type(canvas.getByPlaceholderText('Email'), 'jane@example.com')
        await userEvent.type(password, 'Password')
        await userEvent.click(canvas.getByRole('button', { name: 'Sign Up' }))

        await expect(
            await canvas.findByText('Password must contain at least one number.')
        ).toBeVisible()
        await expect(password).toHaveAttribute('aria-invalid', 'true')
        await expect(args.onSubmit).not.toHaveBeenCalled()
    },
}

export const SuccessfulSubmit: Story = {
    play: async ({ args, canvas, userEvent }) => {
        await userEvent.type(canvas.getByPlaceholderText('Name'), 'Jane')
        await userEvent.type(canvas.getByPlaceholderText('Email'), 'jane@example.com')
        await userEvent.type(canvas.getByPlaceholderText('Password'), 'Secret123')
        await userEvent.click(canvas.getByRole('button', { name: 'Sign Up' }))

        await waitFor(() =>
            expect(args.onSubmit).toHaveBeenCalledWith(
                { name: 'Jane', email: 'jane@example.com', password: 'Secret123' },
                expect.anything()
            )
        )
    },
}
