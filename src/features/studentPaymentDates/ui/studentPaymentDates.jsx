import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {getPaymentDates, studentPaymentDataThunk, studentPaymentDataPostThunk} from "../../studentPayment";
import {Select} from "shared/ui/select";

export const StudentPaymentDates = () => {
    const dispatch = useDispatch();
    const paymentDate = useSelector(getPaymentDates);
    const date = paymentDate.payments_by_year;
    const [years, setYears] = useState([]);
    const [months, setMonths] = useState([]);
    const [selectedYear, setSelectedYear] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("");
    const pathArray = window.location.pathname.split('/');
    const lastId = pathArray[pathArray.length - 1];

    useEffect(() => {
        dispatch(studentPaymentDataThunk(lastId));
    }, [lastId]);

    useEffect(() => {
        if (date) {
            const yearsOptions = date.map(year => ({
                value: year.name,
                name: year.name
            }));

            setYears(yearsOptions);

            const currentYear = new Date().getFullYear().toString();
            const currentMonth = (new Date().getMonth() + 1).toString();

            if (yearsOptions.find(y => y.value === currentYear)) {
                setSelectedYear(currentYear);
                handleYearChange(currentYear);

                if (date.find(y => y.name.toString() === currentYear)?.months.includes(Number(currentMonth))) {
                    setSelectedMonth(currentMonth);
                }
            }
        }
    }, [date]);

    useEffect(() => {
        if (selectedMonth && selectedYear) {
            dispatch(studentPaymentDataPostThunk({
                lastId,
                data: {year: +selectedYear, month: +selectedMonth}
            }));
        }
    }, [lastId,selectedYear, selectedMonth]);

    const handleYearChange = (selectedYear) => {
        setSelectedYear(selectedYear);
        const selectedYearData = date.find(y => y.name.toString() === selectedYear);
        const monthsOptions = selectedYearData?.months.map(month => ({
            value: month,
            name: month
        })) || [];

        setMonths(monthsOptions);

        if (monthsOptions.length > 0 && monthsOptions.find(m => m.value === Number(selectedMonth))) {
            setSelectedMonth(selectedMonth);
        } else {
            setSelectedMonth(monthsOptions[0]?.value.toString());
        }
    };

    const onHandleSubmit = async (month) => {
        const data = {
            year: Number(selectedYear),
            month: Number(month),
        };

        dispatch(studentPaymentDataPostThunk({id: lastId, data}));
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
