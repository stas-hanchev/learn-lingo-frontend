import { Teacher, User } from '@/lib/types'

export const janeSmith: Teacher = {
    _id: 'teacher-jane-smith',
    name: 'Jane',
    surname: 'Smith',
    languages: ['English', 'Spanish'],
    levels: ['A1 Beginner', 'A2 Elementary', 'B1 Intermediate', 'B2 Upper-Intermediate'],
    rating: 4.8,
    reviews: [
        {
            reviewer_name: 'Frank',
            reviewer_rating: 4,
            comment: "Jane's lessons were very helpful. I made good progress.",
        },
        {
            reviewer_name: 'Eve',
            reviewer_rating: 5,
            comment: 'Jane is an amazing teacher! She is patient and supportive.',
        },
    ],
    price_per_hour: 25,
    lessons_done: 1098,
    avatar_url: 'https://ftp.goit.study/img/avatars/1.jpg',
    lesson_info:
        'The lessons focus on improving speaking and listening skills through real-life scenarios.',
    conditions: [
        'Teaches only adult learners (18 years and above).',
        'Flexible scheduling options available.',
    ],
    experience:
        'Jane has been teaching languages for 7 years and has extensive experience in helping students ' +
        'improve their language skills for travel and business.',
}

export const johnDoe: Teacher = {
    _id: 'teacher-john-doe',
    name: 'John',
    surname: 'Doe',
    languages: ['French', 'German'],
    levels: ['B1 Intermediate', 'B2 Upper-Intermediate', 'C1 Advanced'],
    rating: 4.6,
    reviews: [
        {
            reviewer_name: 'Alice',
            reviewer_rating: 5,
            comment: 'John helped me prepare for my DELF exam. Highly recommended!',
        },
    ],
    price_per_hour: 30,
    lessons_done: 754,
    avatar_url: 'https://ftp.goit.study/img/avatars/2.jpg',
    lesson_info: 'Lessons are structured around grammar, vocabulary and exam preparation.',
    conditions: ['Homework after every lesson.', 'Lessons are 60 minutes long.'],
    experience:
        'John is a certified French and German teacher with 10 years of experience preparing students for exams.',
}

export const olhaKovalenko: Teacher = {
    _id: 'teacher-olha-kovalenko',
    name: 'Olha',
    surname: 'Kovalenko',
    languages: ['Ukrainian', 'Polish'],
    levels: ['A1 Beginner', 'A2 Elementary'],
    rating: 5,
    reviews: [],
    price_per_hour: 15,
    lessons_done: 120,
    avatar_url: 'https://ftp.goit.study/img/avatars/3.jpg',
    lesson_info: 'Conversational lessons for absolute beginners.',
    conditions: ['Teaches learners of all ages.'],
    experience: 'Olha recently started teaching online and specialises in beginner courses.',
}

export const teachers: Teacher[] = [janeSmith, johnDoe, olhaKovalenko]

export const mockUser: User = {
    _id: 'user-1',
    email: 'student@example.com',
    name: 'Student',
}
