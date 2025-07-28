import {getFilteredClassStudents, getFilteredLoading} from "entities/students/model/selector/studentsSelector";
import {onAddAlertOptions} from "features/alert/model/slice/alertSlice";
import React, {memo, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";

import {fetchOnlyNewStudentsData, getNewStudentsData} from "entities/students";
import {useParams} from "react-router-dom";
import {API_URL, headers, useHttp} from "shared/api/base";
import {Button} from "shared/ui/button";
import {DefaultPageLoader} from "shared/ui/defaultLoader";
import {Input} from "shared/ui/input";
import {Modal} from "shared/ui/modal";
import {Table} from "shared/ui/table";

import cls from "./studentCreateClass.module.sass";

export const StudentCreateClass = memo((props) => {

    const {
        active,
        setActive,
        data,
        branch,
        deactiveModal
    } = props

    const {request} = useHttp()
    const dispatch = useDispatch()
    const studentsList = useSelector(getFilteredClassStudents);
    const loading = useSelector(getFilteredLoading);

    const [selectStudents, setSelectStudents] = useState([]);


    useEffect(() => {
        setSelectStudents([])
    },[studentsList])
    const onClick = () => {
        const res = {
            ...data,
            students: selectStudents
        }


        request(`${API_URL}Group/groups/create/`, "POST", JSON.stringify(res), headers())
            .then(res => {
                dispatch(onAddAlertOptions({
                    type: "success",
                    status: true,
                    msg: `Sinf yaratildi`
                }))
                dispatch(fetchOnlyNewStudentsData({userBranchId: branch}))
                setActive(false)
                deactiveModal(false)
                // setCreateStatus(true)
            })
    }


    const renderStudents = () => {
        if (loading === "loading" || loading === "idle") return <DefaultPageLoader/>;

        return studentsList?.map((item, i) => {
            return <tr>
                <td>{i + 1}</td>
                <td>{item.user?.surname} {item.user?.name}</td>
                <td>{item.user?.age}</td>
                <td>{item.user?.language}</td>
                <td>{item?.class_number}</td>
                <td>{item.user?.registered_date}</td>
                <td>
                    <Input
                        extraClassName={cls.createClass__input}
                        type={"checkbox"}
                        onChange={() => setSelectStudents(prev => {
                            if (prev.filter(i => i === item.id)[0]) {
                                return prev.filter(i => i !== item.id)
                            } else {
                                return [...prev, item.id]
                            }
                        })}
                    />
                </td>
            </tr>
        })
    }

    const render = renderStudents()

    return (
        <Modal
            active={active}
            setActive={setActive}
        >
            <div className={cls.createClass}>
                <h1>O'quvchi tanlang</h1>
                <div className={cls.createClass__inner}>
                    <Table>
                        <thead>
                        <tr>
                            <th>№</th>
                            <th>Full name</th>
                            <th>Age</th>
                            <th>Til</th>
                            <th>Sinf</th>
                            <th>Reg. sana</th>
                            <th/>
                        </tr>
                        </thead>
                        <tbody>
                        {render}
                        </tbody>
                    </Table>
                </div>
                <Button
                    onClick={onClick}
                    extraClass={cls.createClass__btn}
                >
                    Create
                </Button>
            </div>
        </Modal>
    );
})
