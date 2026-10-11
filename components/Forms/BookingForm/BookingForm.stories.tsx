import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, waitFor } from 'storybook/test'

import BookingForm from './BookingForm'
import { LearningReason } from '@/lib/types'

const meta = {
    title: 'Forms/BookingForm',
    component: BookingForm,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component:
                    'Trial lesson booking form (Formik + Yup) shown inside the "Book trial lesson" modal of a teacher card: ' +
                    'a learning reason (radio group), full name, email and phone number.',
            },
        },
    },
    args: {
        onSubmit: fn(),
    },
} satisfies Meta<typeof BookingForm>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {}

export const RequiredFields: Story = {
    play: async ({ args, canvas, userEvent }) => {
        await userEvent.click(canvas.getByRole('button', { name: 'Book' }))

        await expect(
            await canvas.findByText('Please select a learning reason.')
        ).toBeVisible()
        await expect(canvas.getByRole('radiogroup')).toHaveAttribute(
            'aria-invalid',
            'true'
        )
        await expect(canvas.getByText('Please enter your name.')).toBeVisible()
        await expect(canvas.getByText('Please enter your email.')).toBeVisible()
        await expect(canvas.getByText('Please enter your phone number.')).toBeVisible()
        await expect(args.onSubmit).not.toHaveBeenCalled()
    },
}

export const InvalidPhone: Story = {
    play: async ({ args, canvas, userEvent }) => {
        const phone = canvas.getByPlaceholderText('Phone number')

        await userEvent.click(
            canvas.getByRole('radio', { name: LearningReason.livingAbroad })
        )
        await userEvent.type(canvas.getByPlaceholderText('Full Name'), 'Jane Doe')
        await userEvent.type(canvas.getByPlaceholderText('Email'), 'jane@example.com')
        await userEvent.type(phone, '12-34')
        await userEvent.click(canvas.getByRole('button', { name: 'Book' }))

        await expect(
            await canvas.findByText('Please enter a valid phone number.')
        ).toBeVisible()
        await expect(phone).toHaveAccessibleDescription(
            'Please enter a valid phone number.'
        )
        await expect(args.onSubmit).not.toHaveBeenCalled()
    },
}

export const SuccessfulSubmit: Story = {
    play: async ({ args, canvas, userEvent }) => {
        const reason = canvas.getByRole('radio', {
            name: LearningReason.careerAndBusiness,
        })

        await userEvent.click(reason)
        await expect(reason).toBeChecked()

        await userEvent.type(canvas.getByPlaceholderText('Full Name'), 'Jane Doe')
        await userEvent.type(canvas.getByPlaceholderText('Email'), 'jane@example.com')
        await userEvent.type(
            canvas.getByPlaceholderText('Phone number'),
            '+380 67 123 45 67'
        )
        await userEvent.click(canvas.getByRole('button', { name: 'Book' }))

        await waitFor(() =>
            expect(args.onSubmit).toHaveBeenCalledWith(
                {
                    reason: LearningReason.careerAndBusiness,
                    full_name: 'Jane Doe',
                    email: 'jane@example.com',
                    phone_number: '+380 67 123 45 67',
                },
                expect.anything()
            )
        )
    },
}
