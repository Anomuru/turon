import {getSelectedWeekDay, getWeekDays} from "entities/profile/groupProfile/model/groupProfileSelector.js";
import React, {useEffect, useState} from 'react';
import {useForm} from "react-hook-form";


import cls from "./TimeTableTuronPageFilters.module.sass"
import {Button} from "shared/ui/button";
import {Select} from "shared/ui/select";
import classNames from "classnames";
import {useDispatch, useSelector} from "react-redux";
import {
    onChangeColorTimeTable, onChangeDateTimeTable,
    onChangeDayTimeTable, onChangeFilterClassTimeTable,
    onChangeTypeTimeTable, onChangeWeekDayTimeTable
} from "../../model/slice/timeTableTuronSlice";
import {
    getTimeTableTuronColor,
    getTimeTableTuronColors, getTimeTableTuronDate,
    getTimeTableTuronDay,
    getTimeTableTuronType, getTimeTableTuronWeekDay,
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

    const {register} = useForm()

    const [activeIdColor, setActiveIdColor] = useState(1)
    const [selectedWeek, setSelectedWeek] = useState(null)

    const dispatch = useDispatch()

    const type = useSelector(getTimeTableTuronType)
    const colors = useSelector(getTimeTableTuronColors)
    const color = useSelector(getTimeTableTuronColor)
    const date = useSelector(getTimeTableTuronDate)
    const weekDays = useSelector(getWeekDays)
    const weekDay = useSelector(getSelectedWeekDay)

    const onChangeColor = (id) => {
        dispatch(onChangeColorTimeTable(id))
    }


    const onChangeDate = (date) => {
        const currentDate = new Date(date);
        const currentDayOfWeek = currentDate.getDay();

        if (currentDayOfWeek === 0) {
            setSelectedWeek(7)
        } else {
            setSelectedWeek(currentDayOfWeek)
        }
        dispatch(onChangeDateTimeTable(date))
    }

    const onChangeWeekDay = (selectedDay) => {
        setSelectedWeek(selectedDay)
        const currentDate = new Date(date);

        const currentDayOfWeek = currentDate.getDay();

        const targetDayOfWeek = selectedDay % 7;

        const startOfWeek = new Date(currentDate);
        const diffToMonday = (currentDayOfWeek + 6) % 7;
        startOfWeek.setDate(currentDate.getDate() - diffToMonday);

        const newDate = new Date(startOfWeek);
        newDate.setDate(startOfWeek.getDate() + (targetDayOfWeek === 0 ? 6 : targetDayOfWeek - 1));

        const formattedDate = newDate.toISOString().split("T")[0];
        dispatch(onChangeDateTimeTable(formattedDate));

        dispatch(onChangeWeekDayTimeTable(selectedDay));
    };

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
                <div className={cls.navigators__btns}>
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
                </div>

                <div className={cls.navigators__date}>

                    <div className={cls.container}>
                        <Select
                            value={selectedWeek ? weekDays[selectedWeek - 1]?.id : weekDay}
                            options={weekDays}
                            titleOption={"Kunlar"}
                            onChangeOption={onChangeWeekDay}
                        />

                        <Input
                            type={"date"}
                            value={date}
                            onChange={(e) => onChangeDate(e.target.value)}
                            extraClassName={cls.select}
                        />
                    </div>
                    <Select
                        onChangeOption={onChangeOptionClassLesson}
                        options={groups}
                        titleOption={"filter"}
                    />
                </div>

            </div>
            {
                type === "group" && !isSelected && <div className={cls.colorList}>
                    {renderColor}
                </div>
            }

        </div>
    );
});

export default TimeTableTuronPageFilters;