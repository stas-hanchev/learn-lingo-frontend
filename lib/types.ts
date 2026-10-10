export interface Review {
    reviewer_name: string;
    reviewer_rating: number;
    comment: string;
}

export interface Teacher {
    _id: string;
    name: string;
    surname: string;
    languages: string[];
    levels: string[];
    rating: number;
    reviews: Review[];
    price_per_hour: number;
    lessons_done: number;
    avatar_url: string;
    lesson_info: string;
    conditions: string[];
    experience: string;
}

export interface TeachersResponse {
    page: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
    teachers: Teacher[];
}

export interface RegisterRequestBody {
    name: string;
    email: string;
    password: string;
}

export interface LoginRequestBody {
    email: string;
    password: string;
}

export interface User {
    _id: string;
    email: string;
    name?: string | null | undefined;
}

export type CheckSessionRequest = {
  success: boolean;
};

export enum Language {
    all = 'All',
    french = 'French',
    english = 'English',
    german = 'German',
    ukrainian = 'Ukrainian',
    polish = 'Polish'
};

export enum Level {
    all = 'All',
    beginner = 'A1 Beginner',
    elementary = 'A2 Elementary',
    intermediate = 'B1 Intermediate',
    upperIntermediate = 'B2 Upper-Intermediate',
    advanced = 'C1 Advanced',
    proficiency = 'C2 Proficient'
};

export enum Price {
    all = 'All',
    ten = '10',
    twenty = '20',
    thirty = '30',
    fourty = '40'
};

export interface Filters {
    languages: Language[];
    levels: Level[];
    price_per_hour: Price;
};

export type SelectOption = { value: string | number; label: string };
export type OptionType = { value: string; label: string };

export interface SelectFilters {
    language: OptionType | null;
    level: OptionType | null;
    price: OptionType | null;
}

export interface TeacherQuery {
    language?: string;
    level?: string;
    price?: string;
    page?: number;
    perPage: number;
};

export enum LearningReason {
    EmptyValue = '',
    careerAndBusiness = 'Career and business',
    lessonForKids = 'Lesson for kids',
    livingAbroad = 'Living abroad',
    examsAndCoursework = 'Exams and coursework',
    cultureTravelOrHobby = 'Culture, travel or hobby',
}

export interface BookingRequestBody {
    reason: LearningReason;
    full_name: string;
    email: string;
    phone_number: string;
}
