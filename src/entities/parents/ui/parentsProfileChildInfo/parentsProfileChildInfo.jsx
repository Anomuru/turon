import {onAddAlertOptions} from "features/alert/model/slice/alertSlice.js";
import {getParentsChild, getParentsLoading} from "features/parentsProfile/model/parentsProfileSelector.js";
import {onAddParentChild, onDeleteChild} from "features/parentsProfile/model/parentsProfileSlice.js";
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router";
import {API_URL, headers, useHttp} from "shared/api/base.js";
import unknownUser from "shared/assets/user-interface/user_image.png";
import {ConfirmModal} from "shared/ui/confirmModal/index.js";
import {DefaultPageLoader} from "shared/ui/defaultLoader/index.js";
import cls from "./parentProfileChildInfo.module.sass"
import profilePic from "shared/assets/images/user_image.png"

import GreenCard from "shared/assets/images/greenCard.svg"


export const ParentsProfileChildInfo = ({setActiveAdd}) => {

    const children = useSelector(getParentsChild)
    const [activeConfirm, setActiveConfirm] = useState(false)
    const [activeItem, setActiveItem] = useState({})
    const dispatch = useDispatch()
    const loading = useSelector(getParentsLoading)

    const navigate = useNavigate()

    const {id} = useParams()
    const {request} = useHttp()
    const onDelete = () => {
        const res = {
            student_id: activeItem.id
        }
        request(`${API_URL}parents/${id}/remove_student/`, "POST", JSON.stringify(res), headers())
            .then(res => {
                console.log(res)
                dispatch(onDeleteChild(activeItem.id))
                setActiveConfirm(false)
                dispatch(onAddAlertOptions({
                    type: "success",
                    status: true,
                    msg: "Muvaffaqiyatli o'chirildi"
                }))
            })

    }

    const renderChildren = () => {
        return children.map((item, i) => (
            <div
                className={cls.child__body_card_item}
            >
                <div className={cls.child__body_card_item_left}>
                    <h2 className={cls.child__body_card_item_left_header}>
                        {item.name} {item.surname}
                    </h2>
                    <div className={cls.child__body_card_item_left_number}>
                        Number: <span>{item.phone}</span>
                    </div>
                    <div className={cls.child__body_card_item_left_number}>
                        Balans: <span>{item.phone.toLocaleString()}</span>
                    </div>
                </div>

                <div
                    className={cls.item__image}
                    style={{
                        backgroundImage: backImaga,
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center"
                    }}>
                    <div
                        onClick={() => navigate(`../students/profile/${item.id}`)}
                        className={cls.circle}
                    >
                        <img src={profilePic} alt=""/>
                    </div>
                    <div
                        onClick={() => {
                            setActiveConfirm(true)
                            setActiveItem(item)
                        }}
                        className={cls.delete}>
                        <i className={"fa fa-trash"}/>
                    </div>
                </div>
            </div>
        ))
    }

    return (
        <div className={cls.child}>

            <div className={cls.child__header}>

                <h1>Farzandlarim</h1>

                <i className={"fa fa-plus"} onClick={() => setActiveAdd(true)}/>

            </div>

            <div className={cls.child__list}>
                {loading ? <DefaultPageLoader status={true}/> :
                    renderChildren()}
                {/*{renderChildren()}*/}
                {/*{renderChildren()}*/}
            </div>
            <ConfirmModal setActive={setActiveConfirm} active={activeConfirm} onClick={onDelete}/>

        </div>
    );
};


const backImaga = "url('data:image/png;base64,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')"
