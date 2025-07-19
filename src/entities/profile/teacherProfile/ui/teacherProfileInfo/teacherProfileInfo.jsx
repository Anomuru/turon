import {onAddAlertOptions} from "features/alert/model/slice/alertSlice";
import React, {memo, useEffect, useState} from 'react';
import {EditableCard} from "shared/ui/editableCard";
import {Link} from "shared/ui/link";
import cls from "./teacherProfileInfo.module.sass";
import defaultUserImg from "shared/assets/images/user_image.png";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router";
import {fetchTeacherId, getTeacherId} from "../../../../teachers";
import {getLoading} from "../../../../teachers/model/selector/teacherIdSelector";
import {TeacherEdit} from "features/profileEdits/teacherEdit";
import {DefaultLoader} from "shared/ui/defaultLoader";

import {getBranch} from "../../../../../features/branchSwitcher";
import {fetchClassNumberData, fetchClassTypeData} from "../../../../oftenUsed";
import {fetchCategories} from "../../../../oftenUsed/model/oftenUsedThunk";


export const TeacherProfileInfo = memo(({active, setActive, setActiveModal, newImage, system}) => {

    const loading = useSelector(getLoading)
    const dispatch = useDispatch()

    const teacherId = useSelector(getTeacherId)
    const [localTeacherData, setLocalTeacherData] = useState({});
    const branchId = useSelector(getBranch)

    console.log(branchId)
    const id = branchId.id

    useEffect(() => {
        dispatch(fetchClassTypeData({branch: id}))
        dispatch(fetchClassNumberData({branch:id}))
        dispatch(fetchCategories(id))
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
                            src={teacherId.user?.profile_img ?? defaultUserImg}
                            alt=""
                        />
                        <h1>{teacherId.user?.username}</h1>
                        <h2 className={cls.info__role}>Teacher</h2>
                    </div>
                    <div className={cls.info__text}>
                        <h3 style={{color: "red"}}>{localTeacherData?.msg}</h3>
                        <p>Ism: <span>{teacherId.user?.name}</span></p>
                        <p>Familiya: <span>{teacherId.user?.surname}</span></p>
                        <p>Otasinig ismi: <span>{teacherId.user?.father_name}</span></p>
                        <p>Telefon raqami: <span>{teacherId.user?.phone}</span></p>
                        <p>Yoshi: <span>{teacherId.user?.age}</span></p>
                        <p>Tug'ilgan sana: <span>{teacherId.user?.birth_date}</span></p>
                        <p>Darslik soat: <span>{teacherId?.working_hours}</span></p>
                        <div className={cls.info__addInfo}>
                            <i className="fas fa-plus"/>
                        </div>
                    </div>
                </>
            }
            <Link to={`teacherSalaryPage/${teacherId?.id}`}>
                <EditableCard
                    extraClass={cls.info__balance}
                >
                    <h2>Balans</h2>
                    <p>Summa</p>

                    <div className={cls.info__money}>
                        {system.name === "center" ?
                            <h2>$ 570.000</h2> :
                            null}
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
        </EditableCard>
    )
})