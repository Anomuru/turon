import React, {useEffect, useState} from 'react';

import {MainSwitch} from "shared/ui/mainSwitch";
import {useTheme} from "shared/lib/hooks/useTheme";
import cls from "shared/ui/mainSwitch/mainSwitch.module.sass";
import {useDispatch, useSelector} from "react-redux";
import {fetchThemeSwitcherSystemsThunk} from "features/themeSwitcher/modal/thunk/themeSwitcherThunk";
import {onChangeSystem} from "../modal/slice/themeSwitcherSlice";
import {getSystem, getSystemInited, getSystems} from "../modal/selector/themeSwitcherSystems";

export const ThemeSwitcher = () => {

    const {toggleTheme, theme} = useTheme()
    const dispatch = useDispatch()
    const currentTheme = localStorage.getItem("theme")

    const system = useSelector(getSystem)
    const systems = useSelector(getSystems)
    const inited = useSelector(getSystemInited)

    const [active, setActive] = useState(true)
    const [activeType, setActiveType] = useState("center")
    const [isLocal, setIsLocal] = useState(false)


    // useEffect(() => {
    //     if (!inited) {
    //         dispatch(fetchThemeSwitcherSystemsThunk())
    //     }
    // }, [inited])


    const onClick = (status) => {
        toggleTheme(theme)
        setActive(status)
        setActiveType(status ? "center" : "school")
        dispatch(onChangeSystem(status ? "center" : "school"))
    }

    useEffect(() => {
        setActive(system.name === "center")
        setActiveType(system?.name)
        toggleTheme(system.name === "center" ? "app_school_theme" : "app_center_theme")
    }, [system?.name])



    if (systems?.length < 2|| !inited) return

    return (
        <MainSwitch
            isActive={active}
            onSwitch={onClick}
        >

            {
                active ?
                    <h2 className={cls.mainSwitch__text}>Center</h2>
                    :
                    <h2 className={cls.mainSwitch__text__center}>School</h2>
            }
        </MainSwitch>
    );
};
