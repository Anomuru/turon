import React, {memo, useCallback, useEffect} from 'react';

import cls from "./schoolHomeCertificats.module.sass";
import image1 from "shared/assets/images/turonIGCSE.png";
import addIcon from "../../../../shared/assets/icons/PlusCircle.svg";
import {useDispatch, useSelector} from "react-redux";
import {fetchCertificatData} from "../../model/thunk/schoolHomeCertificatsThunk";
import {getSchoolHomeCertificatData} from "../../model/selector/schoolHomeCertificatsSelector";

const list = [1, 2, 3, 4]

export const SchoolHomeCertificats = memo(({setActive, setActiveEditItem , job}) => {

    const data = useSelector(getSchoolHomeCertificatData)

    const renderCertificats = useCallback(() => {
        return data?.map(item => {
            return (
                <div className={cls.item__container}>
                    <img
                        className={cls.item__image}
                        src={item?.images[0]?.image ?? image1}
                        // src={image1}
                        alt=""
                    />
                    <div className={cls.item__inner}>
                        {job && <div
                            onClick={() => {
                                setActive("edit")
                                setActiveEditItem(item)
                            }}
                            className={cls.item__change}
                        >
                            <i className="fas fa-edit"/>
                        </div>}
                        <h2 className={cls.item__title}>
                            {item?.name}
                        </h2>
                        <p className={cls.item__text}>
                            {item?.description}
                            {/*Cambridge IGCSE is the world’s most popular international curriculum for 14-16 year olds,*/}
                            {/*leading to globally recognised and valued Cambridge IGCSE qualifications. It is part of the*/}
                            {/*Cambridge Secondary 2 stage. Schools worldwide have helped*/}
                            {/*develop Cambridge IGCSE, which*/}
                            {/*provides excellent preparation for the Cambridge Advanced stage including Cambridge*/}
                            {/*International AS and A Levels and Cambridge Pre-U, as well as other progression routes. It*/}
                        </p>
                    </div>
                </div>
            )
        })
    }, [data])

    const render = renderCertificats()

    return (
        <div className={cls.certificats}>
            <div className={cls.certificats__wrapper}>
                <h2 className={cls.certificats__title}>Certificats</h2>
                {job && <div className={cls.certificats__add} onClick={() => setActive("add")}>
                    <img src={addIcon} alt=""/>
                </div>}
            </div>
            <div className={cls.item}>
                {render}
            </div>
        </div>
    )
})