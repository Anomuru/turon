import {Statistics} from "entities/statistics/index.js";
import {statisticsReducer} from "entities/statistics/model/statisticsSlice.js";
import {useNavigate} from "react-router";
import {DynamicModuleLoader} from "shared/lib/components/DynamicModuleLoader/DynamicModuleLoader.jsx";
import {useDispatch, useSelector} from "react-redux";
import {getStatistics, getStatisticsLoading} from "entities/statistics/model/statisticsSelector.js";
import {Button} from "shared/ui/button/index.js";
import {Input} from "shared/ui/input/index.js";

import cls from "./statisticsPage.module.sass"
import {useEffect, useState} from "react";
import {fetchStatistics} from "entities/statistics/model/statisticsThunk.js";
import {getPaymentType} from "entities/capital/model/thunk/capitalThunk.js";
import {capitalReducer, getCapitalTypes} from "entities/capital/index.js";
import {Radio} from "shared/ui/radio/index.js";
import {getSelectedLocations} from "features/locations/index.js";
import {getCurrentBranch} from "entities/oftenUsed/model/oftenUsedSelector.js";

const reducers = {
    statisticsSlice: statisticsReducer,
    CapitalSlice: capitalReducer,
};

export const StatisticsPage = () => {
    const dispatch = useDispatch();
    const data = useSelector(getStatistics);
    const loading = useSelector(getStatisticsLoading);

    const navigate = useNavigate()
    const today = new Date().toISOString().slice(0, 10);
    const [from, setFrom] = useState(today);
    const [to, setTo] = useState(today);

    const branchId = localStorage.getItem("branchId");
    const ROLE = localStorage.getItem("job")
    const currentBranch = useSelector(getCurrentBranch)
    const branchForFilter =
        ROLE === "director"
            ? currentBranch
            : branchId;
    const paymentType = useSelector(getCapitalTypes)

    const [activePayment , setActivePayment] = useState()


    useEffect(() => {
        if (paymentType) {
            setActivePayment(paymentType[0]?.name)
        }
    } , [paymentType])

    console.log(paymentType, "paymentType")
    useEffect(() => {
        dispatch(getPaymentType())
    }, [])
    useEffect(() => {
        if (from && to && activePayment) {
            const data = {
                from_date: from,
                to_date: to,
                branch: branchForFilter,
            };
            dispatch(fetchStatistics({data ,  activePayment}));
        }
    }, [from, to , activePayment, branchForFilter]);

    return (
        <DynamicModuleLoader reducers={reducers}>
            <div className={cls.statistics}>
                <Button onClick={() => navigate(`../dailyReport`)} extraClass={cls.button} type={"filter"}>Kunlik hisobot</Button>
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
            <div className={cls.statistics__payment}>
                {paymentType?.map(item => (
                    <Radio
                        key={item.id}
                        onChange={() => setActivePayment(item.name)}
                        checked={activePayment === item.name}
                    >
                        {item.name}
                    </Radio>
                ))}
            </div>
            <div className={cls.statistics__container}>
                <Statistics data={data} loading={loading}/>
            </div>
        </DynamicModuleLoader>
    );
};
