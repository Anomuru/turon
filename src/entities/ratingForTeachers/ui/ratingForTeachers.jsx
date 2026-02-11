import React, {useEffect, useState} from 'react';
import {API_URL, headers, useHttp} from "shared/api/base.js";
import cls from './ratingForTeachers.module.sass'
import {Select} from "shared/ui/select/index.js";
import {Input} from "shared/ui/input/index.js";
import {Button} from "shared/ui/button/index.js";
import {Table} from "shared/ui/table/index.js";
import {DefaultLoader, DefaultPageLoader} from "shared/ui/defaultLoader/index.js";
import {MiniLoader} from "shared/ui/miniLoader/index.js";
import {EditableCard} from "shared/ui/editableCard/index.js";
import {Switch} from "shared/ui/switch/index.js";
import {useSelector} from "react-redux";
import {getCurrentBranch} from "entities/oftenUsed/model/oftenUsedSelector.js";


const categoies = [
    {
        value: "observation",
        name: "Observation"
    },
    {
        value: "lesson_plan",
        name: "Lesson Plan"
    },
    {
        value: "student_results",
        name: "Student Results"
    }
]


export const RatingForTeachers = () => {

    const {request} = useHttp()
    const [dateValue, setDateValue] = useState("");
    const [data, setData] = useState([])

    const [value, setValue] = useState("")
    const [year, setYear] = useState("")
    const [month, setMonth] = useState("")
    const [loading, setLoading] = useState(false);
    const [active, setActive] = useState(true)
    const currentBranch = useSelector(getCurrentBranch)
    const ROLE = localStorage.getItem("job")
    const userBranchId = localStorage.getItem("branchId")
    const branchForFilter =
        ROLE === "director"
            ? currentBranch
            : userBranchId;

    useEffect(() => {
        if (!branchForFilter || !value) return;

        let url = `${API_URL}Teachers/teacher-rating/?branch=${branchForFilter}&category=${value}`;
        if (year && month) {
            url += `&year=${year}&month=${month}`;
        }

        setLoading(true)

        request(url, "GET", null, headers())
            .then(res => setData(res))
            .catch(err => console.error("Teacher rating error:", err))
            .finally(() => setLoading(false));

    }, [branchForFilter, value, year, month, active]);

    const handleSwitch = (state) => {
        setActive(state)

        if (state) {
            setDateValue("")
            setYear("")
            setMonth("")
        }
    }

    const handleDateChange = (e) => {
        const fullDate = e.target.value;
        setDateValue(fullDate);

        if (fullDate) {
            const [onlyYear, onlyMonth] = fullDate.split("-");
            setYear(onlyYear);
            setMonth(onlyMonth);
            setActive(false);
        }
    }

    const renderTableRows = (data) => {
        return data?.map((item, index) => (
            <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.name} {item.surname}</td>
                {
                    value === "observation" && (
                        <td>{item?.ball}</td>
                    )
                }
                {
                    value === "lesson_plan" && (
                        <>
                            <td>{item?.total}</td>
                            <td>{item?.done}</td>
                            <td>{item?.percent}%</td>

                        </>
                    )
                }
                {
                    value === "student_results" && (
                        <>
                            <td>{item?.total}</td>
                            <td>{item?.done}</td>
                            <td>{item?.percent}%</td>

                        </>
                    )
                }

            </tr>
        ));
    }


    return (
        <div className={cls.rating}>
            <div className={cls.rating__header}>
                <div className={cls.rating__header__inner}>
                    <Select
                        title={"Kategoriya"}
                        options={categoies} defaultValue={"observation"}
                        onChangeOption={(value) => setValue(value)}
                        extraClass={cls.rating__header__inner__select}
                    />
                    <Input title={"Yil va oy "}
                           type={"month"}
                           value={dateValue}
                           extraClassName={cls.rating__header__inner__input}
                           onChange={handleDateChange}
                    />
                    <span className={cls.rating__header__inner__box}>
                        <p>Hozirgi oyni ko'rish</p>
                    <Switch onChangeSwitch={handleSwitch}  activeSwitch={active}/>
                    </span>
                </div>
                {/*<hr/>*/}
            </div>
            <EditableCard extraClass={cls.rating__header__seconder} titleType={""}>
                <Table>
                    <thead style={{position: "relative"}}>
                    <tr style={{position: "sticky", top: "-2rem"}}>
                        <th>T/r</th>
                        <th>Ism-familiyasi</th>
                        {value === "observation" && (
                            <th>Ball ko'rsatkichi</th>
                        )}

                        {value === "lesson_plan" || "student_results" &&  (
                            <>
                                <th>Jami plan</th>
                                <th>Bajarilgan</th>
                                <th>Foiz (%)</th>
                            </>
                        )}
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? <div style={{display: "flex", alignSelf: "center", marginLeft: "70rem"}}>
                        <MiniLoader/>
                    </div> : renderTableRows(data)}
                    </tbody>
                </Table>
            </EditableCard>

        </div>
    );
};

