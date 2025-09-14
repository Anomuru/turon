import {Statistics} from "entities/statistics/index.js";
import {statisticsReducer} from "entities/statistics/model/statisticsSlice.js";
import {DynamicModuleLoader} from "shared/lib/components/DynamicModuleLoader/DynamicModuleLoader.jsx";
import {useDispatch, useSelector} from "react-redux";
import {getStatistics, getStatisticsLoading} from "entities/statistics/model/statisticsSelector.js";
import {Input} from "shared/ui/input/index.js";

import cls from "./statisticsPage.module.sass"
import {useEffect, useState} from "react";
import {useHttp} from "shared/api/base.js";
import {fetchStatistics} from "entities/statistics/model/statisticsThunk.js";


const reducers = {
    statisticsSlice: statisticsReducer
}

export const StatisticsPage = () => {
    const data = useSelector(getStatistics)
    const loading = useSelector(getStatisticsLoading)
    const [from, setFrom] = useState()
    const [to, setTo] = useState()
    const dispatch = useDispatch()
    const branchId = localStorage.getItem("branchId")
    useEffect(() => {
        if (from && to) {

            const data = {
                from_date: from,
                to_date: to,
                branch:branchId
            }

            dispatch(fetchStatistics(data))
        }
    }, [to, from])

    return (
        <DynamicModuleLoader reducers={reducers}>
            <div className={cls.statistics}>
                <Input onChange={(e) => setFrom(e.target.value)} extraClassName={cls.statistics__input} type={"date"}/>
                <Input onChange={(e) => setTo(e.target.value)} extraClassName={cls.statistics__input} type={"date"}/>
            </div>

            <div className={cls.statistics__container}>

                <Statistics data={data} loading={loading}/>

            </div>
        </DynamicModuleLoader>
    );
};

