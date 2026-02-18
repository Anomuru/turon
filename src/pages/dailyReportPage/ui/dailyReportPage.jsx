import {getUserBranchId} from "entities/profile/userProfile/index.js";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {API_URL, headers, useHttp} from "shared/api/base.js";
import {DefaultPageLoader} from "shared/ui/defaultLoader/index.js";
import {Input} from "shared/ui/input/index.js";
import { Select } from "shared/ui/select/index.js";
import cls from "./dailyReport.module.sass";
import {getCurrentBranch} from "entities/oftenUsed/model/oftenUsedSelector.js";

const reportData = [
    {
        day: 23,
        newGroups: 0,
        deletedGroups: 0,
        paymentsCount: 1,
        paymentsAmount: 360000,
        newStudents: 1,
        removedFromGroup: 0,
        removedFromRegistration: 0,
    },
    {
        day: 22,
        newGroups: 0,
        deletedGroups: 1,
        paymentsCount: 7,
        paymentsAmount: 3000000,
        newStudents: 0,
        removedFromGroup: 0,
        removedFromRegistration: 0,
    },
    {
        day: 21,
        newGroups: 0,
        deletedGroups: 0,
        paymentsCount: 0,
        paymentsAmount: 0,
        newStudents: 0,
        removedFromGroup: 0,
        removedFromRegistration: 0,
    },   {
        day: 21,
        newGroups: 0,
        deletedGroups: 0,
        paymentsCount: 0,
        paymentsAmount: 0,
        newStudents: 0,
        removedFromGroup: 0,
        removedFromRegistration: 0,
    },   {
        day: 21,
        newGroups: 0,
        deletedGroups: 0,
        paymentsCount: 0,
        paymentsAmount: 0,
        newStudents: 0,
        removedFromGroup: 0,
        removedFromRegistration: 0,
    },
];

export const DailyReportPage = () => {


    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [data , setData] = useState([])
    const getCurrentMonth = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        return `${year}-${month}`;
    };

    const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());


    const { request } = useHttp();
    const currentBranch = useSelector(getCurrentBranch)
    const ROLE = localStorage.getItem("job")
    const branchId = useSelector(getUserBranchId);
    const branchForFilter =
        ROLE === "director"
            ? currentBranch
            : branchId;


    useEffect(() => {
        if (!selectedMonth || !branchForFilter) return;

        const [year, month] = selectedMonth.split("-");

        setLoading(true);

        request(
            `${API_URL}Encashment/daily-summary/?branch_id=${branchForFilter}&year=${year}&month=${Number(month)}`, "GET", null, headers()
        )
            .then((res) => {
                console.log(res);
                setData(res)
            })
            .catch(err =>{
                setError(true)
            })
            .finally(() => setLoading(false));
    }, [selectedMonth, branchForFilter]);



    return (
        <div className={cls.report}>
            <div className={cls.report__header}>
                <Input
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                />
            </div>


            {loading  ? <DefaultPageLoader/> :
                error ? <div className={cls.report__error}>

                    <h2>Xatolik yuz berdi. Qayta urinib ko‘ring.</h2>

                    <img src="https://static.vecteezy.com/system/resources/thumbnails/051/667/743/small/icon-logo-of-a-cute-robot-with-an-error-on-the-screen-a-chatbot-the-robot-is-a-virtual-assistant-vector.jpg" alt=""/>
                    </div> :

            <div className={cls.report__list}>
                {data.map((item) => (
                    <div key={item.date} className={cls.report__box}>
                        <div className={cls.report__day}>📅 {item.date}-kun</div>

                        <div className={cls.report__stats}>
                            <div className={cls.report__card}>
                                <div className={cls.report__label}>Umumiy o'quvchilar</div>
                                <div className={cls.report__value}>{item.total_students}</div>
                            </div>

                            <div className={cls.report__card}>
                                <div className={cls.report__label}>O‘chirilgan o'quvchilar</div>
                                <div className={cls.report__value}>{item.deleted_students}</div>
                            </div>
                            <div className={cls.report__card}>
                                <div className={cls.report__label}>Yangi o‘quvchilar</div>
                                <div className={cls.report__value}>{item.new_students}</div>
                            </div>
                            <div className={cls.report__card}>
                                <div className={cls.report__label}>To‘lovlar soni</div>
                                <div className={cls.report__value}>{item.total_payments}</div>
                            </div>

                            <div className={cls.report__card}>
                                <div className={cls.report__label}>To‘lovlar summasi</div>
                                <div className={cls.report__value}>
                                    {item.total_payments_sum.toLocaleString()} so'm
                                </div>
                            </div>



                            {/*<div className={cls.report__card}>*/}
                            {/*    <div className={cls.report__label}>*/}
                            {/*        Guruhdan chiqarilganlar*/}
                            {/*    </div>*/}
                            {/*    <div className={cls.report__value}>*/}
                            {/*        {item.total_students}*/}
                            {/*    </div>*/}
                            {/*</div>*/}

                            {/*<div className={cls.report__card}>*/}
                            {/*    <div className={cls.report__label}>*/}
                            {/*        Registratsiyadan o‘chirilganlar*/}
                            {/*    </div>*/}
                            {/*    <div className={cls.report__value}>*/}
                            {/*        {item.removedFromRegistration}*/}
                            {/*    </div>*/}
                            {/*</div>*/}
                        </div>
                    </div>
                ))}
            </div> }
        </div>
    );
};
