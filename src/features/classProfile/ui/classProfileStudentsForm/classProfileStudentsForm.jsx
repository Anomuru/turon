import React, {memo, useState} from 'react';
import classNames from "classnames";
import {useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";

import {deleteGroupProfile, getGroupProfileData} from "entities/profile/groupProfile";
import {API_URL_DOC} from "shared/api/base";
import defaultUserImg from "shared/assets/images/user_image.png";
import {Button} from "shared/ui/button";
import {Form} from "shared/ui/form";
import {Modal} from "shared/ui/modal";
import {Select} from "shared/ui/select";
import {Table} from "shared/ui/table";
import {Input} from "shared/ui/input";


import cls from "./classProfileStudentsForm.module.sass";
import defaultUser from "shared/assets/images/user_image.png";
import {ConfirmModal} from "../../../../shared/ui/confirmModal";

export const ClassProfileStudentsForm = memo(() => {

    const {
        register,
        handleSubmit
    } = useForm()
    const dispatch = useDispatch()
    const data = useSelector(getGroupProfileData)

    const [active, setActive] = useState(false)
    const [activeModal, setActiveModal] = useState("")
    const [deleteId, setDeleteId] = useState(null)
    const [selectedId, setSelectedId] = useState([])
    const [selectedMoveId, setSelectedMoveId] = useState([])

    const onSubmitMove = (data) => {
    }

    const onSubmitDelete = () => {
        dispatch(deleteGroupProfile({id: deleteId?.id}))
    }

    const onSubmitAdd = (data) => {
    }

    const renderStudentsList = () => {
        return data?.students?.map(item =>
            <tr>
                <td>
                    <img src={item?.user?.profile_img ? API_URL_DOC + item?.user?.profile_img : defaultUser} alt=""/>
                </td>
                <td>{item?.user?.name} {item?.user?.surname}</td>
                <td>{item?.user?.phone}</td>
                <td>{item?.parents_number}</td>
                <td>
                    <div
                        className={classNames(cls.studentsList__status, {
                            [cls.red]: Number(item.money) < 0,
                            [cls.yellow]: Number(item.money) > 0 && Number(item.money) < 100000,
                        })}
                    >
                        {item.money}
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
                            {/*<Input*/}
                            {/*    extraClassName={cls.studentsList__input}*/}
                            {/*    type={"checkbox"}*/}
                            {/*    defaultValue={item.deleted}*/}
                            {/*/>*/}
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

    const renderStudentsData = () => {
        return data?.students?.map(item =>
            <tr>
                <td>
                    <img src={defaultUserImg} alt=""/>
                </td>
                <td>{item?.user?.name}</td>
                <td>{item?.user?.surname}</td>
                <td>{item?.user?.phone}</td>
                <td>
                    <div className={cls.check}>
                        <Input
                            extraClassName={cls.check__input}
                            type={"checkbox"}
                            onChange={() => setSelectedId(prev => {
                                if (prev.filter(i => i === item.id)[0]) {
                                    return prev.filter(i => i !== item.id)
                                } else return [...prev, item.id]
                            })}
                        />
                        {/*<div className={classNames(cls.status, {*/}
                        {/*    [cls.active]: item?.extra_info?.status*/}
                        {/*})}>*/}
                        {/*    <div className={classNames(cls.status__inner, {*/}
                        {/*        [cls.active]: item?.extra_info?.status*/}
                        {/*    })}/>*/}
                        {/*</div>*/}
                    </div>
                </td>
            </tr>
        )
    }

    const render = renderStudentsList()
    const renderStudent = renderStudentsData()

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
                            className={classNames("fas fa-edit", cls.studentsList__icon)}
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
                                    <th>check</th>
                                    <th>del</th>
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
                        // options={teachers}
                        title={"Color"}
                        // onChangeOption={onFilterGroups}
                        register={register}
                        name={"color"}
                    />
                    <Select
                        extraClass={cls.deleteForm__select}
                        // options={groups}
                        title={"Class"}
                        register={register}
                        name={"class"}
                    />
                    <Button extraClass={cls.deleteForm__btn}>Add</Button>
                </Form>
            </Modal>
            <Modal
                active={activeModal === "add"}
                setActive={setActiveModal}
                extraClass={cls.addModal}
            >
                <Input
                    placeholder={"Search"}
                    // onChange={(e) => setSearchValue(e.target.value)}
                    // defaultValue={searchValue}
                />
                <div className={cls.addModal__container}>
                    <Table>
                        <thead>
                        <tr>
                            <th/>
                            <th>Ism</th>
                            <th>Familya</th>
                            <th>Tel</th>
                            <th/>
                        </tr>
                        </thead>
                        <tbody>
                        {renderStudent}
                        </tbody>
                    </Table>
                </div>
                <Button
                    extraClass={cls.addModal__btn}
                    onClick={onSubmitAdd}
                >
                    Add
                </Button>
            </Modal>

            <ConfirmModal setActive={setDeleteId} active={deleteId} onClick={onSubmitDelete} title={`Rostanham ${deleteId.user} ni o'chirmoqchimisiz `}   type={"danger"}/>
            {/*<YesNo*/}
            {/*    activeDelete={deleteId}*/}
            {/*    setActiveDelete={setDeleteId}*/}
            {/*    changingData={deleteId?.user}*/}
            {/*    onDelete={onSubmitDelete}*/}
            {/*/>*/}
        </>
    )
})