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
                        <div className={cls.info__avatar}>
                            <img
                                onClick={() => setActiveModal("changeImage")}
                                className={cls.info__image}
                                src={employerId?.profile_img ?? defaultUserImg}
                                alt=""
                            />
                            <div className={cls.boxEs}>
                                <h1 className={cls.username}
                                    title={employerId?.user?.username}>{employerId?.user?.username}</h1>
                            </div>

                            <h2 className={cls.info__role}>Employer</h2>
                        </div>
                        <div className={cls.info__text}>
                            <p>Ism: <span>{employerId?.user?.name}</span></p>
                            <p>Familiya: <span>{employerId?.user?.surname}</span></p>
                            <p>Otasinig ismi: <span>{employerId?.user?.father_name}</span></p>
                            <p>Telefon raqami: <span>{employerId?.user?.phone}</span></p>
                            <p>Yoshi: <span>{employerId?.user?.age}</span></p>
                            <p>Tug'ilgan sana: <span>{employerId?.user?.birth_date}</span></p>
                            <div className={cls.info__addInfo}>
                                <i className="fas fa-plus"/>
                            </div>
                        </div>
                    </>
                }
                <Link to={`employerSalaryPage/${employerId?.user?.id}`}>
                    <EditableCard
                        extraClass={cls.info__balance}
                    >
                        <h2>Balans</h2>
                        <p>Summa</p>
                        <div className={cls.info__money}>
                            <h2>$ 570.000</h2>
                            <p>$ 390.000</p>
                        </div>
                    </EditableCard>
                </Link>
                <EmployerEdit
                    isOpen={active}
                    onClose={() => setActive(false)}
                    onUpdate={handleUpdateTeacher}
                    teacherId={localTeacherData.id}

                />
            </EditableCard>
        </DynamicModuleLoader>
    )
})