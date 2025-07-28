import React, {useEffect, useMemo, useState} from 'react';

import { Pagination } from "features/pagination";
import {getLoadingSalary, GiveSalaryModal} from "features/giveSalary/giveSalary";
import {GiveSalaryList, GiveTeacherSalaryList} from "entities/giveSalary";
import {branches} from "entities/giveSalary";
import { Select } from "shared/ui/select";
import {Button} from "shared/ui/button";
import cls from "./giveSalaryPage.module.sass";
import {useSelector, useDispatch} from "react-redux";
import {
    fetchTeacherSalaryIdThunk,
} from "entities/teacherSalary";
import {getTeacherSalariesList} from "entities/teacherSalary";
import {useParams} from "react-router-dom";
import {useLocation} from "react-router";
import {DefaultLoader} from "shared/ui/defaultLoader";
import {getBranch} from "../../../features/branchSwitcher";


export const GiveTeacherSalaryPage = () => {
    const [selected, setSelected] = useState("");
    const PageSize = useMemo(() => 20, []);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [currentTableData, setCurrentTableData] = useState([]);
    const [active, setActive] = useState(false);
    const dispatch = useDispatch()
    const params = useParams();
    const { pathname } = useLocation();
    const getSalaryGivesData = useSelector(getTeacherSalariesList)
    const pathParts = Object.values(params);
    const permissionId = pathParts[pathParts.length - 1];
    const pathSegments = pathname.split('/');
    const salaryPageIdx = pathSegments.indexOf('teacherSalaryPage') + 1;
    const teacherSalaryPageId = Number(pathSegments[salaryPageIdx]);
    const {id} = useParams()
    // const {id} = useSelector(getBranch)

    useEffect(() => {
        if(id)
        {
            dispatch(fetchTeacherSalaryIdThunk(id))
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
            <div className={cls.mainContainer_buttonPanelBox}>
                <div className={cls.mainContainer_buttonPanelBox_leftCreateButton}>
                </div>
            </div>
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
                        <GiveTeacherSalaryList
                                user_id={permissionId}
                            currentTableData={getSalaryGivesData}
                            currentPage={currentPage}
                            PageSize={PageSize}
                        />
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
            <GiveSalaryModal
                active={active}
                setActive={setActive}
                salary_id={Number(id)}
                user_id={teacherSalaryPageId}

            />
        </div>
    );
};
