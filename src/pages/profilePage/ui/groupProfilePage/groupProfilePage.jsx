import {getNextLesson, groupProfileReducer} from "entities/profile/groupProfile/model/groupProfileSlice";
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
import {fetchTeachersData} from "entities/teachers";

import {API_URL, headers, useHttp} from "shared/api/base";
import {DefaultPageLoader} from "shared/ui/defaultLoader";
import {
    fetchSubjectsData,
    fetchLanguagesData,
    fetchClassNumberData,
    fetchClassColorData
} from "entities/oftenUsed";

import cls from "./groupProfilePage.module.sass";

import {getUserBranchId} from "entities/profile/userProfile/index.js";
import {DynamicModuleLoader} from "shared/lib/components/DynamicModuleLoader/DynamicModuleLoader.jsx";

const reducers = {
    groupProfileSlice: groupProfileReducer
}

export const GroupProfilePage = () => {

    const {request} = useHttp()
    const dispatch = useDispatch()
    const {id} = useParams()
    const data = useSelector(getGroupProfileData)
    const timeTable = useSelector(getTimeTable)
    const loading = useSelector(getGroupProfileLoading)
    const branch = useSelector(getUserBranchId)
    console.log(branch)
    const [active, setActive] = useState(false)
    const [attendance, setAttendance] = useState(false)
    useEffect(() => {
        dispatch(fetchGroupProfile({id}))


        dispatch(fetchSubjectsData())
        dispatch(fetchLanguagesData())
        dispatch(fetchClassColorData())


        dispatch(fetchReasons())
        dispatch(fetchWeekDays())
    }, [])


    useEffect(() => {
        if (branch) {
            dispatch(fetchClassNumberData({branch}))
            dispatch(fetchRoomsData({id: branch}))
            dispatch(fetchTeachersData({userBranchId: branch}))
        }
    }, [branch])

    useEffect(() => {
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
    }, [id])

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


    return (
        <DynamicModuleLoader reducers={reducers}>
            {loading === true ? <DefaultPageLoader/> :

                <div className={cls.profile}>

                    <GroupProfileInfoForm branch={branch}/>
                    {/*<GroupProfileInfo/>*/}
                    <div
                        className={classNames(cls.profile__mainContent, {
                            [cls.active]: active
                        })}
                    >
                        <GroupProfileModalTeachers branch={branch}/>
                        {/*<GroupProfileTeacher setActive={setActiveModal}/>*/}
                        <GroupProfileDeleteForm branch={branch}/>
                        {/*<GroupProfileStudents/>*/}
                        <GroupProfileAttendanceForm data={data?.students} setAttendance={setAttendance}
                                                    attendance={attendance}/>
                        {/*<GroupProfileAttendance/>*/}

                    </div>
                    <div className={classNames(cls.profile__otherContent, {
                        [cls.active]: active
                    })}>
                        <GroupProfileRating/>
                    </div>

                </div>
            }


        </DynamicModuleLoader>
    )
}


