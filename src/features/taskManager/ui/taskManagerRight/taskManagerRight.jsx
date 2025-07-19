import cls from "./taskManagerRight.module.sass"
import {useState} from "react";
import Calendar from "react-calendar";
import {useSelector} from "react-redux";
import {getTaskManagerPercentage} from "features/taskManager/modal/taskManagerSelector";



export const TaskManagerRight = ({setSelectedDate , selectedDate}) => {




    return (
        <div className={cls.taskManager}>
            <div className={cls.taskManager__rating}>
                <div className={cls.taskManager__rating_box}>
                    <CircularProgress/>
                </div>
                <h1>All Rating</h1>
            </div>
            <CalendarItem setSelectedDate={setSelectedDate} selectedDate={selectedDate}/>
        </div>
    );
};

const CircularProgress = ({ size = 150, strokeWidth = 15 }) => {
    const radius = (size - strokeWidth) / 2;
    const percentage= useSelector(getTaskManagerPercentage)
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;




    return (
        <div className={cls.taskManager__rating_circle}>
            <svg width={size} height={size}>
                <circle
                    stroke="#E6F0FA"
                    fill="transparent"
                    strokeWidth={strokeWidth}
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                <circle
                    stroke="rgba(0, 194, 255, 1)"
                    fill="transparent"
                    strokeWidth={strokeWidth}
                    // strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                    transform={`rotate(-90 ${size / 2} ${size / 2})`}
                />
                <text
                    x="50%"
                    y="50%"
                    dominantBaseline="middle"
                    textAnchor="middle"
                    fontSize="24"
                    fill="rgba(112, 112, 112, 1)"
                >
                    {percentage}%
                </text>
            </svg>
        </div>
    );
};


const CalendarItem = ({setSelectedDate , selectedDate}) => {
    const today = new Date(); //bugungi kun ni ovolish
    const maxSelectableDate = new Date();
    maxSelectableDate.setDate(today.getDate());
    return (
        <div style={{width: "100%" , justifyContent: "center" , display: "flex"}}>
            <Calendar
                tileDisabled={({ date }) => date >= new Date()}
                      onChange={setSelectedDate}
                value={selectedDate} maxDate={maxSelectableDate}
            />
        </div>
    );
}