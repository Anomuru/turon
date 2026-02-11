import React, {memo} from 'react';

import {Table} from "shared/ui/table";
import {EditableCard} from "shared/ui/editableCard";

import cls from "./groupProfileAttendance.module.sass";

const data = [
    {
        name: "Madina",
        surname: "Abdurahmonova",
        days: [true, false, true]
    },
    {
        name: "Madina",
        surname: "Abdurahmonova",
        days: [true, false, true]
    },
    {
        name: "Madina",
        surname: "Abdurahmonova",
        days: [true, false, true]
    },
    {
        name: "Madina",
        surname: "Abdurahmonova",
        days: [true, false, true , true]
    }

]

export const GroupProfileAttendance = memo(() => {

    const renderAttendance = () => {
        return data.map(item =>
            <tr>
                <td/>
                <td>{item.name} {item.surname}</td>
                {
                    item.days.map(i =>
                        <td>{
                            i ? <i className="fas fa-check" style={{color: "#22C55E"}}/> :
                            <i className="fas fa-times" style={{color: "#F43F5E"}}/>
                        }</td>
                    )
                }
            </tr>
        )
    }

    const render = renderAttendance()

    return (
        <EditableCard
            extraClass={cls.attendance}
        >
            <h1>Davomat</h1>
            <div className={cls.attendance__contauner}>
                <Table>
                    <thead>
                    <tr>
                        <th/>
                        <th>Ism Familya</th>
                        <th>
                            <div className={cls.days}>
                                <h2>01</h2>
                                <p>Dushanba</p>
                            </div>
                        </th>
                        <th>
                            <div className={cls.days}>
                                <h2>03</h2>
                                <p>Dushanba</p>
                            </div>
                        </th>
                        <th>
                            <div className={cls.days}>
                                <h2>05</h2>
                                <p>Dushanba</p>
                            </div>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {render}
                    </tbody>
                </Table>
            </div>
        </EditableCard>
    )
})
