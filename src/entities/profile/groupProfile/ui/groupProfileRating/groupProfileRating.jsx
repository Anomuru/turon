import React, {memo} from 'react';
import classNames from "classnames";

import {EditableCard} from "shared/ui/editableCard";
import {Select} from "shared/ui/select";

import cls from "./groupProfileRating.module.sass";

export const GroupProfileRating = memo(() => {
    return (
        <EditableCard
            extraClass={classNames(cls.totalRating, {
                // [cls.active]: active === "rating"
            })}
            titleType={"cross"}
            // onClick={() => setActive("")}
        >
            <h1>Rating</h1>
            <div className={cls.totalRating__header}>
                <Select
                    title={"Yil"}
                />
                <Select
                    title={"Oy"}
                />
            </div>
            <div className={cls.totalRating__container}>
                <EditableCard
                    extraClass={classNames(cls.commonRating, cls.inner)}
                >
                    <div className={cls.inner__title}>
                        <h1>Umumiy</h1>
                        <p>1 Oylik rating</p>
                    </div>
                    <div className={cls.inner__inner}>
                        <div className={cls.progress}>
                            <h1>30%</h1>
                        </div>
                    </div>
                </EditableCard>
                <EditableCard
                    extraClass={classNames(cls.classRoomRating, cls.inner)}
                >
                    <div className={cls.inner__title}>
                        <h1>Classroom</h1>
                    </div>
                    <div className={cls.inner__inner}>
                        <div className={cls.progress}>
                            <h1>30%</h1>
                        </div>
                    </div>
                </EditableCard>
                <EditableCard
                    extraClass={classNames(cls.dailyRating, cls.inner)}
                >
                    <div className={cls.inner__title}>
                        <h1>Kunlik</h1>
                    </div>
                    <div className={cls.inner__inner}>
                        <div className={cls.progress}>
                            <h1>30%</h1>
                        </div>
                    </div>
                </EditableCard>
                <EditableCard
                    extraClass={classNames(cls.testRating, cls.inner)}
                >
                    <div className={cls.inner__title}>
                        <h1>Test</h1>
                        <p>baholar</p>
                    </div>
                    <div className={cls.inner__inner}>
                        <div className={cls.progress}>
                            <h1>30%</h1>
                        </div>
                    </div>
                </EditableCard>
                <EditableCard
                    extraClass={cls.items}
                >
                    <div className={cls.items__item}>
                        <div className={cls.items__title}>
                            <h1>Matematika</h1>
                            <p>baholar</p>
                        </div>
                        <div className={cls.items__progress}>
                            <h1>30%</h1>
                        </div>
                    </div>
                    <div className={cls.items__item}>
                        <div className={cls.items__title}>
                            <h1>Matematika</h1>
                            <p>baholar</p>
                        </div>
                        <div className={cls.items__progress}>
                            <h1>30%</h1>
                        </div>
                    </div>
                    <div className={cls.items__item}>
                        <div className={cls.items__title}>
                            <h1>Matematika</h1>
                            <p>baholar</p>
                        </div>
                        <div className={cls.items__progress}>
                            <h1>30%</h1>
                        </div>
                    </div>
                </EditableCard>
            </div>
        </EditableCard>
    )
})
