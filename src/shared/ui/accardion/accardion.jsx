import React, {useEffect, useRef, useState} from 'react';

import cls from "./accordion.module.sass"

import classNames from "classnames";



export const Accordion = ({title, subtitle, children, backOpen, setBackOpen, clazz, btns , number}) => {


    const [open, setOpen] = useState(false)


    const contentHeight = useRef()


    const toggleOpen = (e) => {

        if (e.target.tagName !== "BUTTON") {
            if (backOpen !== undefined) {
                setBackOpen(!backOpen)
            } else {
                setOpen(!open)
            }
        }

    }


    return (
        <div
            className={classNames(cls.accordion, clazz, {
                [cls.active]: backOpen || open
            })}


        >
            <div  className={cls.header}>
                <div className={cls.info}>

                        <span>{number}</span>
                    {
                        title ? <div className={cls.title}>{title}</div> : null
                    }


                </div>


                <div className={cls.btns}>
                    {subtitle && <div className={cls.checkbox}>{subtitle}</div>}
                    {
                        btns?.map(item => {
                            return item
                        })
                    }
                    <div onClick={toggleOpen} className={classNames(cls.arrow, {
                        [cls.active]: backOpen || open
                    })}>
                        <i className="fas fa-angle-down"></i>
                    </div>
                </div>
            </div>
            <div
                style={
                    backOpen || open
                        ? {height: contentHeight.current?.scrollHeight}
                        : {height: "0px"}
                }
                ref={contentHeight}
                className={cls.wrapper}
            >
                <div>
                    {children}
                </div>

            </div>
        </div>
    );
};
