import cls from "./groupObserve.module.sass"
import { Select } from "shared/ui/select/index.js";
import { useDispatch, useSelector } from "react-redux";
import { getGroupObserve, getGroupObserveOption } from "features/groupProfile/model/groupObserve/groupObserveSelector.js";
import { Textarea } from "shared/ui/textArea/index.js";
import { useEffect, useState } from "react";
import { API_URL, headers, useHttp } from "shared/api/base.js";
import { useParams } from "react-router-dom";
import { Button } from "shared/ui/button/index.js";
import { onAddAlertOptions } from "features/alert/model/slice/alertSlice.js";
import {
    fetchGroupObserve,
    fetchGroupObserveOption
} from "features/groupProfile/model/groupObserve/groupObserveThunk.js";
import { DefaultLoader } from "shared/ui/defaultLoader/index.js";

export const GroupObserve = () => {

    const observe = useSelector(getGroupObserve)
    const option = useSelector(getGroupObserveOption)
    const [fields, setFields] = useState([])
    const [months, setMonths] = useState([])
    const [observationTools, setObservationTools] = useState([])
    const [month, setMonth] = useState(null)
    const [day, setDays] = useState(null)
    const [loading, setLoading] = useState(false)
    const { id } = useParams()

    const dispatch = useDispatch()
    const { request } = useHttp()

    const getYearForMonth = (monthValue) => {
        const match = observationTools.find(tool => {
            const [y, m] = tool.date.split("-")
            return m === monthValue
        })
        if (match) return match.date.split("-")[0]
        return String(new Date().getFullYear())
    }

    useEffect(() => {
        dispatch(fetchGroupObserve());
        dispatch(fetchGroupObserveOption());
    }, [dispatch]);

    useEffect(() => {
        setLoading(true)
        request(`${API_URL}Observation/teacher_observe/${id}/`, "GET", null, headers())
            .then(res => {
                setObservationTools(res.observation_tools || [])
                setMonths(res.old_current_dates)
                if (res.old_current_dates.length > 0) {
                    setMonth(res.old_current_dates[0].value)
                }
            })
            .finally(() => setLoading(false))
    }, [])

    useEffect(() => {
        if (!month || !day || !observe?.length) return
        const year = getYearForMonth(month)
        setLoading(true)
        request(`${API_URL}Observation/observed_group_info/${id}/`, "POST", JSON.stringify({ month, day, year, id }), headers())
            .then(res => {
                if (res?.info?.length > 0) {
                    setFields(res.info.map((infoItem, idx) => ({
                        ...observe[idx],
                        value: infoItem.values.find(v => v.value !== "")?.value ?? "1",
                        comment: infoItem.comment || ""
                    })))
                } else {
                    setFields(observe.map(item => ({ ...item, value: "1", comment: "" })))
                }
            })
            .catch(() => {
                setFields(observe.map(item => ({ ...item, value: "1", comment: "" })))
            })
            .finally(() => setLoading(false))
    }, [month, day, observe])

    const onChangeOption = (value, id) => {
        setFields(items => items.map(item => {
            if (item.id === id) {
                return {
                    ...item,
                    value: value
                }
            }
            return item
        }))
    }
    const onChangeText = (value, id) => {
        setFields(items => items.map(item => {
            if (item.id === id) {
                return {
                    ...item,
                    comment: value
                }
            }
            return item
        }))
    }
    const onSubmit = () => {
        if (!month || !day) return
        const year = getYearForMonth(month)

        setLoading(true)
        request(`${API_URL}Observation/teacher_observe/${id}/`, "POST", JSON.stringify({ list: fields, month, day, year, id }), headers())
            .then(res => {
                dispatch(onAddAlertOptions({
                    type: "success",
                    status: true,
                    msg: res.msg
                }))
                return request(`${API_URL}Observation/observed_group_info/${id}/`, "POST", JSON.stringify({ month, day, year, id }), headers())
            })
            .then(res => {
                if (res?.info?.length > 0) {
                    setFields(res.info.map((infoItem, idx) => ({
                        ...observe[idx],
                        value: infoItem.values.find(v => v.value !== "")?.value ?? "1",
                        comment: infoItem.comment || ""
                    })))
                }
            })
            .finally(() => setLoading(false))
    }

    return (
        <div className={cls.observe}>
            {loading && <DefaultLoader />}

            <h2>Observe Teacher</h2>
            <div className={cls.observe__select}>
                {months.length > 1 &&
                    <Select title={"Oy"} name={"month"} defaultValue={months[0].value} options={months} value={month} onChangeOption={setMonth} />}
                <Select title={"Kun"} defaultValue={months.filter(item => item.value === month)[0]?.days[0]} name={"day"} options={months.filter(item => item.value === month)[0]?.days}
                    value={day} onChangeOption={setDays} />
            </div>


            <div className={cls.fields}>
                {observe && fields?.map((item, key) => (
                    <div className={cls.field} key={key}>
                        <h2>{item.title} </h2>
                        <Select
                            name={`select-${key}`}
                            value={item.value}
                            extraClassName={cls.select}
                            onChangeOption={(e) => onChangeOption(e, item.id)}
                            options={option}
                            defaultValue={1}
                        />
                        <Textarea
                            value={item.comment}
                            onChange={(e) => onChangeText(e, item.id)}
                            required
                            extraClassName={cls.textarea}
                        />
                    </div>
                ))}
            </div>
            <div className={cls.footer}>
                <Button
                    onClick={onSubmit}
                // formId={"fields"}
                // type={"submit"}
                >
                    Tasdiqlash
                </Button>
            </div>
        </div>
    );
};

