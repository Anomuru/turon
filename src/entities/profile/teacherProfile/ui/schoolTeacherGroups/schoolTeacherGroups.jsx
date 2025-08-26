import {getStudentLoading, getTeacherStudent} from "entities/teachers/model/selector/teacherIdSelector";
import {fetchDropStudents} from "entities/teachers/model/teacherParseThunk";
import React, {memo, useEffect} from 'react';
import {useNavigate, useParams} from "react-router";
import {DefaultPageLoader} from "shared/ui/defaultLoader";

import {EditableCard} from "shared/ui/editableCard";


import cls from "./schoolTeacherGroups.module.sass";

import {Table} from "shared/ui/table";
import {useDispatch, useSelector} from "react-redux";
import {getTeacherId} from "../../../../teachers";

import {getUserBranchId} from "entities/profile/userProfile/index.js";
import {
    getTimeTableTuronData,
    getTimeTableTuronForShow
} from "pages/timeTable/model/selectors/timeTableTuronSelectors.js";
import classNames from "classnames";

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

export const SchoolTeacherGroups = memo(() => {

    // const {id} = useParams()
    const id = useSelector(getUserBranchId)

    const dispatch = useDispatch()
    const navigation = useNavigate()

    const teacherData = useSelector(getTeacherId)
    const students = useSelector(getTeacherStudent)
    const studentsLoading = useSelector(getStudentLoading)
    const data = useSelector(getTimeTableTuronForShow)
    const schoolTeacherGroups = teacherData?.group

    useEffect(() => {
        dispatch(fetchDropStudents({id}))
    }, [])


    const renderStudents = () => {
        return students?.map((item, index) => {
            return (
                <tr>
                    <td>{index + 1}</td>
                    <td
                        onClick={() => navigation(`../students/profile/${item?.id}`)}
                    >
                        {`${item?.name} ${item?.surname}`}
                    </td>
                    <td>{item?.number}</td>
                    <td>{item?.parent_number}</td>
                    <td>{item?.debt}</td>
                </tr>
            )
        })
    }

    const render = renderStudents()

    return (
        <div className={cls.groupsContainer}>
            {
                schoolTeacherGroups?.length === 0 ?
                    <EditableCard>
                        <h1>O'qituvchida guruhi yo'q</h1>
                    </EditableCard>
                    :
                    schoolTeacherGroups?.map((item, index) => (
                        <EditableCard extraClass={cls.classProfile} titleType="">
                            <h1>Sinfi</h1>

                            <div
                                onClick={() => navigation(`../groups/groupInfo/${item?.id}`)}
                                className={cls.classColor}
                            />

                            <h1>{item?.class_number?.number}-{item?.color?.name}</h1>

                            {/*<h2 className={cls.info__role}>{item?.color?.name}</h2>*/}
                        </EditableCard>
                    ))
            }


            <EditableCard extraClass={cls.classList}>
                <h1>O'quvchilar ro'yxati</h1>
                {
                    students?.length ?
                        studentsLoading ? <DefaultPageLoader/>
                            : <Table>
                                <thead className={cls.theadBody}>
                                <tr>
                                    <th>№</th>
                                    <th>Ism familiya</th>
                                    <th>Tel</th>
                                    <th>Tel (ota-ona)</th>
                                    <th>Qarz</th>
                                </tr>
                                </thead>
                                <tbody>
                                {render}
                                </tbody>
                            </Table>
                        : <div
                            style={{
                                height: "100%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                            }}
                        >
                            <h1 style={{fontSize: "3rem"}}>O'quvchilar yo'q</h1>
                        </div>
                }

            </EditableCard>

            <EditableCard titleType={false}>
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
        </div>
    );
});
