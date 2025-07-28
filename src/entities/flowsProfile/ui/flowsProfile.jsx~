import {
    getFlowsProfileData,
    getFlowsProfileNextLs,
    getFlowsProfileStatus
} from "entities/flowsProfile/model/flowsProfileSelector";
import {
    changeFlowProfile,
    fetchFilteredStudents,
    fetchFlowProfileData, fetchFlowProfileNextLesson, fetchGroupProfileNextLesson
} from "entities/flowsProfile/model/flowsProfileThunk";
import {changeGroupProfile, deleteGroupProfile} from "entities/profile/groupProfile";
import {getUserBranchId} from "entities/profile/userProfile";
import {getCurseLevelData} from "entities/students";
import {getCurseLevel} from "entities/students/model/studentsSlice";
import {onAddAlertOptions} from "features/alert/model/slice/alertSlice";
import React, {memo, useEffect, useState} from 'react';
import classNames from "classnames";

import {FlowProfileStudentsForm} from "features/FlowProfileStudentsForm";
import {useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router";
import {API_URL, headers, useHttp} from "shared/api/base";
import {Button} from "shared/ui/button";
import {DefaultPageLoader} from "shared/ui/defaultLoader";
import {Form} from "shared/ui/form";
import {Input} from "shared/ui/input";
import {Modal} from "shared/ui/modal";
import {Radio} from "shared/ui/radio";
import {Select} from "shared/ui/select";
import {Switch} from "shared/ui/switch";

import cls from "./flowsProfile.module.sass";
import teacher from "shared/assets/images/teachingTeacher.png";
import defaultUser from "shared/assets/images/user_image.png";
import defaultRoom from "shared/assets/images/room.png";
import coin from "shared/assets/images/coin.png";
import {FlowProfileStudentsList} from "./flowsProfileItem";
import {ConfirmModal} from "../../../shared/ui/confirmModal";
import {getBranch} from "../../../features/branchSwitcher";

export const FlowProfileNavigators = memo(() => {

    const {request} = useHttp()
    const {
        register,
        handleSubmit,
        setValue
    } = useForm()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {id} = useParams()
    // const {id} = useSelector(getBranch)
    const data = useSelector(getFlowsProfileData)
    const nextLesson = useSelector(getFlowsProfileNextLs)
    const loading = useSelector(getFlowsProfileStatus)
    const userBranchId = useSelector(getUserBranchId)
    const level = useSelector(getCurseLevelData)
    const [deleteId , setDeleteId] = useState(false)

    const [activeTeacher, setActiveTeacher] = useState("")
    const [subject  ,setSubject] = useState(null)
    const [isDeleted, setIsDeleted] = useState(false)

    useEffect(() => {
        dispatch(fetchFlowProfileData({id}))
        dispatch(fetchFlowProfileNextLesson({id}))
    }, [id])

    useEffect(() => {
        if (userBranchId && data)
            dispatch(fetchFilteredStudents({
                flow: id,
                branch: userBranchId,
                res: {ignore_students: data?.students.map(item => item?.id)}
            }))
    }, [userBranchId, data])

    useEffect(() => {
        if (data) {
            setValue("name", data?.name)
            setValue("level", data?.level?.id)
        }
    }, [data])

    useEffect(() => {
        if (data)
            request(`${API_URL}Subjects/level-for-subject/${data?.subject_id}/`, "GET", null, headers())
                .then(res => {

                    dispatch(getCurseLevel(res))
                })
                .catch(err => console.log(err))
    }, [data])

    const onSubmitDelete = () => {
        request(`${API_URL}Flow/flow-delete/${id}`, "DELETE", null, headers())
            .then(res => {
                navigate(-2)
                dispatch(onAddAlertOptions({
                    type: "success",
                    status: true,
                    msg: res?.msg
                }))
            })
            .catch(err => {
                dispatch(onAddAlertOptions({
                    type: "error",
                    status: true,
                    msg: "Databazada hatolik yuzberdi"
                }))
            })
        // dispatch(deleteGroupProfile({id}))
    }

    const onDelete = () => {
        setIsDeleted(true)
    }

    const onSubmitChange = (data) => {
        const res = {
            ...data,
            subject: subject
            // color: selectColor
        }
        console.log(res, "log")
        dispatch(changeFlowProfile({
            // status: activeSwitch,
            // data: res,
            id,
            res
            // group_type: theme === "app_center_theme" ? "center" : "school"
        }))
        dispatch(onAddAlertOptions({
            type: "success",
            status: true,
            msg: `Patokni malumotlari o'zgardi`
        }))
    }

    if (loading) {
        if (activeTeacher)
            setActiveTeacher(false)
        return <DefaultPageLoader/>
    }
    return (
        <div className={cls.flowProfile}>
            <div className={cls.navigators}>
                <div
                    className={cls.navigatorsItem}
                    style={{borderColor: "#3B82F6"}}
                >
                    <div className={cls.navigatorsItem__link}>
                        <p>Next lesson</p>
                        <i
                            className={classNames("fas fa-share", cls.navigatorsItem__icon)}
                        />
                    </div>
                    <div className={cls.navigatorsItem__border}/>
                    <div className={cls.navigatorsItem__info}>
                        <h2>{nextLesson?.day}</h2>
                        <h2>{nextLesson?.hour}</h2>
                        <h2>{nextLesson?.room}</h2>
                    </div>
                </div>
                <div
                    className={cls.navigatorsItem}
                    style={{borderColor: "#5A588E"}}
                >
                    <div className={cls.navigatorsItem__link}>
                        <p>Teacher</p>
                        <img src={teacher} alt=""/>
                    </div>
                    <div className={cls.navigatorsItem__border}/>
                    <div className={cls.navigatorsItem__info}>
                        <img className={cls.navigatorsItem__image} src={defaultUser} alt=""/>
                        <h2>{`${data?.teacher?.surname} ${data?.teacher?.name}`}</h2>
                        <h2 className={cls.navigatorsItem__subject}>{data?.subject_name}</h2>
                        <i
                            className={classNames("fas fa-edit", cls.navigatorsItem__iconPosition)}
                            onClick={() => setActiveTeacher("changeTeacher")}
                        />
                    </div>
                </div>
                <div
                    className={cls.navigatorsItem}
                    style={{borderColor: "#5A588E"}}
                >
                    <div className={cls.navigatorsItem__link}>
                        <p>Info</p>
                        <img src={teacher} alt=""/>
                    </div>
                    <div className={cls.navigatorsItem__border}/>
                    <div className={cls.navigatorsItem__info}>
                        <h2 className={cls.navigatorsItem__inner}>
                            <span>Name: </span>
                            {data?.name}
                        </h2>
                        {
                            data?.level_name ? <h2 className={cls.navigatorsItem__inner}>
                                <span>Level: </span>
                                {data?.level_name}
                            </h2> : null
                        }
                        <h2 className={cls.navigatorsItem__inner}>
                            <span>Activity: </span>
                            <div className={classNames(cls.status, {
                                [cls.active]: data?.activity
                            })}>
                                <div className={classNames(cls.status__inner, {
                                    [cls.active]: data?.activity
                                })}/>
                            </div>
                        </h2>
                        <i
                            className={classNames("fas fa-edit", cls.navigatorsItem__iconPosition)}
                            onClick={() => setActiveTeacher("changeInfo")}
                        />
                    </div>
                </div>
                {/*<div*/}
                {/*    className={cls.navigatorsItem}*/}
                {/*    style={{borderColor: "#22C55E"}}*/}
                {/*>*/}
                {/*    <div className={cls.navigatorsItem__link}>*/}
                {/*        <p>Class</p>*/}
                {/*        <h1*/}
                {/*            className={cls.navigatorsItem__icon}*/}
                {/*            style={{color: "black"}}*/}
                {/*        >*/}
                {/*            7*/}
                {/*        </h1>*/}
                {/*        <h2 className={cls.navigatorsItem__subject}>Green</h2>*/}
                {/*    </div>*/}
                {/*    <div className={cls.navigatorsItem__border}/>*/}
                {/*    <div className={cls.navigatorsItem__info}>*/}
                {/*        <img className={cls.navigatorsItem__image} src={defaultRoom} alt=""/>*/}
                {/*        <h2>1-xona</h2>*/}
                {/*    </div>*/}
                {/*</div>*/}
            </div>
            <FlowProfileStudentsForm
                activeTeacher={activeTeacher}
                setActiveTeacher={setActiveTeacher}
            />
            <Modal
                extraClass={cls.infoModal}
                active={activeTeacher === "changeInfo"}
                setActive={setActiveTeacher}
            >
                <h1>Ma’lumot o’zgartirish</h1>
                <Button
                    extraClass={cls.infoModal__btn}
                    onClick={() => setDeleteId(!deleteId)}
                    type={"danger"}
                >
                    Delete group
                </Button>
                <Form
                    id={"formChange"}
                    extraClassname={cls.form}
                    typeSubmit={""}
                    onSubmit={handleSubmit(onSubmitChange)}
                >
                    <Input
                        extraClassName={cls.form__input}
                        placeholder={"Patok nomi"}
                        register={register}
                        name={"name"}
                        required
                    />
                    {/*<Select*/}
                    {/*    extraClass={cls.form__input}*/}
                    {/*    options={data?.teacher?.subject}*/}
                    {/*    title={"Fan"}*/}
                    {/*    register={register}*/}
                    {/*    name={"subject"}*/}
                    {/*    defaultValue={data?.subject?.id}*/}
                    {/*    // defaultValue={data?.subject?.id}*/}
                    {/*    required*/}
                    {/*/>*/}
                    <Select
                        extraClass={cls.form__input}
                        options={data?.teacher?.subject}
                        title={"Fan"}
                        defaultValue={data?.subject?.id}
                        onChangeOption={setSubject}
                        // defaultValue={data?.subject?.id}
                        required
                    />
                    {
                        level.length ?
                            <Select
                                extraClass={cls.form__input}
                                options={level}
                                title={"Level"}
                                register={register}
                                name={"level"}
                                defaultValue={data?.level?.id}
                                required
                            /> : null
                    }

                    {/*<Input*/}
                    {/*    extraClassName={}*/}
                    {/*    placeholder={}*/}
                    {/*    register={register}*/}
                    {/*    name={"level"}*/}
                    {/*    type={"number"}*/}
                    {/*    required*/}
                    {/*/>*/}
                    <Button id={"formChange"} extraClass={cls.infoModal__btn}>Change</Button>
                </Form>
                <ConfirmModal setActive={setDeleteId} active={deleteId} onClick={onDelete} title={`Rostanham o'chirmoqchimisiz `}   type={"danger"}/>


            </Modal>
            <ConfirmModal
                type={"danger"}
                active={isDeleted}
                setActive={setIsDeleted}
                onClick={onSubmitDelete}
            />
        </div>
    )
})
