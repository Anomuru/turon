import cls from "./employeesPage.module.sass"
import {Button} from "shared/ui/button";
import {Select} from "shared/ui/select";
import {DeletedEmployers, Employers, employersReducer} from "entities/employer";
import React, {useEffect, useMemo, useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {fetchEmployersData} from "entities/employer/model/slice/employersThunk";
import {getEmployersData} from "entities/employer/model/selector/employersSelector";
import {EmployeesFilter} from "features/filters/employeesFilter";
import {getSearchValue} from "features/searchInput";
import {Pagination} from "features/pagination";
import {useParams} from "react-router-dom";
import {getBranch} from "features/branchSwitcher";
import {useNavigate} from "react-router";
import {EmployerCategoryPage} from "./employerCategory/employerCategoryPage";
import {DynamicModuleLoader} from "shared/lib/components/DynamicModuleLoader/DynamicModuleLoader";
import {getUserBranchId} from "entities/profile/userProfile";

const reducers = {
    employers: employersReducer
}

export const EmployerPage = () => {

    const branch = useSelector(getUserBranchId)
    const dispatch = useDispatch()
    const employersData = useSelector(getEmployersData)
    const [activeFilter, setActiveModal] = useState(false)
    const PageSize = useMemo(() => 30, []);
    const [currentPage, setCurrentPage] = useState(1);
    const [activeSwitch, setActiveSwitch] = useState(false)

    const search = useSelector(getSearchValue);
    const {"*": id} = useParams()
    const navigation = useNavigate()
    const userBranchId = id

    useEffect(() => {
        if (branch)
        dispatch(fetchEmployersData({branch}))
    }, [branch])

    const searchedEmployers = useMemo(() => {
        const filteredRooms = employersData?.filter(item => !item.deleted) || [];
        setCurrentPage(1);

        if (!search) return filteredRooms;

        return filteredRooms.filter(item =>
            item.user?.name?.toLowerCase().includes(search.toLowerCase())
        );
    }, [employersData, search]);

    return (
        <DynamicModuleLoader reducers={reducers}>
            <div className={cls.employer}>
                <div className={cls.employer__header}>
                    <Button onClick={() => setActiveModal(!activeFilter)} status={"filter"} type={"filter"}>Filter</Button>

                    {/*<Select/>*/}
                </div>
                {
                    activeSwitch ?
                        <DeletedEmployers/>
                        :
                        <>
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
                        </>
                }


                <EmployeesFilter activeSwitch={activeSwitch} setActiveSwitch={setActiveSwitch} active={activeFilter}
                                 setActive={setActiveModal}/>
            </div>
        </DynamicModuleLoader>

    )
}
