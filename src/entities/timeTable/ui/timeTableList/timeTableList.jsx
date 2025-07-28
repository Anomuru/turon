import {memo, useCallback} from 'react';
import classNames from "classnames";

import {Table} from "shared/ui/table";
import {DefaultLoader} from "shared/ui/defaultLoader";

import cls from "./timeTableList.module.sass";

export const TimeTableList = memo((props) => {

    const {
        data,
        setIsChange,
        loading,
        setStatus
    } = props

    const renderTimeTableList = useCallback(() => {
        return data.sort(compareById).map((item, i) =>
            <tr>
                <td>{i + 1}</td>
                <td>{item.order}-dars</td>
                <td>{item.start_time?.slice(0, 5)}</td>
                <td>{item.end_time?.slice(0, 5)}</td>
                <td>{item.name}</td>
                <td></td>
                <td>
                    <i
                        onClick={() => {
                            setIsChange(item)
                            setStatus(false)
                        }}
                        className={classNames("fas fa-pen", cls.timeTableList__icon)}
                    />
                </td>
            </tr>
        )
    }, [data, loading])

    const render = renderTimeTableList()

    function compareById(a, b) {
        return a.order - b.order;
    }

    return loading ? <DefaultLoader/> :
        (
            <div className={cls.timeTableList}>
                <Table>
                    <thead>
                    <tr>
                        <th>No</th>
                        <th>Soatlar ro’yxati</th>
                        <th>Boshlanish vaqt</th>
                        <th>Tugash vaqti</th>
                        <th>Name</th>
                        <th>Sinf</th>
                        <th/>
                    </tr>
                    </thead>
                    <tbody>
                    {render}
                    </tbody>
                </Table>
            </div>

        )
})
