import React, {memo} from 'react';
import {useSelector} from "react-redux";

import {Table} from "shared/ui/table";
import {getRgbData} from "entities/rgbData";

import cls from "./rgbDataList.module.sass";

export const RgbDataList = memo(() => {

    const data = useSelector(getRgbData)

    const renderRgbData = () => {
        return data.map((item, index) => {
            return (
                <tr>
                    <td>{index+1}</td>
                    <td>{item?.region}</td>
                    <td>{item?.district}</td>
                    <td>{item?.old_school}</td>
                    <td>{item?.full_name_student}</td>
                    <td>{item?.birth_date}</td>
                    <td>
                        <div className={cls.list__inner}>
                            <p className={cls.list__item}>{item?.student_seria}</p>
                            <p>{item?.student_seria_num}</p>
                        </div>
                    </td>
                    <td>{item?.parents_fullname}</td>
                    <td>{item?.parent_region}</td>
                    <td>
                        <div className={cls.list__inner}>
                            <p className={cls.list__item}>{item?.parent_seria}</p>
                            <p>{item?.parent_seria_num}</p>
                        </div>
                    </td>
                    <td>{item?.parents_born_date}</td>
                    <td>{item?.parents_number}</td>
                </tr>
            )
        })

    }

    const render = renderRgbData()

    return (
        <div className={cls.list}>
            <div className={cls.list__wrapper}>
                <Table>
                    <thead>
                    <tr>
                        <th>No</th>
                        <th>Hudud nomi</th>
                        <th>Tuman/Shahar nomi</th>
                        <th>O'quvchi qabul qilingan maktabi</th>
                        <th>F.I.SH</th>
                        <th>Tug'ilgan sana</th>
                        <th>
                            <div className={cls.list__container}>
                                <p>Guvohnomasi</p>
                                <div className={cls.list__inner}>
                                    <p className={cls.list__item}>Seriya</p>
                                    <p>Raqami</p>
                                </div>
                            </div>
                        </th>
                        <th>Ota-ona F.I.SH</th>
                        <th>Yashash manzili</th>
                        <th>
                            <div className={cls.list__container}>
                                <p>Passport</p>
                                <div className={cls.list__inner}>
                                    <p className={cls.list__item}>Seriya</p>
                                    <p>Raqami</p>
                                </div>
                            </div>
                        </th>
                        <th>Ota-ona tug'ilgan sana</th>
                        <th>Telefon raqami</th>
                        {/*<th>Izoh</th>*/}
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
