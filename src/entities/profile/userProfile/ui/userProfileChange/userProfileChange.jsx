import {memo, useEffect, useMemo, useState} from 'react';
import {Button} from "shared/ui/button";

import {Form} from "shared/ui/form";
import {Modal} from "shared/ui/modal";
import {Input} from "shared/ui/input";

import cls from "./userProfileChange.module.sass";

export const UserProfileChange = memo((props) => {

    const {
        active,
        setActive,
        onSubmit,
        register,
        setValue,
        data
    } = props

    const [activeType, setActiveType] = useState(false)

    let name = useMemo(() => data?.name, [data])
    let surname = useMemo(() => data?.surname, [data])
    let fatherName = useMemo(() => data?.father_name, [data])
    let birthDate = useMemo(() => data?.birth_date, [data])
    let phone = useMemo(() => data?.phone, [data])

    useEffect(() => {
        setValue("name", name)
        setValue("surname", surname)
        setValue("father_name", fatherName)
        setValue("birth_date", birthDate)
        setValue("phone", phone)
    }, [data])

    const renderForm = () => {
        switch (activeType) {
            case false:
                return (
                    <>
                        <Input
                            extraClassName={cls.change__input}
                            register={register}
                            name={"name"}
                            placeholder={"Ism"}
                            required
                        />
                        <Input
                            extraClassName={cls.change__input}
                            register={register}
                            name={"surname"}
                            placeholder={"Familiya"}
                            required
                        />
                        <Input
                            extraClassName={cls.change__input}
                            register={register}
                            name={"father_name"}
                            placeholder={"Otasining ismi"}
                            required
                        />
                        <Input
                            extraClassName={cls.change__input}
                            register={register}
                            name={"birth_date"}
                            placeholder={"Tug'ilgan sana"}
                            type={"date"}
                            required
                        />
                        <Input
                            extraClassName={cls.change__input}
                            register={register}
                            name={"phone"}
                            placeholder={"Telefon raqami"}
                            type={"number"}
                            required
                        />
                    </>
                )
            case true:
                return (
                    <>
                        <Input
                            extraClassName={cls.change__input}
                            register={register}
                            name={"password"}
                            placeholder={"Parol"}
                            type={"password"}
                            required
                        />
                        <Input
                            extraClassName={cls.change__input}
                            register={register}
                            name={"confirm_password"}
                            placeholder={"Parolni tasdiqlang"}
                            type={"password"}
                            required
                        />
                    </>
                )
        }
    }

    const render = renderForm()

    return (
        <Modal
            active={active}
            setActive={setActive}
        >
            <div className={cls.change}>
                <div className={cls.change__header}>
                    <h1>Malumotni o'zgartirish</h1>
                    {/*<Button*/}
                    {/*    onClick={() => setActiveType("info")}*/}
                    {/*    extraClass={cls.change__btn}*/}
                    {/*    type={activeType === "info" ? "simple" : "simple-add"}*/}
                    {/*>*/}
                    {/*    Info*/}
                    {/*</Button>*/}
                    <Button
                        onClick={() => setActiveType(!activeType)}
                        extraClass={cls.change__btn}
                        type={activeType ? "simple" : "simple-add"}
                    >
                        Password
                    </Button>
                </div>
                <Form
                    onSubmit={onSubmit}
                    // typeSubmit={""}
                >
                    {render}
                </Form>
            </div>
        </Modal>
    )
})
