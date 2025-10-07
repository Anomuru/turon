import {fetchWeekDays, getSelectedWeekDay} from "entities/profile/groupProfile/index.js";
import {getBranch} from "features/branchSwitcher";
import React, {useEffect, useState} from 'react';

import cls from "./TimeTableTuronPage.module.sass"

import {
    AutoScrollActivator,
    DndContext,
    DragOverlay,
    MouseSensor,
    rectIntersection,
    TouchSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";


import {
    restrictToFirstScrollableAncestor, restrictToParentElement,
    restrictToVerticalAxis, restrictToWindowEdges
} from "@dnd-kit/modifiers";
import {Button} from "shared/ui/button";
import {useDispatch, useSelector} from "react-redux";
import {
    fetchTimeTableClassView, fetchTimeTableColors,
    fetchTimeTableData, fetchTimeTableStudents,
    fetchTimeTableSubject,
    fetchTimeTableTeacher,
    fetchTimeTableTypesData
} from "pages/timeTable/model/thunks/timeTableTuronThunks";
import {
    getTimeTableStudents,
    getTimeTableTuronClassViewData,
    getTimeTableTuronColor,
    getTimeTableTuronData, getTimeTableTuronDataStatus, getTimeTableTuronDate,
    getTimeTableTuronFilterClass, getTimeTableTuronFilterTeacher,
    getTimeTableTuronGroup, getTimeTableTuronGroupStatus,
    getTimeTableTuronHours, getTimeTableTuronIsDataStatus,
    getTimeTableTuronSubjects,
    getTimeTableTuronTeachers,
    getTimeTableTuronTeachersStatus,
    getTimeTableTuronType, getTimeTableTuronWeekDay
} from "pages/timeTable/model/selectors/timeTableTuronSelectors";
import {API_URL, headers, useHttp} from "shared/api/base";
import {DefaultLoader} from "shared/ui/defaultLoader";
import {onAddAlertOptions, onAddMultipleAlertOptions} from "features/alert/model/slice/alertSlice";
import TimeTableTuronPageFilters from "../TimeTableTuronPageFilters/TimeTableTuronPageFilters";
import {
    TimeTableDragItem,
    TimeTableDragItems,
    TimeTableDropContainer,
    TimeTableStudents
} from "entities/timeTableTuron";
import {DraggableContainer} from "entities/timeTableTuron/ui/DraggableContainer/DraggableContainer";
import {Modal} from "shared/ui/modal";
import {TimeTableFullScreen} from "entities/timeTableTuron/ui/TimeTableFullScreen/TimeTableFullScreen";
import {TimeTableClassView} from "entities/timeTableTuron/ui/TimeTableClassView/TimeTableClassView";
import {MiniLoader} from "shared/ui/miniLoader";
import {DynamicModuleLoader} from "shared/lib/components/DynamicModuleLoader/DynamicModuleLoader.jsx";
import {onRemoveStudents, timeTableTuronReducer} from "pages/timeTable/model/slice/timeTableTuronSlice.js";
import {fetchTeachersForSelect} from "entities/oftenUsed/index.js";
import {getUserBranchId} from "entities/profile/userProfile/index.js";
import {ConfirmModal} from "shared/ui/confirmModal/index.js";
import {getSelectedLocations} from "features/locations/index.js";



const rooms = [
    "1-xona", "2-xona", "3-xona", "koca", "oshxona"
]

const times = [
    {
        to: "7:00",
        from: "8:00"
    },
    {
        to: "8:00",
        from: "9:00"
    },
    {
        to: "9:00",
        from: "10:00"
    },
    {
        to: "10:00",
        from: "11:00"
    }
]

export const TimeTableTuronPage = () => {


    const [groups, setGroups] = useState([])

    const [subjects, setSubjects] = useState([])

    const [teachers, setTeachers] = useState([])


    const [startItem, setStartItem] = useState()
    const [isSelected, setIsSelected] = useState(false)
    const [selectedType, setSelectedType] = useState("")
    const [loading, setLoading] = useState(false)
    const [canDisabled, setCanDisabled] = useState(false)
    const [fullScreen, setFullScreen] = useState(false)
    const [classView, setClassView] = useState(false)
    const [selectedSubject, setSelectedSubject] = useState(null)
    const [selectedGroup, setSelectedGroup] = useState(null)
    const [selectedContainerTimeTableId, setSelectedContainerTimeTableId] = useState(null)
    const [canSubmitLesson, setCanSubmitLesson] = useState({})
    const [rooms, setRooms] = useState([])
    const [activeUpdate, setActiveUpdate] = useState(false)
    const [activeEvent, setActiveEvent] = useState({})
    const [isActiveCanSet, setIsActiveCanSet] = useState(false)
    const [activeCanSet, setActiveCanSet] = useState({})


    const color = useSelector(getTimeTableTuronColor)
    const type = useSelector(getTimeTableTuronType)
    const data = useSelector(getTimeTableTuronData)
    const dataStatus = useSelector(getTimeTableTuronDataStatus)
    const classViewData = useSelector(getTimeTableTuronClassViewData)
    const hours = useSelector(getTimeTableTuronHours)
    const groupsData = useSelector(getTimeTableTuronGroup)
    const groupsDataStatus = useSelector(getTimeTableTuronGroupStatus)
    const subjectsData = useSelector(getTimeTableTuronSubjects)
    const teachersData = useSelector(getTimeTableTuronTeachers)
    const teachersStatus = useSelector(getTimeTableTuronTeachersStatus)
    const filteredClass = useSelector(getTimeTableTuronFilterClass)
    const filteredTeacher = useSelector(getTimeTableTuronFilterTeacher)
    const date = useSelector(getTimeTableTuronDate)
    const weekDay = useSelector(getTimeTableTuronWeekDay)
    const currentWeekDay = useSelector(getSelectedWeekDay)
    const isDataStatus = useSelector(getTimeTableTuronIsDataStatus)
    const students = useSelector(getTimeTableStudents)


    const branch = useSelector(getUserBranchId)
    const selectedBranch = useSelector(getSelectedLocations);
    const branchForFilter = selectedBranch?.id;


    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchTimeTableColors())
        dispatch(fetchWeekDays())

    }, [])

    useEffect(() => {
        if (branchForFilter) {
            dispatch(fetchTeachersForSelect(branchForFilter))
        }
    }, [branchForFilter])

    useEffect(() => {
        if (isDataStatus === "week" && weekDay && branchForFilter) {
            dispatch(fetchTimeTableData({week: weekDay, branch: branchForFilter, teacher: filteredTeacher }))
        } else if (isDataStatus === "date" && date && branchForFilter) {
            dispatch(fetchTimeTableData({date, branch: branchForFilter, teacher: filteredTeacher}))
        }
    }, [isDataStatus, date, weekDay, branchForFilter, filteredTeacher])

    useEffect(() => {
        if (isDataStatus === "week" && weekDay && branchForFilter && classView) {
            dispatch(fetchTimeTableClassView({week: weekDay, branch: branchForFilter}))
        } else if (isDataStatus === "date" && date && branchForFilter && classView) {
            dispatch(fetchTimeTableClassView({date, branch: branchForFilter}))
        }
    }, [isDataStatus, data, weekDay, branchForFilter, classView])


    useEffect(() => {
        if (type && branchForFilter) dispatch(fetchTimeTableTypesData({type, branch: branchForFilter}))
    }, [type, branchForFilter])


    useEffect(() => {
        if (selectedGroup && selectedType !== "flow") {
            dispatch(fetchTimeTableSubject(selectedGroup))
        }

        if (selectedContainerTimeTableId) {
            dispatch(fetchTimeTableStudents({
                time_table_id: selectedContainerTimeTableId,
                // subject_id
            }))
        }


    }, [selectedGroup,selectedContainerTimeTableId,selectedType])


    useEffect(() => {
        if (!data?.length) return;
        setRooms(data)
    }, [data])


    useEffect(() => {
        // if (!groupsData.length) return;
        setGroups(groupsData)
    }, [groupsData])


    useEffect(() => {
        setSubjects(subjectsData)
    }, [subjectsData])


    useEffect(() => {
        setLoading(false)
        if (!teachersData?.length && teachersStatus === "success") {
            dispatch(onAddAlertOptions({
                type: "error",
                status: true,
                msg: "Bu fanda o'qituvchilar yo'q"
            }))
            setSelectedSubject(null)
        } else {
            setTeachers(teachersData)
        }

    }, [teachersData, teachersStatus])

    useEffect(() => {
        if (selectedSubject && branch) {
            setLoading(true)
            dispatch(fetchTimeTableTeacher({subject: selectedSubject, branch}))
        }
    }, [selectedSubject, branch])


    useEffect(() => {
        if (rooms.length && filteredClass && type) {
            setRooms(rooms => rooms.map(room => {
                const newLessons = room.lessons.map(item => {
                    const isItemGroup = !!item.group.id
                    if (isItemGroup) {
                        let isFilteredColor
                        if (type === "group") {
                            isFilteredColor = item.group.type === "group" ? item.group.id === +filteredClass : item.group.classes.includes(+filteredClass)

                        } else {
                            isFilteredColor = item.group.id === +filteredClass
                        }
                        return {
                            ...item,
                            isFilteredColor: isFilteredColor,
                        }
                    }
                    return item
                })

                return {
                    ...room,
                    lessons: newLessons,
                }
            }))
        }
    },[rooms.length,filteredClass,type])


    const onFilterStudentSubject = (id) => {
        dispatch(fetchTimeTableStudents({
            time_table_id: selectedContainerTimeTableId,
            subject_id: id,
            type: selectedType,
            group_flow: selectedGroup,
            date: date
        }))
    }


    const onDragStart = (e) => {
        const {active} = e;
        const activeTypeItem = active?.data?.current?.type
        setCanDisabled(true)
        if (activeTypeItem === "container") {
            onFalseSelected()

            const roomId = active.data.current.room
            setStartItem(rooms.filter(item => item.id === roomId)[0].lessons.filter(item => item.dndId === active.id)[0])
        } else if (activeTypeItem === "group") {
            setStartItem(groups.filter(item => item.dndId === active.id)[0])
        } else if (activeTypeItem === "subject") {
            setStartItem(subjects.filter(item => item.dndId === active.id)[0])
        } else {
            setStartItem(teachers.filter(item => item.dndId === active.id)[0])
        }
    }


    const {request} = useHttp()
    const canSet = async (hour, id, room, type, overItem) => {

        const data = {
            hour,
            date,
            checked_id: id,
            room,
            type
        }


        if (type === "subject") {
            data.group_id = overItem.group.id
        }

        setLoading(true)

        const res = await request(`${API_URL}SchoolTimeTable/can-set${type === "flow" ? "-flow" : ""}/?branch=${branch}`, "POST", JSON.stringify(data), headers())
            .then(res => {
                setLoading(false)


                if (type === "subject" && !res.status) {
                    setSelectedSubject(null)
                }

                dispatch(onAddMultipleAlertOptions(res.msg.map(item => ({
                    type: "error",
                    status: true,
                    msg: item
                }))))

                return res.status
            })

        return await res
    }


    const canChangeContainer = async (data) => {


        setLoading(true)

        const res = await request(`${API_URL}SchoolTimeTable/timetable-update-hours-rooms/?branch=${branch}`, "POST", JSON.stringify(data), headers())
            .then(res => {
                setLoading(false)

                dispatch(onAddMultipleAlertOptions(res.msg.map(item => ({
                    type: "error",
                    status: true,
                    msg: item
                }))))

                return res.status
            })

        return await res
    }


    async function handleDragEnd(event) {
        let curActive;
        let curOver;
        if (!!event) {
            let {active, over} = event;
            curActive = active
            curOver = over
        } else {
            let {active, over} = activeEvent;
            curActive = active
            curOver = over
        }


        if (!curOver || !curActive) return
        // if (over && over.data.current.accepts.includes(active.data.current.type)) {
        //     // do stuff
        // }


        const activeTypeItem = curActive?.data?.current?.type
        const activeItemRoom = curActive?.data?.current?.room
        const activeItemId = curActive.id

        const overItemId = curOver.id
        const overItemRoom = curOver?.data?.current?.room
        const overTypeItem = curOver?.data?.current?.type


        let isActiveItem


        if (activeTypeItem === "group" || activeTypeItem === "flow") {
            isActiveItem = groups.filter(item => item.dndId === activeItemId)[0]
        } else if (activeTypeItem === "subject") {
            isActiveItem = subjects.filter(item => item.dndId === activeItemId)[0]
            setSelectedSubject(isActiveItem.id)
        } else {
            isActiveItem = teachers.filter(item => item.dndId === activeItemId)[0]
            setSelectedSubject(null)
        }


        if (activeTypeItem === "container" && overTypeItem === "container") {
            const filteredActiveItem = rooms.filter(item => item.id === activeItemRoom)[0].lessons.filter(item => item.dndId === activeItemId)[0]

            const filteredOverItem = rooms.filter(item => item.id === overItemRoom)[0].lessons.filter(item => item.dndId === overItemId)[0]

            let checked
            if (filteredOverItem.group?.id) {


                checked = await canChangeContainer([
                    {
                        id: filteredActiveItem.id,
                        room: filteredOverItem.room,
                        hour: filteredOverItem.hours,
                        date
                    },
                    {
                        id: filteredOverItem.id,
                        room: filteredActiveItem.room,
                        hour: filteredActiveItem.hours,
                        date
                    }
                ])


            } else {
                checked = await canChangeContainer([
                    {
                        id: filteredActiveItem.id,
                        room: filteredOverItem.room,
                        hour: filteredOverItem.hours,
                        date
                    }
                ])

            }


            if (!checked) return;


            if (activeItemRoom !== overItemRoom) {
                setRooms(rooms => rooms.map(room => {


                    if (room.id === overItemRoom) {
                        const newLessons = room.lessons.map(item => {

                            if (item.dndId === overItemId) {
                                return {
                                    ...item,
                                    id: filteredActiveItem.id,
                                    group: filteredActiveItem?.group || {},
                                    subject: filteredActiveItem?.subject || {},
                                    teacher: filteredActiveItem?.teacher || {}
                                }
                            }

                            return item

                        })


                        return {
                            ...room,
                            lessons: newLessons
                        }
                    }

                    if (room.id === activeItemRoom) {
                        const newLessons = room.lessons.map(item => {
                            if (item.dndId === activeItemId) {
                                return {
                                    ...item,
                                    id: filteredOverItem?.id,
                                    group: filteredOverItem?.group,
                                    subject: filteredOverItem?.subject,
                                    teacher: filteredOverItem?.teacher
                                }
                            }
                            return item
                        })
                        return {
                            ...room,
                            lessons: newLessons
                        }
                    }

                    return room

                }))
            } else {
                setRooms(rooms => rooms.map(room => {
                    if (room.id === overItemRoom) {
                        const newLessons = room.lessons.map(item => {
                            if (item.dndId === overItemId) {
                                return {
                                    ...item,
                                    id: filteredActiveItem?.id,
                                    group: filteredActiveItem?.group || {},
                                    subject: filteredActiveItem?.subject || {},
                                    teacher: filteredActiveItem?.teacher || {}
                                }
                            } else if (item.dndId === activeItemId) {
                                return {
                                    ...item,
                                    id: filteredOverItem?.id,
                                    group: filteredOverItem?.group || {},
                                    subject: filteredOverItem?.subject || {},
                                    teacher: filteredOverItem?.teacher || {}
                                }
                            }
                            return item
                        })


                        return {
                            ...room,
                            lessons: newLessons
                        }
                    }

                    return room
                }))
            }


        } else {

            const filteredOverItem = rooms.filter(item => item.id === overItemRoom)[0].lessons.filter(item => item.dndId === overItemId)[0]


            let filteredActiveItem


            if (activeTypeItem === "group" || activeTypeItem === "flow") {
                filteredActiveItem = groups.filter(item => item.dndId === curActive.id)[0]
            } else if (activeTypeItem === "subject") {
                filteredActiveItem = subjects.filter(item => item.dndId === curActive.id)[0]
            } else {
                filteredActiveItem = teachers.filter(item => item.dndId === curActive.id)[0]
            }



            const checked = await canSet(filteredOverItem.hours, filteredActiveItem.id, filteredOverItem.room, activeTypeItem, filteredOverItem )


            if (!checked) return;


            await setRooms(rooms =>
                rooms.map(room => {
                    if (room.id === overItemRoom) {
                        const newLessons = room.lessons.map(container => {
                            if (container.dndId === curOver.id) {
                                if (container.items) {
                                    let have

                                    if (activeTypeItem === "group") {
                                        have = !!container.group.dndId
                                    } else if (activeTypeItem === "subject") {
                                        have = !!container.subject.dndId
                                    } else {
                                        have = !!container.teacher.dndId
                                    }


                                    if (!have) {

                                        if (activeTypeItem === "subject") {

                                            return {
                                                ...container,
                                                [activeTypeItem]: isActiveItem,
                                                teacher: {}
                                            }
                                        }

                                        if (activeTypeItem === "teacher") {
                                            setCanSubmitLesson({
                                                ...container,
                                                [activeTypeItem]: isActiveItem
                                            })

                                            return {
                                                ...container,
                                                [activeTypeItem]: isActiveItem
                                            }
                                        }

                                        return {
                                            ...container,
                                            [activeTypeItem]: isActiveItem
                                        }
                                    }
                                    return container
                                } else {
                                    if (activeTypeItem === "subject") {

                                        return {
                                            ...container,
                                            [activeTypeItem]: isActiveItem,
                                            teacher: {}
                                        }
                                    }

                                    if (activeTypeItem === "teacher") {
                                        setCanSubmitLesson({
                                            ...container,
                                            [activeTypeItem]: isActiveItem
                                        })

                                        return {
                                            ...container,
                                            [activeTypeItem]: isActiveItem
                                        }
                                    }
                                    if (activeTypeItem === "flow") {
                                        setCanSubmitLesson({
                                            ...container,
                                            id: null,
                                            group: isActiveItem,
                                            subject: isActiveItem.subject_info,
                                            teacher: isActiveItem.teacher_info
                                        })


                                        return {
                                            ...container,
                                            id: null,
                                            group: isActiveItem,
                                            subject: isActiveItem.subject_info,
                                            teacher: isActiveItem.teacher_info
                                        }
                                    }


                                    return {
                                        ...container,
                                        [activeTypeItem]: isActiveItem
                                    }
                                }
                            }
                            return container
                        })

                        return {
                            ...room,
                            lessons: newLessons
                        }
                    }
                    return room
                })
            )
        }
        setCanDisabled(false)
        setActiveUpdate(false)
        setActiveEvent({})
        if (isActiveCanSet) {
            setIsActiveCanSet(false)
        }
    }


    const onDoubleClickContainer = (roomId, id, type) => {

            setRooms(rooms => rooms.map(room => {
                if (room.id === roomId) {
                    const newLessons = room.lessons.map(item => {
                        if (item.dndId === id) {

                            setIsSelected(true)
                            setSelectedGroup(item.group.id)
                            setSelectedContainerTimeTableId(item.id)
                            setSelectedType(type)
                            setSelectedSubject(!item.teacher.id && item.subject.id ? item.subject.id : null)

                            return {
                                ...item,
                                isSelected: true,
                                isDisabled: false
                            }
                        }

                        return {
                            ...item,
                            isSelected: false,
                            isDisabled: true
                        }
                    })

                    return {
                        ...room,
                        lessons: newLessons
                    }
                } else {
                    const newLessons = room.lessons.map(item => {
                        return {
                            ...item,
                            isSelected: false,
                            isDisabled: true
                        }
                    })
                    return {
                        ...room,
                        lessons: newLessons
                    }
                }
            }))




    }


    const onFalseSelected = () => {
        setIsSelected(false)
        setSelectedSubject(null)
        setRooms(rooms => rooms.map(room => {
            const newLessons = room.lessons.map(item => {
                return {
                    ...item,
                    isSelected: false,
                    isDisabled: false
                }
            })
            return {
                ...room,
                lessons: newLessons
            }
        }))
        setSelectedSubject(null)
        setSelectedType(null)
        setSelectedContainerTimeTableId(null)
        dispatch(onRemoveStudents())
    }


    const onDeleteContainer = (room, dndId, id) => {
        setRooms(rooms => rooms.map(item => {
            if (item.id === room) {

                const newLessons = item.lessons.map(container => {
                    let {active: lastActive, over: lastOver} = activeCanSet;
                    if (lastOver?.data?.current?.room === room && lastOver?.id  === dndId) {
                        setActiveCanSet({})
                    }
                    if (container.dndId === dndId) {
                        if (container.id) {
                            request(`${API_URL}SchoolTimeTable/timetable-list-delete/${id}`, "DELETE", null, headers())
                                .then(res => {

                                })

                            setSelectedGroup(null)
                        }
                        return {
                            ...container,
                            id: null,
                            group: {},
                            subject: {},
                            teacher: {}
                        }
                    }
                    return container
                })


                return {
                    ...item,
                    lessons: newLessons
                }
            }
            return item
        }))
        setSelectedSubject(null)
        onFalseSelected()
    }


    useEffect(() => {
        if (Object.keys(canSubmitLesson)?.length) {




            let data = {
                lesson: canSubmitLesson?.id,
                [canSubmitLesson?.group.type]: canSubmitLesson.group.id,
                // group: canSubmitLesson.group.id,
                subject: canSubmitLesson?.subject?.id,
                hours: canSubmitLesson?.hours,
                teacher: canSubmitLesson?.teacher?.id,
                room: canSubmitLesson?.room,
                branch: branch,
                week: weekDay ?? currentWeekDay,
                date
            }

            if (canSubmitLesson?.group.type === "flow") {
                data.teacher = canSubmitLesson?.group?.teacher_info?.id
                data.subject = canSubmitLesson?.group?.subject_info?.id
            }

            request(`${API_URL}SchoolTimeTable/timetable-list-${canSubmitLesson?.id ? "update" : "create"}/${canSubmitLesson?.id ? canSubmitLesson?.id : ""}`, canSubmitLesson?.id ? "PATCH" : "POST", JSON.stringify(data), headers())
                .then(res => {
                    setRooms(rooms => rooms?.map(item => {
                        if (item.id === canSubmitLesson?.room) {
                            const newLessons = item?.lessons?.map(lesson => {
                                if (lesson?.dndId === canSubmitLesson?.dndId) {
                                    return {
                                        ...lesson,
                                        id: res?.lesson?.id
                                    }
                                }
                                return lesson

                            })

                            return {
                                ...item,
                                lessons: newLessons
                            }
                        }

                        return item
                    }))

                    if (canSubmitLesson?.group.type !== "flow") {
                        dispatch(fetchTimeTableSubject(canSubmitLesson.group.id))
                    }
                })
                .then(() => {
                    setCanSubmitLesson({})
                })



        }
    }, [canSubmitLesson])

    const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

    return (

            <div className={cls.timeTable}>
                {
                    !isSelected ?
                        <TimeTableTuronPageFilters
                            setIsSelected={setIsSelected}
                            isSelected={isSelected}
                            setFullScreen={setFullScreen}
                            setClassView={setClassView}
                            groups={groups}
                        /> : null
                }


                {isSelected && <Button type={"danger"} onClick={onFalseSelected}>Remove Selected</Button>}

                {loading && <DefaultLoader/>}


                <DndContext
                    sensors={sensors}
                    collisionDetection={rectIntersection}
                    onDragStart={onDragStart}
                    onDragEnd={(event)=> {
                        const {over, active} = event
                        if (active?.data?.current?.type === "container" && over?.data?.current?.type === "container") {
                            setActiveUpdate(true)
                            setActiveEvent(event)
                        } else {
                            let {active, over} = event
                            let {active: lastActive, over: lastOver} = activeCanSet;
                            if (lastActive && lastActive?.id !== active?.id && lastOver?.id === over?.id) {
                                setIsActiveCanSet(true)
                                setActiveEvent(event)
                            } else {
                                setActiveCanSet(event)
                                handleDragEnd(event)
                            }
                        }
                    }}
                    // modifiers={[restrictToFirstScrollableAncestor]}
                >
                    <TimeTableDragItems
                        setSelectedSubject={setSelectedSubject}
                        selectedSubject={selectedSubject}
                        isSelected={isSelected}
                        groups={groups}
                        subjects={subjects}
                        teachers={teachers}
                        color={color}
                        type={type}
                        status={groupsDataStatus}
                        selectedType={selectedType}
                        onFilterStudentSubject={onFilterStudentSubject}
                    />
                    <div className={cls.wrapper}>
                        {
                            dataStatus === true ?
                                <MiniLoader/>
                                :
                                <TimeTableDropContainer
                                    onDoubleClickContainer={onDoubleClickContainer}
                                    onDeleteContainer={onDeleteContainer}
                                    rooms={rooms}
                                    times={times}
                                    hours={hours}
                                    canDisabled={canDisabled}
                                    startItem={startItem}
                                    // containers={containers}
                                />
                        }

                        {students.length > 0 &&<TimeTableStudents students={students}/>}
                    </div>


                    <DragOverlay>
                        {
                            startItem?.room ?
                                <DraggableContainer type={"overlay"} item={startItem}/> :
                                startItem?.type === "teacher" ?
                                    <TimeTableDragItem
                                        item={startItem}
                                    >
                                        {startItem.name} {startItem.surname}
                                    </TimeTableDragItem>
                                    : startItem?.dndId ?
                                        <TimeTableDragItem
                                            item={startItem}
                                            color={startItem?.color?.value}
                                        >
                                            {startItem.class_name || startItem.name}
                                        </TimeTableDragItem>
                                        : null
                        }
                    </DragOverlay>
                </DndContext>





                <Modal active={fullScreen} setActive={setFullScreen} type={"other"}>




                    <TimeTableFullScreen
                        rooms={rooms}
                        times={times}
                        hours={hours}
                    />


                </Modal>

                <Modal active={classView} setActive={setClassView} type={"other"}>


                    <TimeTableClassView
                        lessons={classViewData}
                        hours={hours}
                    />


                    {/*<TimeTableFullScreen*/}
                    {/*    rooms={rooms}*/}
                    {/*    times={times}*/}
                    {/*    hours={hours}*/}
                    {/*/>*/}


                </Modal>

                <ConfirmModal
                    setActive={setActiveUpdate}
                    active={activeUpdate}
                    title={"Rostanham o'zgartirmoqchimisiz"}
                    type={"success"}
                    onClick={() => handleDragEnd(false)}
                />

                <ConfirmModal
                    setActive={setIsActiveCanSet}
                    active={isActiveCanSet}
                    title={"Rostanham o'zgartirmoqchimisiz"}
                    type={"success"}
                    onClick={() => handleDragEnd(false)}
                />

            </div>
    );
};

