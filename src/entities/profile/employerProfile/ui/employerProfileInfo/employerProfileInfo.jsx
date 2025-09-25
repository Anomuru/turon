import React, {memo, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";

import {EmployerEdit} from "features/profileEdits/employerEdit";
import {DynamicModuleLoader} from "shared/lib/components/DynamicModuleLoader/DynamicModuleLoader.jsx";
import {EditableCard} from "shared/ui/editableCard";
import {Link} from "shared/ui/link";
import {DefaultLoader} from "shared/ui/defaultLoader";
import {employerParseReducer} from "../../model/employerParseSlice";
import {getEmployerId} from "../../model/selector/employerIdSelector";
import {getEmployerLoading} from "../../model/selector/employerIdSelector";

import cls from "./employerProfileInfo.module.sass";
import defaultUserImg from "shared/assets/images/user_image.png";
import {Button} from "shared/ui/button/index.js";
import classNames from "classnames";
import {TeacherEdit} from "features/profileEdits/teacherEdit/index.js";

const reducers = {
    employerParseSlice: employerParseReducer
}

export const EmployerProfileInfo = memo(({active, setActive, setActiveModal, newImage}) => {

    const loading = useSelector(getEmployerLoading)
    const dispatch = useDispatch()
    // const {employerId} = useParams()
    const employerId = useSelector(getEmployerId)
    const [localTeacherData, setLocalTeacherData] = useState({});

    useEffect(() => {
        if (employerId) {
            setLocalTeacherData(employerId);
        }
    }, [employerId]);


    const handleUpdateTeacher = (updateTeacher) => {
        setLocalTeacherData((prevData) => ({
            ...prevData,
            ...updateTeacher
        }))
    }

    return (
        <DynamicModuleLoader reducers={reducers}>
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
                                src={employerId?.user?.profile_img ?? defaultUserImg}
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
                               <h1 title={employerId?.user?.father_name} className={cls.info__teacherSource__header__name}>{employerId?.user?.name} {employerId?.user?.surname}</h1>
                                {
                                    localTeacherData?.msg ? <h3 style={{color: "red"}}>{localTeacherData?.msg}</h3> : null
                                }
                            </span>

                                <Button extraClass={cls.info__teacherSource__header__status}>
                                    <i style={{fontSize: "1.9rem"}} className="fa-solid fa-graduation-cap"></i>
                                    <h2>Ishchi</h2>
                                </Button>
                                <Button onClick={() => navigate(`employerSalaryPage/${employerId?.id}`)} extraClass={cls.info__teacherSource__header__balance}>
                                    <i style={{fontSize: "1.9rem"}} className="fa-solid fa-dollar-sign"></i>
                                    <h2>Balans</h2>
                                </Button>


                            </div>
                            <div className={cls.info__teacherSource__footer}>
                                <div style={{background: "#FFEFDA", border: "2px solid #FED7AA"}} className={cls.info__teacherSource__footer__card}>
                                <span style={{background: "#F97316"}}>
                                    <i className="fa-regular fa-user"></i>
                                </span>
                                    <div className={cls.info__teacherSource__footer__card__arounder}>
                                        <h2 style={{color: "#F97316"}}>Yoshi</h2>
                                        <h1 style={{color: "#9A3412"}}>{employerId?.user?.age}</h1>
                                    </div>
                                </div>
                                <div style={{background: "#E3EFFE", border: "2px solid #3B82F6"}} className={cls.info__teacherSource__footer__card}>
                                <span style={{background: "#3B82F6"}}>
                                    <i className="fa-solid fa-phone"></i>
                                </span>
                                    <div className={cls.info__teacherSource__footer__card__arounder}>
                                        <h2 style={{color: "#4A63EB"}}>Tel raqami</h2>
                                        <h1 style={{color: "#1E40AF"}}>{employerId?.user?.phone}</h1>
                                    </div>
                                </div>
                                <div style={{background: "#F5ECFF", border: "2px solid #9675F1"}} className={cls.info__teacherSource__footer__card}>
                                <span style={{background: "#A855F7"}}>
                                    <i className="fa-regular fa-calendar"></i>
                                </span>
                                    <div className={cls.info__teacherSource__footer__card__arounder}>
                                        <h2 style={{color: "#9675F1"}}>Tug'ilgan kuni</h2>
                                        <h1 style={{color: "#6B21A8"}}>{employerId?.user?.birth_date}</h1>
                                    </div>
                                </div>
                                <div style={{background: "#E2FDEB", border: "2px solid #22C55E"}} className={cls.info__teacherSource__footer__card}>
                                <span style={{background: "#22C55E"}}>
                                    <i className="fa-regular fa-clock"></i>
                                </span>
                                    <div className={cls.info__teacherSource__footer__card__arounder}>
                                        <h2 style={{color: "#16A384"}}>Darslik soati</h2>
                                        <h1 style={{color: "#166534"}}>{employerId?.working_hours}</h1>
                                    </div>
                                </div>
                                <div style={{background: "#E3EFFE", border: "2px solid #3B82F6"}} className={cls.info__teacherSource__footer__card}>
                                <span style={{background: "#3B82F6"}}>
                                    <i className="fa-solid fa-fingerprint"></i>
                                </span>
                                    <div className={cls.info__teacherSource__footer__card__arounder}>
                                        <h2 style={{color: "#4A63EB"}}>Face ID</h2>
                                        <h1 style={{color: "#1E40AF"}}>{employerId?.face_id}</h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <EmployerEdit
                            isOpen={active}
                            onClose={() => setActive(false)}
                            onUpdate={handleUpdateTeacher}
                            teacherId={localTeacherData.id}

                        />
                    </>
                }

            </EditableCard>
            {/*<EditableCard*/}
            {/*    onClick={() => setActive(true)}*/}
            {/*    extraClass={cls.info}*/}
            {/*    title={<i className="fas fa-edit"/>}*/}
            {/*>*/}
            {/*    {loading ? <DefaultLoader/>*/}
            {/*        :*/}
            {/*        <>*/}
            {/*            <div className={cls.info__avatar}>*/}
            {/*                <img*/}
            {/*                    onClick={() => setActiveModal("changeImage")}*/}
            {/*                    className={cls.info__image}*/}
            {/*                    src={employerId?.profile_img ?? defaultUserImg}*/}
            {/*                    alt=""*/}
            {/*                />*/}
            {/*                <div className={cls.boxEs}>*/}
            {/*                    <h1 className={cls.username}*/}
            {/*                        title={employerId?.user?.username}>{employerId?.user?.username}</h1>*/}
            {/*                </div>*/}

            {/*                <h2 className={cls.info__role}>Employer</h2>*/}
            {/*            </div>*/}
            {/*            <div className={cls.info__text}>*/}
            {/*                <p>Ism: <span>{employerId?.user?.name}</span></p>*/}
            {/*                <p>Familiya: <span>{employerId?.user?.surname}</span></p>*/}
            {/*                <p>Otasinig ismi: <span>{employerId?.user?.father_name}</span></p>*/}
            {/*                <p>Telefon raqami: <span>{employerId?.user?.phone}</span></p>*/}
            {/*                <p>Yoshi: <span>{employerId?.user?.age}</span></p>*/}
            {/*                <p>Tug'ilgan sana: <span>{employerId?.user?.birth_date}</span></p>*/}
            {/*                <div className={cls.info__addInfo}>*/}
            {/*                    <i className="fas fa-plus"/>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </>*/}
            {/*    }*/}
            {/*    <Link to={`employerSalaryPage/${employerId?.user?.id}`}>*/}
            {/*        <EditableCard*/}
            {/*            extraClass={cls.info__balance}*/}
            {/*        >*/}
            {/*            <h2>Balans</h2>*/}
            {/*            <p>Summa</p>*/}
            {/*            <div className={cls.info__money}>*/}
            {/*                <h2>$ 570.000</h2>*/}
            {/*                <p>$ 390.000</p>*/}
            {/*            </div>*/}
            {/*        </EditableCard>*/}
            {/*    </Link>*/}
            {/*   */}
            {/*</EditableCard>*/}
        </DynamicModuleLoader>
    )
})