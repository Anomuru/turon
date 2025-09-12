import React from 'react';
import {Draggable} from "shared/ui/draggable";


import cls from "./TimeTableDragItem.module.sass"
import Grip from "shared/assets/icons/grip-vertical-solid.svg";


export const TimeTableDragItem = (props) => {


    const {item, children, color, typeItem, grip, onClick, active} = props


    return (
        <Draggable
            data={{
                type: item?.type
            }}
            id={item.dndId}
            extraClass={cls.dnd}
            grip={grip}

        >


            <div
                className={cls.class}
                onClick={onClick}
                style={{
                    backgroundColor: color || item?.teacher?.color,
                    fontSize: typeItem === "flow" ? "1.2rem" : null,
                    border: active ? "2px solid red" : null
                }}
            >
                {children}
            </div>

        </Draggable>
    )
};
