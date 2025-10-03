import cls from './groupObservedDates.module.sass'
import {Select} from "shared/ui/select/index.js";
import {API_URL, headers, useHttp} from "shared/api/base.js";
import {useDispatch} from "react-redux";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Table} from "shared/ui/table/index.js";

export const ObservedDates = () => {
    const dispatch = useDispatch()
    const {request} = useHttp()
    const {id} = useParams()

    const [year, setYear] = useState()
    const [years, setYears] = useState([])

    const [month, setMonth] = useState()
    const [months, setMonths] = useState([])


    const [day, setDay] = useState()
    const [days, setDays] = useState([])

    const [observationsOptions, setObservationOptions] = useState([])
    const [info, setInfo] = useState([])
    const [observer, setObserver] = useState({})
    const [average, setAverage] = useState("")
    const [comment, setComment] = useState("")

    useEffect(() => {
        if (id) {
            request(`${API_URL}Observation/observed_group/${id}/`, "GET", null, headers())
                .then(res => {

                    if (res.month_list.length === 1) {
                        setMonth(res.month_list[0])
                    } else {
                        setMonth(res.month)
                    }
                    setMonths(res.month_list)

                    if (res.years_list.length === 1) {
                        setYear(res.years_list[0])
                    }
                    setYears(res.years_list)


                    setYear(res.year)

                })
        }
    }, [])
    useEffect(() => {
        if (year && month) {
            request(`${API_URL}Observation/observed_group/${id}/${year}-${month}/`, "GET", null, headers())
                .then(res => {
                    setDays(res.days)
                })
        }

    }, [year && month])
    useEffect(() => {


        const data = {
            month,
            day,
            year,
            id: id
        }


        if (year && month && day && id) {
            request(`${API_URL}Observation/observed_group_info/${id}/`, "POST", JSON.stringify(data), headers())
                .then(res => {
                    setObservationOptions(res.observation_options)
                    setInfo(res.info)
                    setAverage(res.average)
                    setObserver(res.observer)
                })
        }


    }, [month, year, day])


    const stringCheck = (name,length = 50) => {
        if (name?.length > length) {
            return (
                <>
                    {name.substring(0,length)}...

                </>
            )
        }
        return name
    }


    const renderInfo = () => {
        return info.map((item, index) => {
            return (
                <tr>
                    <td>{index + 1}</td>
                    <td>{item.title}</td>
                    {
                        Object.values(item.values).map(vl => {
                            if (!vl.value) {
                                return <td></td>
                            }
                            return (
                                <td>
                                    <i className="fas fa-check"></i>
                                </td>
                            )
                        })
                    }
                    <td
                        onClick={() => {
                            setActive(!active)
                            setComment(item.comment)
                        }}
                    >
                        {stringCheck(item.comment)}

                    </td>
                </tr>
            )

        })
    }

    return (
        <div className={cls.observed}>

           <div className={cls.observed__header}>
               <h2 className={cls.observed__title}>Observed Lessons</h2>
               <div className={cls.observed__header_select}>

                           <Select
                               value={year}
                               title={"Yil"}
                               options={years}
                               onChangeOption={(e) => {
                                   setYear(e)
                               }}
                           />


                           <Select
                               value={month}
                               title={"Oy"}
                               options={months}
                               onChangeOption={(e) => {
                                   setMonth(e)
                               }}
                           />

                           <Select
                               value={day}
                               title={"Day"}
                               options={days}
                               onChangeOption={(e) => {
                                   setDay(e)
                               }}
                           />
               </div>
           </div>
            <div className={cls.observed__body}>
                <div>
                    Observer: <b>{observer?.name} {observer?.surname}</b>
                </div>
                <div>
                    Average: <b>{average}</b>
                </div>
            </div>
            <div className={cls.wrapper}>


                <Table className={cls.table}>
                    <thead>
                    <tr>
                        <th>№</th>
                        <th>Dimensions and Observable Expectations</th>
                        {
                            observationsOptions?.map(item => {
                                return (
                                    <th>{item.name} ({item.value})</th>
                                )
                            })
                        }
                        <th>Descriptive Actions (comments)</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        renderInfo()
                    }


                    </tbody>
                </Table>



            </div>

        </div>
    );
};

