import React from 'react';

import cls from "./defaultLoader.module.sass"
export const DefaultPageLoader = ({status}) => {
    return (
        <div style={{position : status ? "" : "absolute"}} className={cls.defaultLoader}>
            <div className={cls.loadingio_spinner_rolling_fu80w05cx7e}>
                <div className={cls.defaultLoader_box}>
                    <div></div>
                </div>
            </div>
        </div>
    );
};

