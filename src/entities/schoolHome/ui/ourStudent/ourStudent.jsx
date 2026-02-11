import React from 'react';
import {useSelector} from "react-redux";
import {getSchoolLeaderShip} from "../../model/selector/schoolLeaderShipSelector";
import cls from "./ourStudent.module.sass";

export const OurStudent = () => {


    const leaderShip = useSelector(getSchoolLeaderShip)

    const renderDate = () => {
        return leaderShip.map(item => (
            <div className={cls.champions__wrapper_box}>
                <div className={cls.champions__wrapper_box_img}>
                    <img src={item.img} alt=""/>
                </div>

                <div className={cls.champions__wrapper_box_info}>
                    <div className={cls.champions__wrapper_box_info_name}>
                        {item.name}
                    </div>
                    <div className={cls.champions__wrapper_box_info_job}>
                        {item.job}
                    </div>
                    <div className={cls.champions__wrapper_box_info_descr}>
                        {item.descr}
                    </div>
                </div>

            </div>
        ))
    }

    return (
        <div className={cls.champions}>
            <div className={cls.champions__title}>
                <h1>Student council</h1>
                <div className={cls.champions__locations}>
                    <span>Chirchiq</span>
                    <span>Chirchiq</span>
                    <span>Chirchiq</span>
                </div>
            </div>


            <div className={cls.champions__wrapper}>
                {renderDate()}
            </div>
        </div>
    );
};

export default OurStudent;