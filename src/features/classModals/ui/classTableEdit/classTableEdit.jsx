import {Modal} from "shared/ui/modal";
import {Input} from "shared/ui/input";
import {Button} from "shared/ui/button";
import {Form} from "shared/ui/form";
import {useForm} from "react-hook-form";

import cls from "../classModal.module.sass"
import {useEffect, useState} from "react";

import {AnimatedMulti} from "features/workerSelect";


import {updateClassItem} from "entities/class/model/thunk/classThunk";


import {useDispatch} from "react-redux";
import {API_URL, headers, useHttp} from "shared/api/base";
import {onUpdateClass} from "entities/class/model/slice/classSlice";
import {onAddAlertOptions} from "features/alert/model/slice/alertSlice.js";


export const ClassTableEdit = ({

                                   selectOptions,
                                   editClass,
                                   setEditClass,
                                   edit,
                                   changedItem,


                               }) => {


    // const [selectedSubject, setSelectedSubject] = useState([])
    //
    //
    // const {register, handleSubmit, setValue} = useForm()
    // const dispatch = useDispatch()
    //
    // const {request} = useHttp()
    //
    // const changeInfo = (data) => {
    //
    //     const id = edit.id
    //
    //     const res1 = {
    //         subjects: selectedSubject.map(item => (
    //             // name: item.label,
    //             item.value
    //         )),
    //         ...data
    //     }
    //     const idClass = editClass
    //
    //     setValue("curriculum_hours", "")
    //     setValue("price", "")
    //     // dispatch(updateClassItem({idClass, res}))
    //     request(`${API_URL}Class/class_number_update/${idClass}/`, "PUT", JSON.stringify(res1), headers())
    //         .then(res => {
    //             dispatch(onUpdateClass(res))
    //         })
    //         .catch(err => {
    //         })
    //
    //     setEditClass(!editClass)
    // }
    //
    //
    // const [optionsSubject, setOptionsSubject] = useState([])
    //
    //
    // useEffect(() => {
    //     if (changedItem?.id) {
    //
    //         setSelectedSubject(changedItem.subjects.map(item => ({
    //             value: item.id,
    //             label: item.name
    //         })))
    //         setValue("curriculum_hours", changedItem.curriculum_hours)
    //         setValue("price", changedItem.price)
    //
    //     }
    // }, [changedItem?.id])
    //
    // useEffect(() => {
    //     if (selectOptions?.length)
    //         setOptionsSubject(selectOptions?.map(item => ({
    //             value: item.id,
    //             label: item.name
    //         })))
    //
    // }, [selectOptions])
    //
    // const onChangeSubjectPrice = (id, hours) => {
    //     setSelectedSubject(subjects => subjects.map(item => {
    //         if (item.value === id && hours !== item?.hours) {
    //             return {
    //                 ...item,
    //                 hours
    //             }
    //         }
    //         return item
    //     }))
    // }

    const [selectedSubject, setSelectedSubject] = useState([])


    const {register, handleSubmit, setValue} = useForm()
    const {request} = useHttp()
    const dispatch = useDispatch()


    const onDeleteSubject = (item) => {
        const id = item.value

        if (item.fromDatabase) {
            request(`${API_URL}Group/groups_remove_subject/`, "POST",JSON.stringify({subject_id: id, group_id: editClass}) , headers())
                .then(res => {
                    dispatch(onAddAlertOptions({
                        type: "success",
                        status: true,
                        msg: res.msg
                    }))
                    setSelectedSubject(selectedSubject.filter(item => item.value !== id))
                    // dispatch(onUpdateClass(res))
                })
                .catch(err => {
                })
        } else {
            setSelectedSubject(selectedSubject.filter(item => item.value !== id))
        }
    }
    //
    //
    //  const onChangeSubject = async (data) => {
    //
    //     if (selectedSubject.length !== data.length) {
    //         await onDeleteSubject(data)
    //     }
    //     await setSelectedSubject(data)
    // }

    const changeInfo = (data) => {


        const res = {
            subjects: selectedSubject,
            ...data
        }

        const idClass = editClass
        setValue("price", selectedSubject.price)
        dispatch(updateClassItem({idClass, res}))
        setEditClass(!editClass)
    }


    const [optionsSubject, setOptionsSubject] = useState([])


    useEffect(() => {
        if (changedItem?.id) {
            setSelectedSubject(changedItem.subjects.map(item => ({
                value: item.subject_id,
                label: item.subject_name,
                hours: item.hours,
                fromDatabase: item.from_database,
                canDelete: item.can_delete
            })))
            setValue("curriculum_hours", changedItem.curriculum_hours)
            setValue("price", changedItem.price)

        }
    }, [changedItem?.id])

    useEffect(() => {
        if (selectOptions?.length)
            setOptionsSubject(selectOptions?.map(item => ({
                value: item.id,
                label: item.name,
                canDelete: true
            })))
    }, [selectOptions])


    // useEffect(() => {
    //     if (editClass) {
    //         request(`${API_URL}Class/class_subjects/?id=${editClass}`, "GET", null, headers())
    //             .then(res => {
    //                 setSelectedSubject(res.hours.map(item => ({
    //                     value: item.id,
    //                     label: item.name,
    //                     hours: item.hours
    //                 })))
    //             })
    //     }
    // }, [editClass])


    const onChangeSubjectPrice = (id, hours) => {
        setSelectedSubject(subjects => subjects.map(item => {
            if (item.value === id && hours !== item?.hours) {
                return {
                    ...item,
                    hours
                }
            }
            return item
        }))
    }


    return (
        <>
            <Modal active={editClass} setActive={setEditClass}>
                <h2>Ma’lumotlarni o’zgartirish</h2>
                <Form extraClassname={cls.extraClassForm} typeSubmit={""} onSubmit={handleSubmit(changeInfo)}>
                    <div className={cls.container}>
                        <div>

                            <Input
                                name={"price"}
                                register={register}
                                value={changedItem.price}
                                type={"number"}
                                placeholder={"narxi"}
                            />

                            <div className={cls.selectBox}>
                                <AnimatedMulti
                                    extraClass={cls.select}
                                    value={selectedSubject}
                                    options={optionsSubject}
                                    onChange={setSelectedSubject}
                                />
                            </div>
                        </div>
                        <div className={cls.inputs}>
                            {
                                selectedSubject.map(item => {
                                    return (
                                        <div className={cls.inputs__item}>
                                            <Input
                                                value={item.hours || 0}
                                                type={"number"}
                                                title={item.label}
                                                onChange={
                                                    (e) => onChangeSubjectPrice(item.value, e.target.value)
                                                }
                                            />
                                            {
                                                item.canDelete  && <i className={"fas fa-times"} onClick={() => onDeleteSubject(item)}></i>
                                            }

                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <Button>
                        Tastiqlash
                    </Button>
                </Form>

            </Modal>


        </>
    )
}

