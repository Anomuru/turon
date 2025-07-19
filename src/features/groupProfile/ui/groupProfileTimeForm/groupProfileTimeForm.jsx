import classNames from "classnames";
import {getTimeTable, getWeekDays} from "entities/profile/groupProfile/model/groupProfileSelector";
import {changeWeekDays, createWeekDays, deleteWeekDays} from "entities/profile/groupProfile/model/groupProfileThunk";
import {getRoomsData} from "entities/rooms";
import {getUserBranchId} from "entities/profile/userProfile";
import React, {memo, useEffect, useState} from 'react';
import {useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router";

import {EditableCard} from "shared/ui/editableCard";
import {Modal} from "shared/ui/modal";
import {Form} from "shared/ui/form";
import {Select} from "shared/ui/select";
import {Input} from "shared/ui/input";
import {Button} from "shared/ui/button";
import {Table} from "shared/ui/table";

import cls from "./groupProfileTimeForm.module.sass";
import {getBranch} from "../../../branchSwitcher";

const data = [
    {
        name: "Madina",
        surname: "Abdurahmonova",
        days: ["14:00", "14:00", "14:00"]
    },
    {
        name: "Madina",
        surname: "Abdurahmonova",
        days: ["14:00", "14:00", "14:00"]
    },
    {
        name: "Madina",
        surname: "Abdurahmonova",
        days: ["14:00", "14:00", "14:00"]
    },
    {
        name: "Madina",
        surname: "Abdurahmonova",
        days: ["14:00", "14:00", "14:00"]
    }

]

export const GroupProfileTimeForm = memo(() => {

    const {
        register,
        handleSubmit,
        setValue
    } = useForm()

    const dispatch = useDispatch()
    const timeData = useSelector(getTimeTable)
    const roomsData = useSelector(getRoomsData)
    const weekData = useSelector(getWeekDays)
    const userBranchId = useSelector(getUserBranchId)
    // const {id} = useParams()
    const {id} = useSelector(getBranch)

    const [active, setActive] = useState("")
    const [counter, setCounter] = useState([])
    const [timeCounter, setTimeCounter] = useState([])
    const [isChanged, setIsChanged] = useState([])

    // useEffect(() => {
    //     if (timeData) setCounter([timeData.length ? timeData.length + 1 : 1])
    // }, [timeData])

    const onSubmit = (data) => {
        let arr = Object.entries(data).sort()
        let activeArr = counter.length ? [...timeCounter, ...counter] : timeCounter
        const res = activeArr.map((item, index) =>
            ({
                end_time: arr[index][1],
                start_time: arr[arr.length / 2 + index][1],
                room: +arr[arr.length / 4 + index][1],
                week: +arr[arr.length - (activeArr.length - index)][1],
                time: +item?.id ?? null,
                group: +id,
                branch: userBranchId
            })
        )
        res.map(item => {
            if (item.time) {
                dispatch(changeWeekDays({id: item.time, res: item}))
            } else {
                dispatch(createWeekDays({id: item.group, res: item}))
            }
        })
    }

    const onSubmitDelete = (id) => {
        dispatch(deleteWeekDays({id}))
    }

    const renderSubjectList = () => {
        return data.map(item =>
            <tr>
                <td/>
                <td>{item.name} {item.surname}</td>
                {
                    item.days.map(i =>
                        <td>{i}</td>
                    )
                }
            </tr>
        )
    }

    const render = renderSubjectList()

    return (
        <>
            <EditableCard
                extraClass={cls.subjectList}
                title={<i className="fas fa-edit"/>}
                onClick={() => setActive("changeTime")}
            >
                <h1>Dars jadvali</h1>
                <div className={cls.subjectList__contauner}>
                    <Table>
                        <thead>
                        <tr>
                            <th/>
                            <th>Hona</th>
                            <th>
                                <div className={cls.days}>
                                    <h2>01</h2>
                                    <p>Dushanba</p>
                                </div>
                            </th>
                            <th>
                                <div className={cls.days}>
                                    <h2>03</h2>
                                    <p>Dushanba</p>
                                </div>
                            </th>
                            <th>
                                <div className={cls.days}>
                                    <h2>05</h2>
                                    <p>Dushanba</p>
                                </div>
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {render}
                        </tbody>
                    </Table>
                </div>
            </EditableCard>
            <Modal
                extraClass={cls.timeForm}
                active={active === "changeTime"}
                setActive={setActive}
            >
                <h1>Ma’lumot o’zgartirish</h1>
                <Form
                    extraClassname={cls.form}
                    onSubmit={handleSubmit(onSubmit)}
                    typeSubmit={""}
                >
                    <div className={cls.form__container}>
                        {
                            timeData?.map((item, index) => {

                                if (timeCounter.length < (index + 1)) {
                                    setTimeCounter(prev => [...prev, {
                                        index: index + 1,
                                        id: item?.id
                                    }])
                                }
                                const dayName = `week${index + 1}`
                                const roomName = `room${index + 1}`
                                const startName = `start_time${index + 1}`
                                const endName = `end_time${index + 1}`
                                const changedName = `changed${index}`

                                setValue(startName, item?.start_time)
                                setValue(endName, item?.end_time)
                                setValue(dayName, item?.week?.id)
                                setValue(roomName, item?.room?.id)

                                return (
                                    <div className={cls.form__item}>
                                        <Select
                                            title={"Kunlar"}
                                            register={register}
                                            options={weekData}
                                            name={dayName}
                                            defaultValue={item?.week?.id}
                                            // onChangeOption={(value) => {
                                            //     if (value === item?.week?.id) {
                                            //         setIsChanged(prev =>
                                            //             prev.filter(i => i.id === changedName ? {id: changedName, status: false}: i))
                                            //     }
                                            // }}
                                        />
                                        <Select
                                            title={"Xonalar"}
                                            register={register}
                                            options={roomsData}
                                            name={roomName}
                                            defaultValue={item?.room?.id}
                                        />
                                        <Input
                                            extraClassName={cls.form__input}
                                            placeholder={"Boshlanish vaqti"}
                                            type={"time"}
                                            register={register}
                                            name={startName}
                                            defaultValue={item?.start_time}
                                        />
                                        <Input
                                            extraClassName={cls.form__input}
                                            placeholder={"Tugash vaqti"}
                                            type={"time"}
                                            register={register}
                                            name={endName}
                                            defaultValue={item?.end_time}
                                        />
                                        <div className={cls.form__icons}>
                                            <i
                                                className="fas fa-minus"

                                            />
                                            <i
                                                className={classNames("fas fa-times", cls.form__icon)}
                                                onClick={() => onSubmitDelete(item.id)}
                                            />
                                        </div>
                                    </div>
                                )
                            })
                        }
                        {
                            counter.map(item => {

                                const dayName = `week${item}Create`
                                const roomName = `room${item}Create`
                                const StartName = `start_time${item}Create`
                                const endName = `end_time${item}Create`

                                return (
                                    <div className={cls.form__item}>
                                        <Select
                                            title={"Kunlar"}
                                            register={register}
                                            options={weekData}
                                            name={dayName}
                                        />
                                        <Select
                                            title={"Xonalar"}
                                            register={register}
                                            options={roomsData}
                                            name={roomName}
                                        />
                                        <Input
                                            extraClassName={cls.form__input}
                                            placeholder={"Boshlanish vaqti"}
                                            type={"time"}
                                            register={register}
                                            name={StartName}
                                        />
                                        <Input
                                            extraClassName={cls.form__input}
                                            placeholder={"Tugash vaqti"}
                                            type={"time"}
                                            register={register}
                                            name={endName}
                                        />
                                        <div className={cls.form__icons}>
                                            <i
                                                className="fas fa-minus"
                                                onClick={() => setCounter(counter.filter(i => i !== item))}
                                            />
                                            <i className={classNames("fas fa-times", cls.form__icon)}/>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <i
                        className={classNames("fas fa-plus", cls.timeForm__plus)}
                        onClick={() => setCounter(prev => {
                            const newCounter = prev.length ?
                                ((timeCounter.length - 1) + (prev[prev.length - 1] + 1)) : timeCounter.length + 1
                            return [...prev, newCounter]
                        })}
                    />
                    <Button extraClass={cls.form__btn}>Change</Button>
                </Form>
            </Modal>
            <Modal
                extraClass={cls.timeDo}
                active={active === "doTime"}
                setActive={setActive}
            >
                <h1>Davomat qilinganlar</h1>
                <div className={cls.container}>
                    <div className={cls.container__item}>
                        <h1>Aziza Erkinova</h1>
                        <i className={classNames("fas fa-check", cls.container__check)}/>
                    </div>
                    <div className={cls.container__item}>
                        <h1>Aziza Erkinova</h1>
                        <i className={classNames("fas fa-times", cls.container__cross)}/>
                    </div>
                </div>
            </Modal>
        </>
    )
})
