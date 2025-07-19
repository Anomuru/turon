import React, {useEffect, useMemo, useState} from 'react';
import { Pagination } from "features/pagination";
import {TeacherSalaryList, branches,} from "entities/teacherSalary";
import { Select } from "shared/ui/select";
import cls from "./teacherSalaryPage.module.sass";
import {useSelector, useDispatch} from "react-redux";
import {getTeacherSalaries} from "entities/teacherSalary";
import {fetchTeacherSalaryThunk} from "entities/teacherSalary";
import {useParams} from "react-router-dom";
import {getSearchValue} from "../../../features/searchInput";
import {getBranch} from "../../../features/branchSwitcher";

export const TeacherSalaryPage = () => {
    const [selected, setSelected] = useState("");
    let PageSize = useMemo(() => 20, []);
    const [currentPage, setCurrentPage] = useState(1);
    const search = useSelector(getSearchValue)
    const [currentTableData, setCurrentTableData] = useState([]);
    const dispatch = useDispatch()
    const teacherSalaries = useSelector(getTeacherSalaries)
    const {id} = useParams()
    // const {id} = useSelector(getBranch)
    const handleChange = (value) => {
        setSelected(value);
    };

    // const searchedUsers = useMemo(() => {
    //     const filteredHeroes = teacherSalaries?.usersalary.slice()
    //     setCurrentPage(1)
    //
    //     if (!search) return  filteredHeroes
    //
    //     return filteredHeroes.filter(item =>
    //         item.total_salary?.toLowerCase().includes(search.toLowerCase())
    //     )
    // }, [teacherSalaries, setCurrentPage, search])
    const onChangeOption = (value) => {
        setSelected(value)
    }

    useEffect(() => {
        if (id) {
            dispatch(fetchTeacherSalaryThunk(id))
        }
    }, [dispatch, id])

    return (
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
                <TeacherSalaryList
                    currentTableData={teacherSalaries}
                    currentPage={currentPage}
                    PageSize={PageSize}
                />
            </div>
            {/*<Pagination*/}
            {/*    setCurrentTableData={setCurrentTableData}*/}
            {/*    users={searchedUsers}*/}
            {/*    search={search}*/}
            {/*    setCurrentPage={setCurrentPage}*/}
            {/*    currentPage={currentPage}*/}
            {/*    pageSize={PageSize}*/}
            {/*    onPageChange={page => setCurrentPage(page)}*/}
            {/*/>*/}
        </div>
    );
};
