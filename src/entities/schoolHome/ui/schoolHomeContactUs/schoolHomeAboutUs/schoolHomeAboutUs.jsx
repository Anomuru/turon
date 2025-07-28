import React, {memo, useEffect, useRef, useState} from 'react';
import classNames from "classnames";
import {motion, AnimatePresence} from "framer-motion";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import cls from "./schoolHomeAboutUs.module.sass";
import image from "shared/assets/images/turonWorker.png";

const list = [1,2,3,4,5]

export const SchoolHomeAboutUs = memo(() => {

    const settings = {
        className: classNames("center", cls.aboutUsSlider),
        centerMode: true,
        infinite: false,
        dots: true,
        centerPadding: "60px",
        slidesToShow: 3,
        speed: 500,
        arrows: false
    }

    const carousel = useRef()
    const [width,setWidth] = useState(null)

    useEffect(() => {
        setWidth(carousel.current?.scrollWidth - carousel.current?.offsetWidth)
    },[list.length])

    console.log(width, "width")

    const renderWorkers = () => {
        return list.map(item => {
            return (
                <motion.div
                    transition={{duration : 1}}
                    className={classNames(cls.item, {
                        // [cls.active]: true
                    })}
                >
                    <div className={cls.item__back}>
                        <img
                            className={cls.item__image}
                            src={image}
                            alt=""
                        />
                    </div>
                    <div className={cls.innerUser}>
                        <h2 className={cls.innerUser__title}>
                            01
                        </h2>
                        <p className={cls.innerUser__text}>
                            Jumaniyozov.Begzod
                        </p>
                    </div>
                    <div className={cls.innerInfo}>
                        <h2 className={cls.innerInfo__title}>
                            SEO Website Design
                        </h2>
                        <p className={cls.innerInfo__text}>
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
                            been the industry's standard dummy text ever since the 1500s, when an unknown printer took a
                            galley of type and scrambled it to make a type specimen book. It has survived not only five
                            centuries, but also the leap into electronic typesetting, remaining essentially .
                        </p>
                    </div>
                </motion.div>
            )
        })
    }

    const render = renderWorkers()

    return (
        <motion.div className={cls.aboutUs}>
            <h2 className={cls.aboutUs__title}>About us</h2>
            <motion.div
                className={classNames("slider-container", cls.aboutUs__container)}
                ref={carousel}
            >
                {/*<i className={classNames("fas fa-chevron-left", cls.aboutUs__icon)}/>*/}
                <motion.div
                    className={cls.aboutUs__wrapper}
                    drag={"x"}
                    dragConstraints={{left: -width,right: 0}}
                >
                {/*<Slider {...settings}>*/}
                    {render}
                {/*</Slider>*/}
                </motion.div>
                {/*<i className={classNames("fas fa-chevron-right", cls.aboutUs__icon)}/>*/}
            </motion.div>
        </motion.div>
    )
})
