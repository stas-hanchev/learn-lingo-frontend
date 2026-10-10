'use client'

import Image from 'next/image'
import { BookingRequestBody, Teacher } from '@/lib/types'

import { FaStar } from 'react-icons/fa'
import styles from './TeacherCard.module.css'
import FavoriteButton from '../FavoriteButton/FavoriteButton'
import { useState } from 'react'
import ReviewItem from '../ReviewItem/ReviewItem'
import { useAuthStore } from '@/lib/store/authStore'
import Modal from '../Modal/Modal'
import BookingForm from '@/components/Forms/BookingForm/BookingForm'
import { FormikHelpers } from 'formik'

interface TeacherCardProps {
    teacher: Teacher
    levelValue: string | undefined
}

export default function TeacherCard({ teacher, levelValue }: TeacherCardProps) {
    const { isAuthenticated, user } = useAuthStore()
    const [isExpanded, setIsExpanded] = useState(false)
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)

    const toggleExpanded = () => {
        if (isExpanded) {
            setIsExpanded(false)
        } else {
            setIsExpanded(true)
        }
    }

    const handleBookButtonClick = () => {
        if (isAuthenticated) {
            setIsBookingModalOpen(true)
        } else {
            alert('First, you need to log in!')
        }
    }

    const handleBookingSubmit = async (
        values: BookingRequestBody,
        actions: FormikHelpers<BookingRequestBody>
    ) => {
        try {
            const formattedValues = Object.entries(values)
                .map(([key, value]) => `${key} - ${value}`)
                .join('\n')
            alert(
                `${user?.name} successfully booked a lesson with ${teacher.name} ${teacher.surname}.\nInformation sent:\n${formattedValues}`
            )
        } catch (error) {
            console.error(error)
            alert(`Oops, error occured(`)
        } finally {
            actions.setSubmitting(false)
        }
    }

    return (
        <div className={styles.teacher_container}>
            <div className={styles.teacher_avatar_container}>
                <Image
                    src={teacher.avatar_url}
                    width={96}
                    height={96}
                    alt={`Teacher ${teacher.name}'s avatar.`}
                    className={styles.teacher_avatar}
                ></Image>
            </div>

            <div className={styles.card_info_part}>
                <div className={styles.heading}>
                    <p className={styles.languages}>Languages</p>
                    <ul className={styles.characteristics_list}>
                        <li className={styles.lessons_format}>
                            <div className={styles.characteristic_container}>
                                <svg
                                    className={styles.book_icon}
                                    width={16}
                                    height={16}
                                >
                                    <use href="/sprite.svg#icon-book"></use>
                                </svg>
                                <p className={styles.characteristic_text}>
                                    Lessons online
                                </p>
                            </div>
                        </li>
                        <li className={styles.lessons_done}>
                            Lessons done: {teacher.lessons_done}
                        </li>
                        <li>
                            <div className={styles.rating_container}>
                                <FaStar
                                    className={styles.star}
                                    aria-hidden="true"
                                />
                                <p className={styles.rating}>
                                    Rating: {teacher.rating}
                                </p>
                            </div>
                        </li>
                        <li>
                            <p className={styles.price}>
                                Price / 1 hour:{' '}
                                <span className={styles.price_value}>{teacher.price_per_hour}$</span>
                            </p>
                        </li>
                        <li>
                            <FavoriteButton
                                teacherId={teacher._id}
                            ></FavoriteButton>
                        </li>
                    </ul>
                </div>
                <p className={styles.teacher_name}>
                    {teacher.name} {teacher.surname}
                </p>
                <p className={styles.languages_info}>
                    Speaks:{' '}
                    <span className={styles.languages_values}>
                        {teacher.languages.join(', ')}
                    </span>
                </p>
                <p className={styles.lessons_info}>
                    Lesson Info:{' '}
                    <span className={styles.lessons_info_value}>
                        {teacher.lesson_info}
                    </span>
                </p>
                <p className={styles.conditions_info}>
                    Conditions:{' '}
                    <span className={styles.conditions_value}>
                        {teacher.conditions.join(' ')}
                    </span>
                </p>
                {isExpanded ? (
                    <div className={styles.expanded_info}>
                        <p className={styles.experience}>
                            {teacher.experience}
                        </p>
                        {teacher.reviews.map((review, indx) => {
                            return <ReviewItem key={indx} review={review} />
                        })}
                    </div>
                ) : (
                    <button
                        className={styles.teacher_details_button}
                        onClick={toggleExpanded}
                    >
                        Read more
                    </button>
                )}
                <div className={styles.levels_container}>
                    {teacher.levels.map((level) => {
                        if (level === levelValue) {
                            return (
                                <p
                                    key={level}
                                    className={`${styles.level_value} ${styles.desired_level}`}
                                >
                                    {level}
                                </p>
                            )
                        } else {
                            return (
                                <p key={level} className={styles.level_value}>
                                    {level}
                                </p>
                            )
                        }
                    })}
                </div>

                {isExpanded && (
                    <button
                        className={styles.book_btn}
                        onClick={handleBookButtonClick}
                    >
                        Book trial lesson
                    </button>
                )}

                {isBookingModalOpen && (
                    <Modal onClose={() => setIsBookingModalOpen(false)}>
                        <h2 className={styles.heading}>Book trial lesson</h2>
                        <p className={styles.description}>
                            Our experienced tutor will assess your current
                            language level, discuss your learning goals, and
                            tailor the lesson to your specific needs.
                        </p>
                        <div className={styles.your_teacher_container}>
                            <Image
                                src={teacher.avatar_url}
                                width={44}
                                height={44}
                                alt={`Photo of teacher ${teacher.name} ${teacher.surname}`}
                                className={styles.your_teacher_avatar}
                            ></Image>
                            <div className={styles.your_teacher_name_container}>
                                <p className={styles.your_teacher}>
                                    Your teacher
                                </p>
                                <p
                                    className={styles.your_teacher_name}
                                >{`${teacher.name} ${teacher.surname}`}</p>
                            </div>
                        </div>
                        <BookingForm
                            onSubmit={handleBookingSubmit}
                        ></BookingForm>
                    </Modal>
                )}
            </div>
        </div>
    )
}
