import {AnimatedMulti} from "features/workerSelect";
import {memo, useEffect, useState} from 'react';
import {useForm} from "react-hook-form";
import {useDispatch} from "react-redux";

import {Modal} from "shared/ui/modal";
import {Form} from "shared/ui/form";
import {Input} from "shared/ui/input";
import {Button} from "shared/ui/button";
import {MiniLoader} from "shared/ui/miniLoader";

import cls from "./timeTableCreate.module.sass";
import {Select} from "shared/ui/select";

export const TimeTableCreate = memo((props) => {

    const {
        classInput,
        active,
        setActive,
        onSubmit,
        loading
    } = props


    const optionsType = [
        {
            name: "Yuqori",
            value: "high"
        },
        {
            name: "Boshlang'ich",
            value: "initial"
        },
    ]

    const {
        register,
        handleSubmit,
        reset
    } = useForm()

    const [selectedCI, setSelectedCI] = useState(null)
    const [classInputData, setClassInputData] = useState([])

    useEffect(() => {
        setClassInputData(classInput.map(item => ({value: item.id, label: item.name})))
    }, [classInput])

    return (
        <Modal
            active={active}
            setActive={setActive}
        >
            <Form
                onSubmit={handleSubmit((data) => {
                    onSubmit({...data, types: selectedCI.map(item => item.value)})
                    reset()
                })}
                typeSubmit={""}
            >
                <div className={cls.create}>
                    <h1>Soat yaratish</h1>
                    <Input
                        extraClassName={cls.create__input}
                        placeholder={"Boshlanish vaqti"}
                        register={register}
                        name={"start_time"}
                        type={"time"}
                        required
                    />
                    <Input
                        extraClassName={cls.create__input}
                        placeholder={"Tugash vaqti"}
                        register={register}
                        name={"end_time"}
                        type={"time"}
                        required
                    />
                    <Input
                        extraClassName={cls.create__input}
                        placeholder={"Soati"}
                        register={register}
                        name={"order"}
                        type={"number"}
                        required
                    />
                    <Input
                        extraClassName={cls.create__input}
                        placeholder={"Name"}
                        register={register}
                        name={"name"}
                        required
                    />
                    <Select
                        name={"type"}
                        register={register}
                        required
                        options={optionsType}
                    />
                    <AnimatedMulti
                        options={classInputData}
                        onChange={setSelectedCI}
                        value={selectedCI}
                        fontSize={15}
                    />
                    {
                        loading ? <MiniLoader/> :
                            <Button
                                extraClass={cls.create__btn}
                                type={"simple"}
                            >
                                Yaratish
                            </Button>
                    }
                </div>
            </Form>
        </Modal>
    )
})
