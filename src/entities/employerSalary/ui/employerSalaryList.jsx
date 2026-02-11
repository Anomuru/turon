import React, {useEffect} from 'react';
import { Table } from "shared/ui/table";
import cls from './employerSalaryList.module.sass'
import {Link} from "../../../shared/ui/link";
import {getEmployerSalaryLoading} from "../model/selectors/selectors";
import {useSelector} from "react-redux";
import {DefaultPageLoader} from "../../../shared/ui/defaultLoader";


export const EmployerSalaryList = ({ currentTableData,  setActiveEdit  , setActive}) => {
    const loadingDef = useSelector(getEmployerSalaryLoading)
    const renderStudents = () => {
        return currentTableData?.map((item, index) => (
            <tr key={index + 1}>
                {
                    loadingDef ? <DefaultPageLoader/>
                        :
                        <>
                            <td>{index + 1}</td>
                            <Link to={`giveSalaryPage/${item.id}/${item.permission}`}>
                            <td>{item.total_salary}</td>
                            </Link>
                            <td>{item.taken_salary}</td>
                            <td>{item.remaining_salary}</td>
                            <td>{item.date}</td>
                            <td>
                                <i
                                    onClick={() => {
                                        setActive(true)
                                        setActiveEdit(item)
                                    }}
                                    className={"fa fa-pen"}/>
                            </td>

                        </>
                }

            </tr>
        ));
    };

    return (
            <Table>
                <thead className={cls.theadBody}>
                <tr>
                    <th>№</th>
                    <th>Umumiy oylik</th>
                    <th>Olingan oylik</th>
                    <th>Qolgan oylik</th>
                    <th>Sana</th>
                    <th/>
                </tr>
                </thead>
                <tbody>
                {renderStudents()}
                </tbody>
            </Table>

    );
};
