import {onAddAlertOptions} from "features/alert/model/slice/alertSlice";
import {deleteDayType} from "pages/calendarPage/model/calendarSlice";
import React, {memo, useCallback, useEffect, useState} from 'react';

import {CalendarListItem} from "entities/calendar";
import {useDispatch} from "react-redux";
import {API_URL, headers, useHttp} from "shared/api/base";
import {ConfirmModal} from "shared/ui/confirmModal";
import {DefaultPageLoader} from "shared/ui/defaultLoader";

import cls from "./calendarList.module.sass";

export const CalendarList = (props) => {

    const {
        setActive,
        currentData,
        loading,
        data,
        onSubmit,
        isChanged,
        setIsChanged,
    } = props

    const {request} = useHttp()
    const dispatch = useDispatch()
    const [selected, setSelected] = useState([])
    const [isDeleted, setIsDeleted] = useState(false)
    const [deleteData, setDeleteData] = useState(null)

    const onSubmitDelete = () => {
        request(`${API_URL}Calendar/delete-type/`, "DELETE", JSON.stringify({days: deleteData}), headers())
            .then(res => {
                dispatch(deleteDayType(res))
                dispatch(onAddAlertOptions({
                    type: "success",
                    status: true,
                    msg: `${res.length > 1 ? "Kunlar" : "Kun"} o'chirildi`
                }))
                setIsDeleted(false)
            })
            .catch(err => console.log(err))
    }

    const onDelete = (data) => {
        setDeleteData(data)
        setIsDeleted(true)
    }

    useEffect(() => {
        if (isChanged) {
            setSelected([])
            setIsChanged(false)
        } else {
            if (selected.length) {
                setActive(obj => ({
                    ...obj,
                    days: selected
                }))
            }
        }
    }, [isChanged, selected])

    const onActiveDays = (id, value, trueActive, setTrueActive, setDemoActive) => {
        let newArr = trueActive.map((item, index) => {
            if (item.startId && !item?.finishId) {
                const startID = item.startId < id ? item.startId : id
                const finishID = item.startId < id ? id : item.startId
                setActive(obj => ({
                    ...obj,
                    finishValue: value,
                    startId: startID,
                    finishId: finishID
                }))
                return {
                    startId: startID,
                    finishId: finishID
                }
            } else if (!item?.startId && trueActive[index - 1]?.finishId !== id) {
                return {startId: id}
            } else {
                return item
            }
        })
        const newActives =
            newArr[newArr.length - 1].startId && newArr[newArr.length - 1].finishId
                ? [...newArr, {}] : newArr
        setTrueActive(newActives)
        setDemoActive([])
    }

    function sortWeeksDays(arr, startDay) {
        let newArr = [...arr]?.sort(compareById)
        let i = 0
        let arrContainer = []
        let totalArr = []
        const whileCount = (newArr.length + startDay) <= 35 ? 35 : 42

        while (i < whileCount) {
            if (i < startDay) {
                arrContainer.push("")
            } else {
                if ((i - startDay) < newArr.length) {
                    arrContainer.push({id: newArr[i - startDay], value: newArr[i - startDay]})
                } else arrContainer.push("")
            }
            if (arrContainer.length === 7) {
                totalArr.push(arrContainer)
                arrContainer = []
            }
            i = i + 1
        }
        return totalArr
    }

    function compareById(a, b) {
        return a.id - b.id;
    }

    const renderMonthList = useCallback(() => {
        // console.log(data, "data")
        return data && [...data]?.map((item, index) => {
            // console.log(item, "item")
            return (
                <CalendarListItem
                    key={index}
                    month={index}
                    setActive={setActive}
                    data={item.months}
                    onActiveDays={onActiveDays}
                    sortWeeksDays={sortWeeksDays}
                    currentData={currentData.id === index ? currentData : {}}
                    setSelected={setSelected}
                    onSubmit={onSubmit}
                    isChanged={isChanged}
                    setIsChanged={setIsChanged}
                    onSubmitDelete={onDelete}
                />
            )
        })
    }, [currentData, data])

    const render = loading ? <DefaultPageLoader/> : renderMonthList()

    return (
        <>
            <div className={cls.calendarList}>
                {render}
            </div>
            <ConfirmModal
                type={"danger"}
                active={isDeleted}
                setActive={setIsDeleted}
                onClick={onSubmitDelete}
            />
        </>
    )
}
