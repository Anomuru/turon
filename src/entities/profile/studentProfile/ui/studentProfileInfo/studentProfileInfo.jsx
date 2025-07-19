import React, {memo} from 'react';
import {EditableCard} from "shared/ui/editableCard";
import cls from "./studentProfileInfo.module.sass";
import defaultUserImg from "shared/assets/images/user_image.png";
import {API_URL_DOC} from "../../../../../shared/api/base";
import {Button} from "../../../../../shared/ui/button";
import {Table} from "../../../../../shared/ui/table";

export const StudentProfileInfo = memo(({
                                            setActive,
                                            data,
                                            active,
                                            setActiveModal,
                                            content,
                                            contract,
                                            system,
                                            month,
                                            charity
                                        }) => {
    const number = content?.debt

    const formattedNumber = number?.toLocaleString();
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
                <h1>{data?.username}</h1>
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
                    <i className="fas fa-plus"/>
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
                    {system.name === "center" ? <p>$ 390.000</p> : null}
                </div>
            </EditableCard>
        </EditableCard>
    );
});
