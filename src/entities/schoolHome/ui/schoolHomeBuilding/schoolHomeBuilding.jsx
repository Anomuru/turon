import {useCallback, useContext, useEffect, useRef} from 'react';
import classNames from "classnames";
import {isMobile} from "react-device-detect";

import {HomeContext} from "shared/lib/context/homeContext";

import cls from "./schoolHomeBuilding.module.sass";
import image from "shared/assets/images/studentBuilding.png";
import iconImage1 from "shared/assets/images/studentBuildImage1.png";

const list = [
    {
        title: "Collaborator (Jamoada hamkorlikda ishlovchi",
        text: "Our students learn the value of teamwork, respect " +
            "diverse perspectives, and contribute effectively to group success.",
        image: iconImage1
    }, {
        title: "Collaborator (Jamoada hamkorlikda ishlovchi",
        text: "Our students learn the value of teamwork, respect " +
            "diverse perspectives, and contribute effectively to group success.",
        image: iconImage1
    }, {
        title: "Collaborator (Jamoada hamkorlikda ishlovchi",
        text: "Our students learn the value of teamwork, respect " +
            "diverse perspectives, and contribute effectively to group success.",
        image: iconImage1
    }, {
        title: "Collaborator (Jamoada hamkorlikda ishlovchi",
        text: "Our students learn the value of teamwork, respect " +
            "diverse perspectives, and contribute effectively to group success.",
        image: iconImage1
    },
]
const list2 = [
    {
        title: "Collaborator (Jamoada hamkorlikda ishlovchi",
        text: "Our students learn the value of teamwork, respect " +
            "diverse perspectives, and contribute effectively to group success.",
        image: iconImage1
    }, {
        title: "Collaborator (Jamoada hamkorlikda ishlovchi",
        text: "Our students learn the value of teamwork, respect " +
            "diverse perspectives, and contribute effectively to group success.",
        image: iconImage1
    }, {
        title: "Collaborator (Jamoada hamkorlikda ishlovchi",
        text: "Our students learn the value of teamwork, respect " +
            "diverse perspectives, and contribute effectively to group success.",
        image: iconImage1
    }, {
        title: "Collaborator (Jamoada hamkorlikda ishlovchi",
        text: "Our students learn the value of teamwork, respect " +
            "diverse perspectives, and contribute effectively to group success.",
        image: iconImage1
    },
]

export const SchoolHomeBuilding = () => {
    const {setSectionTop} = useContext(HomeContext)

    const sectionRef = useRef()

    useEffect(() => {
        setSectionTop(cur => ({...cur, our_students: sectionRef?.current?.offsetTop}))
    }, [setSectionTop])

    const renderList = useCallback(() => {
        return list.map(item => {
            return (
                <div
                    className={classNames(cls.item, {
                        [cls.reverse]: isMobile
                    })}
                >
                    <div className={cls.item__info}>
                        <h2>{item.title}</h2>
                        <p>{item.text}</p>
                    </div>
                    <div className={cls.item__image}>
                        <img src={item.image} alt=""/>
                    </div>
                </div>
            )
        })
    }, [list])

    const renderList2 = useCallback(() => {
        return list2.map(item => {
            return (
                <div
                    className={classNames(cls.item, {
                        [cls.reverse]: isMobile
                    })}
                >
                    <div className={cls.item__info}>
                        <h2>{item.title}</h2>
                        <p>{item.text}</p>
                    </div>
                    <div className={cls.item__image}>
                        <img src={item.image} alt=""/>
                    </div>
                </div>
            )
        })
    }, [list2])

    return (
        <div className={cls.building} ref={sectionRef}>
            <div className={cls.building__header}>
                <h1>Student Profile - Building Tomorrow's Leaders</h1>
                <p>
                    "At Turon International School, we are committed to developing well-rounded
                    individuals. We believe that fostering essential {!isMobile && <br/>}
                    traits such as collaboration, critical thinking, and innovation in our students
                    is the foundation for academic and personal {!isMobile && <br/>}
                    success. Once these qualities are nurtured, education becomes an easier and
                    more enriching journey."
                </p>
            </div>
            <div className={cls.container}>
                {
                    !isMobile &&
                    <div className={cls.container__list}>
                        {renderList()}
                    </div>
                }
                <img src={image} alt=""/>
                <div className={cls.container__list}>
                    {isMobile && renderList()}
                    {renderList2()}
                </div>
            </div>
        </div>
    );
}
