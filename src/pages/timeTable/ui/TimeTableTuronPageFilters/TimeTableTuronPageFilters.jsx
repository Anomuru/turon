import React, {useEffect, useState} from 'react';


import cls from "./TimeTableTuronPageFilters.module.sass"
import {Button} from "shared/ui/button";
import {Select} from "shared/ui/select";
import classNames from "classnames";
import {useDispatch, useSelector} from "react-redux";
import {
    onChangeColorTimeTable, onChangeDateTimeTable,
    onChangeDayTimeTable, onChangeFilterClassTimeTable,
    onChangeTypeTimeTable
} from "../../model/slice/timeTableTuronSlice";
import {
    getTimeTableTuronColor,
    getTimeTableTuronColors, getTimeTableTuronDate,
    getTimeTableTuronDay,
    getTimeTableTuronType,
    getTimeTableTuronWeekDays
} from "pages/timeTable/model/selectors/timeTableTuronSelectors";
import {fetchTimeTableColors, fetchTimeTableWeekDays} from "pages/timeTable/model/thunks/timeTableTuronThunks";
import {Input} from "shared/ui/input";


const TimeTableTuronPageFilters = React.memo((props) => {

    const {
        setFullScreen,
        isSelected,
        setIsSelected,
        setClassView,
        groups
    } = props

    const [activeIdColor, setActiveIdColor] = useState(1)

    const dispatch = useDispatch()

    const type = useSelector(getTimeTableTuronType)
    const colors = useSelector(getTimeTableTuronColors)
    const color = useSelector(getTimeTableTuronColor)
    const date = useSelector(getTimeTableTuronDate)





    const onChangeColor = (id) => {
        dispatch(onChangeColorTimeTable(id))
    }


    const onChangeDate = (date) => {
        dispatch(onChangeDateTimeTable(date))

    }


    const renderColorTypes = () => {
        return colors?.map(item => {
                return (
                    <div
                        style={{color: item?.value}}
                        className={classNames(cls.colorList__inner, {
                            [cls.active]: +color === item.id
                        })}
                        onClick={() => onChangeColor(item.id)}
                    >
                        {item.name}
                    </div>
                )
            }
        )
    }


    const onChangeType = (type) => {
        setIsSelected()
        dispatch(onChangeTypeTimeTable(type))
    }


    const renderColor = renderColorTypes()



    const onChangeOptionClassLesson = (item) => {
        dispatch(onChangeFilterClassTimeTable(item))
    }


    return (
        <div className={cls.filters}>
            <div className={cls.navigators}>
                <div
                    id="unique-id"
                    className={cls.navigators__inner}
                >
                    <Button
                        onClick={() => onChangeType("group")}
                        type={type === "group" ? "simple" : "simple-add"}
                    >
                        Class
                    </Button>
                    <Button
                        onClick={() => onChangeType("flow")}
                        type={type === "flow" ? "simple" : "simple-add"}
                    >
                        Flow
                    </Button>
                </div>

                <div style={{display: "flex"}}>
                    <Button onClick={() => setFullScreen(true)}>Full screen</Button>
                    <Button onClick={() => setClassView(true)}>Class view</Button>
                </div>

                <Select
                    onChangeOption={onChangeOptionClassLesson}
                    options={groups}
                    title={"filter"}
                />



                <Input
                    type={"date"}
                    value={date}
                    onChange={(e) => onChangeDate(e.target.value)}

                />

            </div>
            {
                type === "group" && !isSelected && <div className={cls.colorList}>
                    {renderColor}
                </div>
            }

        </div>
    );
}) ;

export default TimeTableTuronPageFilters;