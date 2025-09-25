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
import {Button} from "shared/ui/button/index.js";
import {useNavigate} from "react-router";
import classNames from "classnames";


export const TeacherProfileInfo = memo(({active, setActive, setActiveModal, newImage, setCurrentTab, currentTab}) => {

    const loading = useSelector(getLoading)
    const dispatch = useDispatch()
    const navigate = useNavigate()
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
                    <span className={cls.info__circleBg}></span>
                    <span className={cls.info__circleBg2}></span>
                    <div className={cls.info__avatar}>
                        <img
                            onClick={() => setActiveModal("changeImage")}
                            className={cls.info__image}
                            src={teacherId?.user?.profile_img ?? defaultUserImg}
                            alt=""
                        />
                        <span className={cls.info__avatar__medal}>
                            <i style={{color: "white"}} className={"fa-regular fa-star"}></i>
                        </span>

                        {/*<h1>{teacherId?.user?.username}</h1>*/}
                        {/*<h2 className={cls.info__role}>Teacher</h2>*/}
                    </div>
                    <div className={cls.info__teacherSource}>
                        <div className={cls.info__teacherSource__header}>
                            <span>
                               <h1 title={teacherId?.user?.father_name} className={cls.info__teacherSource__header__name}>{teacherId?.user?.name} {teacherId?.user?.surname}</h1>
                                {
                                    localTeacherData?.msg ? <h3 style={{color: "red"}}>{localTeacherData?.msg}</h3> : null
                                }
                            </span>

                            <Button onClick={() => setCurrentTab("info")} extraClass={classNames(cls.info__teacherSource__header__status, { [cls.active]: currentTab === "info" })}>
                                <i style={{fontSize: "1.9rem"}} className="fa-solid fa-graduation-cap"></i>
                                <h2>O'qituvchi</h2>
                            </Button>
                            <Button extraClass={cls.info__teacherSource__header__job}>
                                <i style={{fontSize: "1.9rem"}} className="fa-solid fa-book-open-reader"></i>
                                <h2>{teacherId?.subject?.[0]?.name}</h2>
                            </Button>
                            <Button onClick={() => navigate(`teacherSalaryPage/${teacherId?.id}`)} extraClass={cls.info__teacherSource__header__balance}>
                                <i style={{fontSize: "1.9rem"}} className="fa-solid fa-dollar-sign"></i>
                                <h2>Balans</h2>
                            </Button>
                            <Button onClick={() => setCurrentTab("time")} extraClass={classNames(cls.info__teacherSource__header__time, { [cls.active]: currentTab === "time" })}>
                                <i style={{fontSize: "1.9rem"}} className="fa-solid fa-table"></i>
                                <h2>Time table</h2>
                            </Button>


                        </div>
                        <div className={cls.info__teacherSource__footer}>
                            <div style={{background: "#FFEFDA", border: "2px solid #FED7AA"}} className={cls.info__teacherSource__footer__card}>
                                <span style={{background: "#F97316"}}>
                                    <i className="fa-regular fa-user"></i>
                                </span>
                                <div className={cls.info__teacherSource__footer__card__arounder}>
                                    <h2 style={{color: "#F97316"}}>Yoshi</h2>
                                    <h1 style={{color: "#9A3412"}}>{teacherId?.user?.age}</h1>
                                </div>
                            </div>
                            <div style={{background: "#E3EFFE", border: "2px solid #3B82F6"}} className={cls.info__teacherSource__footer__card}>
                                <span style={{background: "#3B82F6"}}>
                                    <i className="fa-solid fa-phone"></i>
                                </span>
                                <div className={cls.info__teacherSource__footer__card__arounder}>
                                    <h2 style={{color: "#4A63EB"}}>Tel raqami</h2>
                                    <h1 style={{color: "#1E40AF"}}>{teacherId?.user?.phone}</h1>
                                </div>
                            </div>
                            <div style={{background: "#F5ECFF", border: "2px solid #9675F1"}} className={cls.info__teacherSource__footer__card}>
                                <span style={{background: "#A855F7"}}>
                                    <i className="fa-regular fa-calendar"></i>
                                </span>
                                <div className={cls.info__teacherSource__footer__card__arounder}>
                                    <h2 style={{color: "#9675F1"}}>Tug'ilgan kuni</h2>
                                    <h1 style={{color: "#6B21A8"}}>{teacherId?.user?.birth_date}</h1>
                                </div>
                            </div>
                            <div style={{background: "#E2FDEB", border: "2px solid #22C55E"}} className={cls.info__teacherSource__footer__card}>
                                <span style={{background: "#22C55E"}}>
                                    <i className="fa-regular fa-clock"></i>
                                </span>
                                <div className={cls.info__teacherSource__footer__card__arounder}>
                                    <h2 style={{color: "#16A384"}}>Darslik soati</h2>
                                    <h1 style={{color: "#166534"}}>{teacherId?.working_hours}</h1>
                                </div>
                            </div>
                            <div style={{background: "#E3EFFE", border: "2px solid #3B82F6"}} className={cls.info__teacherSource__footer__card}>
                                <span style={{background: "#3B82F6"}}>
                                    <i className="fa-solid fa-fingerprint"></i>
                                </span>
                                <div className={cls.info__teacherSource__footer__card__arounder}>
                                    <h2 style={{color: "#4A63EB"}}>Face ID</h2>
                                    <h1 style={{color: "#1E40AF"}}>{teacherId?.face_id}</h1>
                                </div>
                            </div>
                        </div>
                    </div>
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