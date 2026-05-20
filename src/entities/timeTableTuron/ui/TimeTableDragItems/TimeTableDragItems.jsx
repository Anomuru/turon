import React, {useState} from 'react';


import cls from "./TimeTableDragItems.module.sass"
import {TimeTableDragItem} from "entities/timeTableTuron/ui/TimeTableDragItem/TimeTableDragItem";

import {Button} from "shared/ui/button";
import {MiniLoader} from "shared/ui/miniLoader";
import Grip from "shared/assets/icons/grip-vertical-solid.svg";


export const TimeTableDragItems = (props) => {

    const {
        groups,
        flowSearch,
        isSelected,
        subjects,
        teachers,
        selectedSubject,
        color,
        setSelectedSubject,
        type,
        status,
        selectedType,
        onFilterStudentSubject
    } = props

    const [selectedItem, setSelectedItem] = useState(null)


    const filteredColors = () => {
        return groups?.filter(item => {
            if (item.type === "group") return item?.color?.id === +color
            return true
        })
    }

    const filteredFlows = () => {
        const search = flowSearch?.trim()?.toLowerCase()

        if (type !== "flow" || !search) {
            return filteredColors()
        }

        return filteredColors()?.filter(item => {
            const flowName = item?.name || ""
            const teacherName = item?.teacher_info?.name || ""
            const teacherSurname = item?.teacher_info?.surname || ""
            const fullTeacherName = `${teacherName} ${teacherSurname}`

            return [flowName, teacherName, teacherSurname, fullTeacherName]
                .some(value => value.toLowerCase().includes(search))
        })
    }


    const renderItems = () => {
        if (!isSelected || selectedType === "flow") {
            if (!groups?.length) {
                return <h1 style={{color: 'red'}}>{type} yoq</h1>
            }
            return filteredFlows()?.map(item => {
                return <TimeTableDragItem  color={item.type === "group" ? item?.color?.value : ""} typeItem={type}
                                          item={item}>
                    <p style={{textAlign: "center"}}>{item?.class_name || item?.name}</p>
                    <p style={{textAlign: "center"}}>
                        {
                            type === "flow" &&
                            <>

                                {item?.subject_info?.name}
                                <br/>
                                {item.teacher_info?.name} -
                                {item.teacher_info?.surname}
                            </>
                        }
                    </p>

                </TimeTableDragItem>
            })
        } else if (!selectedSubject && selectedType === "group") {
            if (!subjects?.length) {
                return <h1 style={{color: 'red'}}>Fanlar yoq</h1>
            }

            return subjects.map(item => {
                return (
                        <TimeTableDragItem
                            active={selectedItem === item.id}
                            onClick={() => {
                                onFilterStudentSubject(item.id)
                                setSelectedItem(item.id)
                            }}
                            grip type={"subject"}
                            item={item}
                        >
                            {item?.name} - {item.hours}
                        </TimeTableDragItem>
                    )
            })
        } else {


            return teachers.map(item => {
                return <TimeTableDragItem type={"teacher"} item={item}>{item?.name} {item?.surname}</TimeTableDragItem>
            })
        }
    }


    if (status === true) {
        return <MiniLoader/>
    }
    return (
        <div className={cls.dragItems}>
            {selectedSubject && <Button type={"danger"} onClick={() => setSelectedSubject(null)}>Fanlar</Button>}
            {renderItems()}
        </div>
    );
};
