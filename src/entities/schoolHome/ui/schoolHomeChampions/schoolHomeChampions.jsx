import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import {motion} from "framer-motion";

import {HomeContext} from "shared/lib/context/homeContext";

import cls from "./schoolHomeChampions.module.sass";
import image from "shared/assets/images/championImage.png";
import ratingStar from 'shared/assets/icons/rate.svg'

const list = [
    {
        span: "Expert instruction",
        title: "Watch our Courses",
        text: "We focus on ergonomics and meeting\n you where you work. It's only a\n keystroke away.",
        rate: 4.9,
        image: image
    },{
        span: "Expert instruction",
        title: "Watch our Courses",
        text: "We focus on ergonomics and meeting\n you where you work. It's only a\n keystroke away.",
        rate: 4.9,
        image: image
    },{
        span: "Expert instruction",
        title: "Watch our Courses",
        text: "We focus on ergonomics and meeting\n you where you work. It's only a\n keystroke away.",
        rate: 4.9,
        image: image
    },{
        span: "Expert instruction",
        title: "Watch our Courses",
        text: "We focus on ergonomics and meeting\n you where you work. It's only a\n keystroke away.",
        rate: 4.9,
        image: image
    },
]

export const SchoolHomeChampions = () => {
    const {setSectionTop} = useContext(HomeContext)

    const sectionRef = useRef()

    useEffect(() => {
        setSectionTop(cur => ({...cur, academic_champions: sectionRef?.current?.offsetTop}))
    }, [setSectionTop])

    const carousel = useRef()

    const [width, setWidth] = useState(null)

    useEffect(() => {
        setWidth(carousel.current?.scrollWidth - carousel.current?.offsetWidth)
    }, [list?.length])

    const renderItems = useCallback(() => {
        return list.map(item => {
            return (
                <motion.div className={cls.champions__item}>
                    <img src={item.image} alt=""/>
                    <div className={cls.info}>
                        <div className={cls.info__header}>
                            <h4 className={cls.info__header__name}>{item.span}</h4>
                            <div className={cls.info__header__ratingBox}>
                                <img className={cls.info__header__ratingBox__ratingImg} src={ratingStar} alt=""/>
                                <p>{item.rate}</p>
                            </div>
                        </div>
                        <h2>{item.title}</h2>
                        <p>{item.text}</p>
                    </div>
                </motion.div>
            )
        })
    }, [list])

    return (
        <div ref={sectionRef} className={cls.champions}>
            <div className={cls.champions__title}>
                <h1>School champions</h1>
                <div className={cls.champions__locations}>
                    <span>Chirchiq</span>
                    <span>Chirchiq</span>
                    <span>Chirchiq</span>
                </div>
            </div>
            <motion.div
                ref={carousel}
                className={cls.champions__container}
            >
                <motion.div
                    className={cls.champions__wrapper}
                    drag={"x"}
                    dragConstraints={{left: -width, right: 0}}
                >
                    {renderItems()}
                </motion.div>
            </motion.div>
        </div>
    );
}
