import {memo} from 'react';

import {Button} from "shared/ui/button";

import cls from "./calendarHeader.module.sass";

export const CalendarHeader = memo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const startYear = currentMonth >= 8 ? currentYear : currentYear - 1;
    const endYear = startYear + 1;

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
                <h2>{`${startYear}-${endYear}`} o'quv yili</h2>
            </div>
        </div>
    )
})
