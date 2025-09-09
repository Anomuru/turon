import React, {memo, useState} from 'react';
import {EditableCard} from "shared/ui/editableCard";
import cls from "./studentProfileInfo.module.sass";
import defaultUserImg from "shared/assets/images/user_image.png";
import visa from "shared/assets/images/visa.svg"
import classNames from "classnames";
import {Button} from "shared/ui/button";

import {Switch} from "shared/ui/switch/index.js";

export const StudentProfileInfo = memo(({
                                            setActive,
                                            data,
                                            active,
                                            setActiveModal,
                                            content,
                                            contract,
                                            month,
                                            charity,
                                            currentTab,
                                            setCurrentTab,
                                        }) => {
    const number = Number(content?.debt)

    const formattedNumber = number?.toLocaleString();
    console.log(data?.profile_img)
    return (
        <EditableCard
            onClick={() => {
                setActiveModal("changeInfo")
            }}
            extraClass={cls.info}
            title={<i className="fas fa-edit"/>}
        >
            <div className={cls.info__div}>
                <div className={cls.info__div__avatar}>
                    <img
                        onClick={() => setActiveModal("changeImage")}
                        className={cls.info__div__avatar__image}
                        src={data?.profile_img ?? defaultUserImg}
                        alt=""
                    />
                    <div className={cls.info__div__avatar__box}>
                        <h1 className={cls.info__div__avatar__box__name}>{data?.name} {data?.surname} {data?.father_name}</h1>
                        <div className={cls.info__div__avatar__box__panel}>
                            <Button
                                extraClass={classNames(cls.info__div__avatar__box__panel__stBtn, {
                                    [cls.active]: currentTab === "info"
                                })}
                                onClick={() => setCurrentTab("info")}
                            >
                                Ma'lumotlar
                            </Button>

                            <Button
                                extraClass={classNames(cls.info__div__avatar__box__panel__btn, {
                                    [cls.active]: currentTab === "contract"
                                })}
                                onClick={() => setCurrentTab("contract")}
                            >
                                Shartnoma
                            </Button>

                            <Button
                                extraClass={classNames(cls.info__div__avatar__box__panel__switch, {
                                    [cls.active]: currentTab === "timetable"
                                })}
                                onClick={() => setCurrentTab("timetable")}
                            >
                                Dars jadvalini ko'rish
                            </Button>
                            <Button
                                extraClass={cls.info__div__avatar__box__panel__quarter}
                            >
                               Chorakni ko'rish
                            </Button>


                        </div>
                        <div className={cls.info__div__avatar__box__source}>
                            <div title={"Telefon raqami"} className={cls.info__div__avatar__box__source__each}>
                                <i style={{color: "#16A34A", fontSize: "2.5rem"}} className="fa-solid fa-phone"></i>
                                <h1>{data?.phone}</h1>
                            </div>
                            <div title={"Yoshi"} className={cls.info__div__avatar__box__source__each}>
                                <i style={{color: "#2563EA", fontSize: "2.5rem"}} className="fa-solid fa-id-card"></i>
                                <h1>{data?.age}</h1>
                            </div>
                            <div title={"Tug'ilgan yili"} className={cls.info__div__avatar__box__source__each}>
                                <i style={{color: "#A453F6", fontSize: "2.5rem"}}
                                   className="fa-solid fa-cake-candles"></i>
                                <h1>{data?.birth_date}</h1>
                            </div>
                            {
                                charity && charity.charity_sum
                                    ? (
                                        <div title="Chegirma" className={cls.info__div__avatar__box__source__each}>
                                            <i style={{color: "#A453F6", fontSize: "2.5rem"}}
                                               className="fa-solid fa-handshake"></i>
                                            <h1>{Number(charity.charity_sum).toLocaleString()}</h1>
                                        </div>
                                    )
                                    : null
                            }
                            <div className={cls.info__div__avatar__box__source__payment}>
                                <span onClick={() => setActive("balanceIn")} title={"To'lov qilish"}
                                      className={cls.info__div__avatar__box__source__payment__clicker}></span>
                                <h1 title={"To'lovlar ro'yxati"} onClick={() => setActive("balance")}
                                    className={cls.info__div__avatar__box__source__payment__text}>{formattedNumber} so'm</h1>
                                <img draggable="false" className={cls.info__div__avatar__box__source__payment__img}
                                     src={visa} alt=""/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </EditableCard>
    );
});
