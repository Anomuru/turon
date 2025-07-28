import classNames from "classnames";
import React, {memo, useCallback, useContext, useEffect, useRef, useState} from 'react';

import {HomeContext} from "shared/lib/context/homeContext";

import {Button} from "shared/ui/button";

import cls from "./schoolHomeHeader.module.sass";
import turonLogo from "shared/assets/logo/turonLogo.png";
import turonLogoText from "shared/assets/logo/turonLogoText.png";
import {Link} from "react-router-dom";
import {useNavigate} from "react-router";

const list = [
    {
        name: "aboutUs",
        label: "About us",
        path: "aboutUs",
        isMultiLink: true,
        children: [
            {
                name: "About TIS",
                path: "aboutUs"
            },
            {
                name: "Principal’s Spotlight",
                path: "principalsSpotlight"
            },
            {
                name: "Student Profile",
                path: "studentProfile"
            },
            {
                name: "Teaching Staff",
                path: "teachingStaff"
            },
        ]
    },
    {
        name: "education",
        label: "Education",
        path: "education",
        isMultiLink: true,
        children: [
            {
                name: "Curricular",
                path: "curricular"
            },
            {
                name: "Co-Curricular",
                path: "co_curricular"
            },
            {
                name: "Extra Curricular",
                path: "extra_curricular"
            },
            {
                name: "Academic Calendar",
                path: "academic_calendar"
            },
        ]
    },
    {
        name: "news_announcement",
        label: "News  announcement",
        path: "news_announcement"
    },

    {
        name: "students",
        label: "Students",
        path: "students",
        isMultiLink: true,
        children: [
            {
                name: "Our Students",
                path: "our_students"
            }, {
                name: "Academic Champions",
                path: "academic_champions"
            }, {
                name: "Student Clubs",
                path: "student_clubs"
            }, {
                name: "Student Council",
                path: "student_council"
            },
        ]
    },
    {
        name: "testimonial",
        label: "Testimonial",
        path: "testimonial"
    },
    // {
    //     name: "admission",
    //     label: "Admission",
    //     path: "admission"
    // },
    {
        name: "workwithus",
        label: "Work with us",
        path: "workwithus",
    },
    // {
    //     name: "academicCalendar",
    //     label: "Academic calendar"
    // }
]

export const SchoolHomeHeader = memo(() => {

    const navigate = useNavigate()
    const {sectionTop} = useContext(HomeContext)

    const [activeSection, setActiveSection] = useState(null)
    const [prevActiveSection, setPrevActiveSection] = useState("")
    const [activeMulti, setActiveMulti] = useState(false)
    const [activeBurger, setActiveBurger] = useState(false)

    const toLink = (top) => {
        // setStatus(false)
        setActiveBurger(false)
        window.scrollTo(0, top - 100)
    }

    const renderSectionMenuList = useCallback(() => {
        return list.map(item => {
            if (item.isMultiLink) {
                return (
                    <details
                        open={activeSection === item.name}
                        className={classNames(cls.listItem, {
                            [cls.active]: item.name === activeSection
                        })}
                        onClick={() => {
                            setActiveSection(prev => {
                                setPrevActiveSection(prev)
                                return item.name
                            })
                            navigate(item.path)
                        }}
                    >
                        <summary
                            className={classNames(cls.listItem__summary, {
                                [cls.active]: item.name === activeSection
                            })}
                        >
                            {item.label}
                        </summary>
                        <div className={cls.homeHeader__multi}>
                            {
                                item.children.map(link => {
                                    return (
                                        <li
                                            onClick={() => {
                                                setActiveSection(link.name)
                                                toLink(sectionTop[link.path])
                                                // navigate(link.path)
                                            }}
                                            className={classNames(cls.multiItem, {
                                                // [cls.active]: link.name === activeSection
                                            })}
                                        >
                                            {link.name}


                                            {/*<div className={classNames({*/}
                                            {/*        [cls.hoverActive]: item.name === activeSection,*/}
                                            {/*        [cls.hover]: !item.name === !activeSection*/}
                                            {/*    }*/}
                                            {/*)}>*/}

                                            {/*</div>*/}


                                        </li>
                                    )
                                })
                            }
                        </div>
                    </details>
                )
            }
            return (
                <li
                    onClick={() => {
                        setActiveSection(item.name)
                        navigate(item.path)
                    }}
                    className={classNames(cls.listItem,cls.listItem__single,  {
                        [cls.active]: item.name === activeSection
                    })}
                >
                    {item.label}


                    {/*<div className={classNames({*/}
                    {/*        [cls.hoverActive]: item.name === activeSection,*/}
                    {/*        [cls.hover]: !item.name === !activeSection*/}
                    {/*    }*/}
                    {/*)}>*/}

                    {/*</div>*/}


                </li>
            )
        })
    }, [activeSection, prevActiveSection, activeMulti])

    const render = renderSectionMenuList()

    return (
        <>
            <div
                // onWheel={(e) => {
                //     console.log(e, "e.target")
                //     console.log(ref?.current?.offsetTop, "currentHeight")
                // }}
                className={cls.homeHeader}
                // ref={ref}
            >
                <div
                    className={classNames(cls.homeHeader__burger, {
                        [cls.active]: activeBurger
                    })}
                >
                    <i
                        onClick={() => setActiveBurger(true)}
                        className={
                            activeBurger ? "fas fa-times" : "fas fa-bars"
                        }
                    />
                </div>
                <div onClick={() => navigate("/")} className={cls.homeHeader__logo}>
                    <img className={cls.logo} src={turonLogo} alt=""/>
                    <img className={cls.logoText} src={turonLogoText} alt=""/>
                </div>
                <ul className={cls.homeHeader__list}>
                    {render}
                </ul>
                <div className={cls.homeHeader__btns}>
                    {/*<Button*/}
                    {/*    extraClass={cls.aplayBtn}*/}
                    {/*    type={"simple-add"}*/}
                    {/*>*/}
                    {/*    Aplay*/}
                    {/*</Button>*/}
                    <Link target={"_self"} to={`/instagramReg`}>
                        <Button
                            extraClass={cls.loginBtn}
                            type={"login"}
                        >
                            Register
                        </Button>
                    </Link>
                </div>
            </div>
            <div
                className={classNames(cls.homeMenu, {
                    [cls.active]: activeBurger
                })}
            >
                <i
                    onClick={() => setActiveBurger(false)}
                    className={classNames("fas fa-times", cls.homeMenu__icon)}
                />
                <ul className={classNames(cls.homeMenu__list, {
                    [cls.active]: activeBurger
                })}>
                    {render}
                </ul>
            </div>
        </>
    )
})
