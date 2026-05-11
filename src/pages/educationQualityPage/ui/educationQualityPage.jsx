import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchEducationQualityOverview,
    selectEducationQualityOverview,
    selectEducationQualityLoading,
} from 'entities/educationQuality';
import cls from './educationQualityPage.module.sass';

export const EducationQualityPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const overallRating = useSelector(selectEducationQualityOverview);
    const loading = useSelector(selectEducationQualityLoading);

    useEffect(() => {
        dispatch(fetchEducationQualityOverview());
    }, [dispatch]);

    const handleCardClick = () => {
        navigate('details');
    };

    if (loading) {
        return (
            <div className={cls.container}>
                <div className={cls.loader}>
                    <div className={cls.spinner}></div>
                </div>
            </div>
        );
    }

    return (
        <div className={cls.container}>
            <div className={cls.header}>
                <h1 className={cls.title}>Ta'lim Sifati</h1>
                <p className={cls.subtitle}>Maktab reytingi va ko'rsatkichlar</p>
            </div>

            <div className={cls.cardWrapper} onClick={handleCardClick}>
                <div className={cls.card}>
                    <div className={cls.cardHeader}>
                        <div className={cls.iconWrapper}>
                            <svg className={cls.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className={cls.cardTitle}>Maktab Sifati</h2>
                    </div>

                    <div className={cls.cardBody}>
                        <div className={cls.ratingDisplay}>
                            <div className={cls.ratingNumber}>
                                {overallRating?.rating?.toFixed(1) || '0.0'}
                            </div>
                            <div className={cls.ratingMax}>
                                / {overallRating?.max_rating || 5}
                            </div>
                        </div>

                        <div className={cls.ratingBar}>
                            <div
                                className={cls.ratingBarFill}
                                style={{
                                    width: `${(overallRating?.rating / overallRating?.max_rating) * 100}%`
                                }}
                            />
                        </div>

                        <p className={cls.description}>
                            {overallRating?.description || '5 ballik tizimda maktab reytingi'}
                        </p>

                        <div className={cls.stars}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <svg
                                    key={star}
                                    className={`${cls.star} ${
                                        star <= Math.round(overallRating?.rating || 0) ? cls.starFilled : ''
                                    }`}
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                            ))}
                        </div>
                    </div>

                    <div className={cls.cardFooter}>
                        <span className={cls.viewDetails}>
                            Batafsil ko'rish
                            <svg className={cls.arrow} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
