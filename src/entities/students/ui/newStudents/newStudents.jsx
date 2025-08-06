import React, {memo, useState} from 'react';
import {useNavigate} from "react-router";
import cls from "entities/students/ui/newStudents/newStudents.module.sass";
import {Table} from "shared/ui/table";

import {onAddAlertOptions} from "features/alert/model/slice/alertSlice";
import {useDispatch} from "react-redux";
import {ConfirmModal} from "shared/ui/confirmModal";
import {API_URL, headers, useHttp} from "shared/api/base";
import {onDeleteNewStudents} from "../../model/studentsSlice";
import {Alert} from "features/alert/index.js";

export const NewStudents = memo(({currentTableData}) => {

    const [studentId, setStudentId] = useState(false)
    const [isDeleted, setIsDeleted] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const navigation = useNavigate()


    const renderStudents = () => {
        return currentTableData?.map((item, i) => (
            <tr key={item.id}>
                <td>{i + 1}</td>
                <td onClick={() => navigation(`profile/${item.id}`)}>


                    {item.user?.surname} {item.user?.name}

                </td>
                <td>
                    {item.user?.age}

                </td>
                <td>
                    {item.deleted ? item.user?.language?.name : item?.user?.language}
                </td>
                <td>
                    {item?.class_number}-sinf
                </td>
                <td>{item.user?.registered_date}</td>

                {!item.deleted && <td onClick={() => {
                    setStudentId(item.id);
                    setIsOpen(!isOpen);
                    setIsDeleted(item?.deleted)
                }}>
                    <i style={{color: '#FF3737FF'}} className={`fa-solid fa-xmark ${cls.xmark}`}></i>
                </td>}


            </tr>
        ));
    };


    const render = renderStudents()

    const dispatch = useDispatch();
    const {request} = useHttp();

    const handleDelete = () => {
        request(`${API_URL}Students/students_delete/${studentId}/`, "DELETE", null, headers())
            .then(res => {
                dispatch(onAddAlertOptions({
                    type: "success",
                    status: true,
                    msg: res.msg
                }))
                setIsOpen(false)

                dispatch(onDeleteNewStudents(studentId))

            })


    };

    return (
        <div className={cls.mainContainer}>
            <Alert/>
            <div className={cls.mainContainer_tablePanelBox}>
                <Table>
                    <thead className={cls.thead}>
                    <tr>
                        <th>№</th>
                        <th>Full name</th>
                        <th>Age</th>
                        <th>Til</th>
                        <th>Sinf</th>

                        <th>Reg. sana</th>

                        {currentTableData.filter(item => !item.deleted)?.length ?  <th>O'chirish</th> : ""}

                    </tr>
                    </thead>
                    <tbody>
                    {render}
                    </tbody>
                </Table>
            </div>



            <ConfirmModal
                type={isDeleted ? "success" : "danger"}
                title={!isDeleted ? "O'chirmoq" : "Qaytarmoq"}
                text={isDeleted ? "Studentni qaytarishni hohlaysizmi" : "Studentni o'chirishni hohlaysizmi"}
                active={isOpen}
                setActive={setIsOpen}
                onClick={handleDelete}
            />
            {/*<YesNo  setActiveDelete={setIsOpen} activeDelete={isOpen}  onDelete={handleDelete}/>*/}


        </div>
    );
});
