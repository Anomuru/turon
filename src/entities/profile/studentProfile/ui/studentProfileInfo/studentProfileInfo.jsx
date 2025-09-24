import React, {memo, useEffect, useState} from 'react';
import {EditableCard} from "shared/ui/editableCard";
import cls from "./studentProfileInfo.module.sass";
import defaultUserImg from "shared/assets/images/user_image.png";
import visa from "shared/assets/images/visa.svg"
import classNames from "classnames";
import {Button} from "shared/ui/button";

import {API_URL, API_URL_DOC, headers, useHttp} from "../../../../../shared/api/base";
import {useNavigate, useParams} from "react-router";
import {Modal} from "shared/ui/modal/index.js";
import {Input} from "shared/ui/input/index.js";
import {useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import {getUserDataUsername} from "pages/profilePage/model/selector/studentProfileSelector.js";
import {onChangeUserUsername} from "pages/profilePage/model/slice/studentProfileSlice.js";

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

    const id = data?.id

    const formattedNumber = number?.toLocaleString();
    console.log(data?.profile_img)
    const navigate = useNavigate()
    const [activeChangePassword, setActiveChangePassword] = useState(false)
    const [activeChangeUsername, setActiveChangeUsername] = useState(false)

    const {register, setValue, handleSubmit} = useForm()
    const userDataUsername = useSelector(getUserDataUsername)


    useEffect(() => {
        setValue("username", userDataUsername)
    }, [])
    const {request} = useHttp()
    const [activeErr, setActiveErr] = useState("")

    const onChangePassword = (data) => {
        console.log(data)
        request(`${API_URL}Users/users/update/${id}/`, "PATCH", JSON.stringify(data), headers())
            .then(res => {
                console.log(data)
            })
    }

    const dispatch = useDispatch()
    const onChangeUsername = (data) => {

        request(`${API_URL}Users/users/update/${id}/`, "PATCH", JSON.stringify(data), headers())
            .then(res => {
                console.log(res)
                dispatch(onChangeUserUsername(res.username))
                setActiveChangeUsername(false)
                setActiveErr(false)

            })
            .catch(err => {
                setActiveErr(true)
            })
    }

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
                                onClick={() => setCurrentTab("quarter")}
                                extraClass={cls.info__div__avatar__box__panel__quarter}
                            >
                                Chorakni ko'rish
                            </Button>


                        </div>
                        <div className={cls.info__div__avatar__box__source}>
                            <div className={cls.info__div__avatar__box__source__each}>
                                <span className={cls.info__div__avatar__box__source__each__iconBox}>

                                    <i style={{textShadow: "0 0 0 #fff", fontSize: "2rem", color: "transparent"}}
                                       className="fa-solid fa-phone"></i>
                                </span>
                                <div className={cls.info__div__avatar__box__source__each__info}>
                                    <h2>Tel raqami</h2>
                                    <h1>{data?.phone}</h1>
                                </div>


                            </div>
                            <div className={cls.info__div__avatar__box__source__each}>
                                <span style={{background: "#2563EA"}}
                                      className={cls.info__div__avatar__box__source__each__iconBox}>
                                        <i style={{color: "#fff", fontSize: "2rem"}}
                                           className="fa-solid fa-id-card"></i>
                                </span>
                                <div className={cls.info__div__avatar__box__source__each__info}>
                                    <h2>Yoshi</h2>
                                    <h1>{data?.age}</h1>
                                </div>
                            </div>
                            <div className={cls.info__div__avatar__box__source__each}>
                                 <span style={{background: "#A453F6"}}
                                       className={cls.info__div__avatar__box__source__each__iconBox}>
                                     <i style={{color: "#fff", fontSize: "2rem"}}
                                        className="fa-solid fa-cake-candles"></i>
                                </span>
                                <div className={cls.info__div__avatar__box__source__each__info}>
                                    <h2>Tug'ilgan sanasi</h2>
                                    <h1>{data?.birth_date}</h1>
                                </div>

                            </div>
                            <div className={cls.info__div__avatar__box__source__each}>
                                 <span style={{background: "#3B82F6"}}
                                       className={cls.info__div__avatar__box__source__each__iconBox}>
                                     <i style={{color: "#fff", fontSize: "2rem"}}
                                        className="fa-solid fa-calendar"></i>
                                </span>
                                <div className={cls.info__div__avatar__box__source__each__info}>
                                    <h2>Reg. sanasi</h2>
                                    <h1>{data?.registered_date}</h1>
                                </div>

                            </div>
                            {
                                charity && charity.charity_sum
                                    ? (
                                        <div className={cls.info__div__avatar__box__source__each}>
                                            <span style={{background: "#F97316"}}
                                                  className={cls.info__div__avatar__box__source__each__iconBox}>
                                                <i style={{color: "#fff", fontSize: "2rem"}}
                                                   className="fa-solid fa-handshake"></i>
                                            </span>
                                            <div className={cls.info__div__avatar__box__source__each__info}>
                                                <h2>Chegirma</h2>
                                                <h1>{Number(charity.charity_sum).toLocaleString()}</h1>
                                            </div>

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


                <Modal active={activeChangeUsername} setActive={setActiveChangeUsername}>
                    <h2>Change username</h2>


                    <div style={{marginTop: "20px"}}>
                        {activeErr ? <h2 style={{color: "red", marginTop: "5px"}}>Username mavjud</h2> : ""}
                        <Input register={register} name={"username"}/>
                        <Button onClick={handleSubmit(onChangeUsername)} extraClass={cls.info__addInfo}>Click</Button>
                    </div>


                </Modal>


                <Modal active={activeChangePassword} setActive={setActiveChangePassword}>
                    <h2>Change password</h2>

                    <div style={{marginTop: "20px"}}>
                        <Input register={register} name={"password"} type={"password"}/>

                        <Button onClick={handleSubmit(onChangePassword)} extraClass={cls.info__addInfo}>Click</Button>
                    </div>


                </Modal>

            </div>

        </EditableCard>
    );
});
