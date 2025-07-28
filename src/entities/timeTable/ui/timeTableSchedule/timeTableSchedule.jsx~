import {memo, useCallback, useEffect, useState} from 'react';
import classNames from "classnames";

import {Table} from "shared/ui/table";
import {Droppable} from "shared/ui/droppable";

import cls from "./timeTableSchedule.module.sass";
import {DndContext} from "@dnd-kit/core";
import {Draggable} from "../../../../shared/ui/draggable";
import {logDOM} from "@testing-library/react";


const timesData = [
    {
        startTime: "14:50",
        endTime: "15:35"
    },
    {
        startTime: "14:50",
        endTime: "15:35"
    },
    {
        startTime: "14:50",
        endTime: "15:35"
    },
    {
        startTime: "14:50",
        endTime: "15:35"
    },
    {
        startTime: "14:50",
        endTime: "15:35"
    },
    {
        startTime: "14:50",
        endTime: "15:35"
    },
    {
        startTime: "14:50",
        endTime: "15:35"
    }
]

export const TimeTableSchedule = memo((props) => {

    const {
        subjectData,
        activeDrop,
        uid,
        data,
        index,
        onSubmit,
        onDelete,
        classId,
        userBranchId
    } = props

    const [currentData, setCurrentData] = useState([])

    useEffect(() => {
        setCurrentData(

            data?.time_tables.map((item, iI) => ({
                    weekday: {
                        name: item.weekday.name,
                        id: item.weekday.id,
                        lessons: item.weekday.lessons.map((i, ii) => {
                            let newID = uid + ((item.weekday.id + (ii + 1)) * (i.hour.id + (iI + 1)))
                            return {
                                id: i.id,
                                hour: i.hour,
                                status: i.status,
                                uid: newID,
                                // subject: i.subject,
                                // room: i.room,
                                // teacher: i.teacher,
                                subject: {
                                    id: i?.subject?.id,
                                    name: i?.subject?.name,
                                    itemUID: i?.subject?.id ? newID + "subject" : null
                                },
                                room: {
                                    id: i?.room?.id,
                                    name: i?.room?.name,
                                    itemUID: i?.room?.id ? newID + "room" : null
                                },
                                teacher: {
                                    id: i?.teacher?.id,
                                    name: i?.teacher?.name,
                                    surname: i?.teacher?.surname,
                                    itemUID: i?.teacher?.id ? newID + "teacher" : null
                                }
                            }
                        })
                    }
                })
            ))
    }, [data])


    useEffect(() => {
        if (subjectData && currentData?.length) {
            setCurrentData(
                currentData.map(item => ({
                        weekday: {
                            name: item.weekday.name,
                            id: item.weekday.id,
                            lessons: item.weekday.lessons.map(i => {
                                if (i.uid === activeDrop) {
                                    return {
                                        hour: i.hour,
                                        status: i.status,
                                        uid: i.uid,
                                        subject: subjectData.value === "subject" ?
                                            subjectData : i.subject,
                                        teacher: subjectData.value === "teacher" ?
                                            subjectData : i.teacher,
                                        room: subjectData.value === "room" ?
                                            subjectData : i.room
                                    }
                                } else return i
                            })
                        }
                    })
                )
            )
        }
    }, [data, activeDrop, subjectData])


    useEffect(() => {
        if (activeDrop) {
            let filtered;
            let filteredDay;
            currentData.filter(item =>
                item.weekday.lessons.map(i => {
                    if (i.uid === activeDrop) {
                        filtered = i
                        filteredDay = item.weekday.id
                    }
                })
            )
            if (filtered?.room.id && filtered?.teacher.id && filtered?.subject.id)
                onSubmit({
                    group: classId,
                    week: filteredDay,
                    room: filtered?.room?.id,
                    hours: filtered?.hour?.id,
                    branch: userBranchId,
                    teacher: filtered?.teacher?.id,
                    subject: filtered?.subject?.id
                })
        }
    }, [activeDrop, currentData])

    const renderData = useCallback(() => {
        return currentData?.map((item, iI) => {
            let status;
            const renderItem = (
                <tr>
                    <td style={{padding: "3rem 1.5rem"}}>{item?.weekday?.name?.slice(0, 3)}</td>
                    {
                        item?.weekday?.lessons?.map((i, index) => {
                            status = i.status
                            return (
                                <td className={cls.days__item}>
                                    <Droppable
                                        id={i.uid}
                                        key={i.uid}
                                    >
                                        {
                                            i.subject?.name ?
                                                <Draggable id={i.subject.itemUID}>
                                                    <p
                                                        className={classNames(cls.subject, {
                                                            [cls.notActive]: !i.subject?.name
                                                        })}
                                                    >
                                                        {i?.subject?.name}
                                                    </p>
                                                </Draggable>
                                                :
                                                <p
                                                    className={classNames(cls.subject, {
                                                        [cls.notActive]: !i.subject?.name
                                                    })}
                                                >
                                                    {i?.subject?.name}
                                                </p>
                                        }
                                        {
                                            i.teacher?.name ?
                                                <Draggable id={i.teacher.itemUID}>
                                                    <p
                                                        className={classNames(cls.teacher, {
                                                            [cls.notActive]: !i.teacher?.name
                                                        })}
                                                    >
                                                        <span>
                                                            {i?.teacher?.name}
                                                        </span>
                                                        <span>
                                                            {i?.teacher?.surname}
                                                        </span>
                                                    </p>
                                                </Draggable>
                                                :
                                                <p
                                                    className={classNames(cls.teacher, {
                                                        [cls.notActive]: !i.teacher?.name
                                                    })}
                                                >
                                                    <span>
                                                        {i?.teacher?.name}
                                                    </span>
                                                    <span>
                                                        {i?.teacher?.surname}
                                                    </span>
                                                </p>
                                        }
                                        {
                                            i.room?.name ?
                                                <Draggable id={i.room.itemUID}>
                                                    <p
                                                        className={classNames(cls.room, {
                                                            [cls.notActive]: !i.room?.name
                                                        })}
                                                    >
                                                        {i?.room?.name}
                                                    </p>
                                                </Draggable>
                                                :
                                                <p
                                                    className={classNames(cls.room, {
                                                        [cls.notActive]: !i.room?.name
                                                    })}
                                                >
                                                    {i?.room?.name}
                                                </p>
                                        }
                                    </Droppable>
                                </td>
                            )
                        })
                    }
                </tr>
            )
            return (
                // status ? <DndContext onDragEnd={handleDragEndInner}>
                //     {renderItem}
                // </DndContext> : renderItem
                <DndContext onDragEnd={handleDragEndInner}>
                    {renderItem}
                </DndContext>
            )
        })
    }, [currentData, uid])

    const render = renderData()

    function handleDragEndInner(event) {
        const {active, over} = event;
        currentData.map(item => {
            item.weekday.lessons.map(i => {
                if (active.id.includes("subject")) {
                    if (i.uid === active.id.slice(0, i.uid.length) && i.uid !== over.id) {
                        onDelete({id: i.id, res: {item_type: "subject"}})
                    }
                } else if (active.id.includes("room")) {
                    if (i.uid === active.id.slice(0, i.uid.length) && i.uid !== over.id) {
                        onDelete({id: i.id, res: {item_type: "room"}})
                    }
                } else {
                    if (i.uid === active.id.slice(0, i.uid.length) && i.uid !== over.id) {
                        onDelete({id: i.id, res: {item_type: "teacher"}})
                    }
                }
            })
        })
        // setActiveDrag(active?.id)
        // setActiveDrop(over?.id)

    }

    return (
        <div className={cls.schedule}>
            <Table extraClass={cls.schedule__inner}>
                <thead>
                <tr>
                    <th/>
                    {
                        data?.hours_list?.map((item, i) =>
                            <th>
                                <p className={cls.index}>{i + 1}</p>
                                <div className={cls.schedule__time}>
                                    <p>
                                        {item?.start_time.slice(0, 5)}
                                    </p>
                                    -
                                    <p>
                                        {item?.end_time.slice(0, 5)}
                                    </p>
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
    )
})
