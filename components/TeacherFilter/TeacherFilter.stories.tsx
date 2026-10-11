import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn } from 'storybook/test'

import TeacherFilter from './TeacherFilter'

const meta = {
    title: 'Teachers/TeacherFilter',
    component: TeacherFilter,
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component:
                    'Language, level and price filters above the teachers list (react-select). ' +
                    'Every change calls `onChange` with the full set of filters, not only the changed one.',
            },
        },
    },
    decorators: [
        (Story) => (
            <div style={{ minHeight: 380 }}>
                <Story />
            </div>
        ),
    ],
    argTypes: {
        onChange: {
            description:
                'Called with `{ language, level, price }` after every selection; unselected filters are `null`.',
        },
    },
    args: {
        onChange: fn(),
    },
} satisfies Meta<typeof TeacherFilter>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    play: async ({ args, canvas }) => {
        await expect(
            canvas.getByRole('combobox', { name: 'Languages' })
        ).toBeVisible()
        await expect(
            canvas.getByRole('combobox', { name: 'Level of knowledge' })
        ).toBeVisible()
        await expect(
            canvas.getByRole('combobox', { name: 'Price, $' })
        ).toBeVisible()
        await expect(args.onChange).not.toHaveBeenCalled()
    },
}

export const SelectLanguage: Story = {
    play: async ({ args, canvas, userEvent }) => {
        await userEvent.click(
            canvas.getByRole('combobox', { name: 'Languages' })
        )
        await userEvent.click(
            await canvas.findByRole('option', { name: 'French' })
        )

        await expect(args.onChange).toHaveBeenCalledTimes(1)
        await expect(args.onChange).toHaveBeenCalledWith({
            language: { value: 'French', label: 'French' },
            level: null,
            price: null,
        })
        await expect(canvas.getByText('French')).toBeVisible()
    },
}

export const CombineFilters: Story = {
    play: async ({ args, canvas, userEvent, step }) => {
        await step('Pick a language', async () => {
            await userEvent.click(
                canvas.getByRole('combobox', { name: 'Languages' })
            )
            await userEvent.click(
                await canvas.findByRole('option', { name: 'German' })
            )
        })

        await step('Pick a level', async () => {
            await userEvent.click(
                canvas.getByRole('combobox', { name: 'Level of knowledge' })
            )
            await userEvent.click(
                await canvas.findByRole('option', { name: 'B1 Intermediate' })
            )
        })

        await step('Pick a price', async () => {
            await userEvent.click(
                canvas.getByRole('combobox', { name: 'Price, $' })
            )
            await userEvent.click(
                await canvas.findByRole('option', { name: '30' })
            )
        })

        await expect(args.onChange).toHaveBeenCalledTimes(3)
        await expect(args.onChange).toHaveBeenLastCalledWith({
            language: { value: 'German', label: 'German' },
            level: { value: 'B1 Intermediate', label: 'B1 Intermediate' },
            price: { value: '30', label: '30' },
        })
    },
}
