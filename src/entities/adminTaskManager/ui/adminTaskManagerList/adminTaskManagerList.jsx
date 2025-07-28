import cls from "./adminTaskManagerList.module.sass"

import completedIcon from "shared/assets/icons/completed.svg"
import progressIcon from "shared/assets/icons/progres.svg"

import yellowCard from "shared/assets/images/yelloCard.svg"
import pinkCard from "shared/assets/images/pinkCard.svg"
import greenCard from "shared/assets/images/greenCard.svg"

import React, {createContext, useCallback, useContext, useEffect, useMemo, useRef, useState} from "react"
import {Modal} from "shared/ui/modal";
import {Select} from "shared/ui/select";
import {Textarea} from "shared/ui/textArea";
import {Button} from "shared/ui/button";
import {useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import {
    getAdminTasksData,
    getTaskManager,
    getTaskManagerCompletedCount, getTaskManagerLoading,
    getTaskManagerProgressCount
} from "features/taskManager/modal/taskManagerSelector";
import {API_URL, headers, useHttp} from "shared/api/base";
import {
    onCountCompleted,
    onCountPercentage,
    onCountProgress,
    onRemoveTask
} from "features/taskManager/modal/taskManagerSlice";
import {formatDate} from "shared/ui/formDate/formDate";
import {Table} from "shared/ui/table";
import {ConfirmModal} from "shared/ui/confirmModal";
import {DefaultLoader, DefaultPageLoader} from "shared/ui/defaultLoader";
import {onAddAlertOptions} from "features/alert/model/slice/alertSlice";

const FuncContext = createContext(null)


const status = ["Tel ko'tardi", "Tel ko'tarmadi"]
const agreeType = ["Keladi", "Kemidi"]


export const AdminTaskManagerList = ({formatted, setTaskType, taskType}) => {
    const complateCount = useSelector(getTaskManagerCompletedCount)
    const progressCount = useSelector(getTaskManagerProgressCount)
    const [selectedStatus, setSelectedStatus] = useState(null)
    const [agreeStatus, setAgreeStatus] = useState(null)

    const loading = useSelector(getTaskManagerLoading)

    const [resComment, setResComment] = useState(null)

    const date = new Date()

    const formatedDate = formatDate(date)

    const [activeModal, setActiveModal] = useState(false)
    const [activeModalItem, setActiveModalItem] = useState(null)
    const {register, handleSubmit, setValue} = useForm()
    const card = useSelector(getAdminTasksData)
    // const branchs = useSelector(getTaskManagerBranchs)
    const {request} = useHttp()

    const dispatch = useDispatch()



    useEffect(() => {
        if (loading) setActiveModal(false)

    }, [loading])

    const groupedCards = {
        red: [],
        yellow: [],
        green: []
    }
    card?.forEach((item) => {
        if (groupedCards[item?.color]) {
            groupedCards[item?.color].push(item)
        }
    })


    const onPost = (data) => {

        const res = {
            ...data,
            lead: activeModalItem?.id,
            name: activeModalItem.name,
            phone: activeModalItem.phone,
            status: selectedStatus === "Tel ko'tardi" ? true : false,
            is_agreed: agreeStatus === "Keladi" ? true : false
        }

        request(`${API_URL}Lead/lead_call_create/`, "POST", JSON.stringify(res), headers())
            .then(res => {
                setActiveModal(false)
                dispatch(onRemoveTask(activeModalItem.id))
                dispatch(onCountPercentage(res.accepted_percentage))
                dispatch(onCountCompleted(res.completed))
                dispatch(onCountProgress(res.progressing))
                setValue("comment", "")
                dispatch(onAddAlertOptions({
                    type: "success",
                    status: true,
                    msg: "Muvaffaqiyatli yuborildi"
                }))

            })


    }

    useEffect(() => {
        setSelectedStatus(status[0])
    }, [status])


    const onClick = useCallback((item) => {
        setActiveModal(true)
        setActiveModalItem(item)
        request(`${API_URL}Lead/lead_call/${item.id}`, "GET", null, headers())
            .then(res => {
                console.log(res, "nma gap")
                setResComment(res.history)
            })
            .catch(err => {
                console.log(err)
            })
    })

    const contextObj = useMemo(() => ({
        activeModal,
        setActiveModal: (item) => onClick(item),
        activeModalItem,
        setActiveModalItem,
        taskType
    }), [])


    const onClickTel = () => {


        request(`${API_URL}Lead/lead_call_ring/`, "POST", JSON.stringify({lead_id: activeModalItem.id}), headers())
            .then(res => {
                console.log(res)
            })
            .catch(err => {
            })
    }



    return (
        <div className={cls.taskLeft}>
            <div className={cls.taskLeft__header}>

                {formatedDate === formatted && <div

                    onClick={() => setTaskType("progress")}
                    className={cls.taskLeft__header_box}
                    style={{background: `rgba(249, 145, 75, 1)`}}
                >
                    <div className={cls.taskLeft__header_box_top}>
                        <img src={progressIcon} alt=""/>
                        <h2 style={{whiteSpace: "pre-line"}}>Task <br/>in Progress</h2>
                    </div>
                    <div className={cls.taskLeft__header_box_count}>{progressCount}</div>
                </div>}

                <div

                    className={cls.taskLeft__header_box}
                    onClick={() => setTaskType("completed")}

                    style={{background: `rgba(26, 174, 204, 1)`}}
                >
                    <div className={cls.taskLeft__header_box_top}>
                        <img src={completedIcon} alt=""/>
                        <h2 style={{whiteSpace: "pre-line"}}>Project<br/>Completed</h2>
                    </div>
                    <div className={cls.taskLeft__header_box_count}>{complateCount}</div>
                </div>


            </div>

            <FuncContext.Provider value={contextObj}>

                <div className={cls.taskLeft__body}>
                    <h1 className={cls.taskLeft__body_title}>{taskType === "completed" ? "Completed leads" : "Leads"}</h1>

                    {loading ? <DefaultPageLoader/> :

                        formatted === formatedDate ? <>
                            <div className={cls.taskLeft__body_main}>
                                <div className={cls.taskLeft__body_card}>
                                    {Object.entries(groupedCards).map(([color, items]) => {
                                        if (!items.length) return null
                                        return (
                                            <DraggableRow
                                                taskType={taskType}
                                                key={color + taskType}
                                                items={items}
                                                className={cls.taskLeft__body_card_cotainer}
                                            />
                                        )
                                    })}
                                </div>
                            </div>
                        </> : <>

                            <div className={cls.taskLeft__body_table}>
                                <Table>
                                    <thead>
                                    <tr>
                                        <th/>
                                        <th>Ism</th>
                                        <th>Familiya</th>
                                        <th>Kament</th>
                                        <th>Tel raqami</th>
                                        <th>Tel statusi</th>
                                        <th>Yaratilgan sana</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {card?.map((item, i) => (
                                        <tr key={i}>
                                            <td>{i + 1}</td>
                                            <td>{item?.lead?.name}</td>
                                            <td>{item?.lead?.surname}</td>
                                            <td>{item?.comment}</td>
                                            <td>{item?.lead?.phone}</td>
                                            <td>{item.status === true ? "Tel ko'tardi" : "Tel ko'tarilmadi"}</td>
                                            <td>{item?.lead?.created}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </Table>
                            </div>
                        </>}
                </div>
            </FuncContext.Provider>

            {/*<Modal typeIcon extraClass={cls.modal} active={activeModal}*/}
            {/*       setActive={setActiveModal}>*/}

            {/*    <div className={cls.modal__left}>*/}
            {/*        <div className={cls.userbox}>*/}
            {/*            <h2 className={cls.userbox__name}>*/}
            {/*                <span>{activeModalItem?.name} {activeModalItem?.surname}</span> <br/>*/}
            {/*            </h2>*/}
            {/*            <div className={cls.userbox__info}>*/}
            {/*                <div className={cls.userbox__infos}>*/}
            {/*                    <p className={cls.userbox__number}>*/}
            {/*                        Number :*/}
            {/*                        <span>{activeModalItem?.phone} </span>*/}
            {/*                    </p>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </div>*/}

            {/*        {*/}
            {/*            formatted === formatedDate && taskType === "progress" && <>*/}
            {/*                <Select defaultValue={selectedStatus} onChangeOption={setSelectedStatus} options={status}/>*/}
            {/*                <Select defaultValue={agreeStatus} onChangeOption={setAgreeStatus} options={agreeType}/>*/}

            {/*                {selectedStatus === "Tel ko'tardi" ? <>*/}
            {/*                    <Textarea name={"comment"} register={register}/>*/}

            {/*                </> : <Textarea name={"comment"} register={register}/>}*/}
            {/*                <Button extraClass={cls.modal__add} onClick={handleSubmit(onPost)}>Add</Button>*/}
            {/*            </>*/}
            {/*        }*/}
            {/*    </div>*/}


            {/*    {resComment?.length >= 1 && <div className={cls.modal__right}>*/}

            {/*        {resComment.map(item => (*/}
            {/*            <div className={cls.modal__right_box}>*/}
            {/*                <div className={cls.modal__right_header}>*/}
            {/*                    <span>Telefon qilingan sana :</span>  <h2>{item.created}</h2>*/}
            {/*                </div>*/}
            {/*                <div className={cls.modal__right_info}>*/}
            {/*                    <span>Comment :</span> <h2 style={{width: "20rem"}}>{item.comment}</h2>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        ))}*/}

            {/*    </div>}*/}
            {/*</Modal>*/}

        </div>
    )
}

export const DraggableRow = ({items = [], className = "", taskType}) => {
    return (
        <Table>
            <thead>
            <tr>
                <th>№</th>
                <th>Ism</th>
                <th>Familiya</th>
                <th>Telefon nomer</th>
            </tr>
            </thead>
            <tbody>
            {items.map((item, idx) => (
                <TaskCard key={idx} item={item} i={idx}/>
            ))}
            </tbody>
        </Table>
    )
}

const TaskCard = ({item, i}) => {
    const [style, setStyle] = useState({})

    const {setActiveModal, setActiveModalItem, taskType} = useContext(FuncContext)

    const [confirmModal, setActiveConfirmModal] = useState(false)

    const {request} = useHttp()
    const dispatch = useDispatch()
    const renderBgImage = (color) => {
        switch (color) {
            case "red":
                return `url(${pinkCard})`
            case "yellow":
                return `url(${yellowCard})`
            case "green":
                return `url(${greenCard})`
            default:
                return ""
        }
    }
    const onDeleteLead = () => {


        request(`${API_URL}Lead/lead_delete/${item.id}`, "DELETE", null, headers())
            .then(res => {
                console.log(res)
                setActiveConfirmModal(false)
                dispatch(onRemoveTask(item.id))
                dispatch(onCountPercentage(res.accepted_percentage))
                dispatch(onCountCompleted(res.completed))
                dispatch(onCountProgress(res.progressing))
                dispatch(onAddAlertOptions({
                    type: "success",
                    status: true,
                    msg: "Muvaffaqiyatli o'chirildi"
                }))
            })
            .catch(err => {
                console.log(err)
            })


    }


    useEffect(() => {
        setStyle({
            backImage: renderBgImage(item?.color),
            color:
                item?.color === "green"
                    ? "rgba(220, 252, 231, 1)"
                    : item.color === "yellow"
                        ? "rgba(254, 249, 195, 1)"
                        : "rgba(255, 228, 230, 1)"
        })
    }, [item?.color])


    return (
        <>
            <tr style={{background: style.color}}>
                <td>{i + 1}</td>
                <td>{item.name}</td>
                <td>{item.surname}</td>
                <td>{item.phone}</td>
            </tr>
            <ConfirmModal active={confirmModal} setActive={setActiveConfirmModal} onClick={onDeleteLead}/>
        </>
    )
}
