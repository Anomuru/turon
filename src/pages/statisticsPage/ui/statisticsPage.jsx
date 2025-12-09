import {Statistics} from "entities/statistics/index.js";
import {statisticsReducer} from "entities/statistics/model/statisticsSlice.js";
import {DynamicModuleLoader} from "shared/lib/components/DynamicModuleLoader/DynamicModuleLoader.jsx";
import {useDispatch, useSelector} from "react-redux";
import {getStatistics, getStatisticsLoading} from "entities/statistics/model/statisticsSelector.js";
import {Input} from "shared/ui/input/index.js";

import cls from "./statisticsPage.module.sass"
import {useEffect, useState} from "react";
import {fetchStatistics} from "entities/statistics/model/statisticsThunk.js";
import {getPaymentType} from "entities/capital/model/thunk/capitalThunk.js";
import {capitalReducer, getCapitalTypes} from "entities/capital/index.js";
import {Radio} from "shared/ui/radio/index.js";
import {getSelectedLocations} from "features/locations/index.js";
import {Select} from "shared/ui/select/index.js";

const reducers = {
    statisticsSlice: statisticsReducer,
    CapitalSlice: capitalReducer,
};

const optionData = [
    { name: "Barchasi", value: "all" },
    { name: "Yangi o‘quvchilar", value: "new_students" },
    { name: "To‘lovlar", value: "student_payments" },
    { name: "O‘qituvchi oyliklari", value: "teacher_salaries" },
    { name: "Ishchilar oyliklari", value: "user_salaries" },
    { name: "Yangi guruhlar", value: "new_groups" },
    { name: "Yangi leadlar", value: "new_leads" },
    { name: "Overhead payments", value: "overhead_payments" },
]
export const StatisticsPage = () => {
    const dispatch = useDispatch();
    const data = useSelector(getStatistics);
    const loading = useSelector(getStatisticsLoading);
    const [activeFilter, setActiveFilter] = useState("all");

    const today = new Date().toISOString().slice(0, 10);
    const [from, setFrom] = useState(today);
    const [to, setTo] = useState(today);

    const branchId = localStorage.getItem("branchId");
    const selectedBranch = useSelector(getSelectedLocations);
    const branchForFilter = selectedBranch?.id ?? branchId;
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
           <div className={cls.header}>
               <Select
                   value={activeFilter}
                   onChangeOption={setActiveFilter}
                   options={optionData}
               />

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
                <Statistics data={data} loading={loading} filter={activeFilter}/>
            </div>
        </DynamicModuleLoader>
    );
};
