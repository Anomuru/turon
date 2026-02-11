import {useDraggable} from "@dnd-kit/core";
import {CSS} from "@dnd-kit/utilities";
import Grip from "shared/assets/icons/grip-vertical-solid.svg";
import cls from "entities/timeTableTuron/ui/TimeTableDragItems/TimeTableDragItems.module.sass";
import React from "react";

export function Draggable({id, children, extraClass,data,style,grip}) {
    const {attributes, listeners, setNodeRef, transform} = useDraggable({
        id: id,
        data
    });


    const newStyle = transform
        ? {
            transform: CSS.Translate.toString(transform),
            ...style
        }
        : style;
    const containerBind = grip ? {} : { ...listeners, ...attributes };
    const handleBind    = grip ? { ...listeners, ...attributes } : {};

    return (
        <div
            ref={setNodeRef}
            className={extraClass}
            style={newStyle}
            {...containerBind}
        >
            {children}

            {grip && (
                <img
                    style={{cursor: "grab"}}
                    src={Grip}
                    alt="grip"
                    className={cls.handle}
                    {...handleBind}
                />
            )}
        </div>
    );
}