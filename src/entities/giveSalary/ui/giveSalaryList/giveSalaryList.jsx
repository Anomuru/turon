import React, {useState} from 'react';
import { Table } from "shared/ui/table";
import cls from './giveSalaryList.module.sass'
import {Link} from "shared/ui/link";
import {Button} from "../../../../shared/ui/button";
import {EmployerSalaryDeleteModal, SalaryDeleteModal} from "../../../../features/salaryEdits";
export const GiveSalaryList = ({ currentTableData, currentPage, PageSize, user_id}) => {
    const [modal, setModal] = useState(false);
    const [selectedSalaryId, setSelectedSalaryId] = useState(null);
    const handleDeleteClick = (id) => {
        setModal(true);
        setSelectedSalaryId(id);

    };
    const renderStudents = () => {
        return currentTableData?.map((item, index) => (
            <tr key={index + 1}>
                <td>{(currentPage - 1) * PageSize + index + 1}</td>
                <td>{item.salary}</td>
                <td>{item.payment_types.name}</td>
                <td>{item.comment}</td>
                <td>{item.date}</td>
                <td>
                    <Button
                        extraClass={cls.buttonDelete}
                        onClick={() => handleDeleteClick(item.id)}
                    >
                        <i style={{ color: "#d0d0d0" }} className="fa-solid fa-trash"></i>
                    </Button>
                </td>
            </tr>
        ));
    };

    return (
            <Table>
                <thead className={cls.theadBody}>
                <tr>
                    <th>№</th>
                    <th>Summa</th>
                    <th>Summa turi</th>
                    <th>Komment</th>
                    <th>Sana</th>
                    <th>Amallar</th>
                </tr>
                </thead>
                <tbody>
                {renderStudents()}
                </tbody>
                {selectedSalaryId && (
                    <EmployerSalaryDeleteModal
                        id={selectedSalaryId}
                        onClose={() => setModal(false)}
                        isOpen={modal}
                        user_id={user_id}
                    />
                )}
            </Table>
    );
};
