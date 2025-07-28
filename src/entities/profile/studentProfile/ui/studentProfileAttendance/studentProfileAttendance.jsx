import {memo, useCallback} from 'react';

import {EditableCard} from "shared/ui/editableCard";

import cls from "./studentProfileAttendance.module.sass";
import {useSelector} from "react-redux";
import {getGroupHistory} from "../../../../../features/studentPayment";

export const StudentProfileAttendance = memo(({setActive, data, onSelectGroup, onSelectGroupName}) => {
    // const getGroupHistories = useSelector(getGroupHistory)
    // const getHistorys = getGroupHistories.studenthistorygroup

    const renderSubjects = useCallback(() => {
        if (!Array.isArray(data))
        {
            return null
        }

        return data?.map(item =>

            <div
                onClick={() => {
                    setActive("totalAttendance");
                    onSelectGroup(item.id)
                    onSelectGroupName(item?.name)
                }}
                key={item?.id}
                className={cls.item}
            >
                <h2>{item?.name}</h2>
                <div className={cls.item__action}>
                    <p>Kelmagan</p>
                    <div className={cls.item__progress}>
                        <div
                            className={cls.item__completed}
                            style={{width: "20%"}}
                        />
                    </div>
                </div>
                <div className={cls.item__action}>
                    <p style={{color: "#22C55E"}}>Kelgan</p>
                    <div
                        className={cls.item__progress}
                        style={{backgroundColor: "#DCFCE7"}}
                    >
                        <div
                            className={cls.item__completed}
                            style={{width: "80%", backgroundColor: "#22C55E"}}
                        />
                    </div>
                </div>
                <h1 className={cls.item__count}>
                    <span style={{color: "#22C55E"}}>12</span>
                    /
                    <span style={{color: "#F43F5E"}}>1</span>
                </h1>
            </div>
        )
    })

    const render = renderSubjects()


    return (
        <EditableCard
            extraClass={cls.attendance}
            onClick={() => setActive("allAttendance")}

        >
            <div className={cls.attendance__title}>
                <h1>Davomat</h1>
                <p>1 oylik davomat</p>
            </div>
            <div className={cls.attendance__list}>
                {render}
            </div>
        </EditableCard>
    );
})