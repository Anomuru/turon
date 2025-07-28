import React, {useEffect, useRef, useState} from 'react';
import { motion} from "framer-motion";


import cls from "./leadProfile.module.sass"
import {Button} from "shared/ui/button";
import classNames from "classnames";

import pen from "shared/assets/icons/edit_icon.svg"
import {useNavigate} from "react-router";
import {LeadInfo} from "entities/lead/ui/leadInfo/leadInfo";
import {LeadTasks} from "features/leadProfile/ui/leadTasks/leadTasks";




const statuses = [
    {
        color: "red",
        title: "New",
        active: true
    },
    {
        color: "yellow",
        title: "Contacted"
    },
    {
        color: "green",
        title: "Enrolled"
    }
]



export const LeadProfile = ({id}) => {



    const [activeColor,setActiveColor] = useState({
        index: null,
        color: null
    })

    const onMouseOver = (color,index) => {
        setActiveColor({
            color,
            index
        })
    }
    const onMouseLeave = () => {
        setActiveColor({
            index: null,
            color: null
        })
    }

    const modalRef = useRef(null);


    const navigate = useNavigate()

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                navigate(-1)
            }
        };
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };

    }, [navigate]);



    return (
        <motion.div
            initial={{opacity: 0, transition: {duration: 0.3}}}
            animate={{opacity: 1, transition: {duration: 0.3}}}
            exit={{opacity: 0, transition: {duration: 0.3}}}
            className={cls.leadProfile}
        >
            <motion.div
                ref={modalRef}
                initial={{y: "100%", transition: {duration: 0.6}}}
                animate={{y: 0, transition: {duration: 0.6}}}
                exit={{y: "100%", transition: {duration: 0.6}}}
                className={cls.container}
            >

                <div className={cls.header}>
                    <h1>Ulug'bek Fatxullayev</h1>

                    <div className={cls.status}>
                        {
                            statuses.map((item, index) => {
                                return (
                                    <div
                                        onMouseOver={() => onMouseOver(item.color,index)}
                                        onMouseLeave={onMouseLeave}
                                        className={classNames(cls.status__item,cls[item.color],{
                                            [cls.active]: item.active || index <= activeColor.index,
                                        })}
                                        key={index}
                                    >
                                        <div className={cls.status__color} style={{background: item.color}}></div>
                                        <div className={cls.status__title}>{item.title}</div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>


                <div className={cls.wrapper}>
                    <div className={cls.info}>

                        <div className={cls.info__header}>
                            <h1>Info</h1>

                            <h2>Change</h2>
                        </div>


                        <LeadInfo info={{}}/>

                    </div>


                    <LeadTasks/>
                </div>
            </motion.div>
        </motion.div>
    );
};




