import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal } from 'shared/ui/modal';
import { Button } from 'shared/ui/button';
import cls from './salaryDeleteModal.module.sass';
import alertIcon from 'shared/assets/icons/alert.svg'
import {teacherSalaryDeleteThunk} from "../../model/teacherSalaryDeleteThunk";
import {Link} from "shared/ui/link";
import {fetchTeacherSalaryIdThunk} from "../../../../entities/teacherSalary";
import {employerSalaryDeleteThunk} from "../../model/employerSalaryDeleteThunk";
import {fetchEmployerSalaryThunk} from "../../../../pages/giveSalaryPage";
import {onAddAlertOptions} from "../../../alert/model/slice/alertSlice";

export const EmployerSalaryDeleteModal = ({ isOpen, onClose, id, user_id }) => {

    const dispatch = useDispatch();

    const handleDelete = () => {
        dispatch(employerSalaryDeleteThunk(id)).then(() => {
            dispatch(onAddAlertOptions({
                type: "success",
                status: true,
                msg: "Oylik muvofaqqiyatli o'chirildi"
            }))
            onClose();
            dispatch(fetchEmployerSalaryThunk(user_id))
        });
    };


    if (!isOpen) return null;
    return (
        <Modal active={isOpen} setActive={onClose}>
            <div className={cls.filter}>
                <div className={cls.deleteHead}>
                    <img src={alertIcon} alt=""/>
                    <h1>Delete modal</h1>
                </div>
                <div className={cls.deleteText}>
                    <h2>Are you sure delete this card</h2>
                </div>
                <div className={cls.deleteButtons}>
                    {/*<Link to={`/platform/rooms`}>*/}
                    <Button extraClass={cls.deleteButton} children={"Delete"} onClick={handleDelete}/>
                    {/*</Link>*/}

                    <Button extraClass={cls.cancelButton} children={"Cancel"} onClick={onClose}/>
                </div>
            </div>
        </Modal>
    );
};
