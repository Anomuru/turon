import {useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import {FlowAddForm} from "features/flow";
import {Pagination} from "features/pagination";
import {getSearchValue} from "features/searchInput";
import {getCurseLevelData} from "entities/students";
import {getCurseLevel} from "entities/students/model/studentsSlice";
import {Flows, flowsReducer} from "entities/flows";
import {getFlows} from "entities/flows";
import {getFlowsCount, getFlowsLoading} from "entities/flows/model/selector/flowsSelector";
import {getUserBranchId} from "entities/profile/userProfile";
import {flowsProfileReducer} from "entities/flowsProfile";
import {fetchTeachersData, getTeacherData} from "entities/oftenUsed"
import {API_URL, headers, useHttp} from "shared/api/base";
import {DynamicModuleLoader} from "shared/lib/components/DynamicModuleLoader/DynamicModuleLoader";

import cls from "./flowsPage.module.sass"

const reducers = {
    flowsSlice: flowsReducer,
    // teachers: teachersReducer,
    // newStudents: newStudentsReducer,
    flowsProfileSlice: flowsProfileReducer
}

export const FlowsPage = () => {

    const {request} = useHttp()
    const dispatch = useDispatch()

    const search = useSelector(getSearchValue);
    const flows = useSelector(getFlows)
    const flowsCount = useSelector(getFlowsCount)
    const flowsLoading = useSelector(getFlowsLoading)
    const userBranchId = useSelector(getUserBranchId)
    const teachers = useSelector(getTeacherData)
    const level = useSelector(getCurseLevelData)

    const [currentPage, setCurrentPage] = useState(1);
    const [active, setActive] = useState(false)

    let PageSize = useMemo(() => 50, [])

    const searchedFlow = useMemo(() => {
        const filteredRooms = flows?.filter(item => !item.deleted) || [];

        if (!search) return filteredRooms;
        setCurrentPage(1);

        return filteredRooms.filter(item =>
            item?.name?.toLowerCase().includes(search.toLowerCase())
        );
    }, [flows, search]);

    useEffect(() => {
        if (userBranchId) {
            // dispatch(fetchFlows(userBranchId))
            dispatch(fetchTeachersData(userBranchId))
        }
    }, [userBranchId])

    const getLevelData = (id) => {
        const subjectId = teachers.filter(item => item.id === +id)[0]?.subject[0]?.id
        request(`${API_URL}Subjects/level-for-subject/${subjectId}/`, "GET", null, headers())
            .then(res => {
                dispatch(getCurseLevel(res))
            })
            .catch(err => console.log(err))
    }


    return (
        <DynamicModuleLoader reducers={reducers}>
            <div className={cls.flow}>
                <div className={cls.flow__header}>

                    {/*<div className={cls.flow__location}>*/}
                    {/*    <Select/>*/}
                    {/*</div>*/}

                </div>
                <Flows
                    branchId={userBranchId}
                    currentTableData={searchedFlow}
                    loading={flowsLoading}
                    teacherData={teachers}
                    levelData={level}
                    getLevelData={getLevelData}
                    setActive={setActive}
                    currentPage={currentPage}
                    pageSize={PageSize}
                />
                <Pagination
                    setCurrentPage={setCurrentPage}
                    currentPage={currentPage}
                    pageSize={PageSize}
                    onPageChange={page => {
                        setCurrentPage(page)
                    }}
                    type={"custom"}
                    totalCount={flowsCount}
                />
                <FlowAddForm
                    userBranchId={userBranchId}
                    active={active}
                    setActive={setActive}
                />
            </div>
        </DynamicModuleLoader>
    )
}