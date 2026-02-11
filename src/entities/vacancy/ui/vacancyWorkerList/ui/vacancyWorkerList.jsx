import React, {useState} from 'react';
import { Table } from "shared/ui/table";
import cls from './vacancyWorkerList.module.sass';
import {VacancyWorkerEdit} from "features/vacancyModals/vacancyWorkerEdit";
import workerImg from "shared/assets/images/workerImg.svg"
import workerSetting from 'shared/assets/icons/setting.svg'
import {useSelector} from "react-redux";
import {headersImg} from "shared/api/base";

export const VacancyWorkerList = ({ currentTableData, currentPage, PageSize, editMode, onEditClick }) => {
    const [actives, setActives] = useState(false)
    const workerData = useSelector(state => state.vacancyWorkerSlice.workerData);
    const safeData = Array.isArray(workerData) ? workerData : [workerData];
    const [selectedWorkerId, setSelectedWorkerId] = useState(null);
    const API_URL_IMAGE = `${headersImg()}`;
    const handleDeleteClick = (id) => {
        setActives(true);
        setSelectedWorkerId(id);

    };
    const renderVacancies = () => {
        return safeData?.map((item, index) => (
            <tr key={item?.id}>
                <td>{(currentPage - 1) * PageSize + index + 1}</td>
                <td className={cls.workerList}>
                    {
                        !item?.profile_img ? <img src={workerImg} alt=""/> : <img className={cls.userImage} src={`${API_URL_IMAGE}${item.profile_img}`} alt=""/>
                    }{`${item?.name} - ${item?.surname}`} <img className={cls.workerSetting} onClick={() => handleDeleteClick(item?.id)} src={workerSetting} alt=""/></td>
            </tr>

        ));
    };

    return (
        <>
            <Table>
                <thead className={cls.theadBody}>
                <tr>
                    <th>№</th>
                    <th>Worker</th>
                </tr>
                </thead>
                <tbody>
                {renderVacancies()}
                </tbody>
                {selectedWorkerId && (
                    <VacancyWorkerEdit user_id={selectedWorkerId} active={actives} setActive={setActives}/>
                )}
            </Table>

        </>


    );
};
