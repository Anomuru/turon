import React, {useState} from 'react';


import cls from "./quarterMaster.module.sass"
import {CustomCheckBox} from "shared/ui/customCheckBox/index.js";
import classNames from "classnames";

export const QuarterMaster = ({data}) => {

    const [checkedMap, setCheckedMap] = useState({});

    const toggleChecked = (id) => {
        setCheckedMap((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };


    return (<>
            {data?.map((item, index) => (<div className={cls.card}>
                <div className={cls.card__header}>
                    <div className={cls.card__header__left}>
                    <span className={cls.card__header__left__span}>
                        <i style={{fontSize: "1.6rem", color: "#21771A"}} className="fa-regular fa-user"></i>
                        <h1 className={cls.card__header__left__span__name}>{item.name}</h1>
                    </span>
                        <div className={cls.card__header__left__panel}>
                        <span className={cls.card__header__left__panel__item}>
                            <i className="fa-solid fa-book-open"></i>
                            <h3 className={cls.card__header__left__panel__item__name}>{item.subject}</h3>
                        </span>
                            <span className={cls.card__header__left__panel__item}>
                            <i className="fa-regular fa-calendar"></i>
                            <h3 className={cls.card__header__left__panel__item__name}>{item.date}</h3>
                        </span>
                        </div>
                    </div>
                    <div className={cls.card__header__right}>
                    <span className={cls.card__header__right__span}>
                        <h2>{item.eqiupments.length} dona</h2>
                    </span>
                    </div>
                </div>
                <div className={cls.card__footer}>
                    {item.eqiupments.map((item, index) => (
                        <div className={classNames(cls.card__footer__card, {
                            [cls.active]: checkedMap[item.id],
                        })}>
                            <div className={cls.card__footer__card__left}>
                                <CustomCheckBox checked={!!checkedMap[item.id]}
                                                setChecked={() => toggleChecked(item.id)}/>
                                <div className={cls.card__footer__card__left__arounder}>
                            <span className={cls.card__footer__card__left__arounder__span}>
                                <i style={{fontSize: "1.6rem", color: "#21771A"}} className="fa-regular fa-file"></i>
                            </span>
                                    <span className={cls.card__footer__card__left__arounder__box}>
                                <h2 className={cls.card__footer__card__left__arounder__box__title}>
                                    {item.name}
                                </h2>
                                <h3 className={cls.card__footer__card__left__arounder__box__subtitle}>
                                    {item.quantity}
                                </h3>
                            </span>
                                </div>
                            </div>
                            <div className={cls.card__footer__card__right}>
                        <span className={cls.card__footer__card__right__check}>
                            <i className="fa-regular fa-circle-check"></i>
                            <h2>Qabul qilindi</h2>
                        </span>
                            </div>
                        </div>))}

                </div>
            </div>))}
        </>

    );
};

