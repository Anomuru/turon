import {Modal} from "../modal";
import cls from "./confirmModal.module.sass"
import alertIcon from "../../assets/icons/alert.svg";
import warning from "../../assets/icons/WarningCircle.svg";
import success from "../../assets/icons/CheckCircle.svg";
import {Button} from "../button";
import React from "react";

export const ConfirmModal = ({setActive, active, onClick, title= "Rostanham o'chirmoqchimisiz", text, type}) => {

    const renderImg = () => {
        // eslint-disable-next-line default-case
        switch (type) {
            case "danger" :
                return <img src={alertIcon} alt=""/>
            case "success":
                return <img src={success} alt=""/>
            case "warning":
                return <img src={warning} alt=""/>
        }
    }
    return (
        <Modal active={active} setActive={setActive}>
            <div className={cls.filter}>
                <div className={cls.deleteHead}>
                    {renderImg()}
                    <h2>{title}</h2>
                </div>
                {text ?
                    <div className={cls.deleteText}>
                        <span>{text}</span>
                    </div> : null
                }
                <div className={cls.deleteButtons}>
                    <Button extraClass={cls.deleteButton} type={type} children={"Xa"} onClick={onClick}/>
                    <Button extraClass={cls.cancelButton} type={type === "success" ? "danger" : null} children={"Yo'q"} onClick={() => setActive(!active)}/>
                </div>
            </div>
        </Modal>
    );
};

