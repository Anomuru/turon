import {getStudentLoading, getTeacherStudent} from "entities/teachers/model/selector/teacherIdSelector";
import {fetchDropStudents} from "entities/teachers/model/teacherParseThunk";
import React, {memo, useEffect} from 'react';
import {useNavigate, useParams} from "react-router";
import {DefaultPageLoader} from "shared/ui/defaultLoader";

import {EditableCard} from "shared/ui/editableCard";
import {groups} from "entities/profile/teacherProfile";

import cls from "./schoolTeacherGroups.module.sass";
import cardBg from 'shared/assets/icons/card-bg.svg';
import groupImage from 'shared/assets/images/group-img.svg';
import {Table} from "shared/ui/table";
import {useDispatch, useSelector} from "react-redux";
import {getTeacherId} from "../../../../teachers";
import {getBranch} from "../../../../../features/branchSwitcher";

export const SchoolTeacherGroups = memo(() => {

    // const {id} = useParams()
    const {id} = useSelector(getBranch)
    const dispatch = useDispatch()
    const navigation = useNavigate()

    const teacherData = useSelector(getTeacherId)
    const students = useSelector(getTeacherStudent)
    const studentsLoading = useSelector(getStudentLoading)
    const schoolTeacherGroups = teacherData?.group

    useEffect(() => {
        dispatch(fetchDropStudents({id}))
    }, [])




    const renderStudents = () => {
        return students.map((item, index) => {
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

    console.log(schoolTeacherGroups)

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
        </div>
    );
});
