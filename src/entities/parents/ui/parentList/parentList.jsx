import {fetchParentList} from "entities/parents/model/parentThunk.js";
import {getUserBranchId} from "entities/profile/userProfile/index.js";
import {onAddAlertOptions} from "features/alert/model/slice/alertSlice.js";
import {useNavigate} from "react-router";
import {API_URL, headers, useHttp} from "shared/api/base.js";
import {Button} from "shared/ui/button/index.js";
import {DefaultLoader, DefaultPageLoader} from "shared/ui/defaultLoader/index.js";
import {Table} from "shared/ui/table/index.js";

import cls from "./parent.module.sass"
import {useDispatch, useSelector} from "react-redux";
import {getParentsList, getParentsListLoading} from "../../model/parentSelector.js";
import {onDeleteParents} from "../../model/parentSlice.js";
import {useEffect, useState} from "react";
import {ConfirmModal} from "shared/ui/confirmModal/index.js";

export const ParentList = () => {


    const parentsData = useSelector(getParentsList)
    const loading = useSelector(getParentsListLoading)
    const dispatch = useDispatch()
    const [confirmItem, setConfirmItem] = useState({})
    const [activeConfirm, setActiveConfirm] = useState(false)

    const navigate = useNavigate()
    const branchId = useSelector(getUserBranchId)
    const [deleted, setDeleted] = useState(false)

    const {request} = useHttp()
    console.log(branchId)
    useEffect(() => {
        if (branchId) {
            dispatch(fetchParentList({branchId, deleted}))
        }
    }, [branchId, deleted])

    const renderData = () => {
        return parentsData.map((item, i) => (
            <tr>
                <td>{i + 1}</td>
                <td onClick={() => navigate(`profile/${item.id}`)}>{item.name}</td>
                <td>{item.surname}</td>
                <td>{item.phone}</td>
                <td>{item.location}</td>
                <td>{item.born_date}</td>
                <td>{item.location}</td>
                <td>{!deleted && <i onClick={() => {
                    setActiveConfirm(true)
                    setConfirmItem(item)
                }} style={{color: "red", fontSize: "18px"}} className={"fa fa-trash"}/>}</td>
            </tr>
        ))
    }

    const onDelete = () => {


        request(`${API_URL}parents/detail/${confirmItem.id}/`, "DELETE", null, headers())
            .then(res => {
                dispatch(onDeleteParents(confirmItem.id))
                setActiveConfirm(false)
                dispatch(onAddAlertOptions({
                    type: "success",
                    status: true,
                    msg: "Muvaffaqiyatli o'chirildi"
                }))
            })

    }

    return (
        <div className={cls.parent}>

            <div className={cls.parent__header}>
                <Button onClick={() => setDeleted(!deleted)} type={deleted ? "simple" : "filter"}>Deleted</Button>
                {/*<div className={cls.parent__header_plus}><i className={"fa fa-plus"}/></div>*/}
            </div>
            {loading ? <DefaultPageLoader/> :


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
            }
            <ConfirmModal setActive={setActiveConfirm} active={activeConfirm} onClick={onDelete} type={"danger"}/>
        </div>
    );
};

