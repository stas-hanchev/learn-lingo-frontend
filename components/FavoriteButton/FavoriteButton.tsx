'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { addFavoriteTeacher, getFavoriteTeachers, removeFavoriteTeacher } from '@/lib/api'
import { useAuthStore } from '@/lib/store/authStore'
import { notifyError, notifyLoginRequired, notifySuccess } from '@/lib/notify'
import styles from './FavoriteButton.module.css'
import { publicPath } from '@/lib/publicPath'

interface FavoriteButtonProps {
    teacherId: string
}

export default function FavoriteButton({ teacherId }: FavoriteButtonProps) {
    const queryClient = useQueryClient()
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

    const { data: favoritesData } = useQuery({
        queryKey: ['favorites'],
        queryFn: () => getFavoriteTeachers(),
        enabled: isAuthenticated,
    })

    const isFavorite =
        favoritesData?.some((favTeacher) => favTeacher._id === teacherId) ?? false

    const addMutation = useMutation({
        mutationFn: () => addFavoriteTeacher(teacherId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['favorites'] })
            notifySuccess('Teacher added to favorites')
        },
        onError: (error) => notifyError(error, 'Failed to add teacher to favorites'),
    })

    const removeMutation = useMutation({
        mutationFn: () => removeFavoriteTeacher(teacherId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['favorites'] })
            notifySuccess('Teacher removed from favorites')
        },
        onError: (error) => notifyError(error, 'Failed to remove teacher from favorites'),
    })

    const isPending = addMutation.isPending || removeMutation.isPending

    const handleClick = () => {
        if (!isAuthenticated) {
            notifyLoginRequired('Log in to add teachers to favorites.')
            return
        }
        isFavorite ? removeMutation.mutate() : addMutation.mutate()
    }

    return (
        <button
            type="button"
            className={styles.favorite_button}
            onClick={handleClick}
            disabled={isPending}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            aria-pressed={isFavorite}
        >
            <svg
                width={26}
                height={26}
                className={`${styles.heart_icon} ${isFavorite ? styles.heart_icon_active : ''}`}
            >
                <use href={publicPath('/sprite.svg#icon-heart')}></use>
            </svg>
        </button>
    )
}