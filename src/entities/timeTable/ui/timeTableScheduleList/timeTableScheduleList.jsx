import {memo, useCallback, useMemo, useState} from 'react';

import {TimeTableSchedule} from "../timeTableSchedule/timeTableSchedule";

import cls from "./timeTableScheduleList.module.sass";

export const TimeTableScheduleList = memo((props) => {

    const {
        data,
        subjectData,
        activeDrop,
        length,
        onSubmit,
        onDelete,
        userBranchId,
        handleDragEndInner
    } = props


    const renderScheduleItems = useCallback(() => {
        return data?.map((item, index) => {
            return (
                <TimeTableSchedule
                    uid={`${length[index]}class`}
                    subjectData={subjectData}
                    activeDrop={activeDrop}
                    data={item.data}
                    index={index+1}
                    onSubmit={onSubmit}
                    onDelete={onDelete}
                    classId={length[index]}
                    userBranchId={userBranchId}
                    handleDragEndInner={handleDragEndInner}
                />
            )
        })
    }, [length, activeDrop, data, subjectData, onSubmit, onDelete])

    const render = renderScheduleItems()

    return (
        <div className={cls.scheduleList}>
            {render}
        </div>
    )
})
