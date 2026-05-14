import { Modal } from "../modal";
import cls from "./confirmModal.module.sass"
import alertIcon from "../../assets/icons/alert.svg";
import warning from "../../assets/icons/WarningCircle.svg";
import success from "../../assets/icons/CheckCircle.svg";
import { Button } from "../button";
import React from "react";

export const ConfirmModal = ({ setActive, active, onClick, title = "Rostanham o'chirmoqchimisiz", text, type = "danger" }) => {
    // const [deleting, setDeleting] = useState(false);
    const renderImg = () => {
        switch (type) {
            case "danger":
                return <div className={`${cls.confirmIcon} ${type === 'success' ? cls.success : cls.danger}`}><i className="fa fa-triangle-exclamation"/></div>
            case "success":
                return <div className={`${cls.confirmIcon} ${type === 'success' ? cls.success : cls.danger}`}><i className="fa fa-circle-check"></i></div>
            case "warning":
                return <img src={warning} alt=""/>
        }
    }
    return (
        <Modal extraClass={cls.overlay} active={active} setActive={setActive}>

            <div className={cls.confirmModal} onClick={e => e.stopPropagation()}>
                {renderImg()}
                {
                    type === "danger" ?
                        <>
                            <h3>O'chirishni tasdiqlang</h3>
                            <p>
                                {text && <><strong>{text}</strong> ni o'chirishni xohlaysizmi?</>}
                        Bu amalni qaytarib bo'lmaydi.
                    </p> </> : type === "success" ? <> <p>
                            <h3>Amal muvaffaqiyatli bajarildi !</h3>
                        Bajarilgan amal muvaffaqiyatli bajarildi. Davom etishni xohlaysizmi?
                    </p> </> : null
                }

                <div className={cls.confirmBtns}>
                    {
                        type === "danger" ? <>

                            <button className={cls.btnCancel} onClick={() => setActive(false)}>Bekor qilish</button>
                            <button className={`${cls.btnDelete} ${type === 'success' ? cls.success : cls.danger}`} onClick={onClick} >
                                <><i className="fa fa-trash"/> Ha, o'chirish</>
                            </button>
                        </> : type === "success" ? <button className={`${cls.btnDelete} ${type === 'success' ? cls.success : cls.danger}`} onClick={() => {
                            onClick?.()
                            setActive(false)
                        }} >
                            <><i className="fa fa-check"/> Ha, tasdiqlash</>
                        </button> : null
                    }

                </div>
            </div>

        </Modal>
    );
};
