import {memo, useEffect} from 'react';

import {Modal} from "shared/ui/modal";
import {Form} from "shared/ui/form";
import {Input} from "shared/ui/input";

import cls from "./calendarAdd.module.sass"

export const CalendarAdd = memo((props) => {

    const {
        active,
        setActive,
        onSubmit,
        register,
        setValue,
        success
    } = props

    useEffect(() =>{
        if (success) {
            setValue("name", "")
            setValue("color", null)
        }
    }, [success])

    return (
        <Modal
            active={active}
            setActive={setActive}
        >
            <div className={cls.calendarAdd}>
                <h1>Add</h1>
                <Form
                    onSubmit={onSubmit}
                >
                    <Input
                        register={register}
                        placeholder={"Kun nomi"}
                        name={"name"}
                        required
                    />
                    <Input
                        register={register}
                        type={"color"}
                        name={"color"}
                        required
                    />
                </Form>
            </div>
        </Modal>
    )
})
