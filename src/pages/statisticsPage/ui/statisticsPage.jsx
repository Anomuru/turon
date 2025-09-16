import {Statistics} from "entities/statistics/index.js";
import {statisticsReducer} from "entities/statistics/model/statisticsSlice.js";
import {DynamicModuleLoader} from "shared/lib/components/DynamicModuleLoader/DynamicModuleLoader.jsx";
import {useDispatch, useSelector} from "react-redux";
import {getStatistics, getStatisticsLoading} from "entities/statistics/model/statisticsSelector.js";
import {Input} from "shared/ui/input/index.js";

import cls from "./statisticsPage.module.sass"
import {useEffect, useState} from "react";
import {fetchStatistics} from "entities/statistics/model/statisticsThunk.js";

const reducers = {
    statisticsSlice: statisticsReducer
};

export const StatisticsPage = () => {
    const dispatch = useDispatch();
    const data = useSelector(getStatistics);
    const loading = useSelector(getStatisticsLoading);

    const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD" format
    const [from, setFrom] = useState(today);
    const [to, setTo] = useState(today);

    const branchId = localStorage.getItem("branchId");

    useEffect(() => {
        if (from && to) {
            const data = {
                from_date: from,
                to_date: to,
                branch: branchId
            };
            dispatch(fetchStatistics(data));
        }
    }, [from, to]);

    return (
        <DynamicModuleLoader reducers={reducers}>
            <div className={cls.statistics}>
                <Input
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    extraClassName={cls.statistics__input}
                    type="date"
                />
                <Input
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    extraClassName={cls.statistics__input}
                    type="date"
                />
            </div>
            <div className={cls.statistics__container}>
                <Statistics data={data} loading={loading} />
            </div>
        </DynamicModuleLoader>
    );
};
