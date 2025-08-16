import {onAddAlertOptions} from "features/alert/model/slice/alertSlice";
import React, {memo, useEffect, useState} from 'react';
import {EditableCard} from "shared/ui/editableCard";
import {Link} from "shared/ui/link";
import cls from "./teacherProfileInfo.module.sass";
import defaultUserImg from "shared/assets/images/user_image.png";
import {useDispatch, useSelector} from "react-redux";

import {getTeacherId} from "../../../../teachers";
import {getLoading} from "../../../../teachers/model/selector/teacherIdSelector";
import {TeacherEdit} from "features/profileEdits/teacherEdit";
import {DefaultLoader} from "shared/ui/defaultLoader";

import {fetchClassNumberData, fetchClassTypeData} from "../../../../oftenUsed";
import {fetchCategories} from "entities/oftenUsed/index.js";
import {getUserBranchId} from "entities/profile/userProfile/index.js";


export const TeacherProfileInfo = memo(({active, setActive, setActiveModal, newImage}) => {

    const loading = useSelector(getLoading)
    const dispatch = useDispatch()

    const teacherId = useSelector(getTeacherId)
    const [localTeacherData, setLocalTeacherData] = useState({});
    const id = localStorage.getItem("branchId")




    useEffect(() => {
        if (id){
            dispatch(fetchClassTypeData({id}))
            dispatch(fetchClassNumberData({id}))
            dispatch(fetchCategories(id))
        }
        if (teacherId) {
            setLocalTeacherData(teacherId);
        }
    }, [teacherId]);


    useEffect(() => {
        if (localTeacherData?.msg) {
            dispatch(onAddAlertOptions({
                type: "error",
                status: true,
                msg: localTeacherData?.msg
            }))
        }
    }, [localTeacherData?.msg])

    const handleUpdateTeacher = (updateTeacher) => {
        setLocalTeacherData((prevData) => ({
            ...prevData,
            ...updateTeacher
        }))
    }

    return (

        <EditableCard
            onClick={() => setActive(true)}
            extraClass={cls.info}
            title={<i className="fas fa-edit"/>}
        >
            {loading ? <DefaultLoader/>
                :
                <>
                    <div className={cls.info__avatar}>
                        <img
                            onClick={() => setActiveModal("changeImage")}
                            className={cls.info__image}
                            src={teacherId?.user?.profile_img ?? defaultUserImg}
                            alt=""
                        />
                        <h1>{teacherId?.user?.username}</h1>
                        <h2 className={cls.info__role}>Teacher</h2>
                    </div>
                    <div className={cls.info__text}>
                        <h3 style={{color: "red"}}>{localTeacherData?.msg}</h3>
                        <p>Ism: <span>{teacherId?.user?.name}</span></p>
                        <p>Familiya: <span>{teacherId?.user?.surname}</span></p>
                        <p>Otasinig ismi: <span>{teacherId?.user?.father_name}</span></p>
                        <p>Telefon raqami: <span>{teacherId?.user?.phone}</span></p>
                        <p>Yoshi: <span>{teacherId?.user?.age}</span></p>
                        <p>Tug'ilgan sana: <span>{teacherId?.user?.birth_date}</span></p>
                        <p>Darslik soat: <span>{teacherId?.working_hours}</span></p>
                        <p>Face id : <span>{teacherId?.face_id}</span></p>
                        <div className={cls.info__addInfo}>
                            <i className="fas fa-plus"/>
                        </div>
                    </div>
                    <Link to={`teacherSalaryPage/${teacherId?.id}`}>
                        <EditableCard
                            extraClass={cls.info__balance}
                        >
                            <h2>Balans</h2>
                            <p>Summa</p>

                            <div className={cls.info__money}>
                                <p>$ 390.000</p>
                            </div>


                        </EditableCard>
                    </Link>
                    <TeacherEdit
                        isOpen={active}
                        onClose={() => setActive(false)}
                        onUpdate={handleUpdateTeacher}
                        teacherId={localTeacherData.id}

                    />
                </>
            }

        </EditableCard>
    )
})