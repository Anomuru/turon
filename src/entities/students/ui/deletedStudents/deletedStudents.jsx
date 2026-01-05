import { fetchReasons } from "entities/profile/groupProfile";
import { getReasons } from "entities/profile/groupProfile/model/groupProfileSelector";
import React, { useEffect, useMemo, useState } from "react";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

import { Table } from "shared/ui/table";

import cls from "./deletedStudents.module.sass";
import { API_URL, headers, useHttp } from "shared/api/base.js";
import { ConfirmModal } from "shared/ui/confirmModal/index.js";
import { onChangeDeletedDate, onDeleteGroupStudentBack } from "../../model/studentsSlice";
import { onAddAlertOptions } from "features/alert/model/slice/alertSlice.js";
import { Modal } from "shared/ui/modal";
import { Input } from "shared/ui/input";
import { Button } from "shared/ui/button";


export const DeletedStudents = ({ currentTableData }) => {

    const dispatch = useDispatch()

    const reasons = useSelector(getReasons)
    const [activeMenu, setActiveMenu] = useState("all")
    const [currentReasons, setCurrentReasons] = useState([])
    const [deletedStudentsData, setDeletedStudents] = useState([])
    const navigation = useNavigate()
    const [active, setActive] = useState(false)
    const [id, setId] = useState(false)
    const [isChangeModal, setIsChangeModal] = useState(false)
    const [selectedStudent, setSelectedStudent] = useState(null)
    const [selectedDate, setSelectedDate] = useState(null)

    useEffect(() => {
        dispatch(fetchReasons())
    }, [])

    const { request } = useHttp()
    const handleDelete = () => {

        request(`${API_URL}Students/delete-student-from-deleted/${id}/`, "DELETE", null, headers())
            .then(res => {
                dispatch(onAddAlertOptions({
                    type: "success",
                    status: true,
                    msg: res.msg
                }))
            })
        setActive(false)
        dispatch(onDeleteGroupStudentBack(id))

    };

    const onSubmit = () => {
        const post = { del_date: selectedDate, student_id: selectedStudent }
        request(`${API_URL}Students/change_date_deleted_student/`, "POST", JSON.stringify(post), headers())
            .then(res => {
                console.log(res)
                dispatch(onChangeDeletedDate(post))
                setSelectedStudent(null)
                setSelectedDate(null)
                setIsChangeModal(false)
                dispatch(onAddAlertOptions({
                    msg: res.msg,
                    status: true,
                    type: "success"
                }))
            })
    }

    const onChangeDelDate = (data) => {
        setSelectedStudent(data.id)
        setSelectedDate(data.deleted_date)
        setIsChangeModal(true)
    }


    const renderDeletedStudents = () => {


        // if (!currentTableData || currentTableData.length === 0)
        // {
        //     return (
        //         <DefaultLoader/>
        //     )
        // }

        return currentTableData?.map((item, i) => {
            if (activeMenu === "all") {
                return (
                    <tr>
                        <td>{i + 1}</td>
                        <td onClick={() => navigation(`profile/${item?.student?.id}`)}>{item?.student?.name} {item?.student?.surname}</td>
                        <td>{item?.student?.age}</td>
                        <td>{item?.student?.phone}</td>
                        <td>{item?.group?.name}</td>
                        <td>{item?.student?.registered_date}</td>
                        <td>{item?.deleted_date}</td>
                        <td>{item?.group_reason?.name}</td>
                        <td>
                            <div onClick={() => {
                                setId(item.student.id)
                                setActive(true)
                            }}>
                                <i className={"fa fa-times"} />
                            </div>
                        </td>
                        <td>
                            <i
                                onClick={() => onChangeDelDate(item)}
                                className={"fa fa-pen"}
                            />
                        </td>
                    </tr>
                )
            } else {
                if (item?.group_reason?.id === activeMenu) {
                    return (
                        <tr onClick={() => navigation(`profile/${item.id}`)}>
                            <td>{i + 1}</td>
                            <td>{item?.student?.name} {item?.student?.surname}</td>
                            <td>{item?.student?.age}</td>
                            <td>{item?.student?.phone}</td>
                            <td>{item?.group?.name}</td>
                            <td>{item?.student?.registered_date}</td>
                            <td>{item?.deleted_date}</td>
                            <td>{item?.group_reason?.name}</td>
                            <td>
                                <div onClick={() => {
                                    setId(item.student.id)
                                    setActive(true)
                                }}>
                                    <i className={"fa fa-times"} />
                                </div>
                            </td>
                            <td>
                                <i
                                    onClick={() => onChangeDelDate(item)}
                                    className={"fa fa-pen"}
                                />
                            </td>
                        </tr>
                    )
                } else return null
            }
        })


    }



    return (
        <div className={cls.deletedStudents}>

            <ul className={cls.deletedStudents__menu}>
                <li
                    key={6}
                    className={classNames(cls.other__item, {
                        [cls.active]: activeMenu === "all"
                    })}
                    onClick={() => {
                        setActiveMenu("all")
                    }}
                >
                    Hammasi
                </li>
                {reasons?.map((item, i) => <li
                    key={i}
                    className={classNames(cls.other__item, {
                        [cls.active]: activeMenu === item?.id
                    })}
                    onClick={() => {
                        setActiveMenu(item?.id)
                    }}
                >
                    {item?.name}
                </li>)}
            </ul>
            <div className={cls.table}>
                <Table extraClass={cls.table__head}>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Full name</th>
                            <th>Yosh</th>
                            <th>Telefon nome</th>
                            <th>Guruh</th>
                            <th>Reg.sana</th>
                            <th>O'chir.sana</th>
                            <th>Sabab</th>
                            <th />
                            <th />
                        </tr>
                    </thead>
                    <tbody>

                        {renderDeletedStudents()}
                    </tbody>
                </Table>
            </div>

            <ConfirmModal
                onClick={handleDelete}
                title={"Qaytarish"}
                text={"Studentni rostanham qaytarmoqchimisiz"}
                type={"danger"}
                active={active}
                setActive={setActive}
            />
            <Modal
                active={isChangeModal}
                setActive={setIsChangeModal}
                extraClass={cls.modal}
            >
                <Input
                    title={"Deleted date"}
                    placeholder={"Enter deleted date"}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    extraClassName={cls.modal__input}
                    type={"date"}
                    defaultValue={selectedDate}
                />
                <Button
                    onClick={onSubmit}
                    extraClass={cls.modal__btn}
                >
                    Enter
                </Button>
            </Modal>
        </div>

    );
};
