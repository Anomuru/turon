import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {
    getAttendanceData,
    studentProfileAttendanceDataPostThunk,
    studentProfileAttendanceDataThunk
} from "../../../studentPayment";
import {Select} from "shared/ui/select";
import {Button} from "shared/ui/button";

export const StudentAttendanceData = ({groupId}) => {
    const dispatch = useDispatch();
    const attendanceData = useSelector(getAttendanceData);
    const [years, setYears] = useState([]);
    const [months, setMonths] = useState([]);
    const [selectedYear, setSelectedYear] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("");
    const pathArray = window.location.pathname.split('/');
    const lastId = pathArray[pathArray.length - 1];

    useEffect(() => {
        if (groupId) {
            dispatch(studentProfileAttendanceDataThunk({id: groupId, lastId}));
        }
    }, [groupId, lastId]);

    useEffect(() => {
        if (attendanceData) {
            const yearsOptions = Object.keys(attendanceData).map(year => ({
                value: year,
                name: year
            }));

            setYears(yearsOptions);

            const currentYear = new Date().getFullYear().toString();
            const currentMonth = (new Date().getMonth() + 1).toString();

            if (yearsOptions.find(y => y.value === currentYear)) {
                setSelectedYear(currentYear);
                handleYearChange(currentYear);

                if (attendanceData[currentYear]?.includes(Number(currentMonth))) {
                    setSelectedMonth(currentMonth);
                }
            }
        }
    }, [attendanceData]);

    useEffect(() => {
        if (selectedMonth && selectedYear)
            dispatch(studentProfileAttendanceDataPostThunk({
                groupId,
                lastId,
                data: {year: +selectedYear, month: +selectedMonth}
            }))
    }, [selectedYear, selectedMonth])

    const handleYearChange = (selectedYear) => {
        setSelectedYear(selectedYear);
        const monthsOptions = attendanceData[selectedYear]?.map(month => ({
            value: month,
            name: month
        })) || [];

        setMonths(monthsOptions);


        if (monthsOptions.length > 0 && monthsOptions.find(m => m.value === Number(selectedMonth))) {
            setSelectedMonth(selectedMonth);
        }
    };

    const onHandleSubmit = async (month) => {
        const data = {
            year: Number(selectedYear),
            month: Number(month),
        };

        dispatch(studentProfileAttendanceDataPostThunk({groupId, lastId, data}));
    };

    return (
        <>
            <Select
                options={years}
                defaultValue={selectedYear}
                onChangeOption={handleYearChange}
            />
            <Select
                options={months}
                defaultValue={selectedMonth}
                onChangeOption={(month) => {
                    setSelectedMonth(month);
                    onHandleSubmit(month);
                }}
            />
        </>
    );
};
