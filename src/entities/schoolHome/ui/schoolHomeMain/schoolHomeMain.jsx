import React, {memo, useCallback, useEffect, useRef, useState} from 'react';
import classNames from "classnames";
import {motion, AnimatePresence} from "framer-motion";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import cls from "./schoolHomeMain.module.sass";
import homeImage from "shared/assets/images/homeImage.png";


import programImg from "shared/assets/icons/programImg.svg"
import idea from "shared/assets/icons/turonIdea.png";
import {useDispatch, useSelector} from "react-redux";
import {getUserJob} from "../../../profile/userProfile";
import {
    getSchoolHomeMainData, getSchoolHomeMainDes,
    getSchoolHomeMainLoading,
    getSchoolHomeMainSecDes
} from "../../model/selector/schoolHomeMainSelector";
import {DefaultLoader, DefaultPageLoader} from "../../../../shared/ui/defaultLoader";
import {useNavigate} from "react-router";
import {Button} from "../../../../shared/ui/button";

const list = [1, 2, 3, 4, 5, 6, 7]


const listData = [
    {name: "Nursery", id: 1},
    {name: "PRIMARY", id: 4},
    {name: "LOWER SECONDARY", id: 3},
    {name: "UPPER SECONDARY", id: 2},
    {name: "ADVANCED", id: 5},


]


export const SchoolHomeMain = memo(({setActive, setMainActive, role, setActiveEditItem}) => {

    const dispatch = useDispatch()


    const data = useSelector(getSchoolHomeMainData)
    const loading = useSelector(getSchoolHomeMainLoading)
    const secDes = useSelector(getSchoolHomeMainSecDes)
    const des = useSelector(getSchoolHomeMainDes)


    const navigate = useNavigate()


    const carousel = useRef()
    const [activeItem, setActiveItem] = useState(null)
    const [width, setWidth] = useState(null)

    useEffect(() => {
        setWidth(carousel.current?.scrollWidth - carousel.current?.offsetWidth)
    }, [list?.length])

    const renderItems = useCallback(() => {
        return listData?.map(item => {
            return (
                <motion.div
                    transition={{duration: 1}}
                    onClick={() => {
                        setActiveItem(prev =>
                            prev === item?.id ? null : item?.id
                        )
                        navigate(`curricular`)
                    }
                    }
                    className={classNames(cls.items__inner, {
                        [cls.active]: activeItem === item?.id
                    })}

                >
                    {
                        role && <div
                            onClick={() => {
                                setActive("edit")
                                setActiveEditItem(item)
                            }}
                            className={cls.items__edit}
                        >
                            <i className="fas fa-edit"/>
                        </div>
                    }
                    <img
                        className={cls.items__image}
                        src={programImg}
                        alt=""
                    />
                    <h2 className={cls.items__title}>{item?.name}</h2>
                    <p className={cls.items__more}>Learn more</p>
                </motion.div>
            )
        })
    }, [data, activeItem])

    const render = renderItems()

    return (
        <motion.div className={cls.homeMain}>
            <div className={cls.homeMain__info}>


                <div className={cls.info}>
                    {role && <div
                        onClick={() => setMainActive(true)}
                        className={cls.programsInfo__mainEdit}
                    >
                        <i className="fas fa-edit"/>
                    </div>}


                    <h1 className={cls.info__title}>Our vision</h1>
                    <p className={cls.info__text}>
                        Our vision at Turon International School is to be a pioneering institution in Uzbekistan,
                        renowned for excellence in STEM and IT education. We aim to foster a community of innovative
                        thinkers and global leaders, equipped with the knowledge and skills to shape the future. Our
                        commitment is to provide an inspiring and technologically advanced learning environment where
                        students are empowered to discover their passions, pursue excellence, and make meaningful
                        contributions to the world
                    </p>
                    <Button onClick={() => navigate("/login")} extraClass={cls.home__btn}>Login</Button>
                </div>
                <div className={cls.image}>
                    <img src={homeImage} alt=""/>
                </div>
            </div>
            <div className={cls.wrapper}>
                <div className={cls.homeMain__programs}>
                    <div className={cls.programsInfo}>

                        <h2 className={cls.programsInfo__title}>Programs</h2>
                        {/*<p className={cls.programsInfo__text}>*/}
                        {/*    {secDes && secDes[0]?.description}*/}
                        {/*</p>*/}
                    </div>
                    <motion.div
                        className={cls.items}
                        ref={carousel}
                    >

                        <motion.div
                            className={cls.items__wrapper}
                            drag={"x"}
                            dragConstraints={{left: -width, right: 0}}
                        >

                            {/*<Slider*/}

                            {/*    {...settings}*/}
                            <AnimatePresence>
                                {loading ? <DefaultPageLoader/> : render}
                            </AnimatePresence>


                            {/*>*/}
                            {/*</Slider>*/}
                        </motion.div>


                    </motion.div>
                    {role && <div
                        onClick={() => setActive("add")}
                        className={cls.items__plus}
                    >
                        <i className="fas fa-plus"/>
                    </div>}
                </div>
            </div>
        </motion.div>
    )
})
