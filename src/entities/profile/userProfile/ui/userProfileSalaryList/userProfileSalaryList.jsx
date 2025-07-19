import {memo} from 'react';

import {Table} from "shared/ui/table";

import cls from "./userProfileSalaryList.module.sass";

export const UserProfileSalaryList = memo(({data, setActive}) => {

    const renderDataList = () => {
        return data.map(item =>
            <tr
                onClick={() => {setActive(item.id)}}
            >
                <td/>
                <td>{item.salary}</td>
                <td>{item.theRest}</td>
                <td>{item.received}</td>
                <td>{item.month}</td>
            </tr>
        )
    }

    const render = renderDataList()

    return (
        <div className={cls.salaryList}>
            <Table>
                <thead>
                <tr>
                    <th/>
                    <th>Oylik</th>
                    <th>Qolgan</th>
                    <th>Olingan</th>
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
