import cls from "./deletedTeachers.module.sass"

import {Table} from "shared/ui/table";
import React from "react";
import {useNavigate} from "react-router";

export const DeletedTeachers = ({data}) => {

    const navigation = useNavigate()


    const renderTeacher = () => {
        return data?.map((item, i) => (
            <tr>

                <td>{i + 1}</td>
                <td onClick={() => navigation(`teacherProfile/${item.id}`)}>{item.name} {item.surname}</td>
                <td>{item?.username}</td>
                <td>{item?.phone}</td>
                <td>{item?.age}</td>
                <td>{item?.subject.map(item => item.name)}</td>
                <td>{item?.deleted_date}</td>
            </tr>
        ))
    }
    return (
        <div className={cls.teacher}>
            <div className={cls.table}>
                <Table>
                    <thead>
                    <tr>
                        <th>No</th>
                        <th>Full name</th>
                        <th>Username</th>
                        <th>Tel</th>
                        <th>Yosh</th>
                        <th>Fan</th>
                        <th>O'chirilgan sana</th>
                    </tr>
                    </thead>
                    <tbody>
                    {renderTeacher()}
                    </tbody>
                </Table>
            </div>
        </div>
    );
};

