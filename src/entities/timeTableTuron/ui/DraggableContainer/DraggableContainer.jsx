import cls from "./DraggableContainer.module.sass";
import React, {useState} from "react";
import {useDraggable} from "@dnd-kit/core";
import {CSS} from "@dnd-kit/utilities";


import Grip from "shared/assets/icons/grip-vertical-solid.svg"
import classNames from "classnames";
import {ConfirmModal} from "shared/ui/confirmModal/index.js";
import {useNavigate} from "react-router";


export const DraggableContainer = (props) => {

    const [isDelete, setIsDelete] = useState(false)


    const {item, type, onDoubleClick, onDelete, canChange = true} = props

    const {attributes, listeners, setNodeRef, transform, isDragging} = useDraggable({
        id: item.dndId,

        data: {
            type: 'container',
            room: item.room
        }
    });


    const style = type === "overlay" ? {border: '1px solid black'} : null

    const newStyle = isDragging
        ? {
            transform: CSS.Translate.toString(transform),
            opacity: "0",
            backgroundColor: item?.isFilteredColor ? "red" : item.group?.color?.value || null,
            ...style
        }
        : {
            backgroundColor:  item?.isFilteredColor ? "#642626" : item.group?.color?.value || null,
            ...style
        };

    const navigate = useNavigate()

    // const navigate = useNavigate()
    return (
        <div
            // onClick={() => navigate(`observe/${item.id}`)}
            style={newStyle}
            className={classNames(cls.draggableContainer, {
                [cls.selected]: item.isSelected
            })}
            {...attributes}
            ref={setNodeRef}
            onDoubleClick={canChange ? onDoubleClick : null}
        >
            {
                canChange &&
                <>
                    {
                        !!item?.teacher?.name &&
                        <img src={Grip} alt="grip" {...listeners} className={cls.handle} />
                    }
                    <i
                        onClick={() => navigate(`observe/${item.id}`)}
                        className={"fa fa-list-ul"}
                        style={{fontSize: "1.4rem" , color: "white" , position: "absolute" , right: "6px" , bottom: "5px"}}
                         // className={cls.handle}
                    />
                    <i
                        onClick={() => {
                            if (item.id) {
                                setIsDelete(true)
                            } else {
                                onDelete(item.room, item.dndId, item.id)
                            }
                        }}
                        className={classNames("fa-solid  fa-times", cls.trash, {
                            [cls.isNotTeacher]: !item?.teacher?.name
                        })}
                    >

                    </i>

                </>
            }

            <h1>{item.group?.class_name || item.group?.name}</h1>
            {
                !!item?.subject?.name &&
                <div className={cls.info}>
                    <span>{item.subject.name}</span>
                    {
                        !!item?.teacher?.name &&
                        <span>{item.teacher?.name} {item?.teacher?.surname}</span>
                    }
                </div>
            }
            <ConfirmModal
                active={isDelete}
                setActive={setIsDelete}
                onClick={() => onDelete(item.room, item.dndId, item.id)}
                type={"danger"}
            />

        </div>
    )
}

