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
    const schoolTeacherFlows = teacherData?.flow

    useEffect(() => {
        if (id)
            dispatch(fetchDropStudents({id}))
    }, [id])


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
    const renderStudentsFlow = () => {
        return schoolTeacherFlows?.map((item, index) => {
            return (
                <tr>
                    <td>{index + 1}</td>
                    <td
                        onClick={() => navigation(`../students/profile/${item?.id}`)}
                    >
                        {`${item?.name}`}
                    </td>
                    <td>{item?.subject?.name}</td>
                </tr>
            )
        })
    }

    const renderFlow = renderStudentsFlow()
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

            <EditableCard extraClass={cls.flowList}>
                <h1>Flows </h1>
                {

                    studentsLoading ? <DefaultPageLoader/>
                        : <Table>
                            <thead className={cls.theadBody}>
                            <tr>
                                <th>№</th>
                                <th>Nomi</th>
                                <th>Fan</th>
                            </tr>
                            </thead>
                            <tbody>
                            {renderFlow}
                            </tbody>
                        </Table>

                }

            </EditableCard>
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

            <TeacherProfileTimeTable/>
        </div>
    );
});
