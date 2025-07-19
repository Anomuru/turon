// import cls from "features/FlowProfileStudentsForm/ui/FlowProfileStudentsForm.module.sass";
import {FlowList} from "entities/flowList";
import {fetchFlows, getFlows} from "entities/flows";
import {getFlowsProfileData, getFlowsProfileFilteredStudents} from "entities/flowsProfile/model/flowsProfileSelector";
import {
    changeFlowProfile,
    fetchFilteredStudents,
    fetchFlowProfileData
} from "entities/flowsProfile/model/flowsProfileThunk";
import {fetchGroupProfile} from "entities/profile/groupProfile";
import {getUserBranchId} from "entities/profile/userProfile";
import React, {memo, useEffect, useState} from 'react';
import {useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import {Button} from "shared/ui/button";
import {Form} from "shared/ui/form";
import {Modal} from "shared/ui/modal";
import {Select} from "shared/ui/select";

import cls from "./flowAddForm.module.sass";

export const FlowAddForm = memo((props) => {

    const {
        active,
        setActive,
    } = props

    const dispatch = useDispatch()
    const {
        register,
        handleSubmit
    } = useForm()
    const flows = useSelector(getFlows)
    const data = useSelector(getFlowsProfileData)
    const userBranchId = useSelector(getUserBranchId)
    const filteredStudents = useSelector(getFlowsProfileFilteredStudents)

    const [currentFilteredData, setCurrentFilteredData] = useState([])
    const [activeModal, setActiveModal] = useState(false)
    const [selectedId, setSelectedId] = useState([])

    useEffect(() => {
        dispatch(fetchFlows(userBranchId))
    }, [])


    useEffect(() => {
        if (filteredStudents)
            setCurrentFilteredData(filteredStudents)
    }, [filteredStudents])

    useEffect(() => {
        if (userBranchId && data)
            dispatch(fetchFilteredStudents({
                flow: data?.id,
                branch: userBranchId,
                res: {ignore_students: data?.students.map(item => item?.id)}
            }))
    }, [userBranchId, data])

    const onSubmit = (data) => {
        dispatch(fetchFlowProfileData({id: data?.flow}))
        setActiveModal(true)
    }

    const onSubmitAdd = () => {
        let idArr = []
        selectedId.map(item => {
            item?.students?.map(i => idArr.push(i))
        })
        const res = {
            update_type: "add_students",
            students: idArr
        }
        dispatch(changeFlowProfile({id: data?.id, res}))
    }

    const onChangeAll = (classId) => {
        setCurrentFilteredData(prev => prev.map(item => {
            if (item.id === +classId) {
                if (item.isCheck) {
                    setSelectedId(prev => prev.filter(i => i.classId !== item.id))
                    return {
                        isCheck: false,
                        id: item.id,
                        students: item.students.map(inner => {
                            return ({
                                isCheck: false,
                                id: inner.id,
                                extra_info: inner.extra_info,
                                user: inner.user
                            })
                        }),
                        class_number: item.class_number,
                        color: item.color
                    }
                } else {
                    setSelectedId(prev => {
                        if (prev.filter(i => i.classId === item.id)[0]) {
                            return [
                                ...prev.filter(i => i.classId !== item.id),
                                {
                                    classId: item.id,
                                    students: item?.students?.map(item => item?.id)
                                }
                            ]
                        } else return [
                            ...prev,
                            {
                                classId: item.id,
                                students: item?.students?.map(item => item?.id)
                            }
                        ]
                    })
                    return {
                        isCheck: true,
                        id: item.id,
                        students: item.students.map(inner => {
                            return ({
                                isCheck: true,
                                id: inner.id,
                                extra_info: inner.extra_info,
                                user: inner.user
                            })
                        }),
                        class_number: item.class_number,
                        color: item.color
                    }
                }
            } else return item
        }))
    }

    const onChangeSingle = (studentId, classId) => {
        setSelectedId(prev => {
            if (prev.filter(i => i?.classId === +classId)[0]) {
                return prev.map(i => {
                    if (i?.classId === classId) {
                        return {
                            classId: i.classId,
                            students: i.students.includes(+studentId)
                                ?
                                i.students.filter(item => item !== +studentId)
                                :
                                [...i.students, +studentId]
                        }
                    }
                })
            } else return [...prev, {
                classId: +classId,
                students: [+studentId]
            }]
        })
    }

    useEffect(() => {
        setCurrentFilteredData(prev => prev.map(item => {
            const filtered = selectedId.filter(i => i?.classId === item.id)[0]
            if (filtered) {
                return {
                    isCheck: filtered?.students?.length === item.students.length,
                    id: item.id,
                    students: item.students.map(i => {
                        if (filtered?.students?.includes(i.id)) {
                            return {
                                isCheck: true,
                                id: i.id,
                                extra_info: i.extra_info,
                                user: i.user
                            }
                        } else {
                            return {
                                isCheck: false,
                                id: i.id,
                                extra_info: i.extra_info,
                                user: i.user
                            }
                        }
                    }),
                    class_number: item.class_number,
                    color: item.color
                }
            } else return item
        }))
    }, [selectedId])

    const renderFlowList = () => {
        return currentFilteredData.map((item, i) => (
            <FlowList
                key={i}
                flowList={item}
                onChangeAll={onChangeAll}
                onChangeSingle={onChangeSingle}
                // flowList={item?.students}
                number={i}
                // name={item?.name}
            />
        ))
    }

    const renderFlow = renderFlowList()

    return (
        <>
            <Modal
                active={active}
                setActive={setActive}
            >
                <Form
                    extraClassname={cls.addForm}
                    onSubmit={handleSubmit(onSubmit)}
                    typeSubmit={""}
                >
                    <h2>Add Flow</h2>
                    <Select
                        options={flows}
                        register={register}
                        title={"Patok"}
                        name={"flow"}
                    />
                    <Button extraClass={cls.addForm__btn}>Tekshirmoq</Button>
                </Form>
            </Modal>
            <Modal
                active={activeModal}
                setActive={setActiveModal}
                extraClass={cls.addModal}
            >
                {/*<Input*/}
                {/*    placeholder={"Search"}*/}
                {/*    // onChange={(e) => setSearchValue(e.target.value)}*/}
                {/*    // defaultValue={searchValue}*/}
                {/*/>*/}
                <div className={cls.addModal__header}>
                    <div className={cls.addModal__inner}>
                        <span>No</span>
                        <span>Sinf Raqami</span>
                    </div>
                </div>
                <div className={cls.addModal__container}>
                    {/*<Table>*/}
                    {/*    <thead>*/}
                    {/*    <tr>*/}
                    {/*        <th/>*/}
                    {/*        <th>Ism</th>*/}
                    {/*        <th>Familya</th>*/}
                    {/*        <th>Tel</th>*/}
                    {/*        <th/>*/}
                    {/*    </tr>*/}
                    {/*    </thead>*/}
                    {/*    <tbody>*/}
                    {renderFlow}
                    {/*    </tbody>*/}
                    {/*</Table>*/}
                </div>
                <Button
                    extraClass={cls.addModal__btn}
                    onClick={onSubmitAdd}
                >
                    Add
                </Button>
            </Modal>
        </>
    );
})
