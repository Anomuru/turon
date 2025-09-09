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
    getGroupsLoading, getGroupListWithFilter, fetchGroupsDataWithFilter, getGroupsListCount
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
import {useNavigate} from "react-router";
import {Flows, flowsReducer, getFlows} from "entities/flows/index.js";
import {getFlowsCount, getFlowsLoading} from "entities/flows/model/selector/flowsSelector.js";
import {getTeacherData} from "entities/oftenUsed/index.js";
import {getCurseLevelData} from "entities/students/index.js";
import {API_URL, headers, useHttp} from "shared/api/base.js";
import {getCurseLevel} from "entities/students/model/studentsSlice.js";
import {FlowAddForm} from "features/flow/index.js";
import {flowsProfileReducer} from "entities/flowsProfile/index.js";
import {FlowFilter} from "features/filters/flowFilter/index.js";


const reducers = {
    groupsSlice: groupsReducer,
    flowsSlice: flowsReducer,
    // teachers: teachersReducer,
    // newStudents: newStudentsReducer,
    flowsProfileSlice: flowsProfileReducer
}
export const GroupsPage = () => {

    const selectedSwitch = localStorage.getItem("selectedSwitch")

    const dispatch = useDispatch()
    const data = useSelector(getGroupsListData)
    const getFilteredGroups = useSelector(getGroupListWithFilter)
    const groupCount = useSelector(getGroupsListCount)
    const deletedGroupsData = useSelector(getDeletedGroupsData)
    const loading = useSelector(getGroupsLoading)
    const loadingWithFilter = useSelector(getGroupListWithFilterLoading)
    // const {"*": id} = useParams()

    const userBranchId = useSelector(getUserBranchId)
    const [deletedGroups, setDeletedGroups] = useState([])
    const [active, setActive] = useState(false);
    const [activeSwitch, setActiveSwitch] = useState(selectedSwitch === "true")
    const [isFilter, setIsFilter] = useState(false)
    const search = useSelector(getSearchValue)
    let PageSize = useMemo(() => 50, [])
    const [currentPage, setCurrentPage] = useState(1);


    const [pageSwitch, setPageSwitch] = useState(false)



    //flow items
    const flows = useSelector(getFlows)
    const flowsCount = useSelector(getFlowsCount)
    const flowsLoading = useSelector(getFlowsLoading)
    const teachers = useSelector(getTeacherData)
    const level = useSelector(getCurseLevelData)
    const [activeFlow, setActiveFlow] = useState(false)
    const [activeAdd, setActiveAdd] = useState(false);
    const [filter, setFilter] = useState(false)
    const [activeAddFlow, setActiveAddFlow] = useState(false)



    useEffect(() => {
        setCurrentPage(1)
    }, [pageSwitch])
    useEffect(() => {
        setDeletedGroups(deletedGroupsData)
    }, [deletedGroupsData])
    const {request} = useHttp()

    const navigate = useNavigate()


    const getLevelData = (id) => {
        const subjectId = teachers.filter(item => item.id === +id)[0]?.subject[0]?.id
        request(`${API_URL}Subjects/level-for-subject/${subjectId}/`, "GET", null, headers())
            .then(res => {
                dispatch(getCurseLevel(res))
            })
            .catch(err => console.log(err))
    }


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

    // if (loadingWithFilter) {
    //     return <DefaultPageLoader/>
    // }


    return (

        <DynamicModuleLoader reducers={reducers}>
            <div className={cls.deletedGroups}>


                <div className={cls.mainContainer_filterPanelBox}>
                    {!pageSwitch ?
                        <Button
                            status={"filter"}
                            extraClass={cls.extraCutClassFilter}
                            onClick={() => {
                                setActive(!active)
                                console.log("hello")
                            }}
                            type={"filter"}
                        >
                            Filter
                        </Button>
                        : <Button
                            onClick={() => {
                                setFilter(!filter)
                                console.log("hello2")
                            }}
                            status={"filter"}
                            type={"filter"}

                        >
                            Filter
                        </Button>
                    }
                    {/*<Link to={"deletedGroups"}>*/}
                    <div style={{display: "flex"}}>
                        {!pageSwitch ? <>
                                <Button
                                    type={"login"}
                                    extraClass={cls.extraCutClassFilter}
                               onClick={() => navigate(`quarter`)}>
                                    Chorak baholari
                                </Button>
                                <Button
                                    type={"login"}
                                    extraClass={cls.extraCutClassFilter}
                                    onClick={() => navigate(`../class`)}
                                >
                                    Sinf raqamlari
                                </Button>
                                <Button
                                    type={"login"}
                                    extraClass={cls.extraCutClassFilter}
                                    onClick={() => navigate(`../timeList`)}
                                >
                                    Time List
                                </Button>
                            </> :


                            <>


                                <Button
                                    onClick={() => setActiveFlow(!activeFlow)}
                                    type={"simple"}
                                >
                                    Create Flow
                                </Button>
                                <Button
                                    type={"simple"}
                                    onClick={() => setActiveAddFlow(true)}
                                >
                                    Add Flow
                                </Button>
                            </>
                        }

                        <Button
                            type={"login"}
                            extraClass={cls.extraCutClassFilter}
                            onClick={() => {
                                setPageSwitch(!pageSwitch)

                            }}
                        >
                            {pageSwitch ? "Classes" : "Flow list"}
                        </Button>
                    </div>
                    {/*</Link>*/}
                </div>

                <div className={cls.table}>

                    <div style={{display: 'flex' , justifyContent: "space-between"}}>
                        <h2>{pageSwitch ? "Flows" : activeSwitch ? "Deleted Classes" : "Classes"}</h2>
                        <h2>{pageSwitch ? flowsCount : groupCount}</h2>
                    </div>
                    {loadingWithFilter === true ? <DefaultPageLoader/> :
                        pageSwitch ? <Flows
                                branchId={userBranchId}
                                currentTableData={flows}
                                loading={flowsLoading}
                                teacherData={teachers}
                                levelData={level}
                                getLevelData={getLevelData}
                                setActive={setActiveAddFlow}
                                active={activeAddFlow}
                                setActiveFlow={setActiveFlow}
                                activeFlow={activeFlow}
                            /> :

                            activeSwitch ? <DeletedGroups loadingWithFilter={loadingWithFilter}
                                                          currentTableData={getFilteredGroups}/> : <GroupsList
                                loadingWithFilter={loadingWithFilter} currentTableData={getFilteredGroups}
                            />}
                </div>
                <Pagination
                    totalCount={pageSwitch ? flowsCount : groupCount}
                    setCurrentPage={setCurrentPage}
                    currentPage={currentPage}
                    pageSize={PageSize}
                    onPageChange={page => {
                        setCurrentPage(page)
                    }}
                    type={"custom"}
                />


                {!pageSwitch ? <GroupsFilter
                        setIsFilter={setIsFilter}
                        activeSwitch={activeSwitch}
                        setActiveSwitch={setActiveSwitch}
                        setActive={setActive}
                        active={active}
                        pageSize={PageSize}
                        currentPage={currentPage}
                    /> :
                    <FlowFilter
                        active={filter}
                        setActive={setFilter}
                        currentPage={currentPage}
                        pageSize={PageSize}
                    />}
                <FlowAddForm
                    userBranchId={userBranchId}
                    active={activeAdd}
                    setActive={setActiveAdd}
                />

            </div>
        </DynamicModuleLoader>


    )
}
