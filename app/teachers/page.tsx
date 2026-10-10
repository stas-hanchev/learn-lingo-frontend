'use client'

import { getTeachers } from '@/lib/api'
import {
    TeachersResponse,
    Teacher,
    TeacherQuery,
    SelectFilters,
    Language,
    Level,
    Price,
} from '@/lib/types'

import { useInfiniteQuery } from '@tanstack/react-query'

import styles from './page.module.css'
import { useState } from 'react'
import TeacherFilter from '@/components/TeacherFilter/TeacherFilter'
import Loader from '@/components/Loader/Loader'
import NoTeachersFound from '@/components/NoTeachersFound/NoTeachersFound'
import TeacherList from '@/components/TeacherList/TeacherList'

export default function TeachersPage() {
    const [filters, setFilters] = useState<SelectFilters | null>(null)

    // isFetchin, isFetching, isFetchingNextPage, isError, isLoading
    const teachersQuery = useInfiniteQuery({
        queryKey: ['teachers', { page: 1 }, filters],
        queryFn: ({ pageParam }) => {
            return getTeachers({
                language:
                    filters?.language?.value === Language.all
                        ? undefined
                        : filters?.language?.value,
                level:
                    filters?.level?.value === Level.all
                        ? undefined
                        : filters?.level?.value,
                price:
                    filters?.price?.value && filters.price.value !== Price.all
                        ? filters?.price?.value
                        : undefined,
                page: pageParam,
                perPage: 3,
            })
        },
        initialPageParam: 1,
        getNextPageParam: (lastResponse: TeachersResponse) => {
            const nextPage = lastResponse.page + 1
            return nextPage <= lastResponse.totalItems ? nextPage : undefined
        },
        select: (data) => {
            return {
                ...data,
                teachers: data.pages.flatMap((page) => page.teachers),
            }
        },
    })

    const teachers = teachersQuery.data?.teachers ?? []
    const hasTeachers = teachers.length > 0

    return (
        <main className={styles.main}>
            <section className={styles.teachers_section}>
                <div className={styles.container}>
                    <TeacherFilter onChange={setFilters}></TeacherFilter>
                    {teachersQuery.isLoading ? (
                        <Loader />
                    ) : hasTeachers ? (
                        <>
                            <TeacherList
                                teachers={teachers}
                                levelValue={filters?.level?.value}
                            />
                            <button
                                className={styles.load_more_btn}
                                onClick={() => teachersQuery.fetchNextPage()}
                            >
                                Load more
                            </button>
                        </>
                    ) : (
                        <NoTeachersFound />
                    )}
                </div>
            </section>
        </main>
    );
}
