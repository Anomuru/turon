import React, {useEffect, useMemo, useState} from 'react';

import { Pagination } from "features/pagination";
import {GiveEmployerSalaryModal} from "../../../features/giveEmployerSalary";
import {GiveSalaryList} from "entities/giveSalary";
import {branches} from "entities/giveSalary";
import { Select } from "shared/ui/select";
import {Button} from "shared/ui/button";
import cls from "./giveSalaryPage.module.sass";
import {useSelector, useDispatch} from "react-redux";
import {fetchEmployerSalaryThunk} from "../model/giveSalaryPageThunk";
import {getSalaryInsideSource} from "../model/selectors/selectors";
import {useParams} from "react-router-dom";
import {useLocation} from "react-router";
import {giveEmployerSalaryLoading} from "../../../features/giveEmployerSalary";
import {DefaultLoader} from "../../../shared/ui/defaultLoader";
import {getBranch} from "../../../features/branchSwitcher";


export const GiveSalaryPage = () => {
    const [selected, setSelected] = useState("");
    const PageSize = useMemo(() => 20, []);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [currentTableData, setCurrentTableData] = useState([]);
    const [active, setActive] = useState(false);
    const dispatch = useDispatch()
    const params = useParams();
    const { pathname } = useLocation();
    const getSalaryGivesData = useSelector(getSalaryInsideSource)
    const getSalaryLoading = useSelector(giveEmployerSalaryLoading)
    const pathParts = Object.values(params);
    const permissionId = pathParts[pathParts.length - 1];
    const pathSegments = pathname.split('/');
    const salaryPageIdx = pathSegments.indexOf('employerSalaryPage') + 1;
    const employerSalaryPageId = pathSegments[salaryPageIdx];
    const {id} = useParams()
    // const {id} = useSelector(getBranch)

    useEffect(() => {
        if(id)
        {
            dispatch(fetchEmployerSalaryThunk(id))
        }

    }, [dispatch, id])


    const handleChange = (value) => {
        setSelected(value);
    };

    const onChangeOption = (value) => {
        setSelected(value)
    }

    return (
        <div className={cls.mainContainer}>
            {/*<div className={cls.mainContainer_buttonPanelBox}>*/}
            {/*    <div className={cls.mainContainer_buttonPanelBox_leftCreateButton}>*/}
            {/*    </div>*/}
            {/*    <Select*/}
            {/*        onChangeOption={() => onChangeOption}*/}
            {/*        options={branches}*/}
            {/*    />*/}
            {/*</div>*/}
            <div className={cls.mainContainer_filterPanelBox}>
                <div></div>
                <div className={cls.mainContainer_filterPanelBox_rightFilterRadioGroupBox}>
                  <Button
                      children={"Oylik berish"}
                      onClick={() => setActive(true)}
                  />
                </div>
            </div>
            <div className={cls.mainContainer_tablePanelBox}>
                {
                    getSalaryLoading ? <DefaultLoader/>
                        :
                        <GiveSalaryList
                            currentTableData={getSalaryGivesData}
                            currentPage={currentPage}
                            PageSize={PageSize}
                            user_id={Number(pathParts[1])}

                        />
                }

            </div>
            {/*<Pagination*/}
            {/*    setCurrentTableData={setCurrentTableData}*/}
            {/*    users={giveSalary}*/}
            {/*    search={search}*/}
            {/*    setCurrentPage={setCurrentPage}*/}
            {/*    currentPage={currentPage}*/}
            {/*    pageSize={PageSize}*/}
            {/*    onPageChange={page => setCurrentPage(page)}*/}
            {/*/>*/}
            <GiveEmployerSalaryModal
                active={active}
                setActive={setActive}
                salary_id={id}
                permission_id={permissionId}
                user_id={employerSalaryPageId}


            />
        </div>
    );
};
