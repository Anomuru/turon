import {memo} from 'react';

import {Button} from "shared/ui/button";

import cls from "./userProfileInfo.module.sass";
import defaultUserImage from "shared/assets/images/user_image.png";

export const UserProfileInfo = memo(({setActive, data, setStatus}) => {


    return (
        <div className={cls.info}>
            <div className={cls.info__container}>
                <img
                    onClick={() => {
                        setActive("changeImage")
                        setStatus(false)
                    }}
                    className={cls.info__avatar}
                    src={data?.profile_img ?? defaultUserImage}
                    alt=""
                />
                <h3>{data?.surname} {data?.name}</h3>
                <p className={cls.info__role}>{data?.job[0]}</p>
            </div>
            <Button
                type={"simple"}
                extraClass={cls.info__btn}
                onClick={() => {
                    setActive("changeInfo")
                    setStatus(false)
                }}
            >
                Change
            </Button>
            <div className={cls.infos}>
                <div className={cls.infos__item}>
                    <span className={cls.infos__title}>
                        Father name
                    </span>
                    <p className={cls.infos__value}>
                        {data?.father_name}
                    </p>
                </div>
                <div className={cls.infos__item}>
                    <span className={cls.infos__title}>
                        Age
                    </span>
                    <div className={cls.infos__wrapper}>
                        <p className={cls.infos__value}>
                            {data?.age}
                        </p>
                        <p className={cls.infos__value}>
                            {data?.birth_date}
                        </p>
                    </div>
                </div>
                <div className={cls.infos__item}>
                    <span className={cls.infos__title}>
                        Number
                    </span>
                    <p className={cls.infos__value}>
                        {data?.phone}
                    </p>
                </div>
            </div>
        </div>
    )
})
