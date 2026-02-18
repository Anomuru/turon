import {getStudentLoading, getTeacherStudent} from "entities/teachers/model/selector/teacherIdSelector";
import {fetchDropStudents} from "entities/teachers/model/teacherParseThunk";
import React, {memo, useEffect, useState} from 'react';
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
import {TeacherProfileTimeTable} from "entities/profile/teacherProfile/index.js";

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

export const SchoolTeacherGroups = memo(({currentTab}) => {
    
    const id = useSelector(getUserBranchId)

    const dispatch = useDispatch()
    const navigation = useNavigate()

    const teacherData = useSelector(getTeacherId)
    const students = useSelector(getTeacherStudent)
    const studentsLoading = useSelector(getStudentLoading)
    const data = useSelector(getTimeTableTuronForShow)
    const schoolTeacherGroups = teacherData?.group
    const schoolTeacherFlows = teacherData?.flow
    const teachId = teacherData?.id
    console.log(teacherData, "teacher data")


    useEffect(() => {
        if (teachId)
            dispatch(fetchDropStudents(teachId))
    }, [teachId])


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

    console.log(schoolTeacherFlows, "flowwwww")
    const render = renderStudents()
    return currentTab === "info"
        ? <div className={cls.groupsContainer}>
            <div className={cls.groupsContainer__header}>
                <EditableCard extraClass={cls.classProfile}>
                    <h1>Sinflar</h1>
                    {
                        schoolTeacherGroups?.length === 0 ?
                            <div className={cls.classProfile__notFound}>
                                <i style={{fontSize: "4rem", color: "#D1D5DB"}} className="fa-solid fa-face-smile"></i>
                                <h1 style={{color: "#D1D5DB"}}>O'qituvchida sinf yo'q</h1>
                            </div> :
                            schoolTeacherGroups?.map((item, index) => (
                                <div onClick={() => navigation(`../groups/groupInfo/${item?.id}`)} key={index}
                                     className={cls.classProfile__card}>
                                    <div className={cls.classProfile__card__left}>
                                <span className={cls.classProfile__card__left__span}>
                                    {item?.class_number?.number}
                                </span>
                                        <h2>{item?.class_number?.number}-{item?.color?.name}</h2>
                                    </div>
                                    <div className={cls.classProfile__card__right}>
                                <span>
                                    <i className="fa-solid fa-chevron-circle-right"></i>
                                </span>
                                    </div>
                                </div>
                            ))
                    }


                </EditableCard>


                <EditableCard extraClass={cls.classProfile}>
                    <h1>Flows </h1>
                    {

                        studentsLoading ? <DefaultPageLoader/>
                            : schoolTeacherFlows?.length === 0 ?
                                <div className={cls.classProfile__notFound}>
                                    <i style={{fontSize: "4rem", color: "#D1D5DB"}} className="fa-solid fa-face-smile"></i>
                                    <h1 style={{color: "#D1D5DB"}}>O'qituvchida flow yo'q</h1>
                                </div> :
                                schoolTeacherFlows?.map((item, index) => (
                                    <div onClick={() => navigation(`../groups/flowsProfile/${item?.id}`)} key={index}
                                         className={cls.classProfile__card}>
                                        <div className={cls.classProfile__card__left}>
                                <span style={{background: "linear-gradient(35deg, #417EF5, #5D69F1)"}} className={cls.classProfile__card__left__span}>
                                    <i className="fa-solid fa-user-group"></i>
                                </span>
                                            <h2>{item?.name}-{item?.subject?.name}</h2>
                                        </div>
                                        <div className={cls.classProfile__card__right}>
                                <span>
                                    <i className="fa-solid fa-chevron-circle-right"></i>
                                </span>
                                        </div>
                                    </div>
                                ))

                    }

                </EditableCard>
            </div>

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
        </div>
        :  currentTab === "time" ? <TeacherProfileTimeTable/> : null
});
