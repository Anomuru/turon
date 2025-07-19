
import {useDispatch, useSelector} from "react-redux";
import {getCapitalList, getDeletedCapitalList} from "entities/accounting/model/selector/capital";
import React, {useEffect, useState} from "react";
import {capitalDeletedListThunk, capitalListThunk} from "entities/accounting/model/thunk/capital";
import {
    CapitalHeader
} from "entities/accounting/ui/acauntingTables/accountingTableCapitalCosts/capitalHeader";
import {
    CapitalModal
} from "entities/accounting/ui/acauntingTables/accountingTableCapitalCosts/capitalModal";
import {getCapitalTypes} from "entities/capital";

import {getMonthDays} from "entities/accounting/model/selector/additionalCosts";
import {getMonthDay} from "entities/accounting/model/thunk/additionalCosts";
import {useForm} from "react-hook-form";
import {API_URL, headers, useHttp} from "shared/api/base";
import {AccountingCapitalCosts} from "entities/accounting";
import {onAddCapital, onDeleteCapital} from "entities/accounting/model/slice/capital";

import {
    CapitalDeleted
} from "entities/accounting/ui/acauntingTables/accountingTableCapitalCosts/capitalDeleted";

import cls from "../accountingPageMain.module.sass"

import {onAddAlertOptions} from "../../../../features/alert/model/slice/alertSlice";
import {getBranch} from "../../../../features/branchSwitcher";
import {ConfirmModal} from "../../../../shared/ui/confirmModal";

export const Capital = ({deleted , setDeleted }) => {
    const capitalList = useSelector(getCapitalList)
    const capitalDeletedList = useSelector(getDeletedCapitalList)
    const dispatch = useDispatch()
    const [activeModal, setActiveModal] = useState(false)
    const paymentType = useSelector(getCapitalTypes)
    const [day, setDay] = useState(null)
    const [month, setMonth] = useState(null)
    const [radio, setRadio] = useState({})
    const [changingData, setChangingData] = useState({})
    const [activeDelete, setActiveDelete] = useState(false)
    const {register, setValue, handleSubmit} = useForm()
    let branchID = useSelector(getBranch)
    const monthDay = useSelector(getMonthDays)

    const {request} = useHttp()
    useEffect(() => {
        dispatch(capitalListThunk(branchID))

        dispatch(getMonthDay())
        // dispatch(capitalDeletedListThunk())
    }, [])



    const onAdd = (data) => {

        const res = {
            branch: branchID.id,
            payment_type: radio.id,

            ...data
        }

        request(`${API_URL}Capital/old_capital_create/`, "POST", JSON.stringify(res), headers())
            .then(res => {

                setActiveModal(false)
                dispatch(onAddAlertOptions({
                    type: "success",
                    status: true,
                    msg: res.msg
                }))
                const data = {
                    ...res,
                    payment_type: res.payment.name
                }

                dispatch(onAddCapital(data))
                setValue("name" , "")
                setValue("price" , "")
            })
            .catch(err => {
                console.log(err)
            })
    }
    const formatSalary = (salary) => {
        return Number(salary).toLocaleString();
    };
    const sum1 = capitalList.reduce((a, c) => a + parseFloat(c.price || 0), 0);
    const sum2 = capitalDeletedList.reduce((a, c) => a + parseFloat(c.price || 0), 0);
    const onDelete = () => {
        const {id} = changingData

        request(`${API_URL}Capital/old_capital_delete/${id}`, "DELETE", JSON.stringify(id), headers())
            .then(res => {
                dispatch(onDeleteCapital({id: id}))

                setActiveDelete(false)
                dispatch(onAddAlertOptions({
                    type: "success",
                    status: true,
                    msg: res.msg
                }))
            })
            .catch(err => {
                console.log(err)
            })
    }
    return (
        <div className={cls.overhead}>
            <CapitalHeader deleted={deleted} setDeleted={setDeleted} setActive={setActiveModal} sum1={sum1} sum2={sum2} formatSalary={formatSalary}/>
            {deleted ? <CapitalDeleted deleted={capitalDeletedList}/> : <AccountingCapitalCosts changingData={changingData} activeDelete={activeDelete}
                                                                                                setActiveDelete={setActiveDelete}
                                                                                                setChangingData={setChangingData}
                                                                                                onDelete={onDelete} capitalData={capitalList}/>}
            <CapitalModal radioSelect={radio} setRadio={setRadio} register={register} onAdd={onAdd}
                          handleSubmit={handleSubmit} monthDay={monthDay} setMonth={setMonth} setDay={setDay} day={day}
                          month={month} setActive={setActiveModal} activeModal={activeModal} radio={paymentType}/>
            <ConfirmModal setActive={setActiveDelete} active={activeDelete} onClick={onDelete} title={`Rostanham ${changingData.name} ni o'chirmoqchimisiz `}   type={"danger"}/>
            {/*<YesNo activeDelete={activeDelete} setActiveDelete={setActiveDelete} onDelete={onDelete} changingData={changingData}/>*/}
        </div>
    );
};
