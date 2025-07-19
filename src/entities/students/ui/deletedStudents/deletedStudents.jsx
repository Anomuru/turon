import {fetchReasons} from "entities/profile/groupProfile";
import {getReasons} from "entities/profile/groupProfile/model/groupProfileSelector";
import React, {useEffect, useMemo, useState} from "react";
import classNames from "classnames";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router";

import {Table} from "shared/ui/table";

import cls from "./deletedStudents.module.sass";
import {API_URL, headers, useHttp} from "../../../../shared/api/base";
import {ConfirmModal} from "../../../../shared/ui/confirmModal";
import {onDeleteGroupStudentBack} from "../../model/studentsSlice";
import {onAddAlertOptions} from "../../../../features/alert/model/slice/alertSlice";


export const DeletedStudents = ({currentTableData}) => {

    const dispatch = useDispatch()

    const reasons = useSelector(getReasons)
    const [activeMenu, setActiveMenu] = useState("all")
    const [currentReasons, setCurrentReasons] = useState([])
    const [deletedStudentsData, setDeletedStudents] = useState([])
    const navigation = useNavigate()
    const [active, setActive] = useState(false)
    const [id, setId] = useState(false)

    useEffect(() => {
        dispatch(fetchReasons())
    }, [])

    const {request} = useHttp()
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
                                <i className={"fa fa-times"}/>
                            </div>
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
                                    <i className={"fa fa-times"}/>
                                </div>
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
                        [cls.active]: activeMenu === item.id
                    })}
                    onClick={() => {
                        setActiveMenu(item.id)
                    }}
                >
                    {item.name}
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
                        <th/>
                    </tr>
                    </thead>
                    <tbody>

                    {renderDeletedStudents()}
                    </tbody>
                </Table>
            </div>

            <ConfirmModal onClick={handleDelete} title={"Qaytarish"} text={"Studentni rostanham qaytarmoqchimisiz"}
                          type={"danger"} active={active} setActive={setActive}/>
        </div>

    );
};
