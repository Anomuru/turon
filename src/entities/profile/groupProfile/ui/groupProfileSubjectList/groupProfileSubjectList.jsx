import React, {memo} from 'react';

import {EditableCard} from "shared/ui/editableCard";
import {Table} from "shared/ui/table";

import cls from "./groupProfileSubjectList.module.sass";

const data = [
    {
        name: "Madina",
        surname: "Abdurahmonova",
        days: ["14:00", "14:00", "14:00"]
    },
    {
        name: "Madina",
        surname: "Abdurahmonova",
        days: ["14:00", "14:00", "14:00"]
    },
    {
        name: "Madina",
        surname: "Abdurahmonova",
        days: ["14:00", "14:00", "14:00"]
    },
    {
        name: "Madina",
        surname: "Abdurahmonova",
        days: ["14:00", "14:00", "14:00"]
    }

]

export const GroupProfileSubjectList = memo(() => {

    const renderSubjectList = () => {
        return data.map(item =>
            <tr>
                <td/>
                <td>{item.name} {item.surname}</td>
                {
                    item.days.map(i =>
                        <td>{i}</td>
                    )
                }
            </tr>
        )
    }

    const render = renderSubjectList()

    return (
        <EditableCard
            extraClass={cls.subjectList}
            title={<i className="fas fa-edit"/>}
        >
            <h1>Dars jadvali</h1>
            <div className={cls.subjectList__contauner}>
                <Table>
                    <thead>
                    <tr>
                        <th/>
                        <th>Hona</th>
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
