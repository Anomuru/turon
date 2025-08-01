import {getUserBranchId} from "entities/profile/userProfile";
import {getBranch} from "features/branchSwitcher";
import React, {useEffect, useMemo, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

import {GroupsList} from "entities/groups/groups/ui/groupsList";
import {
    getGroupsListData,

    getDeletedGroupsData,
    DeletedGroups,
    getGroupsLoading, getGroupListWithFilter, fetchGroupsDataWithFilter
} from "entities/groups";
import {getSearchValue} from "features/searchInput";
import {GroupsFilter} from "features/filters/groupsFilter";
import {Pagination} from "features/pagination";
import {Button} from "shared/ui/button";
import {DefaultPageLoader} from "shared/ui/defaultLoader";

import cls from "./groupsPage.module.sass";

import {DynamicModuleLoader} from "shared/lib/components/DynamicModuleLoader/DynamicModuleLoader.jsx";
import {groupsReducer} from "entities/groups/model/slice/groupsSlice.js";
import {getGroupListWithFilterLoading} from "entities/groups/model/selectors/groupsList.js";


const reducers = {
    groupsSlice: groupsReducer

}
export const GroupsPage = () => {

    const dispatch = useDispatch()
    const data = useSelector(getGroupsListData)
    const getFilteredGroups = useSelector(getGroupListWithFilter)
    const deletedGroupsData = useSelector(getDeletedGroupsData)
    const loading = useSelector(getGroupsLoading)
    const loadingWithFilter = useSelector(getGroupListWithFilterLoading)
    // const {"*": id} = useParams()

    const userBranchId = useSelector(getUserBranchId)
    const [deletedGroups, setDeletedGroups] = useState([])
    const [active, setActive] = useState(false);
    const [activeSwitch, setActiveSwitch] = useState(false)
    const [isFilter, setIsFilter] = useState(false)
    const search = useSelector(getSearchValue)
    let PageSize = useMemo(() => 50, [])
    const [currentTableData, setCurrentTableData] = useState([])
    const [currentPage, setCurrentPage] = useState(1);



    const searchedUsers = useMemo(() => {
        const filteredHeroes = getFilteredGroups?.slice()
        setCurrentPage(1)


        if (!search) return filteredHeroes

        return filteredHeroes.filter(item =>
            item.name?.toLowerCase().includes(search.toLowerCase())
        )
    }, [data, setCurrentPage, search, isFilter, getFilteredGroups])

    useEffect(() => {
        setDeletedGroups(deletedGroupsData)
    }, [deletedGroupsData])

    // useEffect(() => {
    //     if (userBranchId) {
    //         dispatch(fetchGroupsDataWithFilter({userBranchId, deleted: activeSwitch}))
    //     }
    // }, [userBranchId, activeSwitch])

    const types = [
        {
            name: "Guruhlar",
            type: "groups"
        }
    ]

    return (

        // <DynamicModuleLoader reducers={reducers}>
        <div className={cls.deletedGroups}>
            <div className={cls.mainContainer_filterPanelBox}>
                <Button
                    status={"filter"}
                    extraClass={cls.extraCutClassFilter}
                    onClick={() => setActive(!active)}
                    type={"filter"}
                >
                    Filter
                </Button>
                {/*<Link to={"deletedGroups"}>*/}
                <Button
                    type={"login"}
                    status={"timeTable"}
                    extraClass={cls.extraCutClassFilter}
                    onClick={() => setActive(true)}
                >
                    Time Table
                </Button>
                {/*</Link>*/}
            </div>

            <div className={cls.table}>

                <h2>{activeSwitch ? "Deleted Classes" : "Classes"}</h2>
                {activeSwitch ? <DeletedGroups loadingWithFilter={loadingWithFilter} currentTableData={currentTableData}/> : <GroupsList
                    loadingWithFilter={loadingWithFilter} currentTableData={currentTableData}
                />}
            </div>
            <Pagination
                setCurrentTableData={setCurrentTableData}
                users={searchedUsers}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                pageSize={PageSize}
                onPageChange={page => {
                    setCurrentPage(page)
                }}
                type={"custom"}
            />


            <GroupsFilter
                setIsFilter={setIsFilter}
                activeSwitch={activeSwitch}
                setActiveSwitch={setActiveSwitch}
                setActive={setActive}
                active={active}
            />
        </div>
        // {/*</DynamicModuleLoader>*/}


    )
}
