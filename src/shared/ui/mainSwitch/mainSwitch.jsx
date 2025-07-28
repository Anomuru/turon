import React from 'react';
import switchIcon from 'shared/assets/images/main_switch.svg';
import cls from './mainSwitch.module.sass';

export const MainSwitch = ({isActive, onSwitch, children}) => {

    const handleSwitch = () => {
        onSwitch(!isActive);
    };


    return (
        <div className={cls.switchHandler}>
            <div className={cls.switchHandler}>
                <button
                    className={`${cls.mainSwitch} ${isActive ? `${cls.activeBg}` : `${cls.passiveBg}`} `}
                    onClick={handleSwitch}
                >
                    {isActive ?
                        <div>
                                        <span className={cls.mainSwitch__iconHandler}>
                                            <img className={cls.mainSwitch__icon} src={switchIcon} alt=""/>
                                        </span>
                        </div>
                        :
                        <div>
                                        <span className={cls.mainSwitch__iconHandler__center}>
                                            <img className={cls.mainSwitch__icon} src={switchIcon} alt=""/>
                                        </span>
                        </div>
                    }
                    {children}
                </button>
            </div>
        </div>
    );
};
