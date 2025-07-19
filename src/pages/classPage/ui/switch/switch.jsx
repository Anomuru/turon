import React, { useEffect, useState } from 'react';
import switchIcon from 'shared/assets/icons/types.svg';
import cls from './switch.module.sass';
import { useSelector, useDispatch } from 'react-redux';



export const ClassSwitch = ({ isActive, onSwitch }) => {


    const handleSwitch = () => {
        const newIsActive = !isActive;
        onSwitch(newIsActive);
    };

    return (
        <div className={cls.switchHandler}>
            <div className={cls.switchHandler}>
                <button
                    className={`${cls.mainSwitch} ${isActive ? `${cls.activeBg}` : `${cls.passiveBg}`} `}
                    onClick={() => {
                        handleSwitch()
                        onSwitch(!isActive)}}
                >
                    {isActive ?
                        <div>
                                        <span className={cls.mainSwitch__iconHandler}>
                                            <div className={cls.mainSwitch__icon}>
                                                <div className={cls.changeColorBox}/>
                                            </div>
                                        </span>
                        </div>
                        :
                        <div>
                                        <span className={cls.mainSwitch__iconHandler__center}>
                                            <img className={cls.mainSwitch__icon} src={switchIcon} alt=""/>
                                        </span>
                        </div>
                    }
                    {
                        isActive ?
                            <h3 className={cls.mainSwitch__type}>Types</h3>
                            :
                            <h3 className={cls.mainSwitch__text__center}> Color</h3>
                    }

                </button>
            </div>
        </div>
    );
}
