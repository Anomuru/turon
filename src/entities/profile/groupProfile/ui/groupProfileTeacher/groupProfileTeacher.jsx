import React, {memo} from 'react';

import {EditableCard} from "shared/ui/editableCard";

import cls from "./groupProfileTeacher.module.sass";
import defaultUserImg from "shared/assets/images/user_image.png";

export const GroupProfileTeacher = memo(({setActive}) => {
    return (
        <EditableCard
            extraClass={cls.teacher}
            // titleType={"beetwean"}
            title={<i className="fas fa-edit"/>}
            onClick={() => setActive("changeTeacher")}
        >
            <h1>O’qituvchilari</h1>
            <div className={cls.teacher__container}>
                <div className={cls.teacher__info}>
                    <img
                        className={cls.teacher__image}
                        src={defaultUserImg}
                        alt=""
                    />
                    <h2>Yusupova Shoxista</h2>
                </div>
                <div className={cls.teacher__share}>
                    <p>O’qituvchi ulushi:</p>
                    <p className={cls.teacher__money}>190.000</p>
                </div>
            </div>
        </EditableCard>
    )
})
