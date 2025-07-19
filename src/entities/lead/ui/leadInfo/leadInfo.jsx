import React from 'react';



import cls from "./leadInfo.module.sass"


export const LeadInfo = ({info}) => {





    return (
        <div className={cls.info}>
            <div className={cls.info__item}>
                <h1>Name</h1>
                <h2>Ulug'bek</h2>
            </div>
            <div className={cls.info__item}>
                <h1>Surname</h1>
                <h2>Fatxullayev</h2>
            </div>

            <div className={cls.info__item}>
                <h1>Phone</h1>
                <h2>998 90 999 99 99</h2>
            </div>
        </div>
    );
};

