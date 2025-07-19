import React, {createContext, useEffect, useState} from 'react';
import classNames from "classnames";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router";
import {useTheme} from "shared/lib/hooks/useTheme";
import {TeacherProfileInfo, TeacherProfileTeachersGroup, SchoolTeacherGroups} from "entities/profile/teacherProfile";
import {TeacherEdit} from "features/profileEdits/teacherEdit";
import {fetchTeacherId, getTeacherId, changeTeacherProfileImage} from "entities/teachers";
import {ImageCrop} from "features/imageCrop";
import {changeStudentProfileImage} from "../../model/thunk/studentProfileThunk";

import cls from "./profileTeacherPage.module.sass"
import {getSystem} from "features/themeSwitcher";
import {getBranch} from "../../../../features/branchSwitcher";
export const ContextStuPro = createContext(null)

export const ProfileTeacherPage = () => {

    const [active, setActive] = useState(false)
    const [actives, setActives] = useState(false)
    const dispatch = useDispatch()
    const {id} = useParams()
    // const {id} = useSelector(getBranch)
    const teacherId = useSelector(getTeacherId)
    const [activeModal, setActiveModal] = useState("")
    const [newImage, setNewImage] = useState("")
    const {theme} = useTheme()
    const system = useSelector(getSystem)


    useEffect(() => {
        if (id) {
            dispatch(fetchTeacherId(id))
        }

    } ,[dispatch, id])


    const onSubmitImage = (data) => {
        // formData.append("profile_img", data)

        dispatch(changeStudentProfileImage({id: teacherId.user?.id, data}))
    }


    return (
        // <ContextStuPro.Provider value={}>
            <div
                className={classNames(cls.profile, {
                    [cls.active]: active
                })}
            >
                <TeacherProfileInfo
                    setActive={setActive}
                    active={active}
                    setActiveModal={setActiveModal}
                    newImage={newImage}
                    system={system}
                />

                {/*// actives={actives}*/}
                {/*// setActives={setActives}*/}

                {/*<ProfileInfo*/}
                {/*    setActive={setActive}*/}
                {/*    active={active}*/}
                {/*/>*/}
                <div
                    className={classNames(cls.profile__mainContent, {
                        [cls.active]: active
                    })}
                >
                    {
                        theme === "app_school_theme" ?
                            <SchoolTeacherGroups/>
                            :
                            <TeacherProfileTeachersGroup/>
                    }

                </div>
                <ImageCrop
                    setActive={setActiveModal}
                    active={activeModal === "changeImage"}
                    setNewImage={onSubmitImage}
                />

            </div>
        // </ContextStuPro.Provider>

    );
};
