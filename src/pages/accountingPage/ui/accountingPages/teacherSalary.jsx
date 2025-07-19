import {TeachersSalary} from "entities/accounting";
import {useDispatch, useSelector} from "react-redux";
import {getDeletedTeachersSalaryData, getTeacherSalaryData} from "entities/accounting/model/selector/teacher";
import {onDeleteTeacherSalary, onChangePayment} from "entities/accounting/model/slice/teacher";
import React, {useEffect, useMemo, useState} from "react";
import {Button} from "shared/ui/button";
import cls from "../accountingPageMain.module.sass";
import {Select} from "shared/ui/select";
import {Modal} from "shared/ui/modal";
import {getCapitalTypes} from "entities/capital";
import {getPaymentType} from "entities/capital/model/thunk/capitalThunk";
import {
    getDeletedTeacherSalary,
    getTeacherSalary
} from "entities/accounting/model/thunk/teacherSalarythunk";
import {API_URL, headers, useHttp} from "shared/api/base";
import {
    DeletedTeacherSalary
} from "entities/accounting/ui/acauntingTables/accountingTableTeacherSalary/deletedTeacherSalary";
import {onAddAlertOptions} from "features/alert/model/slice/alertSlice";

import {getBranch} from "../../../../features/branchSwitcher";
import {ConfirmModal} from "../../../../shared/ui/confirmModal";

export const TeacherSalaryPage = ({deleted , setDeleted}) => {

    const dispatch = useDispatch()
    const teacherSalary = useSelector(getTeacherSalaryData)
    const getDeletedTeachersSalary = useSelector(getDeletedTeachersSalaryData)
    const [changingData, setChangingData] = useState({})
    const [changePayment, setChangePayment] = useState(false)

    const getPaymentTypes = useSelector(getCapitalTypes)

    const [activeDelete, setActiveDelete] = useState(false)
    let branchID = useSelector(getBranch)
    const {request} = useHttp()


    useEffect(() => {
        // dispatch(getPaymentType())
        dispatch(getTeacherSalary(branchID))
        // dispatch(getDeletedTeacherSalary())
    }, [])


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

    const sum1 = getDeletedTeachersSalary.reduce((a, c) => a + parseFloat(c.salary || 0), 0);

    const sum2 = teacherSalary.reduce((a, c) => a + parseFloat(c.salary || 0), 0);

    const onChangeType = (selectedValue) => {
        dispatch(onChangePayment({
            id: changingData.id,
            payment_types: selectedValue
        }));
        setChangePayment(false);
    };
    return (
        <div>
            <div style={{display: "flex", gap: "2rem" ,alignItems: "center" ,justifyContent: "flex-end"  ,marginBottom: "3rem"}}>
                <div style={{color: "rgb(34, 197, 94)" , fontSize: "2.2rem" , textAlign: "end" }}>Total : {formatSalary(deleted ? sum1 : sum2)}</div>
            </div>

            {deleted ?
                <DeletedTeacherSalary setChangingData={setChangingData} setChangePayment={setChangePayment} deletedTeacher={getDeletedTeachersSalary}/>
                :
                <TeachersSalary
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
            <ConfirmModal setActive={setActiveDelete} active={activeDelete} onClick={onDelete} title={`Rostanham ${changingData.name} ni o'chirmoqchimisiz `}   type={"danger"}/>
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
        </div>
    );
};

