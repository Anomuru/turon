import React, {memo} from 'react';

import {EditableCard} from "shared/ui/editableCard";

import cls from "./groupProfileMore.module.sass";

export const GroupProfileMore = memo(() => {
    return (
        <EditableCard
            title={""}
            titleType={""}
            extraClass={cls.more}
        >
            <h1>Qo’shimcha ma’lumotlar</h1>
            <div className={cls.more__container}>
                <div className={cls.plan}>
                    <p>Darslik Reja</p>
                    <i className="fas fa-list-ul"/>
                </div>
                <div className={cls.lesson}>
                    <p>Observe Lesson</p>
                    <i className="fas fa-user-check"/>
                </div>
            </div>
        </EditableCard>
    )
})
