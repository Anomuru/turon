import React from 'react';
import {roomsReducer} from "entities/rooms/index.js";
import {DynamicModuleLoader} from "shared/lib/components/DynamicModuleLoader/DynamicModuleLoader.jsx";


import cls from "./quarterMasterPage.module.sass";
import {QuarterMaster} from "entities/quarterMaster/index.js";
import {useSelector} from "react-redux";
import {quarterMasterSelector} from "pages/quarterMasterPage/model/quarterMasterSelector.js";
import {quarterMasterReducer} from "pages/quarterMasterPage/model/quarterMasterSlice.js";

const reducers = {
    quarterMasterSlice: quarterMasterReducer,

}

export const QuarterMasterPage = () => {

    const data = useSelector(quarterMasterSelector);

    return (
        <DynamicModuleLoader reducers={reducers}>
            <div className={cls.master}>
                <div className={cls.master__box}>
                    <h1 className={cls.master__box__title}>Maktab uchun zarur buyumlar</h1>
                    <h3 className={cls.master__box__subtitle}>O'qituvchilar tomonidan yuborilgan talablar ro'yxati</h3>
                </div>
                <div className={cls.master__list}>
                    <QuarterMaster data={data}/>
                </div>

            </div>
        </DynamicModuleLoader>

    );
};

