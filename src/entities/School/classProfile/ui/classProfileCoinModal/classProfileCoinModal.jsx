import {memo} from 'react';

import {Modal} from "shared/ui/modal";
import {Form} from "shared/ui/form";
import {Input} from "shared/ui/input";

import cls from "./classProfileCoinModal.module.sass";

export const ClassProfileCoinModal = memo((props) => {

    const {
        active,
        setActive,
        onSubmit,
        register
    } = props

    return (
        <Modal
            active={active}
            setActive={setActive}
        >
            <Form
                onSubmit={onSubmit}
            >
                <div className={cls.coinModal}>
                    <h1>Coin qo’shish</h1>
                    <Input
                        register={register}
                        placeholder={"Summa"}
                        name={"amount"}
                        type={"number"}
                    />
                    <Input
                        register={register}
                        placeholder={"Sabab"}
                        name={"reason"}
                    />
                </div>
            </Form>
        </Modal>
    )
})
