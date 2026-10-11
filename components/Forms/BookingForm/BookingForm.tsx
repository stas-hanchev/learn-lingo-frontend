import { Field, Form, Formik, FormikHelpers } from 'formik'
import * as Yup from 'yup'
import { FiAlertCircle } from 'react-icons/fi'

import styles from './BookingForm.module.css'

import { BookingRequestBody, LearningReason } from '@/lib/types'

interface BookingFormProps {
    onSubmit: (
        values: BookingRequestBody,
        actions: FormikHelpers<BookingRequestBody>
    ) => void
}

const initialValues: BookingRequestBody = {
    reason: LearningReason.EmptyValue,
    full_name: '',
    email: '',
    phone_number: '',
}

const BookingFormSchema = Yup.object().shape({
    reason: Yup.mixed<LearningReason>()
        .oneOf(
            Object.values(LearningReason).filter(
                (value) => value !== LearningReason.EmptyValue
            ),
            'Please select a learning reason.'
        )
        .required('Please select a learning reason.'),

    full_name: Yup.string()
        .min(2, 'Name must contain at least 2 characters.')
        .max(50, 'Name must contain less than 50 characters.')
        .required('Please enter your name.'),

    email: Yup.string()
        .email('Please enter a valid email.')
        .required('Please enter your email.'),

    phone_number: Yup.string()
        .matches(
            /^\+?[0-9\s\-()]{10,20}$/,
            'Please enter a valid phone number.'
        )
        .required('Please enter your phone number.'),
})

export default function BookingForm({ onSubmit }: BookingFormProps) {
    const learningReasons = Object.values(LearningReason).filter(
        (reason) => reason !== LearningReason.EmptyValue
    )

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={BookingFormSchema}
            onSubmit={onSubmit}
        >
            {({ errors, touched, submitCount, isSubmitting }) => {
                const reasonHasError =
                    Boolean(errors.reason) &&
                    (Boolean(touched.reason) || submitCount > 0)

                const fullNameHasError =
                    Boolean(errors.full_name) &&
                    (Boolean(touched.full_name) || submitCount > 0)

                const emailHasError =
                    Boolean(errors.email) &&
                    (Boolean(touched.email) || submitCount > 0)

                const phoneNumberHasError =
                    Boolean(errors.phone_number) &&
                    (Boolean(touched.phone_number) || submitCount > 0)

                return (
                    <Form className={styles.form} noValidate>
                        <h3 id="reason-label" className={styles.subtitle}>What is your main reason for learning English?</h3>
                        <div
                            className={`${styles.field_group} ${styles.reason_field_group}`}
                        >
                            <div
                                className={`${styles.radio_group}`}
                                role="radiogroup"
                                aria-labelledby="reason-label"
                                aria-invalid={reasonHasError}
                                aria-describedby={
                                    reasonHasError ? 'reason-error' : undefined
                                }
                            >
                                {learningReasons.map((reason) => (
                                    <label
                                        key={reason}
                                        className={styles.radio_label}
                                    >
                                        <Field
                                            type="radio"
                                            name="reason"
                                            value={reason}
                                            className={styles.radio_input}
                                        />

                                        <span className={styles.radio_text}>
                                            {reason}
                                        </span>
                                    </label>
                                ))}
                            </div>

                            {reasonHasError && (
                                <div className={styles.error_wrapper}>
                                    <span
                                        id="reason-error"
                                        className={styles.error}
                                    >
                                        {errors.reason}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div
                            className={`${styles.field_group} ${styles.name_field_group}`}
                        >
                            <div className={styles.input_wrapper}>
                                <Field
                                    id="full_name"
                                    aria-label="Full Name"
                                    name="full_name"
                                    placeholder={
                                        fullNameHasError ? '' : 'Full Name'
                                    }
                                    className={`${styles.name_input} ${
                                        fullNameHasError
                                            ? styles.input_error
                                            : ''
                                    }`}
                                    aria-invalid={fullNameHasError}
                                    aria-describedby={
                                        fullNameHasError
                                            ? 'full-name-error'
                                            : undefined
                                    }
                                />

                                {fullNameHasError && (
                                    <FiAlertCircle
                                        className={styles.error_icon}
                                        aria-hidden="true"
                                    />
                                )}
                            </div>

                            {fullNameHasError && (
                                <span
                                    id="full-name-error"
                                    className={styles.error}
                                >
                                    {errors.full_name}
                                </span>
                            )}
                        </div>

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
                            className={`${styles.field_group} ${styles.phone_field_group}`}
                        >
                            <div className={styles.input_wrapper}>
                                <Field
                                    id="phone_number"
                                    aria-label="Phone number"
                                    type="text"
                                    name="phone_number"
                                    placeholder={
                                        phoneNumberHasError
                                            ? ''
                                            : 'Phone number'
                                    }
                                    className={`${styles.phone_input} ${
                                        phoneNumberHasError
                                            ? styles.input_error
                                            : ''
                                    }`}
                                    aria-invalid={phoneNumberHasError}
                                    aria-describedby={
                                        phoneNumberHasError
                                            ? 'phone-error'
                                            : undefined
                                    }
                                />

                                {phoneNumberHasError && (
                                    <FiAlertCircle
                                        className={styles.error_icon}
                                        aria-hidden="true"
                                    />
                                )}
                            </div>

                            {phoneNumberHasError && (
                                <span id="phone-error" className={styles.error}>
                                    {errors.phone_number}
                                </span>
                            )}
                        </div>

                        <button
                            className={styles.booking_btn}
                            type="submit"
                            disabled={isSubmitting}
                        >
                            Book
                        </button>
                    </Form>
                )
            }}
        </Formik>
    )
}
