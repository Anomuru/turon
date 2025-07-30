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
import {DynamicModuleLoader} from "shared/lib/components/DynamicModuleLoader/DynamicModuleLoader.jsx";
import {teacherParseReducer} from "entities/teachers/model/teacherParseSlice.js";
import {getLoading, getStudentLoading} from "entities/teachers/model/selector/teacherIdSelector.js";
import {DefaultLoader, DefaultPageLoader} from "shared/ui/defaultLoader/index.js";


const reducers = {
    teacherParseSlice: teacherParseReducer,
}

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

    const loading = useSelector(getLoading)
    const teacherLoading = useSelector(getStudentLoading)


    useEffect(() => {
        if (id) {
            dispatch(fetchTeacherId(id))
        }

    } ,[dispatch, id])


    const onSubmitImage = (data) => {
        // formData.append("profile_img", data)

        dispatch(changeStudentProfileImage({id: teacherId.user?.id, data}))
    }


    console.log(teacherLoading)
    return (

            <DynamicModuleLoader reducers={reducers}>

                {/*{loading && teacherLoading === true ? <DefaultPageLoader/> :*/}
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
            {/*}*/}
            </DynamicModuleLoader>


    );
};
