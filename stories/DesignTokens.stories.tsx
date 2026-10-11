import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect } from 'storybook/test'

import { colorTokens } from './tokens'

function TokenValues() {
    return (
        <dl>
            {colorTokens.map(({ name, value }) => (
                <div key={name} style={{ display: 'flex', gap: 8 }}>
                    <dt style={{ width: 24, height: 24, background: `var(${name})` }} />
                    <dd style={{ margin: 0 }}>
                        <code>{name}</code>: {value}
                    </dd>
                </div>
            ))}
        </dl>
    )
}

const meta = {
    title: 'Foundations/Token Sync',
    component: TokenValues,
    tags: ['!dev', '!autodocs'],
} satisfies Meta<typeof TokenValues>

export default meta
type Story = StoryObj<typeof meta>

export const ColorsMatchGlobalCss: Story = {
    play: async () => {
        const rootStyle = getComputedStyle(document.documentElement)

        for (const { name, value } of colorTokens) {
            await expect(rootStyle.getPropertyValue(name).trim(), name).toBe(value)
        }
    },
}
