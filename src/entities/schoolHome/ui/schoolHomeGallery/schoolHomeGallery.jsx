import classNames from "classnames";
import React, {memo, useCallback} from 'react';

import cls from "./schoolHomeGallery.module.sass";
import robot from "shared/assets/images/turonGallery.png";
import addIcon from "../../../../shared/assets/icons/PlusCircle.svg";
import {useSelector} from "react-redux";
import {getSchoolHomeGalleryData} from "../../model/selector/schoolHomeGallerySelector";

const list = [1, 2]

export const SchoolHomeGallery = memo(({setValue ,setActive, setActiveEditItem, job}) => {

    const data = useSelector(getSchoolHomeGalleryData)

    const renderGallery = useCallback(() => {
        return data?.map(item => {
            return (
                <div
                    className={classNames(cls.item, {
                        [cls.active]: false
                    })}
                >

                    {job &&

                        <div
                            onClick={() => {
                                setActive("edit")
                                setActiveEditItem(item)
                                setValue("description" , item.description)
                            }}
                            className={cls.item__change}
                        >
                            <i className="fas fa-edit"/>
                        </div>}
                    <img
                        className={cls.item__image}
                        src={item?.images.map(item => item.image) ?? robot}
                        // src={robot}
                        alt=""
                    />
                    <p className={cls.item__text}>
                        {item.description}

                    </p>
                </div>
            )
        })
    }, [data])

    const render = renderGallery()

    return (
        <div className={cls.gallery}>
            <div className={cls.gallery__wrapper}>
                <h2 className={cls.gallery__title}>Gallery</h2>
                {job && <div className={cls.gallery__add} onClick={() => setActive("add")}>
                    <img src={addIcon} alt=""/>
                </div>}
            </div>
            <div className={cls.gallery__container}>
                {/*<div*/}
                {/*    className={classNames(cls.itemMain, {*/}
                {/*        [cls.active]: true*/}
                {/*    })}*/}
                {/*>*/}
                {/*    <h1*/}
                {/*        className={classNames(cls.itemMain__titles, {*/}
                {/*            [cls.active]: true*/}
                {/*        })}*/}
                {/*    >*/}
                {/*        Our projects*/}
                {/*    </h1>*/}

                {/*</div>*/}
                {/*<div*/}
                {/*    className={classNames(cls.item, {*/}
                {/*        [cls.active]: false*/}
                {/*    })}*/}
                {/*>*/}
                {/*    <div*/}
                {/*        onClick={() => setActive("edit")}*/}
                {/*        className={cls.item__change}*/}
                {/*    >*/}
                {/*        <i className="fas fa-edit"/>*/}
                {/*    </div>*/}
                {/*    <img*/}
                {/*        className={cls.item__image}*/}
                {/*        src={robot}*/}
                {/*        alt=""*/}
                {/*    />*/}
                {/*    <p className={cls.item__text}>*/}
                {/*        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut*/}
                {/*        labore*/}
                {/*        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo*/}
                {/*        con*/}

                {/*    </p>*/}
                {/*</div>*/}
                {/*<div*/}
                {/*    className={classNames(cls.item, {*/}
                {/*        [cls.active]: false*/}
                {/*    })}*/}
                {/*>*/}
                {/*    <div*/}
                {/*        onClick={() => setActive("edit")}*/}
                {/*        className={cls.item__change}*/}
                {/*    >*/}
                {/*        <i className="fas fa-edit"/>*/}
                {/*    </div>*/}
                {/*    <img*/}
                {/*        className={cls.item__image}*/}
                {/*        src={robot}*/}
                {/*        alt=""*/}
                {/*    />*/}
                {/*    <p className={cls.item__text}>*/}
                {/*        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut*/}
                {/*        labore*/}
                {/*        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo*/}
                {/*        con*/}

                {/*    </p>*/}
                {/*</div>*/}
                {render}
            </div>
        </div>
    )
})
