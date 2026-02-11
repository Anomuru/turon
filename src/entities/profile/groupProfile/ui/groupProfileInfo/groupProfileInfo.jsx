import {getGroupProfileData} from "entities/profile/groupProfile/model/groupProfileSelector";
import React, {memo} from 'react';
import {useSelector} from "react-redux";

import {EditableCard} from "shared/ui/editableCard";

import cls from "./groupProfileInfo.module.sass";
import defaultUserImg from "shared/assets/images/user_image.png";
import nextImage from "shared/assets/images/groupImage.png";

export const GroupProfileInfo = memo((props) => {

    const {
        setActive,
        setActiveModal,
        newImage
    } = props

    const data = useSelector(getGroupProfileData)

    return (
        <EditableCard
            onClick={() => {
                setActiveModal("changeInfo")
            }}
            extraClass={cls.info}
            title={<i className="fas fa-edit"/>}
        >
            <div className={cls.info__avatar}>
                <img
                    onClick={() => setActiveModal("changeImage")}
                    className={cls.info__image}
                    src={data?.profile_img ?? defaultUserImg}
                    alt=""
                />
                <h1>{data?.name}</h1>
                <h2 className={cls.info__role}>Group</h2>
            </div>
            <div className={cls.info__text}>
                <p>O'qitish tili: <span className={cls.info__name}>
                    {
                        data?.language?.name.length > 16 ?
                            `${data?.language?.name.slice(0, 16)}...` :
                            data?.language?.name
                    }
                </span></p>
                <p className={cls.info__hoverName}>{data?.language?.name}</p>
                <p>Kurs turi: <span>{data?.course_types?.name}</span></p>
                <p>Level: <span>{data?.level}</span></p>
                <p>Guruh narxi: <span>{data?.price}</span></p>
                <p>Studentlar soni: <span>{data?.students.length}</span></p>
                <div className={cls.info__addInfo}>
                    <i className="fas fa-plus"/>
                </div>
            </div>
            <EditableCard
                extraClass={cls.info__balance}
                onClick={() => setActive("balance")}
                title={""}
                titleType={""}
            >
                <div className={cls.info__title}>
                    <h1>Next <br/> Lesson</h1>
                    <p>WEDNESDAY <br/> 14:00 <br/> Lincoln</p>
                </div>
                <div>
                    <img src={nextImage} alt=""/>
                </div>
            </EditableCard>
        </EditableCard>
    )
})