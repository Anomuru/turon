import React, {memo, useEffect, useState} from 'react';
import cls from './schoolTeacherCountDayModal.module.sass'
import {Modal} from "shared/ui/modal";
import {Form} from "shared/ui/form";
import {Input} from "shared/ui/input";
import {useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import {fetchTeacherSalaryThunk} from "entities/teacherSalary";
import {API_URL, headers, useHttp} from "shared/api/base";
import {Select} from "shared/ui/select";
import {Radio} from "shared/ui/radio";
import {getBranch} from "../../../branchSwitcher";
import {Button} from "shared/ui/button";

export const SchoolTeacherCountDayModal = memo(({setEditMode, editMode, teacherData}) => {

    const {register, handleSubmit,setValue} = useForm()
    const [day, setDay] = useState("")
    const dispatch = useDispatch()
    // const {id} = useParams()
    const {id} = useParams()


    const [type,setType] = useState(false)

    const {request} = useHttp()

    const handleAddDay = (newData) => {
        const data = {
            salary_type: type,
            worked_hours: newData.day,
            class_salary: newData.class_salary
        }
        request(`${API_URL}Teachers/teachers/salary/update_patch/${teacherData.id}/` , "PATCH" , JSON.stringify(data) , headers())
            .then(res => {
                console.log(res)
                dispatch(fetchTeacherSalaryThunk(id))

            })

        console.log(data)


        // dispatch(schoolTeacherDayThunk({id: teacherData.id, data: data}))
        // dispatch(onChangeSalary(id))
        setEditMode(false)
    }


    useEffect(() => {
        console.log(teacherData)
        if (teacherData) {
            if (type) {
                setValue("day", teacherData.worked_hours )
            } else {
                setValue("class_salary", teacherData.class_salary )
                console.log("hello")
            }
        }
    },[teacherData,type])


    return (
        <div>
            <Modal extraClass={cls.dayModal} active={editMode} setActive={setEditMode}>
                <h1>O'qituvchining 1 oylik dars soatlari</h1>

                <div className={cls.btns}>
                    <Button onClick={() => setType(true)} type={type ? "success": "simple"}>Formula</Button>
                    <Button onClick={() => setType(false)} type={!type ? "success": "simple"}>Formulasiz</Button>
                </div>


                <Form onSubmit={handleSubmit(handleAddDay)}>
                    {
                        type ?
                            <Input
                                title={"Kelmagan kunlar"}
                                placeholder="Kelmagan kun"
                                type={"number"}
                                register={register}
                                name={"day"}
                            />
                            :
                            <Input
                                title={"Oylik"}
                                placeholder="Oylik kiriting"
                                type={"number"}
                                register={register}
                                name={"class_salary"}
                            />

                    }


                </Form>
            </Modal>
        </div>
    );
});
