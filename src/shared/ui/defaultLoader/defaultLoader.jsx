import React from 'react';

import cls from "./defaultLoader.module.sass"


export const DefaultLoader = () => {
    return (
        <div className={cls.loader}>
            <div className={cls.spinner}>
                <div className={cls.loader__wrapper}>
                    <div />
                </div>
            </div>
        </div>
    );
};
