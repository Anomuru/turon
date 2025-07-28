import {memo} from 'react';

import {ClassMolassesRatingListItem} from "../classMolassesRatingListItem/classMolassesRatingListItem";

import cls from "./classMolassesRatingList.module.sass";

const list = [
    {
        name: "Offline",
        progress: 30
    },
    {
        name: "Online",
        progress: 70
    }
]

export const ClassMolassesRatingList = memo(() => {

    const renderRating = () => {
        return list.map(item =>
            <ClassMolassesRatingListItem
                progress={item.progress}
                name={item.name}
            />
        )
    }

    const render = renderRating()

    return (
        <div className={cls.ratingList}>
            {render}
        </div>
    )
})
