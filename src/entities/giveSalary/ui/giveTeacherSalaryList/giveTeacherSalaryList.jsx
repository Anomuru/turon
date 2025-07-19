import React, { useState } from 'react';
import { Table } from "shared/ui/table";
import cls from './giveTeacherSalaryList.module.sass';
import { Button } from "../../../../shared/ui/button";
import { SalaryDeleteModal } from "../../../../features/salaryEdits";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

export const GiveTeacherSalaryList = ({ currentTableData, currentPage, PageSize, user_id }) => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const [modal, setModal] = useState(false);
    const [selectedSalaryId, setSelectedSalaryId] = useState(null);

    const handleDeleteClick = (id) => {
        setSelectedSalaryId(id);
        setModal(true);
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
            {
                currentTableData?.map((item, index) => (
                    <tr key={item.id}> {/* Use item.id as the key */}
                        <td>{(currentPage - 1) * PageSize + index + 1}</td>
                        <td>{item.salary}</td>
                        <td>{item.payment.name}</td>
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
                ))
            }
            </tbody>
            {selectedSalaryId && (
                <SalaryDeleteModal
                    id={selectedSalaryId}
                    onClose={() => setModal(false)}
                    isOpen={modal}
                    user_id={user_id}
                />
            )}
        </Table>
    );
};
