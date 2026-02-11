import {memo} from 'react';

import {Modal} from "shared/ui/modal";
import {Table} from "shared/ui/table";
import {Button} from "shared/ui/button";

import cls from "./timeTableError.module.sass";
import errorImage from "shared/assets/icons/alert.svg";
import userImage from "shared/assets/images/user_image.png";

const data = [
    {
        img: userImage,
        fullName: "Mahmud Yo`Ldoshev",
        phone: "+998909773176",
        comment: "Lorem ipsum"
    },
    {
        img: userImage,
        fullName: "Mahmud Yo`Ldoshev",
        phone: "+998909773176",
        comment: "Lorem ipsum"
    },
    {
        img: userImage,
        fullName: "Mahmud Yo`Ldoshev",
        phone: "+998909773176",
        comment: "Lorem ipsum"
    },
    {
        img: userImage,
        fullName: "Mahmud Yo`Ldoshev",
        phone: "+998909773176",
        comment: "Lorem ipsum"
    },
    {
        img: userImage,
        fullName: "Mahmud Yo`Ldoshev",
        phone: "+998909773176",
        comment: "Lorem ipsum"
    },
    {
        img: userImage,
        fullName: "Mahmud Yo`Ldoshev",
        phone: "+998909773176",
        comment: "Lorem ipsum"
    },
    {
        img: userImage,
        fullName: "Mahmud Yo`Ldoshev",
        phone: "+998909773176",
        comment: "Lorem ipsum"
    },
    {
        img: userImage,
        fullName: "Mahmud Yo`Ldoshev",
        phone: "+998909773176",
        comment: "Lorem ipsum"
    },
    {
        img: userImage,
        fullName: "Mahmud Yo`Ldoshev",
        phone: "+998909773176",
        comment: "Lorem ipsum"
    },
    {
        img: userImage,
        fullName: "Mahmud Yo`Ldoshev",
        phone: "+998909773176",
        comment: "Lorem ipsum"
    },
    {
        img: userImage,
        fullName: "Mahmud Yo`Ldoshev",
        phone: "+998909773176",
        comment: "Lorem ipsum"
    },
    {
        img: userImage,
        fullName: "Mahmud Yo`Ldoshev",
        phone: "+998909773176",
        comment: "Lorem ipsum"
    }
]

export const TimeTableError = memo(({setActive, active}) => {

    const renderUserList = () => {
        return data.map(item =>
            <tr>
                <td>
                    <img src={item.img} alt=""/>
                </td>
                <td>{item.fullName}</td>
                <td>{item.phone}</td>
                <td>{item.comment}</td>
            </tr>
        )
    }

    const render = renderUserList()

    return (
        <Modal
            setActive={setActive}
            active={active}
        >
            <div className={cls.error}>
                <div className={cls.error__header}>
                    <img src={errorImage} alt=""/>
                    <div className={cls.inner}>
                        <h1>Error</h1>
                        <span>1 blueda hato chiqdi</span>
                    </div>
                </div>
                <Button
                    type={"danger"}
                    extraClass={cls.error__btn}
                >
                    <i className="far fa-check-circle"/>
                </Button>
                <div className={cls.error__list}>
                    <Table>
                        <thead>
                        <tr>
                            <th/>
                            <th>Ism Familiya</th>
                            <th>Tel</th>
                            <th>Comment</th>
                        </tr>
                        </thead>
                        <tbody>
                        {render}
                        </tbody>
                    </Table>
                </div>
            </div>
        </Modal>
    )
})
