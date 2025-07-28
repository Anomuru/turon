import {Button} from "shared/ui/button";
import React, {useCallback, useEffect, useState} from "react";
import {Modal} from "shared/ui/modal";
import {Form} from "shared/ui/form";
import cls from "../accountingPageMain.module.sass"
import {Select} from "shared/ui/select";
import {Input} from "shared/ui/input";
import {OverHeadHeader} from "entities/accounting/ui/acauntingTables/accountingTableAdditionalCosts/overHeadHeader";
import {useDispatch, useSelector} from "react-redux";
import {AccountingAdditionalCosts, getOverHeadLoading, getOverHeadType} from "../../../../entities/accounting";
import {
    getMonthDay,
    getOverheadType,
    overHeadDeletedList,
    overHeadList
} from "entities/accounting/model/thunk/additionalCosts";
import {API_URL, headers, useHttp} from "shared/api/base";
import {getCapitalTypes} from "entities/capital";
import {Radio} from "shared/ui/radio";

import {useForm} from "react-hook-form";
import {
    getMonthDays, getOverHeadDeletedList,
    getOverHeadList,
} from "entities/accounting/model/selector/additionalCosts";
import {onAddOverhead, onChangePaymentType, onDeleteOverhead} from "entities/accounting/model/slice/additionalCosts";
import {DefaultPageLoader} from "shared/ui/defaultLoader";
import {
    AdditionalCostsDeleted
} from "entities/accounting/ui/acauntingTables/accountingTableAdditionalCosts/additionalCostsDeleted";
import {onAddAlertOptions} from "../../../../features/alert/model/slice/alertSlice";

import {ConfirmModal} from "../../../../shared/ui/confirmModal";
import {getBranch} from "../../../../features/branchSwitcher";
import classNames from "classnames";


export const AdditionalCosts = ({deleted, setDeleted}) => {
    const [activeModal, setActiveModal] = useState(false)
    const overHeadType = useSelector(getOverHeadType)
    const dispatch = useDispatch()
    const [select, setSelect] = useState({})
    const [showAdditionalFields, setShowAdditionalFields] = useState(false);
    const {request} = useHttp()
    const loading = useSelector(getOverHeadLoading)
    const paymentType = useSelector(getCapitalTypes)
    const [radioSelect, setRadioSelect] = useState({})
    const {register, handleSubmit, setValue} = useForm()
    const monthDays = useSelector(getMonthDays)
    const [day, setDay] = useState(null)
    const [month, setMonth] = useState(null)
    const overheadList = useSelector(getOverHeadList)
    const [activeDelete, setActiveDelete] = useState(false)
    const [changingData, setChangingData] = useState({})
    const overheadDeletedList = useSelector(getOverHeadDeletedList)
    const [changePayment, setChangePayment] = useState(false)
    const [activeBtn, setActiveBtn] = useState(null)



    const getCapitalType = useSelector(getCapitalTypes)

    const [changePaymentType, setChangePaymentType] = useState(null)
    let branchID = useSelector(getBranch)
    // const [alerts, setAlerts] = useState([])
    useEffect(() => {
        dispatch(getOverheadType())
        // dispatch(getPaymentType())
        dispatch(getMonthDay())
        // dispatch(overHeadDeletedList())
    }, [])

    useEffect(() => {
        const res ={
            branchID: branchID.id,
            type: activeBtn
        }

        dispatch(overHeadList({activeBtn: activeBtn , branchId: branchID}))
    }, [activeBtn])
    console.log(activeBtn)
    // useEffect(() => {
    //
    // }, [deleted])


    const onClick = () => {
        setActiveModal(true)
    }

    const onChangeRadio = (value) => {
        setRadioSelect(value)
    }
    const onChange = (value) => {
        setSelect(value)

        const {id} = value

        if (overHeadType.filter(item => item.id === +id)[0]?.name === "Boshqa") {
            setShowAdditionalFields(true)

        } else {
            setShowAdditionalFields(false)
        }
    }

    const onAdd = (data) => {
        const res = {
            type: select.id,
            branch: branchID.id,
            payment: radioSelect.id,
            ...data
        }

        request(`${API_URL}Overhead/overheads/create/`, "POST", JSON.stringify(res), headers())
            .then(res => {
                setActiveModal(false)
                setValue("name", "")
                setValue("price", "")


                const data = {

                    created: res.created,
                    id: res.id,
                    name: res.name,
                    payment: res.name,
                    price: res.price
                }
                dispatch(onAddOverhead(data))

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
    const onDelete = () => {

        const {id} = changingData

        request(`${API_URL}Overhead/overheads/delete/${id}`, "DELETE", JSON.stringify({id}), headers())
            .then(res => {

                dispatch(onDeleteOverhead({id: id}))
                // dispatch(overHeadList())
                setActiveDelete(false)
                // showAlert("success", `${changingData.name} ${res.msg}`)
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


    const onChangePayment = (newPaymentType) => {
        const {id} = changePaymentType;
        dispatch(onChangePaymentType({
            id: id,
            payment: getCapitalType.filter(item => item.id === +newPaymentType)[0],
            changePaymentType
        }));
        // if (!newPaymentType) return;

        // request(`${API_URL}Users/salaries/update/${id}/`, "PATCH", JSON.stringify({payment_types: Number(newPaymentType)}), headers())
        //     .then(res => {
        //         console.log(res)
        //         // window.location.reload()
        //         setChangePayment(false)
        //
        //     })
        //     .catch(err => {
        //         console.log(err);
        //         // dispatch(onAddAlertOptions({
        //         //     status: "error",
        //         //     type: true,
        //         //     msg: "Serverda hatolik"
        //         // }))
        //         // setChangePayment(false)
        //     });
    }
    const sum1 = overheadList?.reduce((a, c) => a + parseFloat(c.price || 0), 0);
    const sum2 = overheadDeletedList.reduce((a, c) => a + parseFloat(c.price || 0), 0);

    const formatSalary = (salary) => {
        return Number(salary).toLocaleString();
    };
    return   (
        <div className={cls.overhead}>

            <OverHeadHeader formatSalary={formatSalary} sum={sum1} deleted={deleted} sum2={sum2} onClick={onClick}
                            setDeleted={setDeleted}/>

            {deleted ? <AdditionalCostsDeleted
                    overheadDeletedList={overheadDeletedList}
                    extraClassName={cls.table}
                    paymentStyle={cls.typeItem}
                /> :
                <>
                    <div className={cls.subHeader}>

                        {overHeadType.map(item => (
                            <Button extraClass={classNames(cls.subHeader__subBtn , {
                                [cls.active]: activeBtn === item.id
                            })} onClick={() => setActiveBtn(item.id)}>{item.name}</Button>
                        ))}


                    </div>


                    <AccountingAdditionalCosts
                        formatSalary={formatSalary}
                        loading={loading}
                        onDelete={onDelete}
                        changingData={changingData}
                        setChangingData={setChangingData}
                        setActiveDelete={setActiveDelete}
                        activeDelete={activeDelete} extraclassName={cls.table}
                        additionalCosts={overheadList}
                        paymentStyle={cls.typeItem}
                        setChangePayment={setChangePayment}
                        changePayment={changePayment}
                        getCapitalType={getCapitalType}
                        onChange={onChangePayment}
                        setChangePaymentType={setChangePaymentType}

                    />
                </>
            }
            <AddAdditionalCosts
                showAdditionalFields={showAdditionalFields}
                setActiveModal={setActiveModal}
                activeModal={activeModal}
                option={overHeadType}
                select={select}
                setSelected={setSelect}
                onChange={onChange}
                paymentType={paymentType}
                register={register}
                handleSubmit={handleSubmit}
                onAdd={onAdd}
                radioSelect={radioSelect}
                setRadioSelect={setRadioSelect}
                onChangeRadio={onChangeRadio}
                monthDay={monthDays}
                day={day}
                setDay={setDay}
                month={month}
                setMonth={setMonth}
                optionDef={activeBtn}
            />

            <ConfirmModal setActive={setActiveDelete} active={activeDelete} onClick={onDelete}
                          title={`Rostanham ${changingData.name} ni o'chirmoqchimisiz `} type={"danger"}/>
            {/*<YesNo activeDelete={activeDelete} setActiveDelete={setActiveDelete} onDelete={onDelete} changingData={changingData}/>*/}
        </div>
    );
};


export const AddAdditionalCosts = (props) => {
    const {
        activeModal,
        setActiveModal,
        option,
        showAdditionalFields,
        onChange,
        paymentType,
        handleSubmit,
        onAdd,
        register,
        radioSelect,

        onChangeRadio,
        optionDef
    } = props;


    return (

        <Modal setActive={setActiveModal} active={activeModal}>

            <Form extraClassname={cls.form} onSubmit={handleSubmit(onAdd)}>
                <Input register={register} name={"created"} type={"date"} title={"Kun"}/>
                <Select options={option} defaultValue={optionDef} onChangeOption={(e) => {
                    onChange({
                        name: e,
                        id: e
                    })
                }}
                />
                {showAdditionalFields ?
                    <Input name={"name"} register={register} placeholder={"Narsa turi"}/> : null}

                <Input register={register} name={"price"} type={"number"} placeholder={"Narxi"}/>

                <div style={{display: "flex", justifyContent: "center", gap: "2rem"}}>
                    {paymentType.map(item => (
                        <Radio
                            onChange={() => onChangeRadio({
                                name: item.name,
                                id: item.id
                            })}
                            children={item.name}
                            checked={radioSelect?.name === item.name}
                            value={radioSelect === item.name}
                            name={"hello"}
                        />
                    ))}
                </div>


            </Form>
        </Modal>
    )
}
