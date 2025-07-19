import React from 'react';
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router";

import {Button} from "shared/ui/button";

import cls from "./targetItemsLast.module.sass";
import image from "shared/assets/images/last.png";

export const TargetItemsLast = () => {

    const { t, i18n } = useTranslation();
    const navigate = useNavigate()


    return (
        <div className={cls.home}>
            <h1 className={cls.home__title}>🤖 {t("targetLast.title")}</h1>
            <p className={cls.home__desc}>
                🌟 <span className={cls.inner}>{t("targetLast.titleName")}</span> {t("targetLast.subTitle")}
            </p>
            <img className={cls.home__image} src={image} alt=""/>
            <div className={cls.home__container}>
                <h2 className={cls.mainTitle}>🎯 {t("targetLast.boxesTitle")}</h2>
                <div className={cls.list}>
                    <div className={cls.list__item}>
                        <h3 className={cls.title}>🧠 {t("targetLast.boxesTitle1")}</h3>
                        {/*<p className={cls.desc}>*/}
                        {/*Farzandingiz aniq fanlarda chuqur bilimga ega bo‘ladi. 📌 Darslar orqali u tizimli fikrlash,*/}
                        {/*muammo yechish, eksperiment qilish, tahlil qilish kabi ko‘nikmalarni o‘zlashtiradi. 🔬 STEM*/}
                        {/*orqali biz bolani nafaqat fanlarga, balki real hayotdagi muammolarga yechim topishga*/}
                        {/*o‘rgatamiz.*/}
                        {/*</p>*/}
                        <ul className={cls.descs}>
                            <li>{t("targetLast.boxesDesc1-1")}</li>
                            <li>📌 {t("targetLast.boxesDesc1-2")}</li>
                            <li>🔬 {t("targetLast.boxesDesc1-3")}</li>
                        </ul>
                    </div>
                    <div className={cls.list__item}>
                        <h3 className={cls.title}>💻 {t("targetLast.boxesTitle2")}</h3>
                        <ul className={cls.descs}>
                            <li>{t("targetLast.boxesDesc2-1")}</li>
                            <li>📱 {t("targetLast.boxesDesc2-2")}</li>
                            <li>▪️ {t("targetLast.boxesDesc2-3")}</li>
                            <li>▪️ {t("targetLast.boxesDesc2-4")}</li>
                            <li>▪️ {t("targetLast.boxesDesc2-5")}</li>
                            <li>▪️ {t("targetLast.boxesDesc2-6")}</li>
                        </ul>
                    </div>
                    <div className={cls.list__item}>
                        <h3 className={cls.title}>🔧 {t("targetLast.boxesTitle3")}</h3>
                        <ul className={cls.descs}>
                            <li>{t("targetLast.boxesDesc3-1")}</li>
                            <li>🔹 {t("targetLast.boxesDesc3-2")}</li>
                            <li>🔹 {t("targetLast.boxesDesc3-3")}</li>
                            <li>🔹 {t("targetLast.boxesDesc3-4")}</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className={cls.home__menu}>
                <h2 className={cls.title}>👨‍🏫 {t("targetLast.listTitle")}:</h2>
                <ul className={cls.list}>
                    <li>✔️ {t("targetLast.listItem1")}</li>
                    <li>✔️ {t("targetLast.listItem2")}</li>
                    <li>✔️ {t("targetLast.listItem3")}</li>
                    <li>✔️ {t("targetLast.listItem4")}</li>
                    <li>✔️ {t("targetLast.listItem5")}</li>
                    <li>🎓 {t("targetLast.listItem6")}</li>
                </ul>
            </div>
            <Button onClick={() => navigate("/register/target/form/last")} extraClass={cls.home__btn} type={"simple"}>{t("targetLast.btn")}</Button>
        </div>
    );
}
