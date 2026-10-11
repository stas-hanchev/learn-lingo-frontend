import { Teacher } from '@/lib/types'

import styles from './TeacherList.module.css'
import TeacherCard from '../TeacherCard/TeacherCard'

interface TeacherListProps {
    teachers: Teacher[];
    levelValue?: string;
}

export default function TeacherList({
    teachers,
    levelValue,
}: TeacherListProps) {
    return (
            <ul className={styles.teachers_list}>
                {teachers.map((teacher) => {
                    return (
                        <li key={teacher._id}>
                            <TeacherCard
                                teacher={teacher}
                                levelValue={levelValue}
                            ></TeacherCard>
                        </li>
                    )
                })}
            </ul>
    )
}
