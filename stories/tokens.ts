export interface ColorToken {
    name: `--color-${string}`
    value: string
    usage: string
}

export const colorTokens: ColorToken[] = [
    { name: '--color-text-primary', value: '#121417', usage: 'Headings, body text, outlined buttons' },
    { name: '--color-text-secondary', value: '#727271', usage: 'Captions, labels, meta information' },
    { name: '--color-accent', value: '#f4c550', usage: 'Primary buttons, highlighted level badge, focus accents' },
    { name: '--color-accent-light', value: '#fbe9ba', usage: 'Avatar ring, hero accents' },
    { name: '--color-rating', value: '#ffc531', usage: 'Rating stars' },
    { name: '--color-background', value: '#f8f8f8', usage: 'Page background behind cards' },
    { name: '--color-surface', value: '#ffffff', usage: 'Cards, modals, inputs' },
    { name: '--color-border', value: 'rgba(18, 20, 23, 0.1)', usage: 'Input and card borders' },
    { name: '--color-error', value: '#ee0017', usage: 'Validation messages' },
    { name: '--color-success', value: '#228726', usage: 'Lesson price' },
]
