import {onAddAlertOptions} from "features/alert/model/slice/alertSlice";
import {changeDayType} from "pages/calendarPage/model/calendarSlice";
import {useEffect, useState} from 'react';
import {useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";

import {CalendarList} from "features/calendarList"
import {
    CalendarHeader,
    CalendarAdd
} from "entities/calendar";
import {API_URL, headers, useHttp} from "shared/api/base";
import {deleteDayType, fetchCalendarData} from "../model/calendarThunk";
import {getCalendarData, getCalendarLoading} from "../model/calendarSelector";

// http://192.168.0.109:8000/Calendar/get-calendar/{current_year}/{next_year}/
// http://192.168.0.103:8000/Calendar/change-type/

import cls from "./calendarPage.module.sass";

export const CalendarPage = () => {

    const {request} = useHttp()
    const dispatch = useDispatch()
    const {register, handleSubmit, setValue} = useForm()
    const calendarData = useSelector(getCalendarData)
    const calendarLoading = useSelector(getCalendarLoading)
    const [active, setActive] = useState({})
    const [data, setData] = useState({})
    const [isChanged, setIsChanged] = useState(false)
    const currentYear = new Date().getFullYear()

    const onSubmitAdd = (data) => {
        let res;

        setData({...data, ...active, color: data?.color ?? "black"})

        if (active?.length) {
            res = {...data, days: active, color: data?.color ?? "black"}
        } else if (active?.selected?.length) {
            res = {...data, days: active?.selected, color: data?.color ?? "black"}
        } else {
            res = {...data, ...active, color: data?.color ?? "black"}
        }


        request(`${API_URL}Calendar/change-type/`, "POST", JSON.stringify(res), headers())
            .then(res => {
                dispatch(changeDayType(res))
                dispatch(onAddAlertOptions({
                    type: "success",
                    status: true,
                    msg: `${res.length > 1 ? "Kunlar": "Kun"} qo'shildi`
                }))
            })
            .catch(err => console.log(err))
        // dispatch(changeDayType(res))
        setActive({})
        // active.onClear()
        setIsChanged(true)
    }

    // const onSubmitDelete = (data) => {

    //     dispatch(deleteDayType({days: data}))
    // }

    useEffect(() => {
        dispatch(fetchCalendarData({current_year: currentYear, next_year: currentYear + 1}))
    }, [])

    return (
        <div className={cls.calendarPage}>
            <CalendarHeader/>
            <CalendarList
                setActive={setActive}
                currentData={data}
                loading={calendarLoading}
                data={calendarData}
                onSubmit={setActive}
                onDelete={(someFunc) => someFunc([{}])}
                isChanged={isChanged}
                setIsChanged={setIsChanged}
                // onSubmitDelete={onSubmitDelete}
            />
            <CalendarAdd
                active={active?.finishValue || active?.length}
                setActive={setActive}
                onSubmit={handleSubmit(onSubmitAdd)}
                register={register}
                setValue={setValue}
                success={data}
            />
        </div>
    )
}
