import cls from "./groupObserve.module.sass"
import {Select} from "shared/ui/select/index.js";
import {useDispatch, useSelector} from "react-redux";
import {getGroupObserve, getGroupObserveOption} from "features/groupProfile/model/groupObserve/groupObserveSelector.js";
import {Textarea} from "shared/ui/textArea/index.js";
import {useEffect, useState} from "react";
import {API_URL, headers, useHttp} from "shared/api/base.js";
import {useParams} from "react-router-dom";
import {Button} from "shared/ui/button/index.js";
import {onAddAlertOptions} from "features/alert/model/slice/alertSlice.js";

export const GroupObserve = () => {

    const observe = useSelector(getGroupObserve)
    const option = useSelector(getGroupObserveOption)
    const [fields, setFields] = useState([])
    const [months, setMonths] = useState([])
    const [month, setMonth] = useState(null)
    const [day, setDays] = useState(null)
    const {id} = useParams()

    const dispatch = useDispatch()
    const {request} = useHttp()
    useEffect(() => {
        if (observe) {
            setFields(observe?.map(item => ({...item, value: "1"})))
        }
    }, [observe])


    useEffect(() => {
        request(`${API_URL}Observation/teacher_observe/${id}/`, "GET", null, headers())
            .then(res => {
                if (res.old_current_dates.length < 1) {
                    setMonth(res.old_current_dates[0].value)
                    setMonths(res.old_current_dates)
                } else {
                    setMonths(res.old_current_dates)
                }
            })
    }, [])

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
    const onSubmit = (e) => {
        if (month && day) {


            request(`${API_URL}Observation/teacher_observe/${id}/`, "POST", JSON.stringify({list: fields,month,day}),headers())
                .then(res => {
                    // dispatch(setMessage({
                    //     msg: res.msg,
                    //     type: "success",
                    //     active: true
                    // }))
                    dispatch(onAddAlertOptions({
                        type: "success",
                        status: true,
                        msg: res.msg
                    }))
                })
        } else {
        }

    }

    return (
        <div className={cls.observe}>

            <h2>Observe Teacher</h2>
            <div className={cls.observe__select}>
                {months.length > 1 &&
                    <Select title={"Oy"} name={"month"} defaultValue={months[0].value}  options={months} value={month} onChangeOption={setMonth}/>}
                <Select title={"Kun"} defaultValue={months.filter(item => item.value === month)[0]?.days[0]} name={"day"} options={months.filter(item => item.value === month)[0]?.days}
                        value={day} onChangeOption={setDays}/>
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

