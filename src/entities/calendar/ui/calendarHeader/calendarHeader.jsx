import {memo} from 'react';

import {Button} from "shared/ui/button";

import cls from "./calendarHeader.module.sass";

export const CalendarHeader = memo(() => {
    return (
        <div className={cls.calendarHeader}>
            <h1>Academic Calendar</h1>
            <Button
                type={"simple"}
                extraClass={cls.calendarHeader__btn}
            >
                Change
            </Button>
            <div className={cls.calendarHeader__title}>
                <i className="far fa-calendar-alt"/>
                <h2>2023-2024 years calendar</h2>
            </div>
        </div>
    )
})
