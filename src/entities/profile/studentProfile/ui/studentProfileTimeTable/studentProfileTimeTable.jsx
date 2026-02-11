import React, {memo} from 'react';
import classNames from "classnames";
import {useSelector} from "react-redux";

import {getTimeTableTuronForShow} from "pages/timeTable/model/selectors/timeTableTuronSelectors";
import {EditableCard} from "shared/ui/editableCard";

import cls from "./studentProfileTimeTable.module.sass";

function getWeekdayUz(dateInput) {
    const daysUz = [
        "yakshanba",  // воскресенье
        "dushanba",   // понедельник
        "seshanba",   // вторник
        "chorshanba", // среда
        "payshanba",  // четверг
        "juma",       // пятница
        "shanba"      // суббота
    ];

    const date = new Date(dateInput);
    return daysUz[date.getDay()];
}

export const StudentProfileTimeTable = memo(() => {

    const data = useSelector(getTimeTableTuronForShow)
    console.log(data, 'table for students')

    return (
        <EditableCard
            extraClass={cls.timeTable}
            titleType={false}
        >
            <h1>Time Table</h1>
            <div className={cls.time}>
                <div className={cls.time__hours}>
                    {/*<div>{" "}</div>*/}
                    {
                        data?.hours_list?.map(item => {
                            return (
                                <div className={cls.hour}>{item?.start_time}-{item?.end_time}</div>
                            )
                        })
                    }
                </div>
                {
                    data?.time_tables?.map(item => {
                        return (
                            <div className={cls.time__week}>
                                <div
                                    className={classNames(cls.weekDay, {
                                        [cls.nowaday]: item?.weekday?.toLocaleLowerCase() === getWeekdayUz(new  Date())
                                    })}
                                >
                                    {item?.weekday}
                                </div>
                                <div className={cls.container}>
                                    {
                                        data?.hours_list?.map((inn, index) => {
                                            const hasLessons = item?.rooms?.some(room =>
                                                room.lessons.some(l => l?.hours === inn?.id && l?.id)
                                            );

                                            return (
                                                <div
                                                    key={index}
                                                    className={classNames(cls.rooms, {
                                                        [cls.noLesson]: !hasLessons
                                                    })}
                                                >
                                                    {
                                                        hasLessons
                                                            ? item?.rooms?.map(room => {
                                                                const lesson = room.lessons.find((l) => l?.hours === inn?.id && l?.id);
                                                                if (!lesson) return null
                                                                return (
                                                                    <div
                                                                        key={room.id}
                                                                        className={classNames(cls.rooms__lesson, {
                                                                            [cls.isFlow]: lesson?.is_flow,
                                                                        })}
                                                                    >
                                                                        <span
                                                                            className={cls.roomName}
                                                                        >
                                                                            Xona:
                                                                            <span className={cls.roomName__inner}>{room.name}</span>
                                                                        </span>
                                                                        <span
                                                                            className={classNames(cls.lessonName, {
                                                                                [cls.large]: lesson?.subject?.name?.length > 8
                                                                            })}
                                                                        >
                                                                            {lesson?.is_flow ? "Flow:" : "Class:"}
                                                                            <span className={cls.lessonName__inner}>{lesson?.group?.name}</span>
                                                                        </span>
                                                                    </div>
                                                                )
                                                            })
                                                            : <div className={cls.noLesson}>——</div>
                                                    }
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </EditableCard>
    );
})