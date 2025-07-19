import React, {memo, useEffect} from 'react';
import { Table } from "shared/ui/table";
import cls from './vacancyList.module.sass';
import { Button } from "shared/ui/button";
import {Link} from "shared/ui/link";
import {useSelector, useDispatch} from "react-redux";
import {getVacancyJobs} from "features/vacancyModals/vacancyPageAdd";
import {fetchVacancyData} from "features/vacancyModals/vacancyPageAdd";
import {useParams} from "react-router-dom";
import {vacancyWorkerListThunk} from "features/vacancyWorkerList";
import {userSetPermissionThunk} from "../../vacancyWorkerList";
import {DefaultPageLoader} from "../../../../../shared/ui/defaultLoader";

export const VacancyList = memo(({ currentTableData, currentPage, PageSize, editMode, onEditClick }) => {

    const dispatch = useDispatch()
    const jobsData = useSelector(getVacancyJobs)
    // useEffect(() => {
    //     dispatch(fetchVacancyData())
    // }, [])


    // if (!currentTableData || currentTableData.length === 0){
    //     return (
    //         <DefaultPageLoader/>
    //     )
    // }

    const renderVacancies = () => {
        return currentTableData?.map((item, index) => (
            <tr key={item.id}>
                <td>{index + 1 }</td>
                <Link  to={`vacancyWorkPage/${item.group.id}`}>
                    <td className={cls.otClick}>{item.group.name}</td>
                </Link>

                <td><div className={cls.anotherDiv}>{item.system_id.name}</div></td>
                {!editMode && (
                    <td>
                        <Button
                            extraClass={cls.buttonHelper}
                            children={<i className={"fas fa-pencil"}></i>}
                            onClick={() => onEditClick(item)}
                        />
                    </td>
                )}
            </tr>
        ));
    };

    return (
        <Table>
            <thead className={cls.theadBody}>
            <tr>
                <th>№</th>
                <th>Kasblar nomi</th>
                <th>System turi</th>
                {!editMode && <th>Actions</th>}
            </tr>
            </thead>
            <tbody>
            {renderVacancies()}
            </tbody>
        </Table>
    );
})
