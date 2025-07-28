import React, {memo, useEffect, useMemo, useState} from "react";
import {getEmpSalary} from "entities/accounting/model/thunk/employerSalary";
import {useDispatch, useSelector} from "react-redux";
import {EmployeeSalary, getDeletedEmployer, getEmployerSalary, getLoading} from "entities/accounting";
import {DefaultPageLoader} from "shared/ui/defaultLoader";


import {API_URL, headers, useHttp} from "shared/api/base";
import {changePaymentType, onDeleteEmployerSalary} from "entities/accounting/model/slice/employerSalary";

import {getCapitalTypes} from "entities/capital";
import {
    DeletedWorkerSalary
} from "entities/accounting/ui/acauntingTables/accountingTableWorkerSalary/deletedWorkerSalary";
import {onAddAlertOptions} from "features/alert/model/slice/alertSlice";

import {getBranch} from "../../../../features/branchSwitcher";
import {ConfirmModal} from "../../../../shared/ui/confirmModal";


export const EmployerSalaryPage = memo(({deleted , setDeleted }) => {
    const dispatch = useDispatch()
    const [changePayment, setChangePayment] = useState(false)
    const [archive, setArchive] = useState(false)
    const getSalary = useSelector(getEmployerSalary)
    const getDeletedEmployerSalary = useSelector(getDeletedEmployer)
    const loading = useSelector(getLoading)
    const {request} = useHttp()
    const [activeDelete, setActiveDelete] = useState(false)
    let branchID = useSelector(getBranch)
    useEffect(() => {
        dispatch(getEmpSalary(branchID))
        // dispatch(getPaymentType())
        // dispatch(getDeletedEmpSalary())
    }, [])


    const [changingData, setChangingData] = useState({})
    const getCapitalType = useSelector(getCapitalTypes)

    const sum1 = getDeletedEmployerSalary.reduce((a, c) => a + parseFloat(c.salary || 0), 0);
    const sum2 = getSalary.reduce((a, c) => a + parseFloat(c.salary || 0), 0);
    const formatSalary = (salary) => {
        return Number(salary).toLocaleString();
    };




    const onDelete = (data) => {
        const {id} = changingData
        request(`${API_URL}Users/salaries/delete/${id}/`, "DELETE", JSON.stringify(id), headers())
            .then(res => {

                setActiveDelete(!activeDelete)
                dispatch(onDeleteEmployerSalary({id: id}))
                dispatch(onAddAlertOptions({
                    status: true,
                    msg: res.msg,
                    type: "success"
                }))

            })
            .catch(err => {
                console.log(err)
            })


    }

    const onChange = (newPaymentType) => {

        const {id} = changingData;
        // if (!newPaymentType) return;

        request(`${API_URL}Users/salaries/update/${id}/`, "PATCH", JSON.stringify({payment_types: Number(newPaymentType)}), headers())
            .then(res => {

                // window.location.reload()
                setChangePayment(false)
                dispatch(changePaymentType({id: id, payment_types: getCapitalType.filter(item => item.id === +newPaymentType)[0] , changingData}));
            })
            .catch(err => {
                console.log(err);
                // dispatch(onAddAlertOptions({
                //     status: "error",
                //     type: true,
                //     msg: "Serverda hatolik"
                // }))
                // setChangePayment(false)
            });
    }


    return loading ? <DefaultPageLoader/> : (
        <div>
            {/*<div style={{display: "flex"}}>*/}
            {/*    <Button type={"danger"} onClick={() => setDeleted(!deleted)}>*/}
            {/*        Deleted*/}
            {/*    </Button>*/}
            {/*    <Button onClick={() => setArchive(!archive)} type={"simple__add"}>*/}
            {/*        Arxiv*/}
            {/*    </Button>*/}
            {/*    <div style={{*/}
            {/*        // textAlign: "right",*/}
            {/*        display: "flex",*/}
            {/*        justifyContent: "flex-end"*/}
            {/*    }}>*/}
            {/*        <div style={{*/}
            {/*            alignSelf: "flex-end",*/}
            {/*            fontSize: "2rem",*/}
            {/*            color: "#22C55E",*/}
            {/*            padding: "1rem 2rem 1rem 1rem",*/}
            {/*            borderRadius: "5px",*/}
            {/*            marginBottom: "10px"*/}
            {/*        }}>Total : {formatSalary(sum2)} */}
            {/*        </div>*/}
            {/*    </div>*/}

            {/*</div>*/}
            <div style={{display: "flex", gap: "2rem" ,alignItems: "center" ,justifyContent: "flex-end" , marginBottom: "3rem"}}>

                <div style={{color: "rgb(34, 197, 94)" , fontSize: "2.2rem" , textAlign: "end" }}>Total : {formatSalary(deleted ? sum1 : sum2)}</div>
            </div>

            {deleted ? <DeletedWorkerSalary
                    filteredDeletedSalary={getDeletedEmployerSalary}
                    formatSalary={formatSalary}/> :
                <EmployeeSalary
                    changingData={changingData}
                    formatSalary={formatSalary}
                    filteredSalary={getSalary}
                    setChangingData={setChangingData}
                    changePayment={changePayment}
                    activeDelete={activeDelete}
                    setActiveDelete={setActiveDelete}
                    setChangePayment={setChangePayment}
                    getCapitalType={getCapitalType}
                    onChange={onChange}

                />

            }
            <ConfirmModal setActive={setActiveDelete} active={activeDelete} onClick={onDelete} title={`Rostanham ${changingData.name} ni o'chirmoqchimisiz `}   type={"danger"}/>
            {/*<YesNo activeDelete={activeDelete} setActiveDelete={setActiveDelete} onDelete={onDelete} changingData={changingData}/>*/}

        </div>
    );
})
