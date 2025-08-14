import React, {useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import {onAddAlertOptions} from "features/alert/model/slice/alertSlice";
import {teacherReducer, TeachersSalary} from "entities/accounting";
import {getDeletedTeachersSalaryData, getTeacherSalaryData} from "entities/accounting/model/selector/teacher";
import {onDeleteTeacherSalary, onChangePayment} from "entities/accounting/model/slice/teacher";
import {getCapitalTypes} from "entities/capital";
import {
    getTeacherSalary
} from "entities/accounting/model/thunk/teacherSalarythunk";
import {
    DeletedTeacherSalary
} from "entities/accounting/ui/acauntingTables/accountingTableTeacherSalary/deletedTeacherSalary";
import {getUserBranchId} from "entities/profile/userProfile";
import {Select} from "shared/ui/select";
import {Modal} from "shared/ui/modal";
import {API_URL, headers, useHttp} from "shared/api/base";
import {ConfirmModal} from "shared/ui/confirmModal";
import {DynamicModuleLoader} from "shared/lib/components/DynamicModuleLoader/DynamicModuleLoader";

import cls from "../accountingPageMain.module.sass";

const reducers = {
    teacher: teacherReducer
}

export const TeacherSalaryPage = ({deleted, setDeleted}) => {

    const dispatch = useDispatch()
    const {request} = useHttp()

    const teacherSalary = useSelector(getTeacherSalaryData)
    const getDeletedTeachersSalary = useSelector(getDeletedTeachersSalaryData)
    const getPaymentTypes = useSelector(getCapitalTypes)
    const branchID = useSelector(getUserBranchId)

    const [changingData, setChangingData] = useState({})
    const [changePayment, setChangePayment] = useState(false)
    const [activeDelete, setActiveDelete] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);

    let PageSize = useMemo(() => 10, [])


    useEffect(() => {
        // dispatch(getPaymentType())
        if (branchID && currentPage && PageSize)
            dispatch(getTeacherSalary({
                branch: branchID,
                limit: PageSize,
                offset: (currentPage - 1) * PageSize
            }))
        // dispatch(getDeletedTeacherSalary())
    }, [branchID, PageSize, currentPage])


    const onDelete = () => {

        const {id} = changingData
        request(`${API_URL}Teachers/teachers/salary/delete/${id}/`, "DELETE", JSON.stringify({id: id}), headers())
            .then(res => {

                dispatch(onDeleteTeacherSalary({id: id}))
                dispatch(onAddAlertOptions({
                    status: true,
                    msg: res.msg,
                    type: "success"
                }))
                setActiveDelete(false)
            })
            .catch(err => {
                console.log(err)
            })

    }


    const formatSalary = (salary) => {
        return Number(salary).toLocaleString();
    };

    const sum1 = getDeletedTeachersSalary?.reduce((a, c) => a + parseFloat(c.salary || 0), 0);

    const sum2 = teacherSalary?.reduce((a, c) => a + parseFloat(c.salary || 0), 0);

    const onChangeType = (selectedValue) => {
        dispatch(onChangePayment({
            id: changingData.id,
            payment_types: selectedValue
        }));
        setChangePayment(false);
    };
    return (
        <DynamicModuleLoader reducers={reducers}>
            <div style={{
                display: "flex",
                gap: "2rem",
                alignItems: "center",
                justifyContent: "flex-end",
                marginBottom: "3rem"
            }}>
                <div style={{color: "rgb(34, 197, 94)", fontSize: "2.2rem", textAlign: "end"}}>Total
                    : {formatSalary(deleted ? sum1 : sum2)}</div>
            </div>

            {deleted ?
                <DeletedTeacherSalary setChangingData={setChangingData} setChangePayment={setChangePayment}
                                      deletedTeacher={getDeletedTeachersSalary}/>
                :
                <TeachersSalary
                    PageSize={PageSize}
                    setCurrentPage={setCurrentPage}
                    currentPage={currentPage}
                    setChangingData={setChangingData}
                    changePayment={changePayment}
                    setChangePayment={setChangePayment}
                    deleted={deleted}
                    teacherSalary={teacherSalary}
                    changingData={changingData}
                    activeDelete={activeDelete}
                    setActiveDelete={setActiveDelete}
                />}

            {/*<Modal active={changePayment} setActive={setChangePayment}>*/}
            {/*    <div className={cls.changeType}>*/}
            {/*        <Select options={getPaymentTypes} onChangeOption={onChangeType} title={changingData.payment_types}/>*/}
            {/*    </div>*/}
            {/*</Modal>*/}
            <ConfirmModal setActive={setActiveDelete} active={activeDelete} onClick={onDelete}
                          title={`Rostanham ${changingData.name} ni o'chirmoqchimisiz `} type={"danger"}/>
            {/*<YesNo activeDelete={activeDelete} setActiveDelete={setActiveDelete} onDelete={onDelete} changingData={changingData}/>*/}
            <Modal active={changePayment} setActive={setChangePayment}>
                <div className={cls.changeType}>
                    <Select
                        options={getPaymentTypes}
                        onChangeOption={onChangeType}
                        // value={currentPaymentType ? currentPaymentType.value : ""}
                        title="Select payment type"
                    />
                </div>
            </Modal>
        </DynamicModuleLoader>
    );
};

