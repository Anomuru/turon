import React, {useMemo, useState} from "react";
import {useSelector} from "react-redux";

import {EmployeesFilter} from "features/filters/employeesFilter";
import {getSearchValue} from "features/searchInput";
import {Pagination} from "features/pagination";
import {Employers, employersReducer} from "entities/employer";
import {getEmployersData} from "entities/employer/model/selector/employersSelector";
import {Button} from "shared/ui/button";
import {DynamicModuleLoader} from "shared/lib/components/DynamicModuleLoader/DynamicModuleLoader";

import cls from "./employeesPage.module.sass"

const reducers = {
    employers: employersReducer
}

export const EmployerPage = () => {

    const employersData = useSelector(getEmployersData)
    const search = useSelector(getSearchValue);

    const [activeFilter, setActiveModal] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);
    const [activeSwitch, setActiveSwitch] = useState(false)

    const PageSize = useMemo(() => 30, []);

    const searchedEmployers = useMemo(() => {
        const filteredRooms = employersData?.filter(item => !item.deleted) || [];
        setCurrentPage(1);

        if (!search) return filteredRooms;

        return filteredRooms.filter(item =>
            item?.name?.toLowerCase().includes(search.toLowerCase()) ||
            item?.phone?.toLowerCase().includes(search.toLowerCase())
        );
    }, [employersData, search]);

    return (
        <DynamicModuleLoader reducers={reducers}>
            <div className={cls.employer}>
                <div className={cls.employer__header}>
                    <Button
                        onClick={() => setActiveModal(!activeFilter)}
                        status={"filter"}
                        type={"filter"}
                    >
                        Filter
                    </Button>
                </div>

                <Employers
                    currentTableData={searchedEmployers.slice((currentPage - 1) * PageSize, currentPage * PageSize)}
                />
                <Pagination
                    setCurrentTableData={() => {
                    }}
                    search={search}
                    users={searchedEmployers}
                    setCurrentPage={setCurrentPage}
                    currentPage={currentPage}
                    pageSize={PageSize}
                    onPageChange={(page) => {
                        setCurrentPage(page);
                    }}
                />

                <EmployeesFilter
                    setActiveSwitch={setActiveSwitch}
                    activeSwitch={activeSwitch}
                    setActive={setActiveModal}
                    active={activeFilter}
                />
            </div>
        </DynamicModuleLoader>

    )
}
