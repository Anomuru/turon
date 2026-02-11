import classNames from "classnames";
import React, {memo, useContext, useEffect, useRef, useState} from 'react';

import cls from "./schoolHomeExtracurricus.module.sass";
import robot from "shared/assets/images/turonRobot.png";
import {HomeContext} from "../../../../shared/lib/context/homeContext";

const list = [1,2,3,4,5,6,7,8]

export const SchoolHomeExtracurricus = memo(() => {
    const {setSectionTop} = useContext(HomeContext)

    const sectionRef = useRef()

    useEffect(() => {
        setSectionTop(cur => ({...cur, extra_curricular: sectionRef?.current?.offsetTop}))
    }, [setSectionTop])

    const [activeItem, setActiveItem] = useState(null)

    const renderItems = () => {
        return list.map(item => {
            return (
                <div
                    onClick={() => setActiveItem(prev =>
                        item === prev ? null : item
                    )}
                    className={classNames(cls.item, {
                        [cls.active]: activeItem === item
                    })}
                >
                    <img
                        className={cls.item__image}
                        src={robot}
                        alt=""
                    />
                    <h2
                        className={classNames(cls.item__title, {
                            [cls.active]: activeItem === item
                        })}
                    >
                        Robotics
                    </h2>
                    <p className={cls.item__text}>
                        Robotics is an interdisciplinary branch of
                        {/*<br/>*/}
                        electronics and communication, computer
                        {/*<br/>*/}
                        science and engineering...
                    </p>
                </div>
            )
        })
    }

    const render = renderItems()

    return (
        <div ref={sectionRef} className={cls.extracurricus}>
            <h2 className={cls.extracurricus__title}>Extracurricular</h2>
            <div className={cls.extracurricus__container}>
                {render}
            </div>
        </div>
    )
})
