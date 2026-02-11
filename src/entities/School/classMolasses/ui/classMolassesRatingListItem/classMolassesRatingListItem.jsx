import {memo} from 'react';

import cls from "./classMolassesRatingListItem.module.sass";

export const  ClassMolassesRatingListItem = memo(({name, progress}) => {
    return (
        <div className={cls.ratingListItem}>
            <div className={cls.ratingListItem__progress}>
                <h1>{progress}%</h1>
            </div>
            <p>{name}</p>
        </div>
    )
})