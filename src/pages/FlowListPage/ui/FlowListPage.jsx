import classNames from "classnames";
import { FlowList } from "entities/flowList";
import {
    fetchGroupsDataWithFilter, getClassDataForFlow,
    getGroupsListCount,
    getGroupsListData,
    getGroupsLoading,
    groupsReducer
} from "entities/groups";
import { getUserBranchId } from "entities/profile/userProfile";
import { useDispatch, useSelector } from "react-redux";
import { flowListThunk, getFlowList } from "entities/flows";
import { API_URL, headers, useHttp } from "shared/api/base";
import { DynamicModuleLoader } from "shared/lib/components/DynamicModuleLoader/DynamicModuleLoader.jsx";
import { Button } from "shared/ui/button";
import { DefaultPageLoader } from "shared/ui/defaultLoader";
import cls from "./FlowListPage.module.sass";
import { Pagination } from "features/pagination";
import { getSearchValue } from "features/searchInput";
import { useEffect, useMemo, useState } from "react";
import { onAddAlertOptions } from "features/alert/model/slice/alertSlice";
import { useNavigate } from "react-router";
import { fetchClassesDataForFlow } from "entities/groups/model/slice/groupsThunk.js";

const reducers = {
    groupsSlice: groupsReducer
}

export const FlowListPage = () => {
    const { request } = useHttp()
    const dispatch = useDispatch()
    const userBranchId = useSelector(getUserBranchId)
    const navigate = useNavigate()

    useEffect(() => {
        if (userBranchId) {
            dispatch(flowListThunk())
            dispatch(fetchClassesDataForFlow({ branch: userBranchId }))
        }
    }, [userBranchId])

    const totalCount = useSelector(getGroupsListCount)
    const flowList = useSelector(getClassDataForFlow)
    const loading = useSelector(getGroupsLoading)
    const search = useSelector(getSearchValue)

    let PageSize = useMemo(() => 50, [])

    const [currentTableData, setCurrentTableData] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedId, setSelectedId] = useState([])

    const searchedUsers = useMemo(() => {
        const filteredHeroes = flowList?.slice()

        if (!search) return filteredHeroes

        return filteredHeroes.filter(item =>
            item.name?.toLowerCase().includes(search.toLowerCase())
        )
    }, [flowList, search])

    useEffect(() => {
        setCurrentPage(1)
    }, [search])

    useEffect(() => {
        if (searchedUsers) {
            setCurrentTableData(searchedUsers)
        }
    }, [searchedUsers])

    const onChangeAll = (classId) => {
        setCurrentTableData(prev => prev.map(item => {
            if (item?.id !== +classId) return item

            const newIsCheck = !item.isCheck

            setSelectedId(prev => {
                if (newIsCheck) {
                    // Добавляем всех студентов
                    const existingIndex = prev.findIndex(i => i?.classId === item?.id)
                    const allStudents = item?.students?.map(s => s?.id) || []

                    if (existingIndex >= 0) {
                        const newArr = [...prev]
                        newArr[existingIndex] = {
                            classId: item?.id,
                            students: allStudents
                        }
                        return newArr
                    }
                    return [
                        ...prev,
                        {
                            classId: item?.id,
                            students: allStudents
                        }
                    ]
                } else {
                    // ✅ ИСПРАВЛЕНО: полностью удаляем класс из selectedId
                    return prev.filter(i => i?.classId !== item?.id)
                }
            })

            return {
                isCheck: newIsCheck,
                id: item.id,
                students: item.students.map(s => ({
                    ...s,
                    isCheck: newIsCheck,
                    id: s.id,
                })),
                class_number: item.class_number,
                color: item.color
            }
        }))
    }

    const onChangeSingle = (studentId, classId) => {
        setSelectedId(prev => {
            const existingClass = prev.find(i => i?.classId === +classId)

            if (existingClass) {
                const updatedStudents = existingClass.students.includes(+studentId)
                    ? existingClass.students.filter(item => item !== +studentId)
                    : [...existingClass.students, +studentId]

                // ✅ ИСПРАВЛЕНО: если студентов не осталось, удаляем класс полностью
                if (updatedStudents.length === 0) {
                    return prev.filter(i => i?.classId !== +classId)
                }

                return prev.map(i => {
                    if (i?.classId === +classId) {
                        return {
                            classId: i?.classId,
                            students: updatedStudents
                        }
                    }
                    return i
                })
            } else {
                // Добавляем новый класс с одним студентом
                return [
                    ...prev,
                    {
                        classId: +classId,
                        students: [+studentId]
                    }
                ]
            }
        })
    }

    // ✅ ИСПРАВЛЕНО: правильная синхронизация с selectedId
    useEffect(() => {
        setCurrentTableData(prev => prev?.map(item => {
            const filtered = selectedId?.find(i => i?.classId === item.id)

            if (filtered && filtered.students.length > 0) {
                // Класс найден и в нем есть студенты
                return {
                    isCheck: filtered.students.length === item.students.length,
                    id: item.id,
                    students: item.students.map(student => ({
                        ...student,
                        isCheck: filtered.students.includes(student.id),
                        id: student.id,
                    })),
                    class_number: item.class_number,
                    color: item.color
                }
            } else {
                // ✅ ИСПРАВЛЕНО: если класс не найден или студентов нет - снимаем все галочки
                return {
                    isCheck: false,
                    id: item.id,
                    students: item.students.map(student => ({
                        ...student,
                        isCheck: false,
                        id: student.id,
                    })),
                    class_number: item.class_number,
                    color: item.color
                }
            }
        }))
    }, [selectedId])

    const onCreateFlow = () => {
        const idArr = selectedId.flatMap(item => item?.students || [])

        const res = localStorage.getItem("flowData")
        const data = {
            ...JSON.parse(res),
            students: idArr,
            classes: []
        }

        console.log(data, "data");

        // request(`${API_URL}Flow/flow-list-create/`, "POST", JSON.stringify(data), headers())
        //     .then(res => {
        //         dispatch(onAddAlertOptions({
        //             type: "success",
        //             msg: res.msg,
        //             status: true
        //         }))
        //         localStorage.removeItem("flowData")
        //     })
        //     .then(() => {
        //         navigate(-1)
        //     })
        //     .catch(error => {
        //         dispatch(onAddAlertOptions({
        //             type: "error",
        //             msg: error?.message || "Ошибка при создании flow",
        //             status: true
        //         }))
        //     })
    }

    const renderFlowList = () => {
        return currentTableData?.map((item, i) => (
            <FlowList
                currentPage={currentPage}
                key={item.id}
                flowList={item}
                title={`${item?.class_number}-${item?.color}`}
                onChangeAll={onChangeAll}
                onChangeSingle={onChangeSingle}
                number={i}
            />
        ))
    }

    const render = renderFlowList()

    return (
        <DynamicModuleLoader reducers={reducers}>
            <div className={cls.flow}>
                <div className={cls.flowListHeader}>
                    <div>
                        <span>No</span>
                        <span>Sinf Raqami</span>
                    </div>
                </div>
                {
                    loading ? <DefaultPageLoader /> :
                        <div className={cls.table}>
                            <div>
                                {render}
                            </div>
                            <div
                                className={classNames(cls.table__footer, {
                                    [cls.active]: PageSize <= searchedUsers?.length
                                })}
                            >
                                <Pagination
                                    currentPage={currentPage}
                                    pageSize={PageSize}
                                    onPageChange={page => {
                                        setCurrentPage(page)
                                    }}
                                    totalCount={totalCount}
                                    type={"custom"}
                                />
                                <Button
                                    extraClass={cls.table__btn}
                                    onClick={onCreateFlow}
                                    type={selectedId.some(item => item?.students?.length > 0) ? "" : "disabled"}
                                    disabled={!selectedId.some(item => item?.students?.length > 0)}
                                >
                                    Create
                                </Button>
                            </div>
                        </div>
                }
            </div>
        </DynamicModuleLoader>
    )
}