import {getGroupProfileData} from "entities/profile/groupProfile";
import {memo} from 'react';
import classNames from "classnames";
import {useSelector} from "react-redux";
import {API_URL_DOC} from "shared/api/base";
import {Button} from "shared/ui/button";

import {Table} from "shared/ui/table";
import {Input} from "shared/ui/input";

import cls from "./classProfileStudentsList.module.sass";
import defaultUser from "shared/assets/images/user_image.png";

export const ClassProfileStudentsList = memo(() => {

    const data = useSelector(getGroupProfileData)
    const renderStudentsList = () => {
        return data?.students?.map(item =>
            <tr>
                <td>
                    <img src={item?.user?.profile_img ? API_URL_DOC + item?.user?.profile_img : defaultUser} alt=""/>
                </td>
                <td>{item?.user?.name} {item?.user?.surname}</td>
                <td>{item?.user?.phone}</td>
                <td>{item?.parents_number}</td>
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
                <td>
                    <Input
                        extraClassName={cls.studentsList__input}
                        type={"checkbox"}
                        defaultValue={item.checked}
                    />
                </td>
                <td>
                    <Input
                        extraClassName={cls.studentsList__input}
                        type={"checkbox"}
                        defaultValue={item.deleted}
                    />
                </td>
            </tr>
        )
    }

    const render = renderStudentsList()

    return (
        <div className={cls.studentsList}>
            <div className={cls.btns}>
                <h1>O’quvchilar ro’yxati</h1>
                <div className={cls.btns__inner}>
                    <Button>Move</Button>
                    <Button>Add</Button>
                    <i className={classNames("fas fa-edit", cls.studentsList__icon)}/>
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
                        <th>check</th>
                        <th>del</th>
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
