'use client'

import Link from 'next/link'

import styles from './Header.module.css'
import AuthNavigation from '../AuthNavigation/AuthNavigation'
import { useAuthStore } from '@/lib/store/authStore'

export default function Header() {
    const { isAuthenticated } = useAuthStore()

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <div className={styles.logo_and_navigation}>
                    <Link href="/" className={styles.logo_link} aria-label="LearnLingo home">
                        <svg className={styles.logo} width="133" height="28" aria-hidden="true">
                            <use href="/logo.svg"></use>
                        </svg>
                    </Link>
                    <div className={styles.navigation}>
                        <Link href="/" className={styles.navigation_link}>
                            Home
                        </Link>
                        <Link
                            href="/teachers"
                            className={styles.navigation_link}
                        >
                            Teachers
                        </Link>
                        {isAuthenticated && (
                            <Link
                                href="/favorites"
                                className={styles.navigation_link}
                            >
                                Favorites
                            </Link>
                        )}
                    </div>
                </div>
                <AuthNavigation />
            </div>
        </header>
    )
}
