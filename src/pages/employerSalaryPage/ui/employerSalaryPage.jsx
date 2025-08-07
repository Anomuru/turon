import React, {useEffect, useMemo, useState} from 'react';
import {useSelector, useDispatch} from "react-redux";
import {useParams} from "react-router-dom";
import {useForm} from "react-hook-form";

import {EmployerSalaryList, employerSalaryReducer, fetchEmployerSalaryThunk} from "entities/employerSalary";
import {getEmployerSalaries} from "entities/employerSalary";
import {onEditSalary} from "entities/employerSalary/model/employerSalarySlice";
import {Modal} from "shared/ui/modal";
import {Form} from "shared/ui/form";
import {Input} from "shared/ui/input";
import {API_URL, headers, useHttp} from "shared/api/base";
import {DynamicModuleLoader} from "shared/lib/components/DynamicModuleLoader/DynamicModuleLoader";

import cls from "./employerSalaryPage.module.sass";

const reducers = {
    employerSalarySlice: employerSalaryReducer
}

export const EmployerSalaryPage = () => {
    const [active, setActive] = useState(false);
    const [activeItem, setActiveItem] = useState(false);

    const {setValue, register, handleSubmit} = useForm()
    let PageSize = useMemo(() => 20, []);
    const [currentPage, setCurrentPage] = useState(1);

    const dispatch = useDispatch()
    const employerSalaries = useSelector(getEmployerSalaries)
    const {id} = useParams()

    const {request} = useHttp()


    useEffect(() => {
        setValue("total_salary", activeItem.total_salary)
    }, [active, activeItem])


    useEffect(() => {
        if (id) {
            dispatch(fetchEmployerSalaryThunk(id))
        }
    }, [dispatch, id])


    const onChangeSalary = (data) => {
        request(`${API_URL}Users/salaries/update1/${activeItem.id}`, "PATCH", JSON.stringify(data), headers())
            .then(res => {
                setActive(false)
                dispatch(onEditSalary({id: activeItem.id, data: res}))
            })
            .catch(err => {
                console.log(err)
            })

    }

    return (
        <DynamicModuleLoader reducers={reducers}>
            <div className={cls.mainContainer}>
                <div className={cls.mainContainer_buttonPanelBox}>

                    <div className={cls.mainContainer_buttonPanelBox_leftCreateButton}>
                    </div>
                    {/*<Select*/}
                    {/*    onChangeOption={() => onChangeOption}*/}
                    {/*    options={branches}*/}
                    {/*/>*/}
                </div>
                <div className={cls.mainContainer_tablePanelBox}>
                    <EmployerSalaryList
                        setActive={setActive}
                        setActiveEdit={setActiveItem}
                        currentTableData={employerSalaries}
                        currentPage={currentPage}
                        PageSize={PageSize}
                    />
                </div>
                <Modal setActive={setActive} active={active}>

                    <h2>Change Salary</h2>

                    <Form extraClassname={cls.changeSalary} onSubmit={handleSubmit(onChangeSalary)}>
                        <Input placeholder={"Summa"} type={"number"} register={register} name={"total_salary"}/>

                    </Form>

                </Modal>

                {/*<Pagination*/}
                {/*    setCurrentTableData={setCurrentTableData}*/}
                {/*    users={employerSalaries?.usersalary}*/}
                {/*    search={search}*/}
                {/*    setCurrentPage={setCurrentPage}*/}
                {/*    currentPage={currentPage}*/}
                {/*    pageSize={PageSize}*/}
                {/*    onPageChange={page => setCurrentPage(page)}*/}
                {/*/>*/}
            </div>
        </DynamicModuleLoader>
    );
};
