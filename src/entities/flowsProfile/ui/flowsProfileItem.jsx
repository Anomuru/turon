import React, {memo, useState} from 'react';
import classNames from "classnames";
import {Button} from "shared/ui/button";

import {Table} from "shared/ui/table";
import {Input} from "shared/ui/input";

import cls from "./flowsProfile.module.sass";
import defaultUser from "shared/assets/images/user_image.png";

const list = [
    {
        img: defaultUser,
        fullName: "Mahmud Yo`Ldoshev",
        parentTel: "+998909773176",
        tel: "+998909773176",
        money: "-10000",
        checked: true,
        deleted: true
    },
    {
        img: defaultUser,
        fullName: "Mahmud Yo`Ldoshev",
        parentTel: "+998909773176",
        tel: "+998909773176",
        money: "50000",
        checked: true,
        deleted: true
    },
    {
        img: defaultUser,
        fullName: "Mahmud Yo`Ldoshev",
        parentTel: "+998909773176",
        tel: "+998909773176",
        money: "295 000",
        checked: true,
        deleted: true
    },
    {
        img: defaultUser,
        fullName: "Mahmud Yo`Ldoshev",
        parentTel: "+998909773176",
        tel: "+998909773176",
        money: "295 000",
        checked: true,
        deleted: true
    },
    {
        img: defaultUser,
        fullName: "Mahmud Yo`Ldoshev",
        parentTel: "+998909773176",
        tel: "+998909773176",
        money: "295 000",
        checked: true,
        deleted: true
    },
    {
        img: defaultUser,
        fullName: "Mahmud Yo`Ldoshev",
        parentTel: "+998909773176",
        tel: "+998909773176",
        money: "295 000",
        checked: true,
        deleted: true
    }


]

export const FlowProfileStudentsList = memo(() => {

    const [active, setActive] = useState(false)

    const renderStudentsList = () => {
        return list.map(item =>
            <tr>
                <td>
                    <img src={item.img} alt=""/>
                </td>
                <td>{item.fullName}</td>
                <td>{item.tel}</td>
                <td>{item.parentTel}</td>
                <td>
                    <div
                        className={classNames(cls.studentsList__status, {
                            [cls.red]: Number(item.money) < 0,
                            [cls.yellow]: Number(item.money) > 0 && Number(item.money) < 100000,
                        })}
                    >
                        {item.money}
                    </div>
                </td>
                {
                    active ? <>
                        <td>
                            <Input
                                extraClassName={cls.studentsList__input}
                                type={"checkbox"}
                                defaultValue={item.checked}
                            />
                        </td>
                        <td>
                            <i
                                className={classNames("fas fa-trash", cls.studentsList__delete)}
                                // onClick={() => setDeleteId(item)}
                            />
                        </td>
                    </> : null
                }
            </tr>
        )
    }

    const render = renderStudentsList()

    return (
        <div className={cls.studentsList}>
            <div className={cls.btns}>
                <h1>O’quvchilar ro’yxati</h1>
                <div className={cls.btns__inner}>
                    <Button
                        // disabled={selectedMoveId.length === 0}
                        // type={selectedMoveId.length === 0 ? "disabled" : ""}
                        // onClick={() => setActiveModal("change")}
                    >
                        Move
                    </Button>
                    <Button
                        // onClick={() => setActiveModal("add")}
                    >
                        Add
                    </Button>
                    <i
                        className={classNames("fas fa-edit", cls.btns__icon)}
                        onClick={() => setActive(!active)}
                    />
                </div>
            </div>
            <div className={cls.studentsList__container}>
                <Table>
                    <thead>
                    <tr>
                        <th/>
                        <th>Ism Familya</th>
                        <th>Tel</th>
                        <th>Tel Ota-ona</th>
                        <th>Balans</th>
                        {
                            active ? <>
                                <th/>
                                <th/>
                            </> : null
                        }
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
