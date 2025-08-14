import {getUserBranchId} from "entities/profile/userProfile/index.js";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import {Modal} from "shared/ui/modal";
import {Switch} from "shared/ui/switch";

import {
    overHeadDeletedList,
    capitalDeletedListThunk,
    getDeletedTeacherSalary,
    getDeletedEmpSalary,
    getDeletedPayment
} from "entities/accounting";

import {saveFilter, getSavedFilters, removeFilter} from "shared/lib/components/filterStorage/filterStorage";

import cls from "../../filters.module.sass";
import {Button} from "shared/ui/button";

export const AccountingFilter = ({setActive, active, setActiveDel, activeDel, activePage, currentPage, pageSize}) => {
    const dispatch = useDispatch();

    const branch = useSelector(getUserBranchId)

    const [isArchive, setIsArchive] = useState(false);
    const [initialApplied, setInitialApplied] = useState(false);

    // При монтировании: восстанавливаем фильтры
    useEffect(() => {
        const saved = getSavedFilters()["accountingFilter"];
        if (branch) {
            if (saved && !initialApplied) {
                setIsArchive(saved.isArchive);
                setActiveDel(saved.activeDel);

                if (saved.activeDel) {
                    triggerDeletedDispatch();
                }

                setInitialApplied(true);
            }
        }
    }, [initialApplied, activePage, branch]);

    const triggerDeletedDispatch = () => {
        if (activePage === "studentsPayments") {
            dispatch(getDeletedPayment({
                branch,
                offset: (currentPage - 1) * 50,
                limit: pageSize
            }));
        } else if (activePage === "teachersSalary") {
            dispatch(getDeletedTeacherSalary({
                branch,
                offset: (currentPage - 1) * 50,
                limit: pageSize
            }));
        } else if (activePage === "employeesSalary") {
            dispatch(getDeletedEmpSalary({
                branch,
                offset: (currentPage - 1) * 50,
                limit: pageSize
            }));
        } else if (activePage === "overhead") {
            dispatch(overHeadDeletedList({
                branch,
                offset: (currentPage - 1) * 50,
                limit: pageSize
            }));
        } else {
            dispatch(capitalDeletedListThunk({
                branch,
                offset: (currentPage - 1) * 50,
                limit: pageSize
            }));
        }
    };

    const onDeletedToggle = (value) => {
        setActiveDel(value);
        if (value) {
            triggerDeletedDispatch();
        }

        saveFilter("accountingFilter", {
            isArchive,
            activeDel: value
        });
    };

    const onArchiveToggle = (value) => {
        setIsArchive(value);

        saveFilter("accountingFilter", {
            isArchive: value,
            activeDel
        });
    };

    const onDeleteFilter = () => {
        setIsArchive(false);
        setActiveDel(false);

        removeFilter("accountingFilter");
    };

    return (
        <Modal setActive={setActive} active={active}>
            <div className={cls.filter}>
                <h1>Filter</h1>
                <div className={cls.filter__container}>
                    <div className={cls.filter__switch}>
                        <p>O'chirilganlar</p>
                        <Switch onChangeSwitch={onDeletedToggle} activeSwitch={activeDel}/>
                    </div>
                    <div className={cls.filter__switch}>
                        <p>Arxiv</p>
                        <Switch onChangeSwitch={onArchiveToggle} activeSwitch={isArchive}/>
                    </div>
                    <div className={cls.filter__switch} style={{justifyContent: "flex-end"}}>
                        <Button onClick={onDeleteFilter} type="danger">Tozalash</Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
