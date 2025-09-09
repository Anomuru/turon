import {
    fetchClassNumberData,
    fetchLanguagesData,
    getClassNumberData,
    getLanguagesData
} from "entities/oftenUsed";
import {useEffect, useState} from 'react';
import classNames from "classnames";
import {useParams} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {useForm} from "react-hook-form";

import {ImageCrop} from "features/imageCrop";
import {
    StudentProfileInfo,
    StudentProfileRating,
    StudentProfileReward,
    StudentProfileSubjects,
    StudentProfileTeachers,
    StudentProfileAmountPath,
    StudentProfileAttendance,
    StudentProfileTotalRating,
    StudentProfileTotalAmount,
    StudentProfileGroupsHistory,
    StudentProfileTotalAttendance,
    StudentProfileChangeInfo,
    StudentProfileContract,
    StudentProfileAttendanceAll, StudentProfileTimeTable
} from "entities/profile/studentProfile";
import {
    fetchStudentProfileData,
    changeStudentProfileData,
    changeStudentProfileImage, fetchStudentCharity
} from "../../model/thunk/studentProfileThunk";
import {
    getCharity,
    getUserData, getUserDataUsername
} from "../../model/selector/studentProfileSelector";

import cls from "./studentProfilePage.module.sass";

import {fetchStudentDebtorData, getMonthDataThunk} from "features/studentPayment/model/studentPaymentThunk.js";
import {getMonth} from "features/studentPayment/model/selectors/selectors.js";

import {getUserBranchId, getUserJob} from "entities/profile/userProfile";
import {fetchTimeTableData, fetchTimeTableForShow} from "pages/timeTable/model/thunks/timeTableTuronThunks.js";

export const StudentProfilePage = () => {

    const date = new Date().toLocaleDateString('en-CA')
    const formData = new FormData()
    const {register, handleSubmit} = useForm()
    const dispatch = useDispatch()
    const {id} = useParams()
    // const {id} = useSelector(getBranch)

    const branch = useSelector(getUserBranchId)

    const month = useSelector(getMonth)


    const myJob = useSelector(getUserJob)


    const userData = useSelector(getUserData)
    const classes = useSelector(getClassNumberData)
    const languages = useSelector(getLanguagesData)
    const charity = useSelector(getCharity)




    const [selectedSubject, setSelectedSubject] = useState(null)
    const [selectedGroup, setSelectedGroup] = useState(null)
    const [selectedGroupName, setSelectedGroupName] = useState("")
    const student_id = userData?.id
    const branch_id = userData?.user?.branch.id
    const group_id = userData?.group
    const [active, setActive] = useState(false)
    const [activeModal, setActiveModal] = useState("")
    const [actives,setActives] = useState(false)
    const [newImage, setNewImage] = useState("")

    const [changeSelectedClass,setChangeSelectedClass] = useState(null)
    const [changeSelectedLang,setChangeSelectedLang] = useState(null)




    useEffect(() => {
        if (id ) {
            dispatch(fetchStudentProfileData(id))

            dispatch(fetchStudentCharity(id))
            dispatch(fetchStudentDebtorData(id))
            // dispatch(fetchClassNumberListStudentProfile({branch: branch?.id}))
            dispatch(fetchClassNumberData({branch: branch}))
            // dispatch(fetchLanguagesStudentProfile())
            dispatch(fetchLanguagesData())
            dispatch(getMonthDataThunk(id));

        }

    }, [id ,branch])

    useEffect(() => {
        if (id && branch) {
            dispatch(fetchTimeTableForShow({student: id, branch}))
        }
    }, [id, branch])


    // if (!userData || !userData.user) {
    //     return <div>Loading...</div>;
    // }

    const onSubmitData = (data) => {

        const res = {
            user: {
                ...data,
                language: +changeSelectedLang,

            },
            class_number: changeSelectedClass,
            parents_fullname: data.parents_fullname,
            old_school: data.old_school,
            parent_region: data.parent_region,
            district:data.district,


            parent_seria: data.parent_seria,
            parent_seria_num: data.parent_seria_num,

            region:data.region,

            born_date: data.born_date,
            student_seria_num:data.student_seria_num,
            student_seria: data.student_seria
        }
        dispatch(changeStudentProfileData({id, res}))
        setActiveModal(!activeModal)
    }

    const onSubmitImage = (data) => {
        dispatch(changeStudentProfileImage({id: userData?.user?.id, data}))
    }



    return (
        <div
            className={classNames(cls.profile)}
        >
            <StudentProfileInfo
                setActive={setActive}
                active={active}
                setActiveModal={setActiveModal}
                data={userData?.user}
                content={userData}
                contract={userData}
                newImage={newImage}
                month={month}
                charity={charity}
            />

            <div
                className={classNames(cls.profile__mainContent, {
                    [cls.active]: active
                })}
            >
                <StudentProfileTeachers data={userData?.group}/>
                <StudentProfileRating setActive={setActive}/>
                <StudentProfileReward/>
                <StudentProfileSubjects
                    setActive={setActive}
                    data={userData?.group}
                    onSelectSubject={setSelectedSubject}
                />
                <StudentProfileAttendance
                    setActive={setActive}
                    data={userData?.group}
                    onSelectGroup={setSelectedGroup}
                    onSelectGroupName={setSelectedGroupName}
                />
                <StudentProfileTimeTable/>
            </div>
            <div
                className={classNames(cls.profile__otherContent, {
                    [cls.active]: active
                })}
            >
                <StudentProfileContract
                    setActive={setActive}
                    active={active}
                />
                <StudentProfileTotalAmount
                    active={active}
                    setActive={setActive}
                    student_id={student_id}
                    branch_id={branch_id}
                    group_id={group_id}
                />
                <StudentProfileAmountPath
                    data={userData}
                    active={active}
                    setActive={setActive}
                    job={myJob}
                />
                <StudentProfileTotalRating
                    active={active}
                    setActive={setActive}
                />
                <StudentProfileGroupsHistory
                    active={active}
                    setActive={setActive}
                    selectedSubject={id}
                />
                <StudentProfileTotalAttendance
                    active={active}
                    setActive={setActive}
                    selectedGroup={selectedGroup}
                    selectedGroupName={selectedGroupName}
                />
                <StudentProfileAttendanceAll
                    active={active}
                    setActive={setActive}

                />
            </div>
            <ImageCrop
                setActive={setActiveModal}
                active={activeModal === "changeImage"}
                setNewImage={onSubmitImage}
            />
            <StudentProfileChangeInfo
                setSelectedClass={setChangeSelectedClass}
                setSelectedLang={setChangeSelectedLang}
                setActive={setActiveModal}
                active={activeModal === "changeInfo"}
                register={register}
                onSubmit={handleSubmit(onSubmitData)}
                currentData={userData}
                classes={classes}
                languages={languages}
            />
        </div>
    )
}
