import React, {memo} from 'react';
import {useSelector} from "react-redux";
import classNames from "classnames";
import {createPortal} from "react-dom";

import {getTimeTableTuronForShow} from "pages/timeTable/model/selectors/timeTableTuronSelectors";
import {EditableCard} from "shared/ui/editableCard";

import cls from "./teacherProfileTimeTable.module.sass";
import location from "shared/assets/logo/location.svg";
import roomImage from "shared/assets/logo/room.svg";

export const TeacherProfileTimeTable = memo(() => {

    const data = useSelector(getTimeTableTuronForShow)

    const main = document.getElementById("mainTimeTableContainer")

    return (
        <EditableCard
            extraClass={cls.timetable}
            titleType={false}
        >
            {/*<h1>My Schedule</h1>*/}
            <div className={cls.newTimeTable}>
                <div className={cls.wrapper}>
                    <div id={"mainTimeTableContainer"} className={cls.wrapper__header}>
                        <div className={cls.timeTitle}>
                            <h1 className={cls.timeTitle__inner}>Time</h1>
                        </div>
                    </div>
                    <div className={cls.wrapper__container}>
                        <div className={cls.newTimeTable__time}>

                            {
                                data?.hours_list?.map(item => {
                                    return (
                                        <div className={cls.hour}>
                                            <h1 className={cls.hour__inner}>
                                                <span className={cls.title}>{item?.start_time}</span>
                                                —
                                                <span className={cls.title}>{item?.end_time}</span>
                                            </h1>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        {
                            data?.time_tables?.map(item => {
                                return (
                                    <div className={cls.newTimeTable__weekDay}>
                                        {
                                            createPortal(
                                                <div className={cls.weekTitle}>
                                                    <h2 className={cls.weekTitle__subTitle}>{item?.weekday}</h2>
                                                    <h1 className={cls.weekTitle__title}>{item?.date?.slice(8, 10)}</h1>
                                                </div>, main
                                            )
                                        }
                                        {
                                            data?.hours_list?.map((inn, index) => {
                                                const hasLessons = item?.rooms?.some(room =>
                                                    room.lessons.some(l => l?.hours === inn?.id && l?.id)
                                                );

                                                return (
                                                    <div className={cls.lesson}>
                                                        {
                                                            hasLessons
                                                                ? item?.rooms?.map(room => {
                                                                    const lesson = room.lessons.find((l) => l?.hours === inn?.id && l?.id);
                                                                    if (!lesson) return null
                                                                    return (
                                                                        <div className={classNames(cls.lesson__inner, {
                                                                            [cls.isFlow]: lesson?.is_flow
                                                                        })}>
                                                                            <div className={cls.header}>
                                                                                {/*<img className={cls.header__image} src={lesson?.is_flow ? location : location2} alt=""/>*/}
                                                                                <img className={cls.header__image} src={location}
                                                                                     alt=""/>
                                                                                <span
                                                                                    className={cls.header__title}>Xona: {room?.name}</span>
                                                                            </div>
                                                                            <div className={cls.header}>
                                                                                {/*<img className={cls.header__image2} src={lesson?.is_flow ? roomImage : roomImage2} alt=""/>*/}
                                                                                <img className={cls.header__image2} src={roomImage}
                                                                                     alt=""/>
                                                                                <span className={cls.header__title}>
                                                                        {lesson?.is_flow ? "Flow:" : "Class:"}: {lesson?.group?.name}
                                                                    </span>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                })
                                                                : <div className={classNames(cls.lesson__inner, cls.empty)}>
                                                                    <h1 className={cls.empty__title}>Dars yo'q</h1>
                                                                </div>
                                                        }
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </EditableCard>
    );
})
