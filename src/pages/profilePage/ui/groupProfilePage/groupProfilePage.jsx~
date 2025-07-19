import {getNextLesson} from "entities/profile/groupProfile/model/groupProfileSlice";
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import classNames from "classnames";
import {useNavigate, useParams} from "react-router";

import {
    GroupProfileAttendanceForm,
    GroupProfileModalTeachers,
    GroupProfileTimeForm,
    GroupProfileInfoForm,
    GroupProfileStudents,
    GroupProfileDeleteForm
} from "features/groupProfile";
import {
    GroupProfileSubjectList,
    GroupProfileAttendance,
    GroupProfileStatistics,
    fetchGroupProfile,
    GroupProfileInfo,
    GroupProfileMore,
    getGroupProfileData,
    getGroupProfileLoading, GroupProfileRating
} from "entities/profile/groupProfile";
import {getTimeTable} from "entities/profile/groupProfile";
import {
    fetchFilteredStudents,
    fetchFilteredStudentsAndTeachers,
    fetchFilteredTeachers,
    fetchGroupProfileTimeTable,
    fetchReasons,
    fetchWeekDays
} from "entities/profile/groupProfile";
import {fetchRoomsData} from "entities/rooms";
import {fetchClassColors, fetchClassNumberList} from "entities/students";
import {getUserBranchId, getUserSystemId} from "entities/profile/userProfile";
import {fetchTeachersData} from "entities/teachers";
import {fetchGroupsData} from "entities/groups";
import {API_URL, headers, useHttp} from "shared/api/base";
import {DefaultPageLoader} from "shared/ui/defaultLoader";
import {
    fetchSubjectsData,
    fetchLanguagesData,
    fetchClassNumberData,
    fetchClassColorData
} from "entities/oftenUsed";

import cls from "./groupProfilePage.module.sass";
import {getBranch} from "features/branchSwitcher";
import {system} from "features/workerSelect";
import {getSystem} from "features/themeSwitcher";
import {Modal} from "../../../../shared/ui/modal";
import {Select} from "../../../../shared/ui/select";
import {Button} from "../../../../shared/ui/button";
import {Table} from "../../../../shared/ui/table";
import {getAttendance} from "../../model/selector/groupAttendanceSelector";
import {onChecked} from "../../model/slice/groupAttendanceSlice";
import {getGroupAttendance} from "../../../../entities/profile/groupProfile/model/groupProfileSelector";
import {getAttendanceThunk} from "../../../../entities/groups/model/slice/groupsAttendanceThunk";

export const GroupProfilePage = () => {

    const {request} = useHttp()
    const dispatch = useDispatch()
    const {id} = useParams()
    // const {id} = useSelector(getBranch)
    const data = useSelector(getGroupProfileData)
    const timeTable = useSelector(getTimeTable)
    const loading = useSelector(getGroupProfileLoading)
    const {id: branch} = useSelector(getBranch)
    const system = useSelector(getSystem)
    const systemId = useSelector(getUserSystemId)
    // const groupAttendance  = useSelector(getGroupAttendance)




    const [active, setActive] = useState(false)

    const [attendance, setAttendance] = useState(false)

    useEffect(() => {
        dispatch(fetchGroupProfile({id}))


        dispatch(fetchSubjectsData())
        dispatch(fetchLanguagesData())
        dispatch(fetchClassColorData())
        dispatch(fetchClassNumberData({branch}))

        dispatch(fetchReasons())
        dispatch(fetchWeekDays())
    }, [])


    useEffect(() => {
        if (branch) {
            dispatch(fetchGroupsData({userBranchId: branch}))
            dispatch(fetchRoomsData({id: branch}))
            dispatch(fetchTeachersData({userBranchId: branch}))
        }
    }, [branch])

    useEffect(() => {
        // if (systemId === 1) {
        //     request(
        //         `${API_URL}SchoolTimeTable/check-next-lesson/?id=${id}&type=class`,
        //         "POST",
        //         null,
        //         headers()
        //     )
        //         .then(res => {
        //             dispatch(getNextLesson(res))
        //         })
        //         .catch(err => console.log(err))
        //     // dispatch(fetchGroupProfileNextLesson({id, type: "group"}))
        // } else {
        request(
            `${API_URL}TimeTable/check_group_next_lesson/?id=${id}`,
            "GET",
            null,
            headers()
        )
            .then(res => {
                dispatch(getNextLesson(res))
            })
            .catch(err => console.log(err))
        // }
    }, [id, system])

    // useEffect(() => {
    //     if (branchId && data) {
    //         dispatch(fetchFilteredTeachers({
    //             branch_id: branchId,
    //             subject_id: data?.subject?.id
    //         }))
    //         dispatch(fetchFilteredStudents({
    //             branch_id: branchId,
    //             subject_id: data?.subject?.id
    //         }))
    //
    //     }
    // }, [branchId, data])

    useEffect(() => {
        if (data) {
            dispatch(fetchGroupProfileTimeTable({
                group_id: data?.id
            }))
        }
    }, [data])

    useEffect(() => {
        if (branch && data && timeTable && system.name === "center") {
            const res = {
                time_tables: timeTable.map(item => ({
                    week: item.week.id,
                    room: item.room.id,
                    end_time: item.end_time,
                    start_time: item.start_time
                })),
                ignore_students: data?.students.map(item => item.id),
                ignore_teacher: data?.teacher.map(item => item.id)[0]
            }
            dispatch(fetchFilteredStudentsAndTeachers({
                branch_id: branch,
                subject_id: data?.subject?.id,
                res
            }))
        }

    }, [branch, data, timeTable, system])


    if (loading) {
        return <DefaultPageLoader/>
    } else return (
        <div className={cls.profile}>
            <GroupProfileInfoForm branch={branch} system={system}/>
            {/*<GroupProfileInfo/>*/}
            <div
                className={classNames(cls.profile__mainContent, {
                    [cls.active]: active
                })}
            >
                <GroupProfileModalTeachers branch={branch}/>
                {/*<GroupProfileTeacher setActive={setActiveModal}/>*/}
                <GroupProfileDeleteForm branch={branch} system={system}/>
                {/*<GroupProfileStudents/>*/}
                <GroupProfileAttendanceForm  data={data?.students} setAttendance={setAttendance} attendance={attendance}/>
                {/*<GroupProfileAttendance/>*/}
                {
                    system.name === "center" ? <>
                        <GroupProfileStatistics setActive={setActive}/>

                        <GroupProfileTimeForm/>
                        {/*<GroupProfileSubjectList/>*/}
                        <GroupProfileMore/>
                    </> : null
                }
            </div>
            <div className={classNames(cls.profile__otherContent, {
                [cls.active]: active
            })}>
                <GroupProfileRating/>
            </div>

        </div>
    )
}


