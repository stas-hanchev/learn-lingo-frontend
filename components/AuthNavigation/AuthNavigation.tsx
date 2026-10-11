'use client'

import { RegisterRequestBody, LoginRequestBody } from '@/lib/types'
import { FormikHelpers } from 'formik'

import styles from './AuthNavigation.module.css'

import Modal from '../Modal/Modal'
import RegistrationForm from '../Forms/RegistrationForm/RegistrationForm'
import LoginForm from '../Forms/LoginForm/LoginForm'
import { login, register, logout } from '@/lib/api'

import { useAuthStore } from '@/lib/store/authStore'
import { useAuthModalStore } from '@/lib/store/authModalStore'
import { notifyError, notifySuccess } from '@/lib/notify'
import { publicPath } from '@/lib/publicPath'

export default function AuthNavigation() {
    const { isAuthenticated, user } = useAuthStore()

    const setUser = useAuthStore((state) => state.setUser);

    const clearIsAuthenticated = useAuthStore(
        (state) => state.clearIsAuthenticated
    );

    const { openedModal, openLoginModal, openRegistrationModal, closeModal } =
        useAuthModalStore()

    const handleRegistrationSubmit = async (
        values: RegisterRequestBody,
        actions: FormikHelpers<RegisterRequestBody>
    ) => {
        try {
            const response = await register(values);
            setUser(response);

            if (response._id) {
                actions.resetForm()
                closeModal()
                notifySuccess(`Welcome to LearnLingo, ${response.name}! Your account has been created.`)
            }
        } catch (error) {
            console.error(error)
            notifyError(error, 'Registration failed. Please try again.')
        } finally {
            actions.setSubmitting(false)
        }
    }

    const handleLoginSubmit = async (
        values: LoginRequestBody,
        actions: FormikHelpers<LoginRequestBody>
    ) => {
        try {
            const response = await login(values)
            setUser(response);
            
            if (response._id) {
                actions.resetForm()
                closeModal()
                notifySuccess(`Welcome back, ${response.name}!`)
            }
        } catch (error) {
            console.error(error)
            notifyError(error, 'Login failed. Please check your email and password.')
        } finally {
            actions.setSubmitting(false)
        }
    }

    const handleLogout = async () => {
        try {
            await logout();
            clearIsAuthenticated();
            notifySuccess('You have been logged out.')
        } catch (error) {
            console.error(error)
            notifyError(error, 'Failed to log out. Please try again.')
        }
    }

    return !isAuthenticated ? (
        <div className={styles.auth_links}>
            <button
                type="button"
                className={styles.login_button}
                onClick={openLoginModal}
            >
                <svg className={styles.login_icon} width="20" height="20">
                    <use href={publicPath('/sprite.svg#icon-log-in')}></use>
                </svg>
                Log in
            </button>

            {openedModal === 'login' && (
                <Modal label="Log in" onClose={closeModal}>
                    <h2 className={styles.heading}>Log in</h2>
                    <p className={styles.description}>
                        Welcome back! Please enter your credentials to access
                        your account and continue your search for an teacher.
                    </p>
                    <LoginForm onSubmit={handleLoginSubmit}></LoginForm>
                </Modal>
            )}

            <button
                type="button"
                className={styles.registration_button}
                onClick={openRegistrationModal}
            >
                Registration
            </button>

            {openedModal === 'registration' && (
                <Modal label="Registration" onClose={closeModal}>
                    <h2 className={styles.heading}>Registration</h2>
                    <p className={styles.description}>
                        Thank you for your interest in our platform! In order to
                        register, we need some information. Please provide us
                        with the following information.
                    </p>
                    <RegistrationForm
                        onSubmit={handleRegistrationSubmit}
                    ></RegistrationForm>
                </Modal>
            )}
        </div>
    ) : (
        <div className={styles.auth_links}>
            <p className={styles.username}>{user?.name}</p>
            <button className={styles.logout_button} onClick={handleLogout}>Log Out</button>
        </div>
    )
}
