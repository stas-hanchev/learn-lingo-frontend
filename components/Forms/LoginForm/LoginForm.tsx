import { Field, Form, Formik, FormikHelpers } from 'formik'
import * as Yup from 'yup'
import { LoginRequestBody } from '@/lib/types'
import { FiAlertCircle } from 'react-icons/fi'

import styles from './LoginForm.module.css'
import { useState } from 'react'
import { publicPath } from '@/lib/publicPath'

interface LoginFormProps {
    onSubmit: (
        values: LoginRequestBody,
        actions: FormikHelpers<LoginRequestBody>
    ) => void
}

const initialValues: LoginRequestBody = {
    email: '',
    password: '',
}

const LoginFormSchema = Yup.object().shape({
    email: Yup.string()
        .email('Please enter a valid email.')
        .required('Please enter your email.'),

    password: Yup.string().required('Please enter your password.'),
})

export default function LoginForm({ onSubmit }: LoginFormProps) {
    const [showPassword, setShowPassword] = useState(false)
    
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={LoginFormSchema}
            onSubmit={onSubmit}
        >
            {({ errors, touched, submitCount, isSubmitting }) => {

                const emailHasError =
                    Boolean(errors.email) &&
                    (Boolean(touched.email) || submitCount > 0)

                const passwordHasError =
                    Boolean(errors.password) &&
                    (Boolean(touched.password) || submitCount > 0)

                return (
                    <Form className={styles.form} noValidate>
                        <div
                            className={`${styles.field_group} ${styles.email_field_group}`}
                        >
                            <div className={styles.input_wrapper}>
                                <Field
                                    id="email"
                                    aria-label="Email"
                                    type="email"
                                    name="email"
                                    placeholder={emailHasError ? '' : 'Email'}
                                    className={`${styles.email_input} ${
                                        emailHasError ? styles.input_error : ''
                                    }`}
                                    aria-invalid={emailHasError}
                                    aria-describedby={
                                        emailHasError
                                            ? 'email-error'
                                            : undefined
                                    }
                                />

                                {emailHasError && (
                                    <FiAlertCircle
                                        className={styles.error_icon}
                                        aria-hidden="true"
                                    />
                                )}
                            </div>

                            {emailHasError && (
                                <span id="email-error" className={styles.error}>
                                    {errors.email}
                                </span>
                            )}
                        </div>

                        <div
                            className={`${styles.field_group} ${styles.password_field_group}`}
                        >
                            <div className={styles.input_wrapper}>
                                <Field
                                    id="password"
                                    aria-label="Password"
                                    type={`${showPassword ? 'text' : 'password'}`}
                                    name="password"
                                    placeholder={
                                        passwordHasError ? '' : 'Password'
                                    }
                                    className={`${styles.password_input} ${
                                        passwordHasError ? styles.input_error : ''
                                    }`}
                                    aria-invalid={passwordHasError}
                                    aria-describedby={
                                        passwordHasError
                                            ? 'password-error'
                                            : undefined
                                    }
                                />

                                <button
                                    type="button"
                                    className={`${styles.eye_button} ${passwordHasError ? styles.eye_button_with_error : ''}`}
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label="Show password"
                                    aria-pressed={showPassword}
                                >
                                    <svg
                                        width="20"
                                        height="20"
                                        className={styles.eye_icon}
                                        aria-hidden="true"
                                    >
                                        <use href={publicPath('/sprite.svg#icon-eye-off')}></use>
                                    </svg>
                                </button>

                                {passwordHasError && (
                                    <FiAlertCircle
                                        className={styles.error_icon}
                                        aria-hidden="true"
                                    />
                                )}
                            </div>

                            {passwordHasError && (
                                <span
                                    id="password-error"
                                    className={styles.error}
                                >
                                    {errors.password}
                                </span>
                            )}
                        </div>

                        <button
                            className={styles.send_btn}
                            type="submit"
                            disabled={isSubmitting}
                        >
                            Log In
                        </button>
                    </Form>
                )
            }}
        </Formik>
    )
}
