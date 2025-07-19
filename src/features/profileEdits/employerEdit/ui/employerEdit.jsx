import {getUserJob} from "entities/profile/userProfile";
import {fetchVacancyData, getVacancyJobs} from "features/vacancyModals/vacancyPageAdd";
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Select} from "shared/ui/select";
import {editEmployerThunk, fetchEmployerId} from "../../../../entities/profile/employerProfile";
import {Modal} from "shared/ui/modal";
import {Input} from "shared/ui/input";
import {getEmployerId} from "../../../../entities/profile/employerProfile";
import cls from './employerEdit.module.sass'
import {Button} from "../../../../shared/ui/button";
import {onAddAlertOptions} from "../../../alert/model/slice/alertSlice";

export const EmployerEdit = ({isOpen, onClose, onUpdate, teacherId}) => {
    const dispatch = useDispatch();
    const employerID = useSelector(getEmployerId);
    const data = useSelector(getVacancyJobs)
    const userJob = useSelector(getUserJob)
    const [selectedFrom, setSelectedFrom] = useState()
    const [selectedTo, setSelectedTo] = useState()
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [phone, setNumber] = useState('')
    const [age, setAge] = useState('')
    const [money, setMoney] = useState('')
    const [selectedJob, setSelectedJob] = useState(null)
    const [jobs, setJobs] = useState([])

    useEffect(() => {
        dispatch(fetchVacancyData())
    }, [])

    useEffect(() => {
        if (data && selectedJob) {
            setJobs(() => {
                if (userJob === "director") {
                    return data.map(item => ({
                        id: item?.group?.id,
                        name: item?.group?.name
                    }))
                } else {
                    return data
                        .filter(item => item?.name !== "director" && item?.name !== "admin")
                        .map(item => ({
                            id: item?.group?.id,
                            name: item?.group?.name
                        }))
                }
            })
        }
    }, [data])

    useEffect(() => {
        if (employerID) {
            setName(employerID?.user?.name)
            setSurname(employerID?.user?.surname)
            setNumber(employerID?.user?.phone)
            setAge(employerID?.user?.birth_date)
            setMoney(employerID?.salary)
            setSelectedJob(employerID?.group?.id)
        }
    }, [employerID])

    const handleEditTeacher = () => {
        if (!employerID) return;
        const updateEmployer = {
            name: name,
            surname: surname,
            phone: phone,
            birth_date: age,
            money: money,
            profession: +selectedJob

        };
        dispatch(editEmployerThunk({id: (employerID.user?.id), updateEmployer}))
            .then(() => {
                // onUpdate(updateEmployer)
                dispatch(onAddAlertOptions({
                    type: "success",
                    status: true,
                    msg: "Ma'lumot muvofaqqiyatli o'zgartirildi"
                }))
                dispatch(fetchEmployerId(employerID.id))
                onClose()
            })
    }
    if (!isOpen) return null
    return (
        <Modal
            active={isOpen}
            setActive={onClose}
        >
            <div className={cls.filter}>
                <h1>Ma'lumotlarni o'zgartirish</h1>
                <div className={cls.filter__container}>

                    <Input
                        type={"text"}
                        extraClassName={cls.inputAge}
                        placeholder={"Ism"}
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        // value={selectedFrom}
                    />

                    <div className={cls.filter__age}>
                        <Input
                            type={"text"}
                            extraClassName={cls.filter__input}
                            placeholder={"Familiya"}
                            onChange={(e) => setSurname(e.target.value)}
                            value={surname}
                            // value={selectedFrom}
                        />
                        <Input
                            type={"number"}
                            extraClassName={cls.filter__input}
                            placeholder={"Tel raqami"}
                            onChange={(e) => setNumber(e.target.value)}
                            value={phone}
                            // value={selectedTo}
                        />
                        <Input
                            type={"date"}
                            extraClassName={cls.inputAge}
                            placeholder={"Tug'ilgan yili"}
                            onChange={(e) => setAge(e.target.value)}
                            value={age}
                            // value={selectedFrom}
                        />
                        <Input
                            type={"number"}
                            extraClassName={cls.inputAge}
                            placeholder={"Oylik"}
                            onChange={(e) => setMoney(e.target.value)}
                            value={money}
                        />
                        <Select
                            extraClass={cls.inputAge}
                            options={jobs}
                            onChangeOption={setSelectedJob}
                            defaultValue={selectedJob}
                        />
                        {/*<Input*/}
                        {/*    type={"text"}*/}
                        {/*    extraClassName={cls.inputAge}*/}
                        {/*    placeholder={"Class type"}*/}
                        {/*    onChange={setSelectedFrom}*/}
                        {/*    // value={selectedFrom}*/}
                        {/*/>*/}
                    </div>


                    <div className={cls.filter__switch}>
                        <div></div>
                        <Button extraClass={cls.submitBtn} type={"submit"} children={"Button"}
                                onClick={handleEditTeacher}/>
                    </div>

                </div>
            </div>
        </Modal>
    );
}