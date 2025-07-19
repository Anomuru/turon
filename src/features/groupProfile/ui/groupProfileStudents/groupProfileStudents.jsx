import React, {memo, useState} from 'react';
import classNames from "classnames";
import {useSelector} from "react-redux";

import {getGroupProfileData} from "entities/profile/groupProfile";
import {Button} from "shared/ui/button";
import {Input} from "shared/ui/input";
import {Table} from "shared/ui/table";
import {EditableCard} from "shared/ui/editableCard";

import cls from "./groupProfileStudents.module.sass";
import defaultUserImg from "shared/assets/images/user_image.png";

export const GroupProfileStudents = memo(() => {

    const data = useSelector(getGroupProfileData)

    const [active, setActive] = useState(false)
    const [select, setSelect] = useState([])

    const renderStudents = () => {
        return data?.students?.map(item =>
            <tr>
                <td>
                    <div
                        className={cls.students__upper}
                        style={{backgroundColor: item.status}}
                    />
                </td>
                <td>
                    <img src={defaultUserImg} alt=""/>
                </td>
                <td>{item?.user?.name} {item?.user?.surname}</td>
                <td>
                    <div
                        className={classNames(cls.students__money, {
                            [cls.red]: item.status === "red",
                            [cls.yellow]: item.status === "yellow",
                        })}
                    >
                        {item.money}
                    </div>
                </td>
                {
                    active ?
                        <td>
                            <div className={cls.delete}>
                                <Input
                                    extraClassName={cls.delete__input}
                                    type={"checkbox"}
                                    onChange={() => setSelect(prev => {
                                        if (prev.filter(i => i === item.id)[0]) {
                                            return prev.filter(i => i !== item.id)
                                        } else return [...prev, item.id]
                                    })}
                                />
                                <i className={classNames("fas fa-trash-alt", cls.delete__icon)}/>
                            </div>
                        </td>
                        :
                        null
                }
            </tr>
        )
    }

    const render = renderStudents()

    return (
        <EditableCard
            extraClass={cls.students}
            title={<i className="fas fa-edit"/>}
            onClick={() => setActive(!active)}
        >
            <div className={cls.students__title}>
                <h1>O’quvchilar</h1>
                {
                    active ? <Button>Add</Button> : null
                }
            </div>
            <div className={cls.students__list}>
                <Table>
                    <tbody>
                    {render}
                    </tbody>
                </Table>
            </div>
        </EditableCard>
    )
})
