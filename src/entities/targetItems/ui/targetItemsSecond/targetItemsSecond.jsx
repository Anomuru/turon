import React from 'react';
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router";

import {Button} from "shared/ui/button";

import cls from "./targetItemsSecond.module.sass";
import image from "shared/assets/images/second.png";
import image1 from "shared/assets/images/second1.svg";
import image2 from "shared/assets/images/second2.svg";
import image3 from "shared/assets/images/second3.svg";
import image4 from "shared/assets/images/second4.svg";

export const TargetItemsSecond = () => {

    const { t, i18n } = useTranslation();
    const navigate = useNavigate()


    return (
        <div className={cls.home}>
            <h1 className={cls.home__title}>{t("targetSecond.title")}</h1>
            <p className={cls.home__desc}>
                🌍 <span className={cls.inner}>{t("targetSecond.titleName")}</span> {t("targetSecond.subTitle")}
            </p>
            <img className={cls.home__image} src={image} alt=""/>
            <div className={cls.home__container}>
                <h2 className={cls.title}>{t("targetSecond.boxesTitle")}</h2>
                <div className={cls.list}>
                    <div className={cls.list__item}>
                        <img src={image1} alt=""/>
                        <h3 className={cls.title}>{t("targetSecond.boxesTitle1")}</h3>
                        <p className={cls.desc}>
                            {t("targetSecond.boxesDesc1")}
                        </p>
                    </div>
                    <div className={cls.list__item}>
                        <img src={image2} alt=""/>
                        <h3 className={cls.title}>{t("targetSecond.boxesTitle2")}</h3>
                        <p className={cls.desc}>
                            {t("targetSecond.boxesDesc2")}
                        </p>
                    </div>
                    <div className={cls.list__item}>
                        <img src={image3} alt=""/>
                        <h3 className={cls.title}>{t("targetSecond.boxesTitle3")}</h3>
                        <p className={cls.desc}>
                            {t("targetSecond.boxesDesc3")}
                        </p>
                    </div>
                    <div className={cls.list__item}>
                        <img src={image4} alt=""/>
                        <h3 className={cls.title}>{t("targetSecond.boxesTitle4")}</h3>
                        <p className={cls.desc}>
                            {t("targetSecond.boxesDesc4")}
                        </p>
                    </div>
                </div>
            </div>
            <div className={cls.home__menu}>
                <h2 className={cls.title}>
                    👨‍🏫 {t("targetSecond.listTitle")}
                    <span className={cls.title__inner}>{t("targetSecond.listSubtitle")}</span>
                </h2>
                <ul className={cls.list}>
                    <li>✔️ {t("targetSecond.listItem1")}</li>
                    <li>✔️ {t("targetSecond.listItem2")}</li>
                    <li>✔️ {t("targetSecond.listItem3")}</li>
                    <li>✔️ {t("targetSecond.listItem4")}</li>
                    <li>✔️ {t("targetSecond.listItem5")}</li>
                    <li>📚 {t("targetSecond.listItem6")}</li>
                    <li>🏫 {t("targetSecond.listItem7")}</li>
                </ul>
            </div>
            <Button onClick={() => navigate("/register/target/form/second")} extraClass={cls.home__btn} type={"simple"}>{t("targetSecond.btn")}</Button>
        </div>
    );
}
