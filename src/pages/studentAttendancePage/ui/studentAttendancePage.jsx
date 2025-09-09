import React, {Fragment, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";

import {groupProfileReducer} from "entities/profile/groupProfile/model/groupProfileSlice";
import {getSchoolAttendanceAll, getSchoolAttendanceForDay} from "entities/profile/groupProfile/model/groupProfileThunk";
import {
    getAttendance,
    getAttendanceAll, getAttendanceAllForDay,
    getAttendanceListForDay
} from "entities/profile/groupProfile/model/groupProfileSelector";
import {DynamicModuleLoader} from "shared/lib/components/DynamicModuleLoader/DynamicModuleLoader";
import {Select} from "shared/ui/select";

import cls from "./studentAttendancePage.module.sass";
import {getUserBranchId} from "entities/profile/userProfile/index.js";
import {Table} from "shared/ui/table/index.js";

const reducers = {
    groupProfileSlice: groupProfileReducer
}

export const StudentAttendancePage = () => {

    const dispatch = useDispatch()

    const attendanceListForDay = useSelector(getAttendanceListForDay)
    const attendanceAllForDay = useSelector(getAttendanceAllForDay)
    const attendanceDates = useSelector(getAttendanceAll)
    const branch = useSelector(getUserBranchId)

    const [attendanceYears, setAttendanceYears] = useState([])
    const [selectedYear, setSelectedYear] = useState(null)
    const [attendanceMonth, setAttendanceMonth] = useState([])
    const [selectedMonth, setSelectedMonth] = useState(null)
    const [attendanceDays, setAttendanceDays] = useState([])
    const [selectedDay, setSelectedDay] = useState(null)

    const onSelectYear = (year) => {
        setSelectedYear(+year);

        const yearData = attendanceDates?.filter(item => item.year === +year)[0];
        if (yearData) {
            const months = yearData?.months?.map(m => m.month);
            setAttendanceMonth(months);

            const lastMonthObj = yearData?.months[yearData?.months?.length - 1];
            setSelectedMonth(lastMonthObj?.month);

            setAttendanceDays(lastMonthObj?.days);
            setSelectedDay(lastMonthObj?.days[lastMonthObj?.days?.length - 1]);
        }
    };

    const onSelectMonth = (month) => {
        setSelectedMonth(month);

        const yearData = attendanceDates.filter(item => item.year === selectedYear)[0];
        if (yearData) {
            const monthData = yearData?.months?.filter(m => m.month === +month)[0];
            if (monthData) {
                setAttendanceDays(monthData?.days);

                setSelectedDay(monthData?.days[monthData?.days?.length - 1]);
            }
        }
    };


    useEffect(() => {
        if (attendanceDates && attendanceDates.length) {
            const lastYear = attendanceDates[attendanceDates?.length - 1]?.year
            const yearMonths = attendanceDates.filter(item => item.year === lastYear)[0]?.months
            const lastMonth = yearMonths[yearMonths?.length - 1]
            setAttendanceYears(attendanceDates?.map(item => item?.year))
            setAttendanceMonth(yearMonths?.map(item => item?.month))
            setSelectedYear(lastYear)
            setSelectedMonth(lastMonth?.month)
            setAttendanceDays(lastMonth?.days)
            setSelectedDay(lastMonth?.days[lastMonth?.days?.length - 1])
        }
    }, [attendanceDates])

    useEffect(() => {
        dispatch(getSchoolAttendanceAll())
    }, [])

    useEffect(() => {
        if (selectedDay && selectedMonth && selectedYear && branch)
            dispatch(getSchoolAttendanceForDay({
                branch,
                day: selectedDay,
                month: selectedMonth,
                year: selectedYear
            }))
    }, [selectedDay, selectedMonth, selectedYear, branch])

    const render = () => {
        return attendanceListForDay?.map((item, i) => (
            <>
                <div className={cls.header}>
                    <h2 className={cls.header__title}>{item?.group_name}</h2>
                    <div className={cls.header__numbers}>
                        <h2 className={cls.subTitle} style={{color: "#22C55E"}}>Kelganlar: {item?.summary?.present}</h2>
                        <h2 className={cls.subTitle}
                            style={{color: "#F43F5E"}}>Kelmaganlar: {item?.summary?.absent}</h2>
                        <h2 className={cls.subTitle}>Umumiy: {item?.summary?.total}</h2>
                    </div>
                </div>

                {
                    item?.students?.length
                        ? item?.students.map((itemIn, i) => (

                            <tbody>
                            <tr>
                                <td>{i + 1}</td>
                                <td>{itemIn?.name} {itemIn?.surname}</td>
                                <td>
                                    {
                                        itemIn?.status === null
                                            ? "qilinmagan"
                                            : itemIn?.status ? (
                                                <i className="fas fa-check" style={{color: "#22C55E"}}/>
                                            ) : (
                                                <i className="fas fa-times" style={{color: "#F43F5E"}}/>
                                            )
                                    }
                                </td>
                            </tr>
                            </tbody>

                        ))
                        : "student yo"
                }

            </>
        ))
    }

    return (
        <DynamicModuleLoader reducers={reducers}>
            <div className={cls.studentAttendance}>
                <div className={cls.studentAttendance__header}>
                    <div className={cls.info}>
                        <h1>Davomat</h1>
                        <div className={cls.subTitles}>
                            <h2 className={cls.subTitle}
                                style={{color: "#22C55E"}}>Kelganlar: {attendanceAllForDay?.present}</h2>
                            <h2 className={cls.subTitle}
                                style={{color: "#F43F5E"}}>Kelmaganlar: {attendanceAllForDay?.absent}</h2>
                            <h2 className={cls.subTitle}>Umumiy: {attendanceAllForDay?.total}</h2>
                        </div>
                    </div>
                    <div className={cls.selects}>
                        <Select
                            titleOption={"Kun"}
                            options={attendanceDays}
                            onChangeOption={setSelectedDay}
                            defaultValue={selectedDay}
                        />
                        <Select
                            titleOption={"Oy"}
                            onChangeOption={onSelectMonth}
                            options={attendanceMonth}
                            defaultValue={selectedMonth}
                        />
                        <Select
                            titleOption={"Yil"}
                            onChangeOption={onSelectYear}
                            options={attendanceYears}
                            defaultValue={selectedYear}
                        />
                    </div>
                </div>
                <div className={cls.studentAttendance__container}>
                    <Table>
                        <thead style={{top: 0, position: "initial"}}>
                        <tr>
                            <th>No</th>
                            <th>Ism Familiya</th>
                            <th>Davomat</th>
                        </tr>
                        </thead>
                        {render()}
                    </Table>
                </div>
            </div>
        </DynamicModuleLoader>
    );
};

