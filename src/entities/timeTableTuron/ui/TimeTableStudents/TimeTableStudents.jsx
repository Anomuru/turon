import React from 'react';

import cls from "./TimeTableStudents.module.sass"

export const TimeTableStudents = ({students = []}) => {




    return (
        <div className={cls.students}>
            {students?.map((item, i) => (
                <div className={cls.student} key={i}>
                    <span>{item.student}</span>
                    <span>{item.hours} / {item.total_hours}</span>

                </div>
            ))}
        </div>
    );
};

