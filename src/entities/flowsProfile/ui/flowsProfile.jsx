import {flowsReducer} from "entities/flows";
import {
    getFlowsProfileData,
    getFlowsProfileNextLs, getFlowsProfileProfileLoading,
    getFlowsProfileStatus
} from "entities/flowsProfile/model/flowsProfileSelector";
import {
    changeFlowProfile,
    fetchFilteredStudents,
    fetchFlowProfileData, fetchFlowProfileNextLesson
} from "entities/flowsProfile/model/flowsProfileThunk";
import {changeGroupProfile, deleteGroupProfile} from "entities/profile/groupProfile";
import {getGroupProfileNextLsData} from "entities/profile/groupProfile/model/groupProfileSelector.js";
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
import {DynamicModuleLoader} from "shared/lib/components/DynamicModuleLoader/DynamicModuleLoader.jsx";
import {Button} from "shared/ui/button";
import {DefaultPageLoader} from "shared/ui/defaultLoader";
import {Form} from "shared/ui/form";
import {Input} from "shared/ui/input";
import {Modal} from "shared/ui/modal";
import {Radio} from "shared/ui/radio";
import {Select} from "shared/ui/select";
import {Switch} from "shared/ui/switch";
import {flowsProfileReducer} from "../model/flowsProfileSlice.js";

import cls from "./flowsProfile.module.sass";
import teacher from "shared/assets/images/teachingTeacher.png";
import defaultUser from "shared/assets/images/user_image.png";
import defaultRoom from "shared/assets/images/room.png";
import coin from "shared/assets/images/coin.png";
import {FlowProfileStudentsList} from "./flowsProfileItem";
import {ConfirmModal} from "../../../shared/ui/confirmModal";
import {getBranch} from "../../../features/branchSwitcher";

const reducers = {
    flowsProfileSlice: flowsProfileReducer,
    flowsSlice: flowsReducer
}

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
    const userBranchId = useSelector(getUserBranchId)
    const level = useSelector(getCurseLevelData)
    const [activeTeacher, setActiveTeacher] = useState("")
    const [subject, setSubject] = useState(null)
    const [isDeleted, setIsDeleted] = useState(false)
    const loading = useSelector(getFlowsProfileProfileLoading)

    useEffect(() => {
        dispatch(fetchFlowProfileData({id}))
        // dispatch(fetchFlowProfileNextLesson({id}))
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
        if (data && !data?.activity)
            request(`${API_URL}Subjects/level-for-subject/${data?.subject_id}/`, "GET", null, headers())
                .then(res => {

                    dispatch(getCurseLevel(res))
                })
                .catch(err => console.log(err))
    }, [data])

    const onSubmitDelete = () => {
        request(`${API_URL}Flow/flow-delete/${id}`, "DELETE", null, headers())
            .then(res => {
                navigate(-1)
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


    const onSubmitChange = (dataForm) => {
        let res;
        if (!data?.activity) {
            res = {
                ...dataForm,
                subject: subject.id
                // color: selectColor
            }
        } else {
            res = {
                ...dataForm
            }
        }
        dispatch(changeFlowProfile({
            // status: activeSwitch,
            // data: res,
            id,
            res
            // group_type: theme === "app_center_theme" ? "center" : "school"
        }))
        setActiveTeacher(false)
        dispatch(onAddAlertOptions({
            type: "success",
            status: true,
            msg: `Patokni malumotlari o'zgardi`
        }))
    }


    return (
        <DynamicModuleLoader reducers={reducers}>
            <div className={cls.flowProfile}>
                <div className={cls.navigators}>
                    {
                        !data?.activity ?
                            <>
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
                                        {
                                            nextLesson?.msg ? <h2>{nextLesson?.msg}</h2> : <>
                                                <h2>{nextLesson?.day}</h2>
                                                <h2>{nextLesson?.hour}</h2>
                                                <h2>{nextLesson?.room}</h2>
                                            </>
                                        }
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
                            </>
                            : null
                    }
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
                    loading={loading}
                />
                <Modal
                    extraClass={cls.infoModal}
                    active={activeTeacher === "changeInfo"}
                    setActive={setActiveTeacher}
                >
                    <h1>Ma’lumot o’zgartirish</h1>

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
                        {
                            !data?.activity
                                ? <>
                                    <Select
                                        extraClass={cls.form__input}
                                        options={data?.teacher?.subject}
                                        title={"Fan"}
                                        defaultValue={data?.teacher?.subject.find(item => item.id === +data?.subject_id)}
                                        onChangeOption={setSubject}

                                        required
                                    />
                                    {
                                        level?.length ?
                                            <Select
                                                extraClass={cls.form__input}
                                                options={level}
                                                title={"Level"}
                                                register={register}
                                                name={"level"}
                                                defaultValue={level?.find(item => item.name === data?.level_name)?.id}

                                                required
                                            /> : null
                                    }
                                </>
                                : null
                        }

                        {/*<Input*/}
                        {/*    extraClassName={}*/}
                        {/*    placeholder={}*/}
                        {/*    register={register}*/}
                        {/*    name={"level"}*/}
                        {/*    type={"number"}*/}
                        {/*    required*/}
                        {/*/>*/}
                        <div style={{display: "flex", justifyContent: "end"}}>
                            <Button id={"formChange"} extraClass={cls.infoModal__btn}>Change</Button>
                            <Button
                                extraClass={cls.infoModal__btn}
                                onClick={() => setIsDeleted(true)}
                                type={"danger"}
                            >
                                Delete group
                            </Button>
                        </div>
                    </Form>


                </Modal>
                <ConfirmModal
                    type={"danger"}
                    active={isDeleted}
                    setActive={setIsDeleted}
                    onClick={onSubmitDelete}
                />
            </div>
        </DynamicModuleLoader>
    )
})
