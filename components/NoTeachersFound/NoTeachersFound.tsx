import Image from 'next/image'
import styles from './NoTeachersFound.module.css';
import { publicPath } from '@/lib/publicPath'

export default function NoTeachersFound () {
    return (
        <div className={styles.banner}>
            <Image
                src={publicPath('/teacher.png')}
                alt='Teacher drawing'
                className={styles.teacher_image}
                width={488}
                height={463}
            ></Image>
            <h2 className={styles.title}>No teachers found</h2>
            <p className={styles.description}>We couldn&apos;t find any teachers that match your filters.<br />Try adjusting your search or clearing some filters.</p>
        </div>
    );
}