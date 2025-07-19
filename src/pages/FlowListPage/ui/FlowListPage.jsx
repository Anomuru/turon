import classNames from "classnames";
import {FlowList} from "entities/flowList";
import {fetchGroupsData, getGroupsListData, getGroupsLoading} from "entities/groups";
import {getUserBranchId} from "entities/profile/userProfile";
import {getBranch} from "features/branchSwitcher";
import {useDispatch, useSelector} from "react-redux";
import {flowListThunk, getFlowList} from "entities/flows";
import {useParams} from "react-router-dom";
import {API_URL, headers, useHttp} from "shared/api/base";
import {Button} from "shared/ui/button";
import {DefaultPageLoader} from "shared/ui/defaultLoader";
import cls from "./FlowListPage.module.sass";
import {Input} from "shared/ui/input";
import {Pagination} from "features/pagination";
import {getSearchValue} from "features/searchInput";
import {useEffect, useMemo, useState} from "react";
import {onAddAlertOptions} from "features/alert/model/slice/alertSlice";
import {useNavigate} from "react-router";

export const FlowListPage = () => {

    const {request} = useHttp()
    const dispatch = useDispatch()
    const id = useSelector(getBranch)
    // const {"*": id} = useParams()
    const userBranchId = id?.id
    const navigate = useNavigate()

    useEffect(() => {
        if (userBranchId) {
            dispatch(flowListThunk())
            dispatch(fetchGroupsData({userBranchId}))
        }
    }, [userBranchId])

    // const flowList = useSelector(getFlowList)
    const flowList = useSelector(getGroupsListData)
    const loading = useSelector(getGroupsLoading)
    const search = useSelector(getSearchValue)

    let PageSize = useMemo(() => 50, [])

    const [currentTableData, setCurrentTableData] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedId, setSelectedId] = useState([])



    const searchedUsers = useMemo(() => {
        const filteredHeroes = flowList?.slice()
        setCurrentPage(1)

        if (!search) return filteredHeroes

        return filteredHeroes.filter(item =>
            item.name?.toLowerCase().includes(search.toLowerCase())
        )
    }, [flowList])

    const onChangeAll = (classId) => {
        setCurrentTableData(prev => prev.map(item => {
            if (item?.id === +classId) {
                if (item.isCheck) {
                    setSelectedId(prev => prev.filter(i => i?.classId !== item?.id))
                    return {
                        isCheck: false,
                        id: item.id,
                        students: item.students.map(item => ({
                            ...item,
                            isCheck: false,
                            id: item.id,

                        })),
                        class_number: item.class_number,
                        color: item.color
                    }
                } else {
                    setSelectedId(prev => {
                        if (prev.filter(i => i?.classId === item?.id)[0]) {
                            return [
                                ...prev.filter(i => i?.classId !== item.id),
                                {
                                    classId: item?.id,
                                    students: item?.students?.map(item => item?.id)
                                }
                            ]
                        } else return [
                            ...prev,
                            {
                                classId: item?.id,
                                students: item?.students?.map(item => item?.id)
                            }
                        ]
                    })
                    return {
                        isCheck: true,
                        id: item.id,
                        students: item.students.map(item => ({
                            ...item,
                            isCheck: true,
                            id: item.id,
                        })),
                        class_number: item.class_number,
                        color: item.color
                    }
                }
            } else return item
        }))
    }

    const onChangeSingle = (studentId, classId) => {


        setSelectedId(prev => {
            if (prev.filter(i => i?.classId === +classId)[0]) {
                return prev.map(i => {
                    if (i?.classId === classId) {
                        return {
                            classId: i?.classId,
                            students: i?.students.includes(+studentId)
                                ? i.students.filter(item => item !== +studentId)
                                :
                                [...i.students, +studentId]
                        }
                    }
                })
            } else {
                return [...prev, {
                    classId: +classId,
                    students: [+studentId]
                }]
            }
        })
    }



    useEffect(() => {
        setCurrentTableData(prev => prev.map(item => {
            const filtered = selectedId.filter(i => i?.classId === item.id)[0]
            if (filtered) {
                return {
                    isCheck: filtered?.students?.length === item.students.length,
                    id: item.id,
                    students: item.students.map(i => {
                        if (filtered?.students?.includes(i.id)) {
                            return {
                                ...i,
                                isCheck: true,
                                id: i.id,

                            }
                        } else return {
                            ...i,
                            isCheck: false,
                            id: i.id,
                        }
                    }),
                    class_number: item.class_number,
                    color: item.color
                }
            } else return item
        }))
    }, [selectedId, currentPage])

    const onCreateFlow = () => {
        let idArr = []
        selectedId.map(item => {
            item?.students?.map(i => idArr.push(i))
        })
        const res = localStorage.getItem("flowData")
        const data = {
            ...JSON.parse(res),
            students: idArr,
            classes: []
        }

        request(`${API_URL}Flow/flow-list-create/`, "POST", JSON.stringify(data), headers())
            .then(res => {
                dispatch(onAddAlertOptions({
                    type: "success",
                    msg: res.msg,
                    status: true
                }))
                localStorage.removeItem("flowData")
            })
            .then(() => {
                navigate(-2)
            })
    }

    const renderFlowList = () => {
        return currentTableData.map((item, i) => (
            <FlowList
                currentPage={currentPage}
                key={i}
                flowList={item}
                onChangeAll={onChangeAll}
                onChangeSingle={onChangeSingle}
                // flowList={item?.students}
                number={i}
                // name={item?.name}
            />
        ))
    }

    const render = renderFlowList()

    return (
        <div className={cls.flow}>
            <div className={cls.flowListHeader}>
                <div>
                    <span>No</span>
                    <span>Sinf Raqami</span>
                </div>
            </div>
            {
                loading ? <DefaultPageLoader/> :
                    <div className={cls.table}>
                        <div>
                            {render}
                        </div>
                        <div
                            className={classNames(cls.table__footer, {
                                [cls.active]: PageSize <= searchedUsers.length
                            })}
                        >
                            <Pagination
                                setCurrentTableData={setCurrentTableData}
                                users={searchedUsers}
                                currentPage={currentPage}
                                pageSize={PageSize}
                                onPageChange={page => {
                                    setCurrentPage(page)
                                }}
                            />
                            <Button
                                extraClass={cls.table__btn}
                                onClick={onCreateFlow}
                                type={selectedId.filter(item => item?.students?.length > 0)[0] ? "" : "disabled"}
                                disabled={selectedId.filter(item => item?.students?.length > 0)[0] ? "" : "disabled"}
                            >
                                Create
                            </Button>
                        </div>
                    </div>
            }
        </div>
    )
}