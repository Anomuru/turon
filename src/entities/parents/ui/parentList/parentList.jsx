import {useNavigate} from "react-router";
import {Button} from "shared/ui/button/index.js";
import {Table} from "shared/ui/table/index.js";

import cls from "./parent.module.sass"
import {useDispatch, useSelector} from "react-redux";
import {getParentsList} from "../../model/parentSelector.js";
import {onDeleteParents} from "../../model/parentSlice.js";
import {useState} from "react";
import {ConfirmModal} from "../../../../shared/ui/confirmModal/index.js";

export const ParentList = () => {


    const parentsData = useSelector(getParentsList)
    const dispatch = useDispatch()
    const [confirmItem, setConfirmItem] = useState({})
    const [activeConfirm, setActiveConfirm] = useState(false)

    const navigate = useNavigate()

    const renderData = () => {
        return parentsData.map((item, i) => (
            <tr>
                <td>{i + 1}</td>
                <td onClick={() => navigate(`profile/${item.id}`)}>{item.name}</td>
                <td>{item.surname}</td>
                <td>{item.phone}</td>
                <td>{item.location}</td>
                <td>{item.date}</td>
                <td>{item.location}</td>
                <td><i onClick={() => {
                    setActiveConfirm(true)
                    setConfirmItem(item)
                }} style={{color: "red", fontSize: "18px"}} className={"fa fa-trash"}/></td>
            </tr>
        ))
    }

    const onDelete = () => {
        dispatch(onDeleteParents(confirmItem.id))
        setActiveConfirm(false)
    }

    return (
        <div className={cls.parent}>

            <div className={cls.parent__header}>
                <Button type={"filter"}>Deleted</Button>
                <div className={cls.parent__header_plus}><i className={"fa fa-plus"}/></div>
            </div>


            <div className={cls.parent__list}>
                <Table>
                    <thead>
                    <tr>
                        <th>No</th>
                        <th>Ism</th>
                        <th>Familiya</th>
                        <th>Telefon raqami</th>
                        <th>Manzil</th>
                        <th>Tug'ilgan kuni</th>
                        <th>Joylashuvi</th>
                        <th/>
                    </tr>
                    </thead>
                    <tbody>
                    {renderData()}
                    </tbody>
                </Table>
            </div>

            <ConfirmModal setActive={setActiveConfirm} active={activeConfirm} onClick={onDelete} type={"danger"}/>
        </div>
    );
};

