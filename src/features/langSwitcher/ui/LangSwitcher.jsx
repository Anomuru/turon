import React, {useState} from 'react';


import cls from "./langSwitcher.module.sass"

import arrowDown from "shared/assets/icons/Trailing element-selected.svg"
import lang from "shared/assets/icons/language.svg"
import {useTranslation} from "react-i18next";

import UzbSvg from "shared/assets/icons/twemoji_flag-uzbekistan.svg"
import RusSvg from "shared/assets/icons/fxemoji_russianflag.svg"
import classNames from "classnames";


const langs = [
    {
        value: "uz",
        label: "Uzb",
        icon: UzbSvg
    },
    {
        value: "ru",
        label: "Rus",
        icon: RusSvg
    },
]


const LangSwitcher = () => {

    const {t, i18n} = useTranslation();

    const [active, setActive] = useState(false)
    const [activeLang,setActiveLang] = useState("Uzb")

    console.log("dasd")

    const onChangeLanguage = (type) => {
        i18n.changeLanguage(type)
        setActive(false)
        setActiveLang(langs.filter(item => item.value === type)[0].label)
    }


    return (
        <div className={cls.switcher}>

            <div className={cls.switcher__lang} onClick={() => setActive(!active)}>
                <img src={lang} alt=""/>
                <span>{activeLang}</span>
                <img src={arrowDown} alt=""/>
            </div>

            <div
                className={classNames(cls.switcher__popup, {[cls.active]: active})}
            >
                {
                    langs.map((item, index) => {
                        return (
                            <div key={index} onClick={() => onChangeLanguage(item.value)} className={cls.item}>
                                <img src={item.icon} alt=""/>
                                <span>{item.label}</span>

                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
};

export default LangSwitcher;