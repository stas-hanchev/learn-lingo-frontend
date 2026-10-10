import LiteralAvatar from '../LiteralAvatar/LiteralAvatar';
import { Review } from '@/lib/types';
import styles from './ReviewItem.module.css';
import { FaStar } from 'react-icons/fa';

interface ReviewItemProps {
    review: Review; 
};

export default function ReviewItem({ review }: ReviewItemProps) {
    return (
        <div className={styles.review_container}>
            <div className={styles.photo_name_rating_container}>
                <LiteralAvatar name={review.reviewer_name}></LiteralAvatar>
                <div className={styles.name_rating_container}>
                    <p className={styles.name}>{review.reviewer_name}</p>
                    <div className={styles.rating_container}>
                        <FaStar
                            className={styles.star}
                            aria-hidden="true"
                        />
                        <p className={styles.rating_value}>{review.reviewer_rating}</p>
                    </div>
                </div>
            </div>
            <p className={styles.review}>{review.comment}</p>
        </div>
    );
}
