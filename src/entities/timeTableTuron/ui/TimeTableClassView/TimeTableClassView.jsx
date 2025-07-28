import React, {useCallback, useEffect, useState} from 'react';
import {Droppable} from "shared/ui/droppable";


import cls from "./TimeTableClassView.module.sass"

import {TransformComponent, TransformWrapper} from "react-zoom-pan-pinch";
import {DraggableContainer} from "entities/timeTableTuron/ui/DraggableContainer/DraggableContainer";
import classNames from "classnames";
import {useDispatch, useSelector} from "react-redux";
import {Button} from "shared/ui/button";

function hexToBrightness(hex) {
    // Remove the hash at the start if it's there
    hex = hex.replace(/^#/, '');

    // Parse the r, g, b values
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    // Calculate brightness using the formula:
    // Brightness = (0.299 * R + 0.587 * G + 0.114 * B)
    return (0.299 * r + 0.587 * g + 0.114 * b);
}

export const TimeTableClassView = (props) => {

    const {lessons, hours} = props

    const [renderedFlows, setRenderedFlows] = useState([])
    const [isFlows, setIsFLows] = useState(false)


    useEffect(() => {
        if (lessons?.length) {
            const flows = []
            for (let i = 0; i < lessons.length; i++) {
                const containerLessons = lessons[i]
                for (let m = 0; m < containerLessons.lessons.length; m++) {
                    const item = containerLessons.lessons[m]
                    if (item.is_flow) {
                        if (!flows.some(flow => flow.flow === item.group.id)) {
                            flows.push({
                                group: containerLessons.id,
                                flow: item.group.id
                            })
                        }
                    }
                }
            }
            setRenderedFlows(flows)
            setIsFLows(true)
        }
    }, [lessons])


    const renderContainers = useCallback((containers, parentId) => {
        if (isFlows && containers.length) {

            return containers.map(item => {


                if (item.is_flow) {


                    return (
                        <Container
                            isFlow={true}
                            canRender={renderedFlows.some(flow => flow.flow === item.group.id && flow.group === parentId)}
                            renderedFlows={renderedFlows}
                            setRenderedFlows={setRenderedFlows}
                            item={item}
                        />
                    )

                }


                return (
                    <Container
                        renderedFlows={renderedFlows}
                        setRenderedFlows={setRenderedFlows}
                        item={item}
                    />
                )


            })
        }

    }, [isFlows])


    const [scale, setScale] = useState()

    function handleScaleChange(event) {
        setScale(event.instance.transformState.scale);
    }


    console.log(lessons, "lessons")

    return (
        <div
            className={cls.fullscreen}
        >

            <TransformWrapper
                onTransformed={(e) => handleScaleChange(e)}
                initialScale={0.6}
                doubleClick={{disabled: true}}
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
                    <TransformComponent wrapperStyle={{width: '100%', height: "100%"}}>

                        <div className={cls.header}>
                            {
                                hours?.map(item => {
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
                                lessons?.map(item => {
                                    return (
                                        <div className={cls.rooms}>
                                            <div className={cls.room} style={{
                                                backgroundColor: `${item.color}`,
                                                color: hexToBrightness(item.color) > 125 ? "black" : "white"
                                            }}>
                                                <span style={{transform: `scale(${1 / scale})`}}>
                                                    {item.name}
                                                </span>
                                            </div>
                                            <div className={cls.containers}>
                                                {renderContainers(item.lessons, item.id)}
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


    const {item, isFlow, canRender} = props

    const style = isFlow && {height: item.group.classes.length * 70 + "px", position: "absolute", zIndex: 20}


    if (isFlow && !canRender) {
        return (
            <div
                className={cls.droppableContainer}
            ></div>
        )
    }

    return (
        <div
            className={cls.droppableContainer}
        >
            {
                !!item.group.name &&
                <div
                    style={style}
                    className={classNames(cls.draggableContainer, {
                        [cls.isFlow]: isFlow
                    })}
                >
                    <h1> {isFlow ? item.group.name : item.room.name}</h1>
                    {
                        !!item?.subject?.name ?
                            <div className={cls.info}>
                                <span>{item.subject.name}</span>
                                {
                                    !!item?.teacher?.name &&
                                    <span>{item.teacher?.name} {item?.teacher?.surname}</span>
                                }
                            </div> : null
                    }
                </div>
            }
        </div>
    )
}



