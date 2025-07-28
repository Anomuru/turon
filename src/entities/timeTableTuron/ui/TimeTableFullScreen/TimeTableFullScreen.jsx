import React, {useState} from 'react';
import {Droppable} from "shared/ui/droppable";


import cls from "./TimeTableFullScreen.module.sass"
import {Draggable} from "shared/ui/draggable";
import classNames from "classnames";
import {DraggableContainer} from "entities/timeTableTuron/ui/DraggableContainer/DraggableContainer";
import {TransformComponent, TransformWrapper, useTransformEffect} from "react-zoom-pan-pinch";
import {useSelector} from "react-redux";
import {DragOverlay} from "@dnd-kit/core";
import {TimeTableDragItem} from "entities/timeTableTuron/ui/TimeTableDragItem/TimeTableDragItem";
import {restrictToWindowEdges} from "@dnd-kit/modifiers";
import {createPortal} from "react-dom";

export const TimeTableFullScreen = (props) => {

    const {rooms, hours} = props


    const renderContainers = (containers) => {


        return containers.map(item => {


            return (
                <Container
                    item={item}
                />
            )


        })
    }
    const [scale, setScale] = useState()

    function handleScaleChange(event) {
        setScale(event.instance.transformState.scale);
    }


    return (
        <div
            className={cls.fullscreen}
        >

            <TransformWrapper
                onTransformed={(e) => handleScaleChange(e)}
                initialScale={1}
                // pinch={{number: 5}}
                doubleClick={{disabled: true}}
                // centerOnInit={true}
                minScale={0.2}
                maxScale={5}
                panning={{
                    activationKeys: [],
                    excluded: [],
                }}
                pinch={{
                    excluded: []
                }}
            >

                <div className={cls.wrapper}>
                    <TransformComponent  wrapperStyle={{width: '100%', height: "100%"}} >

                        <div className={cls.header}>
                            {
                                hours.map(item => {
                                    return (
                                        <div className={cls.item}>
                                            <span style={{transform: `scale(${1 / scale})`}}>
                                                {item.start_time}-{item.end_time}
                                            </span>

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
                                                <span style={{transform: `scale(${1 / scale})`}}>
                                                    {item.name}
                                                </span>
                                            </div>
                                            <div className={cls.containers}>
                                                {renderContainers(item.lessons)}
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>


                    </TransformComponent>
                </div>
            </TransformWrapper>


        </div>
    );
};


const Container = (props) => {


    const {item} = props


    return (
        <div
            className={cls.droppableContainer}
        >

            {
                !!item.group.name &&
                <DraggableContainer canChange={false}  item={item}/>
            }

        </div>
    )
}



