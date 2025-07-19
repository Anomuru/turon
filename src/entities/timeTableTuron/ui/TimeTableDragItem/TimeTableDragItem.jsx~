import React from 'react';
import {Draggable} from "shared/ui/draggable";
import btnGennis from "app/styles/abstracts/_variables.sass"



import cls from "./TimeTableDragItem.module.sass"


export const TimeTableDragItem = (props) => {


    const {item,children,color,typeItem , } = props



    return (
        <Draggable
            data={{
                type: item.type
            }}
            id={item.dndId}
            extraClass={cls.dnd}
        >


            <div className={cls.class}  style={{backgroundColor: color || item?.teacher?.color,  fontSize : typeItem === "flow" ? "1.2rem" : null}}>
                {children}
            </div>
        </Draggable>
    )
};
