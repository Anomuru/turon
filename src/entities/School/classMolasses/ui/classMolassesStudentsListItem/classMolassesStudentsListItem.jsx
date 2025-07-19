import React, {memo} from 'react';

import {Table} from "shared/ui/table";

import cls from "./classMolassesStudentsListItem.module.sass";
import classNames from "classnames";

export const ClassMolassesStudentsListItem = memo(({title, data}) => {

    const renderData = () => {
        return data.map(item =>
            <tr>
                <td>
                    <img src={item.image} alt=""/>
                </td>
                <td>{item.fullName}</td>
                <td>
                    <div
                        className={classNames(cls.studentsListItem__status, {
                            [cls.red]: item.progress <= 30,
                            [cls.yellow]: item.progress <= 70 && item.progress > 30
                        })}
                    >
                        {item.progress}%
                    </div>
                </td>
            </tr>
        )
    }

    const render = renderData()

    return (
        <div className={cls.studentsListItem}>
            <div className={cls.studentsListItem__title}>
                <h2>{title}</h2>
            </div>
            <div>
                <Table>
                    <thead>
                    <tr>
                        <th/>
                        <th>Ism Familiya</th>
                        <th>Reating foizi</th>
                    </tr>
                    </thead>
                    <tbody>
                    {render}
                    </tbody>
                </Table>
            </div>
        </div>
    )
})
