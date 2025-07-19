import {onAddAlertOptions} from "features/alert/model/slice/alertSlice";
import React, {memo, useState} from 'react';
import {useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";

import {getUserBranchId} from "entities/profile/userProfile";
import {
    getFilteredStatus,
    getFilteredStudentsData,
    getFilteredStudentsStatus
} from "entities/students";
import {getRoomsData} from "entities/rooms";
import {Form} from "shared/ui/form";
import {Select} from "shared/ui/select";
import {Input} from "shared/ui/input";
import {MiniLoader} from "shared/ui/miniLoader";
import {Button} from "shared/ui/button";
import {Modal} from "shared/ui/modal";
import {API_URL, headers, useHttp} from "shared/api/base";

import cls from "./groupTimeTableForm.module.sass";

export const GroupTimeTableForm = memo((props) => {

    const {
        setActive,
        active,
        selectTime,
        setSelectTime,
        weekDays
    } = props

    const {
        register,
        handleSubmit
    } = useForm()
    const dispatch = useDispatch()
    const {request} = useHttp()

    const roomsData = useSelector(getRoomsData);
    // const weekDays = useSelector(getWeekDays);
    const userBranchId = useSelector(getUserBranchId)
    const filteredStatus = useSelector(getFilteredStatus)
    const [timeCounter, setTimeCounter] = useState([1])

    const onSubmit = (data) => {
        let arr = Object.entries(data).sort()
        const res = timeCounter.map((item, index) =>
            ({
                end_time: arr[index][1],
                start_time: arr[arr.length / 2 + index][1],
                room: +arr[arr.length / 4 + index][1],
                week: +arr[arr.length - (timeCounter.length - index)][1],
                branch: userBranchId
            })
        )
        dispatch(getFilteredStudentsStatus())
        setSelectTime(res)

        // console.log("hello", res)

        request(`${API_URL}Students/api/filter_students_subject/?branch=${userBranchId}`, "POST", JSON.stringify(res), headers())
            .then(res => {
                // console.log(res, "timeTable")
                dispatch(getFilteredStudentsData(res))
                dispatch(onAddAlertOptions({
                    type: "success",
                    status: true,
                    msg: `Filterlangan o'quvchilar keldi`
                }))
                setActive(false)
            })
            .catch(err => {
                console.log(err)
                dispatch(onAddAlertOptions({
                    type: "error",
                    status: true,
                    msg: `Databazada xatolik yuz berdi`
                }))
            })
    }

    return (
        <Modal
            setActive={setActive}
            active={active}
        >
            <Form
                typeSubmit={""}
                extraClassname={cls.timeTable}
                onSubmit={handleSubmit(onSubmit)}
            >
                <h1 className={cls.timeTableHeader}>
                    Vaqti Kiritish
                </h1>
                <div className={cls.timeTable__scroll}>
                    {
                        timeCounter.map((item, index) => {

                            const days = `week${item}`
                            const room = `room${item}`
                            const start_time = `start_time${item}`
                            const end_time = `end_time${item}`

                            return (
                                <div className={cls.timeTableForm}>
                                    <Select
                                        title={"Kunlar"}
                                        options={weekDays}
                                        // onChangeOption={setSelectDay}
                                        register={register}
                                        name={days}
                                        defaultValue={selectTime[index]?.week}
                                    />
                                    <Select
                                        title={"Honalar"}
                                        options={roomsData}
                                        // onChangeOption={setSelectRoom}
                                        register={register}
                                        name={room}
                                        defaultValue={selectTime[index]?.room}
                                    />
                                    <Input
                                        type={"time"}
                                        placeholder={"Boshlanish vaqti"}
                                        register={register}
                                        name={start_time}
                                    />
                                    <Input
                                        type={"time"}
                                        placeholder={"Tugash vaqti"}
                                        register={register}
                                        name={end_time}
                                    />
                                </div>
                            )
                        })
                    }
                </div>
                <div
                    className={cls.timeTableAddPlus}
                    onClick={() => setTimeCounter(prev => [...prev, (prev[prev.length - 1] + 1)])}
                >
                    <i className={"fa fa-plus"}/>
                </div>
                <div className={cls.timeTableFooterBtn}>
                    {
                        filteredStatus === "loading" ? <MiniLoader/> : <Button>Tekshirmoq</Button>
                    }
                </div>
            </Form>
        </Modal>
    )
})
