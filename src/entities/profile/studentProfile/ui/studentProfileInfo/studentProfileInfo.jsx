import React, {memo, useEffect, useState} from 'react';
import {EditableCard} from "shared/ui/editableCard";
import cls from "./studentProfileInfo.module.sass";
import defaultUserImg from "shared/assets/images/user_image.png";
import {API_URL, API_URL_DOC, headers, useHttp} from "../../../../../shared/api/base";
import {Button} from "../../../../../shared/ui/button";
import {Table} from "../../../../../shared/ui/table";
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
                                            charity
                                        }) => {
    const number = content?.debt

    const id = data?.id

    const formattedNumber = number?.toLocaleString();
    const navigate = useNavigate()
    const [activeChangePassword, setActiveChangePassword] = useState(false)
    const [activeChangeUsername, setActiveChangeUsername] = useState(false)

    const {register, setValue, handleSubmit} = useForm()
    const userDataUsername = useSelector(getUserDataUsername)


    useEffect(() => {
        setValue("username" , userDataUsername)
    } , [])
    const {request} = useHttp()
    const [activeErr , setActiveErr] = useState("")

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
            <div className={cls.info__avatar}>
                <img
                    onClick={() => setActiveModal("changeImage")}
                    className={cls.info__image}
                    src={data?.profile_img ?? defaultUserImg}
                    alt=""
                />
                <div onClick={() => setActive("contract")} className={cls.subject__edit}>
                    <i style={{fontSize: 20 + "px"}} className={"fa-solid fa-file-contract"}></i>
                    <p>Shartnoma</p>
                </div>
                <h1>{userDataUsername}</h1>
                <h2 className={cls.info__role}>Student</h2>
            </div>
            <div className={cls.info__text}>
                <p>Ism: <span>{data?.name}</span></p>
                <p>Familiya: <span>{data?.surname}</span></p>
                <p>Otasinig ismi: <span>{data?.father_name}</span></p>
                <p>Telefon raqami: <span>{data?.phone}</span></p>
                <p>Yoshi: <span>{data?.age}</span></p>
                <p>Tug'ilgan sana: <span>{data?.birth_date}</span></p>

                <p>Shartnoma: <span>
                    {
                        !contract || !contract.contract || contract.contract.length === 0 ? (
                            <Button onClick={() => setActive("contract")}>Qo'shish</Button>
                        ) : (
                            contract.contract.map((item, index) =>
                                <a key={index} href={`${API_URL_DOC}${item.url}`} target="_blank"
                                   rel="noopener noreferrer">
                                    Yuklab olish
                                </a>
                            )
                        )
                    }
                </span></p>
                <p>Chegirma : <span>{charity.charity_sum}</span></p>
                <p>Chegirma Sababi : <span>{charity.name}</span></p>
                {/*<p>Xayriya Sababi : <span>{month?.data[0]?.reason ? month?.data[0]?.reason : null}</span></p>*/}
                <div className={cls.info__addInfo}>
                    <Button onClick={() => setActiveChangeUsername(true)}>Change Username</Button>
                    <Button onClick={() => setActiveChangePassword(true)}>Change Password</Button>
                    {/*<i className="fas fa-plus"/>*/}
                </div>
            </div>


            <EditableCard
                extraClass={cls.info__balance}
                onClick={() => setActive("balance")}
            >
                <h2>Balans</h2>
                <p>Umumiy qarzi</p>
                <div className={cls.info__money}>
                    <h2 onClick={() => setActive("balanceIn")}>$ {formattedNumber}</h2>
                </div>
            </EditableCard>

            <Modal active={activeChangeUsername} setActive={setActiveChangeUsername}>
                <h2>Change username</h2>


                <div style={{marginTop: "20px"}}>
                    {activeErr ? <h2 style={{color: "red" , marginTop: "5px"}}>Username mavjud</h2> : ""}
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

        </EditableCard>
    );
});
