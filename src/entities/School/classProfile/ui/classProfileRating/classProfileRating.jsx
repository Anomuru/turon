import {memo} from 'react';

import cls from "./classProfileRating.module.sass";

export const ClassProfileRating = memo(() => {
    return (
        <div className={cls.rating}>
            <h1>Umumiy Reyting</h1>
            <div className={cls.rating__container}>
                <div className={cls.rating__proggress}>
                    <h1>30%</h1>
                </div>
                <p>Umumiy</p>
            </div>
        </div>
    )
})
