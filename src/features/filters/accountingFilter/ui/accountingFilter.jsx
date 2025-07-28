import {useState} from "react";
import {useDispatch} from "react-redux";

import {Modal} from "shared/ui/modal";
import {Select} from "shared/ui/select";
import {Switch} from "shared/ui/switch";
import {
    overHeadDeletedList,
    capitalDeletedListThunk,
    getDeletedTeacherSalary,
    getDeletedEmpSalary,
    getDeletedPayment
} from "entities/accounting";
import {
    fetchIsArchive,
    fetchIsDelete
} from "../model/accountingFilterSlice";

import cls from "../../filters.module.sass"

export const AccountingFilter = ({setActive, active, setActiveDel, activeDel, activePage}) => {

    const dispatch = useDispatch()
    const [isDelete, setIsDelete] = useState(false)
    const [isArchive, setIsArchive] = useState(false)

    const onDelete = (value) => {
        setIsDelete(value)
        dispatch(fetchIsDelete(value))
    }

    const onArchive = (value) => {
        setIsArchive(value)
        dispatch(fetchIsArchive(value))
    }

    const onActive = (value) => {
        if (activePage === "studentsPayments") {
            dispatch(getDeletedPayment())
        } else if (activePage === "teachersSalary") {
            dispatch(getDeletedTeacherSalary())
        } else if (activePage === "employeesSalary") {
            dispatch(getDeletedEmpSalary())
        } else if (activePage === "overhead") {
            dispatch(overHeadDeletedList())
        } else {
            dispatch(capitalDeletedListThunk())
        }
        setActiveDel(value)
    }

    return (
        <div>
            <Modal setActive={setActive} active={active}>
                <div className={cls.filter}>
                    <h1>
                        Filter
                    </h1>
                    <div className={cls.filter__container}>
                        <div className={cls.filter__switch}>
                            <p>
                                O'chirilganlar
                            </p>
                            <Switch onChangeSwitch={onActive} activeSwitch={activeDel}/>
                        </div>
                        <div className={cls.filter__switch}>
                            <p>
                                Arxiv
                            </p>
                            <Switch/>
                        </div>

                    </div>
                </div>
            </Modal>
        </div>
    );
};

