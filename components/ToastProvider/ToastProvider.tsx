'use client'

import { Toaster } from 'react-hot-toast'

export default function ToastProvider() {
    return (
        <Toaster
            position="top-right"
            toastOptions={{
                duration: 4000,
                style: {
                    borderRadius: 12,
                    padding: '12px 16px',
                    color: '#121417',
                    fontFamily: 'var(--font-family)',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                },
                success: { iconTheme: { primary: '#F4C550', secondary: '#fff' } },
            }}
        />
    )
}
