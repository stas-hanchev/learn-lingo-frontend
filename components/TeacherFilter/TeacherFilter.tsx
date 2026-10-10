import { Language, Level, Price, OptionType, SelectFilters } from '@/lib/types'
import { enumToOptions } from '@/lib/helpers'
import styles from './TeacherFilter.module.css'
import Select, { StylesConfig } from 'react-select'
import { useState } from 'react'

const customStyles: StylesConfig<OptionType, false> = {
    control: (base, state) => ({
        ...base,
        width: 221,
        minHeight: 48,
        borderRadius: 14,
        borderColor: state.isFocused ? '#F4C550' : '#fff',
        boxShadow: state.isFocused ? '0 0 0 3px rgba(59,130,246,0.15)' : 'none',
        '&:hover': { borderColor: '#F4C550' },
    }),
    menu: (base) => ({
        ...base,
        borderRadius: 8,
        overflow: 'hidden',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
    }),
    option: (base, state) => ({
        ...base,
        backgroundColor: state.isSelected
            ? '#F4C550'
            : state.isFocused
              ? 'rgb(255, 255, 188)'
              : '#fff',
        color: state.isSelected ? '#fff' : '#111',
        cursor: 'pointer',
    }),
    singleValue: (base) => ({
        ...base,
        color: '#111',
    }),
    placeholder: (base) => ({
        ...base,
        color: '#9ca3af',
    }),
    indicatorSeparator: () => ({ display: 'none' }),
}

interface TeacherFilterProps {
    onChange: (next: SelectFilters) => void
}

export default function TeacherFilter({ onChange }: TeacherFilterProps) {
    const languageOptions = enumToOptions(Language)
    const levelOptions = enumToOptions(Level)
    const priceOptions = enumToOptions(Price)

    const [filters, setFilters] = useState<SelectFilters>({
        language: null,
        level: null,
        price: null,
    })

    const updateFilters = (patch: Partial<SelectFilters>) => {
        const next = { ...filters, ...patch }
        setFilters(next)
        onChange(next)
    }

    return (
        <div className={styles.filters_container}>
            <div className={styles.filter_container}>
                <p className={styles.filter_name}>Languages</p>
                <Select<OptionType, false>
                    instanceId="language-select"
                    styles={customStyles}
                    options={languageOptions}
                    onChange={(option) => updateFilters({ language: option })}
                    placeholder="Preferred language"
                />
            </div>

            <div className={styles.filter_container}>
                <p className={styles.filter_name}>Level of knowledge</p>
                <Select<OptionType, false>
                    instanceId="level-select"
                    styles={customStyles}
                    options={levelOptions}
                    onChange={(option) => updateFilters({ level: option })}
                    placeholder="CEFR level"
                />
            </div>

            <div className={styles.filter_container}>
                <p className={styles.filter_name}>Price, $</p>
                <Select<OptionType, false>
                    instanceId="price-select"
                    styles={customStyles}
                    options={priceOptions}
                    onChange={(option) => updateFilters({ price: option })}
                    placeholder="Maximum price"
                />
            </div>
        </div>
    )
}
