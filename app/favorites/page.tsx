import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import styles from './page.module.css'
import { getFavoriteTeachersWithoutProxy } from '@/lib/api';
import { getAuthCookieHeader } from '@/app/api/_lib/proxy';
import { ApiError } from '@/app/api/api';
import { Teacher } from '@/lib/types';
import TeacherList from '@/components/TeacherList/TeacherList';
import NoTeachersFound from '@/components/NoTeachersFound/NoTeachersFound';

export default async function FavoritesPage() {
    const cookieStore = await cookies();
    let favoriteTeachers: Teacher[];

    try {
        favoriteTeachers = await getFavoriteTeachersWithoutProxy({
            Cookie: getAuthCookieHeader(cookieStore),
        })
    } catch (error) {
        if ((error as ApiError).response?.status === 401) redirect('/')
        throw error
    }

    return (
        <main className={styles.main}>
            <section className={styles.teachers_section}>
                <div className={styles.container}>
                    {favoriteTeachers.length > 0 ? (
                        <TeacherList
                            teachers={favoriteTeachers}
                        />
                    ) : (
                        <NoTeachersFound />
                    )}
                </div>
            </section>
        </main>
    )
}
