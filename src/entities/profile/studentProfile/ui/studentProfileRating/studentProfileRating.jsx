import {memo} from 'react';

import {EditableCard} from "shared/ui/editableCard";

import cls from "./studentProfileRating.module.sass";

export const StudentProfileRating = memo(({setActive}) => {
    return (
        <EditableCard
            extraClass={cls.rating}
            onClick={() => setActive("rating")}
        >
            <div className={cls.rating__title}>
                <h1>Rating</h1>
                <p>1 Oylik rating</p>
            </div>
            <div className={cls.rating__inner}>
                <div className={cls.progress}>
                    <h1>30%</h1>
                </div>
            </div>
        </EditableCard>
    )
})