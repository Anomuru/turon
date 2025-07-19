import {memo} from 'react';

import {Table} from "shared/ui/table";

import cls from "./userProfileSalaryListInner.module.sass";

export const UserProfileSalaryListInner = memo(({data}) => {

    const renderDataList = () => {
        return data.map((item, i) =>
            <tr>
                <td>{i + 1}</td>
                <td>{item.salary}</td>
                <td>
                    <div className={cls.salaryListInner__inner}>
                        {item.salaryType}
                    </div>
                </td>
                <td>{item.date}</td>
            </tr>
        )
    }

    const render = renderDataList()

    return (
        <div className={cls.salaryListInner}>
            <Table>
                <thead>
                <tr>
                    <th>No</th>
                    <th>Summa </th>
                    <th>Summa turi</th>
                    <th>Sana</th>
                </tr>
                </thead>
                <tbody>
                {render}
                </tbody>
            </Table>
        </div>
    )
})
