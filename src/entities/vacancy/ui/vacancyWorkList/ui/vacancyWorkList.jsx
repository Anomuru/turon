import React, {useEffect} from 'react';
import { Table } from "shared/ui/table";
import cls from './vacancyWorkList.module.sass';
import { Input } from "shared/ui/input";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import {fetchWorkerWithId} from "features/vacancyModals/vacancyWorkPage/model";
import {getWorkerId, getWorkerLoading} from "features/vacancyModals/vacancyWorkPage/model";
import {DefaultLoader, DefaultPageLoader} from "shared/ui/defaultLoader";
import {getBranch} from "../../../../../features/branchSwitcher";

export const VacancyWorkList = ({ currentTableData, currentPage, PageSize, editMode, onEditClick, selectedItems, setSelectedItems }) => {

    // const {id} = useParams()
    const {id} = useSelector(getBranch)
    const dispatch = useDispatch()
    const workerID = useSelector(getWorkerId)
    const userName = workerID.job?.map(item => item.group.name)
    const loadingDef = useSelector(getWorkerLoading)

    useEffect(() => {
        if (id)
        {
            dispatch(fetchWorkerWithId(id))
        }

    }, [dispatch, id])



    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedItems(currentTableData.map(item => item.id));
        } else {
            setSelectedItems([]);
        }
    };

    const handleSelectItem = (e, id) => {
        if (e.target.checked) {
            setSelectedItems(prev => [...prev, id]);
        } else {
            setSelectedItems(prev => prev.filter(item => item !== id));
        }
    };

    const renderVacancies = () => {
        if (loadingDef) {
            return <DefaultLoader />;
        }

        return workerID.job?.map((item, index) => {
            const permissions = item.group.permissions || [];

            return (
                <React.Fragment key={item.id}>
                    {permissions.map((permission, index) => (
                        <tr key={permission.id}>
                            <td>{(currentPage - 1) * PageSize + index + 1}</td>
                            <td>{item.group.name}</td>
                            <td>{permission.name}</td>
                            {!editMode && (
                                <td>
                                    <Input
                                        style={{ width: 25 + "px" }}
                                        type={"checkbox"}
                                        checked={selectedItems.includes(item.id)}
                                        onChange={(e) => handleSelectItem(e, item.id)}
                                    />
                                </td>
                            )}
                        </tr>
                    ))}
                </React.Fragment>
            );
        });
    };




    return (
        <Table>
            <thead className={cls.theadBody}>
            <tr>
                <th>№</th>
                <th>Ishchi ismi</th>
                <th>Ruxsatlari</th>
                {!editMode && (
                    <th className={cls.checkBox}>
                        <Input
                            style={{ width: 25 + "px" }}
                            type={"checkbox"}
                            onChange={handleSelectAll}
                            checked={selectedItems.length === currentTableData.length}
                        />
                    </th>
                )}
            </tr>
            </thead>
            <tbody>
            {renderVacancies()}
            </tbody>
        </Table>
    );
};
