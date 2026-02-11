import React from 'react';
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router";

import {Button} from "shared/ui/button";

import cls from "./targetItemsHome.module.sass";
import image from "shared/assets/images/newHome.png";

export const TargetItemsHome = () => {

    const { t, i18n } = useTranslation();
    const navigate = useNavigate()

    return (
        <div className={cls.home}>
            <h1 className={cls.home__title}>{t("targetHome.title")}</h1>
            <p className={cls.home__desc}>
                🌍 <span className={cls.inner}>{t("targetHome.titleName")}</span> {t("targetHome.subTitle")}
            </p>
            <img className={cls.home__image} src={image} alt=""/>
            <div className={cls.home__container}>
                <h2 className={cls.mainTitle}>🎯 {t("targetHome.boxesTitle")}:</h2>
                <div className={cls.list}>
                    <div className={cls.list__item}>
                        <h3 className={cls.title}>🧠 {t("targetHome.boxesTitle1")}</h3>
                        <p className={cls.desc}>
                            {t("targetHome.boxesDesc1")}
                        </p>
                    </div>
                    <div className={cls.list__item}>
                        <h3 className={cls.title}>🎯 {t("targetHome.boxesTitle2")}</h3>
                        <p className={cls.desc}>
                            {t("targetHome.boxesDesc2")}
                        </p>
                    </div>
                    <div className={cls.list__item}>
                        <h3 className={cls.title}>😊 {t("targetHome.boxesTitle3")}</h3>
                        <p className={cls.desc}>
                            {t("targetHome.boxesDesc3")}
                        </p>
                    </div>
                    <div className={cls.list__item}>
                        <h3 className={cls.title}>💬 {t("targetHome.boxesTitle4")}</h3>
                        <p className={cls.desc}>
                            {t("targetHome.boxesDesc4")}
                        </p>
                    </div>
                </div>
            </div>
            <div className={cls.home__menu}>
                <h2 className={cls.title}>{t("targetHome.listTitle")}:</h2>
                <ul className={cls.list}>
                    <li>{t("targetHome.listItem1")}</li>
                    <li>{t("targetHome.listItem2")}</li>
                    <li>{t("targetHome.listItem3")}</li>
                    <li>{t("targetHome.listItem4")}</li>
                    <li>{t("targetHome.listItem5")}</li>
                </ul>
            </div>
            <Button onClick={() => navigate("/register/target/form/home")} extraClass={cls.home__btn} type={"simple"}>{t("targetHome.btn")}</Button>
            {/*<button onClick={() => navigate("/register/target/form/home")} className={cls.home__btn} type={"simple"}>{t("targetHome.btn")}</button>*/}
        </div>
    );
}
