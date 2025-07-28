import React from 'react';
import {Droppable} from "shared/ui/droppable";


import cls from "./TimeTableDropConatiner.module.sass"
import classNames from "classnames";
import {DraggableContainer} from "entities/timeTableTuron/ui/DraggableContainer/DraggableContainer";


export const TimeTableDropContainer = (props) => {

    const {rooms, hours, onDoubleClickContainer, onDeleteContainer} = props


    const renderContainers = (containers) => {


        return containers.map(item => {


            return (
                <Container
                    onDoubleClickContainer={onDoubleClickContainer}
                    onDelete={onDeleteContainer}
                    item={item}
                />
            )


        })
    }


    return (
        <div
            className={cls.tableTuron}
        >
            <div className={cls.wrapper}>
                <div className={cls.header}>
                    {
                        hours.map(item => {
                            return (
                                <div className={cls.item}>
                                    {item.start_time}-{item.end_time}
                                </div>
                            )
                        })
                    }
                </div>
                <div className={cls.footer}>
                    {
                        rooms.map(item => {
                            return (
                                <div className={cls.rooms}>
                                    <div className={cls.room}>

                                        {item.name}

                                    </div>
                                    <div className={cls.containers}>
                                        {renderContainers(item.lessons)}
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    );
};


const Container = (props) => {


    const {item, onDoubleClickContainer, onDelete} = props


    const overStyle = {background: "green", border: '2px solid black'}


    const onDoubleClick = () => {
        if (!item.group.name ) return;
        if (item.group.type === "flow") return;

        onDoubleClickContainer(item.room, item.dndId)
    }



    return (
        <Droppable
            data={{
                room: item.room,
                type: "container"
            }}
            id={item.dndId}
            disabled={item.isDisabled}
            extraClass={cls.droppableContainer}
            overStyle={overStyle}
        >

            {
                !!item.group.name &&
                <DraggableContainer onDelete={onDelete} onDoubleClick={onDoubleClick} item={item}/>
            }

        </Droppable>
    )
}



