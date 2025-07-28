import React, {useCallback} from 'react';


import cls from "./TimeTableDragItems.module.sass"
import {TimeTableDragItem} from "entities/timeTableTuron/ui/TimeTableDragItem/TimeTableDragItem";

import {Button} from "shared/ui/button";
import {MiniLoader} from "shared/ui/miniLoader";


export const TimeTableDragItems = (props) => {

    const {groups, isSelected, subjects, teachers, selectedSubject,color,setSelectedSubject,type,status} = props



    const filteredColors = () => {
        return groups?.filter(item => {
            if (item.type === "group") return item?.color?.id === +color
            return true
        })
    }



    const renderItems = useCallback(() => {
        if (!isSelected) {
            if (!groups.length) {
                return <h1 style={{color: 'red'}}>{type} yoq</h1>
            }
            return filteredColors()?.map(item => {
                return <TimeTableDragItem color={item.type === "group" ? item?.color?.value : ""} typeItem={type} item={item}>
                    <p style={{ textAlign: "center"}}>{item?.class_name || item?.name}</p>
                    <p style={{ textAlign: "center"}}>
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
        } else if (!selectedSubject) {
            if (!subjects?.length ) {
                return <h1 style={{color: 'red'}}>Fanlar yoq</h1>
            }

            return subjects.map(item => {
                return <TimeTableDragItem type={"subject"} item={item}>{item?.name} - {item.hours}</TimeTableDragItem>
            })
        } else {



            return teachers.map(item => {
                return <TimeTableDragItem type={"teacher"} item={item}>{item?.name} {item?.surname}</TimeTableDragItem>
            })
        }
    }, [isSelected,selectedSubject,groups,teachers,color,subjects])



    if (status === "loading") {
        return <MiniLoader/>
    }
    return (
        <div className={cls.dragItems}>
            {selectedSubject && <Button type={"danger"} onClick={() => setSelectedSubject(null)}>Fanlar</Button>}
            {renderItems()}
        </div>
    );
};

