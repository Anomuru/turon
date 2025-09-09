import {fetchClassInput, getClassInputData} from "entities/oftenUsed";
import {onAddAlertOptions} from "features/alert/model/slice/alertSlice";
import React, {useEffect, useMemo, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";

import {getSearchValue} from "features/searchInput";
import {Pagination} from "features/pagination";
import {
    TimeTableChange,
    TimeTableCreate,
    TimeTableHeader,
    TimeTableList
} from "entities/timeTable";
import {ConfirmModal} from "shared/ui/confirmModal";
import {
    getTimeTableData,
    getTimeTableLoading
} from "../model/timeTableListSelector/timeTableListSelector";
import {onDelete} from "../model/timeTableListSlice/timeTableListSlice";
import {
    createTimeTable,
    fetchTimeTableListData,
    updateTimeTable
} from "../model/timeTableListThunk/timeTableListThunk";

import cls from "./timeTableListPage.module.sass";
import {API_URL, headers, useHttp} from "shared/api/base";
import {DynamicModuleLoader} from "shared/lib/components/DynamicModuleLoader/DynamicModuleLoader.jsx";

const reducers = {}

export const TimeTableListPage = () => {


    const dispatch = useDispatch()

    const data = useSelector(getTimeTableData)
    const classInput = useSelector(getClassInputData)
    const loading = useSelector(getTimeTableLoading)
    const [isCreate, setIsCreate] = useState(false)
    const [isChange, setIsChange] = useState(null)
    const [isFilter, setIsFilter] = useState(false)
    const [currentStatus, setCurrentStatus] = useState(false)
    const [isDeleted, setIsDeleted] = useState(false)

    const search = useSelector(getSearchValue)
    let PageSize = useMemo(() => 11, [])
    const [currentPage, setCurrentPage] = useState(1);




    useEffect(() => {
        dispatch(fetchTimeTableListData({currentPage, pageSize: PageSize , search}))
        // dispatch(fetchClassInput())
    }, [currentPage , search])
    const onSubmitCreate = (data) => {
        dispatch(createTimeTable(data))
        dispatch(onAddAlertOptions({
            type: "success",
            status: true,
            msg: `Vaqt qo'shildi`
        }))
        setIsCreate(false)
        setCurrentStatus(true)
    }

    const onSubmitChange = (dataForm) => {
        const filteredTime = data?.filter(item => item.id === isChange?.id)[0]
        dispatch(updateTimeTable({id: isChange?.id, obj: dataForm}))
        dispatch(onAddAlertOptions({
            type: "success",
            status: true,
            msg: `${filteredTime?.name}ni malumotlari o'zgardi`
        }))
        setCurrentStatus(true)
    }

    const {request} = useHttp()
    const onDeleteTimeTable = () => {

        request(`${API_URL}SchoolTimeTable/hours-list-update/${isChange.id}`, "DELETE", null, headers())
            .then(res => {
                dispatch(onDelete(isChange.id))
                setIsDeleted(false)
                dispatch(onAddAlertOptions({
                    status: true,
                    type: "success",
                    msg: res.msg
                }))
                setIsChange(false)
            })
            .catch(err => {
                console.log(err)
            })


    }

    const onDeleteStatus = () => {
        setIsDeleted(true)
    }

    return (
        <DynamicModuleLoader reducers={reducers}>
            <div className={cls.timeTable}>
                <TimeTableHeader
                    isCreate={isCreate}
                    setIsCreate={setIsCreate}
                    setIsFilter={setIsFilter}
                    setStatus={setCurrentStatus}
                    totalCount={data?.count}
                />

                <div className={cls.timeTable__table}>
                    <TimeTableList
                        data={data?.results}
                        setIsChange={setIsChange}
                        loading={loading}
                        setStatus={setCurrentStatus}
                    />
                    <Pagination
                        totalCount={data?.count}
                        currentPage={currentPage}
                        pageSize={PageSize}
                        onPageChange={page => {
                            setCurrentPage(page)
                        }}
                    />
                </div>
                <TimeTableCreate
                    classInput={classInput}
                    active={currentStatus ? false : isCreate}
                    setActive={setIsCreate}
                    onSubmit={onSubmitCreate}
                    loading={loading}
                />
                <TimeTableChange
                    classInput={classInput}
                    active={currentStatus ? false : isChange}
                    setActive={setIsChange}
                    onSubmit={onSubmitChange}
                    loading={loading}
                    onDelete={onDeleteStatus}
                />
                <ConfirmModal
                    type={"danger"}
                    active={isDeleted}
                    setActive={setIsDeleted}
                    onClick={onDeleteTimeTable}
                />
            </div>
        </DynamicModuleLoader>
    )
}


