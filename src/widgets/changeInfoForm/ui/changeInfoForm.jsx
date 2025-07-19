import React, {useCallback, useEffect, useState} from 'react';
import classNames from "classnames";

import {useForm} from "react-hook-form";
import {Button} from "shared/ui/button";
import {Form} from "shared/ui/form";
import {Input} from "shared/ui/input";
import {Modal} from "shared/ui/modal";
import {Select} from "shared/ui/select";

import cls from "./changeInfoForm.module.sass";

export const ChangeInfoForm = ({onSubmit, data, defaultValue, active, setActive, extraClass}) => {

    const {
        register,
        handleSubmit,
        setValue
    } = useForm()

    const [currentData, setCurrentData] = useState([])
    const [activeType, setActiveType] = useState(false)

    useEffect(() => {
        setCurrentData(data)
    }, [data])

    useEffect(() => {

        // setValue("name", defaultValue?.name)
        // setValue("surname", defaultValue?.surname)
        // setValue("father_name", defaultValue?.father_name)
        // setValue("birth_date", defaultValue?.birth_date)
        // setValue("phone", +defaultValue?.phone)
        currentData?.map(item => {
            setValue(item?.name, item?.defaultValue)
        })
    }, [currentData])

    const render = useCallback(() => {
        switch (activeType) {
            case true:
                return (
                    <>
                        <Input
                            extraClassName={cls.change__extraClass}
                            register={register}
                            name={"password"}
                            placeholder={"Parol"}
                            type={"password"}
                            required
                        />
                        <Input
                            extraClassName={cls.change__extraClass}
                            register={register}
                            name={"confirm_password"}
                            placeholder={"Parolni tasdiqlang"}
                            type={"password"}
                            required
                        />
                    </>
                )
            case false:
                return currentData?.map(item => {
                    if (item?.isSelect) {
                        return (
                            <Select
                                status={item?.status}
                                extraClass={classNames(item?.extraClass, cls.change__extraClass)}
                                options={item?.options}
                                title={item?.placeholder}
                                register={register}
                                name={item?.name}
                                onChangeOption={item?.onChange}
                                defaultValue={item?.defaultValue}
                                keyValue={item?.keyValue}
                                required
                            />
                        )
                    } else return (
                        <Input
                            extraClassName={classNames(item?.extraClass, cls.change__extraClass)}
                            placeholder={item?.placeholder}
                            register={register}
                            name={item?.name}
                            onChange={(e) => item?.onChange(e.target.value)}
                            defaultValue={item?.defaultValue}
                            type={item?.type ?? "text"}
                            checked={item?.checked}
                            required
                        />
                    )
                })
        }
    }, [currentData, activeType])

    return (
        <Modal
            active={active}
            setActive={setActive}
        >
            <div className={cls.change}>
                <div className={cls.change__header}>
                    <h1>Malumotni o'zgartirish</h1>
                    <Button
                        onClick={() => setActiveType(!activeType)}
                        extraClass={cls.change__btn}
                        type={activeType ? "simple" : "simple-add"}
                    >
                        Password
                    </Button>
                </div>
                <Form
                    extraClassname={classNames(cls.change__form, extraClass)}
                    onSubmit={handleSubmit(onSubmit)}
                    // typeSubmit={""}
                >
                    {render()}
                </Form>
            </div>
        </Modal>
    )
}
