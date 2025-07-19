import React, {memo, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import classNames from "classnames";

import {Table} from "shared/ui/table";
import {weekDaysList} from "entities/calendar/index";
import {Switch} from "shared/ui/switch";
import {Button} from "shared/ui/button";

import cls from "./calendarListItem.module.sass";
import 'react-calendar/dist/Calendar.css';

export const CalendarListItem = memo((props) => {

    const {
        month,
        setActive,
        data,
        onActiveDays,
        sortWeeksDays,
        currentData,
        setSelected,
        onSubmit,
        isChanged,
        setIsChanged,
        onSubmitDelete
    } = props

    const contentHeight = useRef()
    const weeksCount = useMemo(() =>
        ["1week", "2week", "3week", "4week", "5week", "6week"], [])

    const [totalWeeksCount, setTotalWeeksCount] = useState([])
    const [demoActive, setDemoActive] = useState([])
    const [trueActive, setTrueActive] = useState([{}])
    const [selectedId, setSelectedId] = useState([])
    const [typesOfDays, setTypesOfDays] = useState([])
    const [selectedDay, setSelectedDay] = useState([])
    const [activeSwitch, setActiveSwitch] = useState(true)
    const [singleId, setSingleId] = useState([])
    const [singleIdActive, setSingleIdActive] = useState(false)
    const [deletedId, setDeletedId] = useState([])

    useEffect(() => {

        setTotalWeeksCount(sortWeeksDays(data[0]?.days, data[0]?.days[0]?.day_name === "Friday" ?
            4 : data[0]?.days[0]?.day_name === "Saturday" ?
                5 : data[0]?.days[0]?.day_name === "Sunday" ?
                    6 : data[0]?.days[0]?.day_name === "Monday" ?
                        0 : data[0]?.days[0]?.day_name === "Tuesday" ?
                            1 : data[0]?.days[0]?.day_name === "Wednesday" ? 2 : 3))
        setTypesOfDays(data[0]?.types)
        setTrueActive([{}])
    }, [data])

    useEffect(() => {
        // console.log(isChanged, "isChanged out")
        if (isChanged) {
            // console.log(isChanged, "isChanged")
            setSelectedId([])
            setSingleId([])
            setIsChanged(false)
        }
    }, [isChanged, selectedId])



    useEffect(() => {

        if (selectedId.length && !singleIdActive && activeSwitch) {

            setSelected(selectedId)
        }
    }, [selectedId, singleIdActive])

    // if (selectedId.length) {

    // }

    const renderWeekDaysSingle = useCallback(() => {
        return weeksCount.map((item, index) =>
            <tr key={index}>
                {
                    totalWeeksCount[index]?.map((i, iI) => {
                        return (
                            <td
                                key={iI}
                                onClick={() => {
                                    if (i.value) {
                                        setSingleId(prev => {
                                            if (prev.filter(item => item === i?.value?.id)[0]) {
                                                return prev.filter(item => item !== i?.value?.id)
                                            }
                                            return [...prev, i?.value?.id]
                                        })
                                    }
                                }}
                                className={classNames(cls.inner__day, {
                                    [cls.active]: singleId.includes(i?.value?.id),
                                    [cls.demoActive]: false
                                })}
                                style={{
                                    padding: i?.value?.day_number > 9 ? "1rem 0 .6rem .6rem" : ""
                                }}
                            >
                                <p
                                    className={cls.inner__number}
                                    style={{
                                        backgroundColor:
                                            i?.value?.type_id?.color !== "red" || "green" ? i?.value?.type_id?.color :
                                                singleId.includes(i?.value?.id) ? "white" : i?.value?.type_id?.color,
                                        padding: i?.value?.day_number > 9 ? ".4em .9rem" : ""
                                    }}
                                >
                                    {i?.value?.day_number}
                                </p>
                                {
                                    i?.value?.type_id?.type !== ""
                                }
                            </td>
                        )
                    })
                }
            </tr>
        )
    }, [trueActive, weeksCount, totalWeeksCount, singleId])


    // if (trueActive[0]?.finishId) {

    // }

    const renderWeekDaysSelect = useCallback(() => {
        return weeksCount.map((item, index) =>
            <tr key={index}>
                {
                    totalWeeksCount[index]?.map((i, iI) => {
                        const active = trueActive.filter(item => (item?.startId <= i?.value?.id) && (item?.finishId >= i?.value?.id))[0]
                        if (active && !selectedId.length) {
                            setSelectedId(arr => [...arr, i?.value?.id])
                            // setSelected(arr => [...arr, i?.value?.id])
                        }
                        return (
                            <td
                                key={iI}
                                onClick={() => {
                                    if (i.value) {
                                        onActiveDays(i?.value?.id, i?.value?.day_number, trueActive, setTrueActive, setDemoActive, month, selectedId, {func: () => setSelectedId([])})
                                        if (demoActive.length === 2) {
                                            setDemoActive([])
                                        } else {
                                            setDemoActive([i?.value?.id])
                                        }
                                    }
                                }}
                                onMouseEnter={() => {
                                    if (demoActive.length) {
                                        setDemoActive([demoActive[0], i?.value?.id])
                                    }
                                }}
                                className={classNames(cls.inner__day, {
                                    [cls.active]: activeSwitch ? active || i.value ? demoActive[0] === i?.value?.id : false :
                                        i?.value?.type_id?.color !== "red" && i?.value?.type_id?.color !== "green" ? false :
                                            active ||
                                            trueActive.filter(item => (item?.startId && !item?.finishId) ? item?.startId === i?.value?.id : false)[0],
                                    [cls.demoActive]:
                                    (demoActive[0] > demoActive[1] ? demoActive[1] : demoActive[0]) < i?.value?.id
                                    &&
                                    (demoActive[0] > demoActive[1] ? demoActive[0] : demoActive[1]) > i?.value?.id
                                })}
                                style={{
                                    // color: i?.value?.type_id?.color !== "red" || "green" ? i?.value?.type_id?.color : active ? "white" : i?.value?.type_id?.color,
                                    color: "white",
                                    padding: i?.value?.day_number > 9 ? "1rem 0 .6rem .6rem" : ""
                                }}
                            >
                                <p
                                    className={cls.inner__number}
                                    style={{
                                        backgroundColor:
                                            i?.value?.type_id?.color !== "red" || "green" ? i?.value?.type_id?.color : active ? "white" : i?.value?.type_id?.color,
                                        padding: i?.value?.day_number > 9 ? ".4em .9rem" : ""
                                    }}
                                >
                                    {i?.value?.day_number}
                                </p>
                                {
                                    i?.value?.type_id?.type !== ""
                                }
                            </td>
                        )
                    })
                }
            </tr>
        )
    }, [selectedId, trueActive, totalWeeksCount, demoActive])

    const renderCelebrateDays = useCallback(() => {
        return typesOfDays.map((item, index) => {

            if (!item?.days?.length) return null
            return (
                <div
                    className={cls.all}
                    style={{borderBottom: `8px solid ${item.color}`}}
                >
                    <div
                        className={cls.item}
                        // style={{background: item.color}}
                    >
                        {
                            // item.startValue !== item.finishValue ?
                            <p className={cls.item__inner}>
                                {
                                    item.days ? item.days[0]?.day_number : null
                                }
                                {
                                    item.days.length > 1 ? `-${item.days[item.days.length - 1]?.day_number}` : null
                                }
                                {/*<span>{data[0]?.month_name}</span>*/}
                                <span>/</span>
                                <span>{`${item.type.slice(0, 16)}${item.type.length > 16 ? "..." : ""}`}</span>
                            </p>
                        }
                        <div className={cls.item__icons}>
                            {/*<i className={classNames("fas fa-pen", cls.item__icon)}/>*/}
                            {
                                item.type === "Ish kuni" || item.type === "Dam" ? null :
                                    <i
                                        className={classNames("fas fa-trash", cls.item__icon)}
                                        onClick={() => {
                                            onSubmitDelete(item.days.map(item => item.id))
                                        }}
                                    />
                            }
                            {/*{*/}
                            {/*    selectedDay[0]?.id === item?.days[0]?.id*/}
                            {/*        ?*/}
                            {/*        <i*/}
                            {/*            className={classNames("fas fa-chevron-up", cls.item__icon)}*/}
                            {/*            onClick={() => setSelectedDay([])}*/}
                            {/*        />*/}
                            {/*        :*/}
                            {/*        <i*/}
                            {/*            className={classNames("fas fa-chevron-down", cls.item__icon)}*/}
                            {/*            onClick={() => setSelectedDay(item?.days)}*/}
                            {/*        />*/}
                            {/*}*/}
                        </div>
                    </div>
                    {/*<div*/}
                    {/*    className={classNames(cls.all__active, {*/}
                    {/*        [cls.active]: selectedDay[0]?.id === item?.days[0]?.id*/}
                    {/*    })}*/}
                    {/*    style={*/}
                    {/*        selectedDay[0]?.id === item?.days[0]?.id ?*/}
                    {/*            {height: contentHeight.current.scrollHeight}*/}
                    {/*            : {height: "0px"}*/}
                    {/*    }*/}
                    {/*    ref={contentHeight}*/}
                    {/*>*/}
                    {/*    <div>*/}
                    {/*        {*/}
                    {/*            selectedDay[0]?.id === item?.days[0]?.id*/}
                    {/*                ?*/}
                    {/*                <div*/}
                    {/*                    className={classNames(cls.all__inner, {*/}
                    {/*                        [cls.active]: selectedDay[0]?.id === item?.days[0]?.id*/}
                    {/*                    })}*/}
                    {/*                >*/}
                    {/*                    {*/}
                    {/*                        selectedDay.map(item => {*/}
                    {/*                            return (*/}
                    {/*                                <div className={cls.small}>*/}
                    {/*                                <span>*/}
                    {/*                                    {item?.day_number}*/}
                    {/*                                </span>*/}
                    {/*                                    -*/}
                    {/*                                    <p>*/}
                    {/*                                        {data[0]?.month_name}*/}
                    {/*                                    </p>*/}
                    {/*                                </div>*/}
                    {/*                            )*/}
                    {/*                        })*/}
                    {/*                    }*/}
                    {/*                </div>*/}
                    {/*                :*/}
                    {/*                null*/}
                    {/*        }*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                </div>
            )
        })
    }, [typesOfDays, selectedDay])

    const render = activeSwitch ? renderWeekDaysSelect() : renderWeekDaysSingle()
    const renderDays = renderCelebrateDays()

    return (
        <div className={cls.calendarListItem}>
            <div className={cls.inner}>
                <div className={cls.inner__title}>
                    {data[0]?.month_name}
                </div>
                <Table extraClass={cls.inner__items}>
                    <thead>
                    <tr>
                        {
                            weekDaysList.map((item, i) =>
                                <th
                                    key={i}
                                    style={{width: `${39 / 7}rem`}}
                                >
                                    <div className={cls.inner__item}>
                                        {item}
                                    </div>
                                </th>
                            )
                        }
                    </tr>
                    </thead>
                    <tbody>
                    {render}
                    </tbody>
                </Table>
            </div>
            <div className={cls.calendarListItem__item}>
                <div className={cls.calendarListItem__title}>
                    {data[0]?.month_name}
                    <div className={cls.calendarListItem__display}>
                        {
                            activeSwitch ? "select" : "single"
                        }
                        <Switch
                            activeSwitch={activeSwitch}
                            onChangeSwitch={setActiveSwitch}
                        />
                    </div>
                </div>
                <div className={cls.calendarListItem__container}>
                    {renderDays}
                </div>
                {
                    !activeSwitch ? <Button
                        onClick={() => onSubmit(singleId)}
                        extraClass={cls.calendarListItem__btn}
                    >
                        Submit
                    </Button> : null
                }
            </div>
        </div>
    )
})
