import toast from 'react-hot-toast'
import { AxiosError } from 'axios'
import { useAuthModalStore } from '@/lib/store/authModalStore'
import styles from '@/components/ToastProvider/ToastProvider.module.css'

export const getErrorMessage = (
    error: unknown,
    fallback = 'Something went wrong. Please try again.'
) => {
    const data = (error as AxiosError<{ error?: string; message?: string }>)
        .response?.data
    return data?.error ?? data?.message ?? fallback
}

export const notifySuccess = (message: string) => toast.success(message)

export const notifyError = (error: unknown, fallback?: string) =>
    toast.error(getErrorMessage(error, fallback))

export const notifyLoginRequired = (message: string) =>
    toast(
        (t) => (
            <span className={styles.content}>
                {message}
                <button
                    type="button"
                    className={styles.action}
                    onClick={() => {
                        toast.dismiss(t.id)
                        useAuthModalStore.getState().openLoginModal()
                    }}
                >
                    Log in
                </button>
            </span>
        ),
        { id: 'login-required', icon: '🔒' }
    )
