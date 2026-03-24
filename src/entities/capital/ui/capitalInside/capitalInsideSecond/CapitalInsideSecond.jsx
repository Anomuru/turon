import {memo, useState} from "react";
import cls from "./capitalInsideSecond.module.sass"
import {Button} from "shared/ui/button";
import {ConfirmModal} from "../../../../../shared/ui/confirmModal";
import {API_URL_FOR_DOC} from "shared/api/base.js";
import def from "shared/assets/images/defaultImg.svg"

export const CapitalInsideSecond = memo(({
                                             capitalData,
                                             setEditModal,
                                             setChangeItem,
                                             onDelete
                                         }) => {

    const [deleteId, setDeleteId] = useState(false)

    return (
        <div className={cls.capitalInfo}>
            <div className={cls.capitalInfo__wrapper}>

                <div className={cls.capitalBox}>
                    <div className={cls.capitalBox_img}>
                        <img src={capitalData.img ? capitalData?.img : def} alt=""/>
                    </div>

                    <div className={cls.capitalBoxInfo}>
                        <div>
                            {capitalData?.name}
                        </div>

                        <span>
                            Kategoriya raqami: {capitalData?.id_number}
                        </span>

                        <div className={cls.capitalInfo__btn}>

                            {/* EDIT */}
                            <Button
                                onClick={() => {
                                    setChangeItem(capitalData)
                                    setEditModal(true)
                                }}
                            >
                                O’zgartirish
                            </Button>

                            {/*<Button>*/}
                            {/*    <i className="fas fa-download"/>*/}
                            {/*    Download File*/}
                            {/*</Button>*/}

                            {/* DELETE */}
                            <Button
                                onClick={() => setDeleteId(true)}
                                type={"danger"}
                            >
                                O’chirish
                            </Button>

                        </div>
                    </div>
                </div>

            </div>

            <ConfirmModal
                setActive={setDeleteId}
                active={deleteId}
                onClick={onDelete}
                text={capitalData?.name}
                title={`Rostanham o'chirmoqchimisiz`}
                type={"danger"}
            />

        </div>
    );
});