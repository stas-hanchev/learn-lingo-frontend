import type { Metadata } from 'next'
import 'modern-normalize/modern-normalize.css'
import './globals.css'
import Header from '@/components/Header/Header'
import TanStackProvider from '@/components/TanStackProvider/TanStackProvider'
import AuthProvider from '@/components/AuthProvider/AuthProvider'
import ToastProvider from '@/components/ToastProvider/ToastProvider'

import { Roboto } from 'next/font/google';

const roboto = Roboto({
  subsets: ['latin'], 
  weight: ['400', '500', '700'],
  variable: '--font-roboto', 
  display: 'swap', 
});

export const metadata: Metadata = {
    title: 'LearnLingo',
    description:
        'A language learning app that helps you learn new languages quickly and effectively.',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html
            lang="en"
        >
            <body className={roboto.variable} suppressHydrationWarning>
                <TanStackProvider>
                    <AuthProvider>
                        <Header />
                        {children}
                    </AuthProvider>
                    <ToastProvider />
                </TanStackProvider>
            </body>
        </html>
    )
}
