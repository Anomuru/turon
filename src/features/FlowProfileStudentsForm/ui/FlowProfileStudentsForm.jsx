import {FlowList} from "entities/flowList";
import {fetchFlows, getFlows} from "entities/flows";
import {
    getFlowsProfileData,
    getFlowsProfileFilteredStudents, getFlowsProfileFilteredTeachers,
} from "entities/flowsProfile/model/flowsProfileSelector";
import {
    changeFlowProfile,
    fetchFilteredTeachers,
} from "entities/flowsProfile/model/flowsProfileThunk";
import {getUserBranchId} from "entities/profile/userProfile";
import {onAddAlertOptions, onAddMultipleAlertOptions} from "features/alert/model/slice/alertSlice";
import React, {useEffect, useState} from 'react';
import classNames from "classnames";
import {useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router";
import {API_URL, headers, useHttp} from "shared/api/base";
import defaultUserImg from "shared/assets/images/user_image.png";

import {Button} from "shared/ui/button";

import {Form} from "shared/ui/form";
import {Input} from "shared/ui/input";
import {Modal} from "shared/ui/modal";
import {Select} from "shared/ui/select";
import {Switch} from "shared/ui/switch";
import {Table} from "shared/ui/table";


import cls from "./FlowProfileStudentsForm.module.sass";
import {ConfirmModal} from "../../../shared/ui/confirmModal";
import {getBranch} from "../../branchSwitcher";

export const FlowProfileStudentsForm = ({activeTeacher, setActiveTeacher}) => {

    const {request} = useHttp()
    const {id} = useParams()
    // const id = useSelector(getUserBranchId)
    const dispatch = useDispatch()
    const {
        register,
        handleSubmit
    } = useForm()
    const navigation = useNavigate()
    const data = useSelector(getFlowsProfileData)
    const flows = useSelector(getFlows)
    const filteredStudents = useSelector(getFlowsProfileFilteredStudents)
    const filteredTeachers = useSelector(getFlowsProfileFilteredTeachers)
    const branch = useSelector(getUserBranchId)

    const [active, setActive] = useState(false)
    const [activeModal, setActiveModal] = useState("")
    const [selectedTeacher, setSelectedTeacher] = useState()
    const [selectedId, setSelectedId] = useState([])
    const [selectedMoveId, setSelectedMoveId] = useState([])
    const [deleteId, setDeleteId] = useState(null)
    const [currentFilteredData, setCurrentFilteredData] = useState([])

    useEffect(() => {
        if (filteredStudents)
            setCurrentFilteredData(filteredStudents)
    }, [filteredStudents])

    useEffect(() => {
        dispatch(fetchFlows())
    }, [])

    useEffect(() => {
        if (data && id && branch) {
            const res = {
                ignore_teacher: data?.teacher?.id
            }
            dispatch(fetchFilteredTeachers({res, id, branch}))
        }
    }, [id, branch])

    const onSubmitAdd = () => {
        let idArr = []
        selectedId.map(item => {
            item?.students?.map(i => idArr.push(i))
        })
        const res = {
            update_type: "add_students",
            students: idArr
        }
        dispatch(changeFlowProfile({id, res}))
    }

    const onSubmitDelete = () => {
        const res = {
            update_type: "remove_students",
            students: [deleteId?.id]
        }
        dispatch(changeFlowProfile({id, res}))
        // dispatch(onAddAlertOptions({
        //     type: "success"
        // }))
    }

    const onSubmitMove = (data) => {
        // dispatch(moveFlow({
        //     id,
        //     ...data,
        //     res: {students: selectedMoveId}
        // }))
        request(`${API_URL}Flow/move-to-flow/?flow_id=${id}&to_flow_id=${data?.to_id}`, "POST", JSON.stringify({students: selectedMoveId}), headers())
            .then(res => {
                dispatch(onAddMultipleAlertOptions(res.errors.map(item => ({
                    type: "error",
                    status: true,
                    msg: item
                }))))
            })
    }

    const onChangeTeacher = (teacherId) => {
        if (filteredTeachers.filter(item => item.id === +teacherId)[0]?.subject.length === 1) {
            dispatch(changeFlowProfile({
                res: {
                    teacher: teacherId,
                    subject: filteredTeachers.filter(item => item.id === +teacherId)[0]?.subject[0]?.id,
                    level: null
                },
                id,
                // group_type: "school"
            }))
            dispatch(onAddAlertOptions({
                type: "success",
                status: true,
                msg: `Patokni o'qituvchisi o'zgardi`
            }))
        } else {
            setSelectedTeacher(teacherId)
            setActiveModal("changeTeacher")
        }
    }

    const onSubmitSubject = (data) => {

        const res = {
            ...data,
            teacher: selectedTeacher,
            level: null
        }

        dispatch(changeFlowProfile({id, res}))

        // if (filteredTeachers.filter(item => item.id === +teacherId)[0]?.subject.length === 1) {
        //     dispatch(changeFlowProfile({
        //         res: {teacher: teacherId },
        //         id,
        //         // group_type: "school"
        //     }))
        //     dispatch(onAddAlertOptions({
        //         type: "success",
        //         status: true,
        //         msg: `Patokni o'qituvchisi o'zgardi`
        //     }))
        // } else {
        //     setActiveModal("changeTeacher")
        // }
    }

    const renderStudentsList = () => {
        return data?.students?.map(item =>
            <tr>
                <td>
                    <img
                        onClick={() => navigation(`../students/profile/${item?.id}`)}
                        src={item.img ?? defaultUserImg}
                        alt=""
                    />
                </td>
                <td>
                    {`${item?.surname} ${item?.name}`}
                </td>
                <td>{item?.phone}</td>
                <td>{item?.parents_phone}</td>
                <td>
                    <div
                        className={classNames(cls.studentsList__status, {
                            [cls.red]: Number(item.balance) < 0,
                            [cls.yellow]: Number(item.balance) > 0 && Number(item.balance) < 100000,
                        })}
                    >
                        {item?.balance}
                    </div>
                </td>
                {
                    active ? <>
                        <td>
                            <Input
                                extraClassName={cls.studentsList__input}
                                type={"checkbox"}
                                // defaultValue={item.checked}
                                onChange={() => setSelectedMoveId(prev => {
                                    if (prev.filter(i => i === item.id)[0]) {
                                        return prev.filter(i => i !== item.id)
                                    } else return [...prev, item.id]
                                })}
                            />
                        </td>
                        <td>
                            <i
                                className={classNames("fas fa-trash", cls.studentsList__delete)}
                                onClick={() => setDeleteId(item)}
                            />
                        </td>
                    </> : null
                }
            </tr>
        )
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

    const renderTeachers = () => {
        return filteredTeachers?.map(item =>
            <tr>
                <td>
                    <img src={defaultUserImg} alt=""/>
                </td>
                <td>{item?.user?.name}</td>
                <td>{item?.user?.surname}</td>
                <td>
                    <div className={cls.teachersModal__wrapper}>
                        {
                            item?.subject?.map(i =>
                                <div className={cls.teachersModal__subject}>
                                    {i?.name?.slice(0, 16)}
                                </div>
                            )
                        }
                    </div>
                </td>
                <td>
                    <div className={cls.check}>
                        <Switch
                            activeSwitch={data?.teacher?.id === item?.id}
                            onChangeSwitch={() => onChangeTeacher(item?.id)}
                        />
                        <div className={classNames(cls.status, {
                            [cls.active]: item?.extra_info?.status
                        })}>
                            <div className={classNames(cls.status__inner, {
                                [cls.active]: item?.extra_info?.status
                            })}/>
                        </div>
                    </div>
                </td>
            </tr>
        )
    }

    const renderFlow = renderFlowList()
    const renderTeacher = renderTeachers()
    const render = renderStudentsList()
    // const renderStudent = renderStudentsData()

    return (
        <>
            <div className={cls.studentsList}>
                <div className={cls.btns}>
                    <h1>O’quvchilar ro’yxati</h1>
                    <div className={cls.btns__inner}>
                        <Button
                            disabled={selectedMoveId.length === 0}
                            type={selectedMoveId.length === 0 ? "disabled" : ""}
                            onClick={() => setActiveModal("change")}
                        >
                            Move
                        </Button>
                        <Button
                            onClick={() => setActiveModal("add")}
                        >
                            Add
                        </Button>
                        <i
                            className={classNames("fas fa-edit", cls.btns__icon)}
                            onClick={() => setActive(!active)}
                        />
                    </div>
                </div>
                <div className={cls.studentsList__container}>
                    <Table>
                        <thead>
                        <tr>
                            <th/>
                            <th>Ism Familya</th>
                            <th>Tel</th>
                            <th>Tel Ota-ona</th>
                            <th>Balans</th>
                            {
                                active ? <>
                                    <th/>
                                    <th/>
                                </> : null
                            }
                        </tr>
                        </thead>
                        <tbody>
                        {render}
                        </tbody>
                    </Table>
                </div>
            </div>
            <Modal
                active={activeModal === "add"}
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
            <Modal
                extraClass={cls.deleteForm}
                active={activeModal === "change"}
                setActive={setActiveModal}
            >
                <h1>Boshqa sinfga qo’shish</h1>
                <Form
                    extraClassname={cls.deleteForm__form}
                    onSubmit={handleSubmit(onSubmitMove)}
                    typeSubmit={""}
                >
                    <Select
                        extraClass={cls.deleteForm__select}
                        options={flows?.filter(item => item.id !== +id)}
                        title={"Patok"}
                        // onChangeOption={onFilterGroups}
                        register={register}
                        name={"to_id"}
                    />
                    {/*<Select*/}
                    {/*    extraClass={cls.deleteForm__select}*/}
                    {/*    // options={groups}*/}
                    {/*    title={"Class"}*/}
                    {/*    register={register}*/}
                    {/*    name={"class"}*/}
                    {/*/>*/}
                    <Button extraClass={cls.deleteForm__btn}>Add</Button>
                </Form>
            </Modal>
            <Modal
                active={activeTeacher === "changeTeacher"}
                setActive={setActiveTeacher}
                extraClass={cls.teachersModal}
            >
                {/*<Input*/}
                {/*    placeholder={"Search"}*/}
                {/*    onChange={(e) => setSearchValue(e.target.value)}*/}
                {/*    defaultValue={searchValue}*/}
                {/*/>*/}
                <div className={cls.teachersModal__container}>
                    <Table>
                        <thead>
                        <tr>
                            <th/>
                            <th>Ism</th>
                            <th>Familya</th>
                            <th>Fanlar</th>
                            <th>Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {renderTeacher}
                        </tbody>
                    </Table>
                </div>
            </Modal>
            <Modal
                extraClass={cls.changeTeacher}
                active={activeModal === "changeTeacher"}
                setActive={setActiveModal}
            >
                <h1>Fan tanlang</h1>
                <Form
                    extraClassname={cls.changeTeacher__container}
                    onSubmit={handleSubmit(onSubmitSubject)}
                >
                    <Select
                        title={"Fan"}
                        register={register}
                        options={filteredTeachers?.filter(item => item.id === selectedTeacher)[0]?.subject}
                        name={"subject"}
                    />
                </Form>
            </Modal>
            <ConfirmModal setActive={setDeleteId} active={deleteId} onClick={onSubmitDelete}   type={"danger"}/>

        </>
    )
}
