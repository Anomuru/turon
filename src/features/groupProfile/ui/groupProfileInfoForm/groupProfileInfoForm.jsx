import {deleteGroup} from "entities/groups/model/slice/groupsSlice";
import {getGroupProfileNextLsData} from "entities/profile/groupProfile/model/groupProfileSelector";
import {onAddAlertOptions} from "features/alert/model/slice/alertSlice";
import React, {memo, useEffect, useState} from 'react';
import {useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router";

import {
    getGroupProfileData,
    changeGroupProfile,
    deleteGroupProfile
} from "entities/profile/groupProfile";
import {getSchoolClassColors, getSchoolClassNumbers} from "entities/students";
import {useTheme} from "shared/lib/hooks/useTheme";
import {Button} from "shared/ui/button";
import {EditableCard} from "shared/ui/editableCard";
import {Form} from "shared/ui/form";
import {Input} from "shared/ui/input";
import {Modal} from "shared/ui/modal";
import {Radio} from "shared/ui/radio";
import {Select} from "shared/ui/select";
import {
    getLanguagesData,
    getClassColorData,
    getClassNumberData
} from "entities/oftenUsed";
import {Switch} from "shared/ui/switch";

import cls from "./groupProfileInfoForm.module.sass";
import nextImage from "shared/assets/images/groupImage.png";
import defaultUserImg from "shared/assets/images/user_image.png";
import {ConfirmModal} from "../../../../shared/ui/confirmModal";
import {getBranch} from "../../../branchSwitcher";
import {API_URL, headers, useHttp} from "shared/api/base.js";
import classNames from "classnames";


export const GroupProfileInfoForm = memo(({currentTab, setCurrentTab}) => {

    const {
        register,
        handleSubmit,
        setValue
    } = useForm()

    const {theme} = useTheme()
    const {id} = useParams()
    // const {id} = useSelector(getBranch)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const data = useSelector(getGroupProfileData)
    const nextLesson = useSelector(getGroupProfileNextLsData)
    const languages = useSelector(getLanguagesData)
    // const schoolClassNumbers = useSelector(getSchoolClassNumbers)
    const schoolClassNumbers = useSelector(getClassNumberData)
    // const schoolClassColors = useSelector(getSchoolClassColors)
    const schoolClassColors = useSelector(getClassColorData)

    const [isDeleted, setIsDeleted] = useState(false)
    const [active, setActive] = useState(false)
    const [selectColor, setSelectColor] = useState()
    const [activeSwitch, setActiveSwitch] = useState(data?.status ?? false)
    const [deleteID, setDelete] = useState(false)


    const onSubmitChange = (data) => {
        const res = {
            ...data,
            color: data.color.id ? data.color.id : schoolClassColors.filter(item => item.name === data.color)[0]?.id ?? selectColor
        }
        dispatch(changeGroupProfile({
            status: activeSwitch,
            data: res,
            id,
            group_type: theme === "app_center_theme" ? "center" : "school"
        }))
        dispatch(onAddAlertOptions({
            type: "success",
            status: true,
            msg: `Guruhni malumotlari o'zgardi`
        }))
    }
    const {request} = useHttp()
    console.log(nextLesson, 'ssss')

    const onDelete = () => {

        request(`${API_URL}Group/groups/delete/${id}/`, "POST", null, headers())
            .then(res => {

                dispatch(deleteGroup(id))
                navigate(-1)
            })
        //
        // dispatch(deleteGroupProfile({
        //     id,
        // }))
    }




    useEffect(() => {
        setValue("name", data?.name)
        setValue("price", data?.price)
        setValue("language", data?.language?.id)
        if (data){
            setValue("color", data?.color?.id ? data.color?.id : schoolClassColors.filter(item => item?.name === data?.color)[0]?.id)
            setValue("class_number", data?.class_number?.id ? data.class_number.id : schoolClassNumbers.filter(item => item.number === data.class_number)[0]?.id)
        }
    }, [data])


    return (
        <>
            <EditableCard
                extraClass={cls.info}
                title={<i className="fas fa-edit"/>}
                onClick={() => setActive(true)}
            >
                <span className={cls.info__circleBg}></span>
                <span className={cls.info__circleBg2}></span>
                <div className={cls.info__left}>
                    <span style={{background: `${data?.color}`}} className={cls.info__left__box}>
                        <h1>{data?.class_number}</h1>
                    </span>
                </div>
                <div className={cls.info__right}>
                    <div className={cls.info__right__header}>
                        <h1>{data?.name}</h1>
                        <Button onClick={() => setCurrentTab("info")} extraClass={classNames(cls.info__right__header__status, { [cls.active]: currentTab === "info" })}>
                            <i style={{fontSize: "1.9rem"}} className="fa-solid fa-graduation-cap"></i>
                            <h2>Sinf ma'lumotlari</h2>
                        </Button>
                        <Button onClick={() => navigate(`quarter/${id}`)} extraClass={cls.info__right__header__balance}>
                            <i style={{fontSize: "1.9rem"}} className="fa-solid fa-bars-progress"></i>
                            <h2>Chorak baholarni ko'rish</h2>
                        </Button>
                        <Button onClick={() => setCurrentTab("time")} extraClass={classNames(cls.info__right__header__time, { [cls.active]: currentTab === "time" })}>
                            <i style={{fontSize: "1.9rem"}} className="fa-solid fa-table"></i>
                            <h2>Time table</h2>
                        </Button>
                    </div>
                    <div className={cls.info__right__footer}>
                        <div style={{background: "#FFEFDA", border: "2px solid #FED7AA"}} className={cls.info__right__footer__card}>
                                <span style={{background: "#F97316"}}>
                                    <i className="fa-regular fa-user"></i>
                                </span>
                            <div className={cls.info__right__footer__card__arounder}>
                                <h2 style={{color: "#F97316"}}>Sinf rahbari</h2>
                                <h1 style={{color: "#9A3412"}}>{data?.teacher}</h1>
                            </div>
                        </div>
                        <div style={{background: "#E3EFFE", border: "2px solid #3B82F6"}} className={cls.info__right__footer__card}>
                                <span style={{background: "#3B82F6"}}>
                                    <i className="fa-solid fa-globe"></i>
                                </span>
                            <div className={cls.info__right__footer__card__arounder}>
                                <h2 style={{color: "#4A63EB"}}>Sinf tili</h2>
                                <h1 style={{color: "#1E40AF"}}>{data?.language?.name}</h1>
                            </div>
                        </div>
                        <div style={{background: "#F5ECFF", border: "2px solid #9675F1"}} className={cls.info__right__footer__card}>
                                <span style={{background: "#A855F7"}}>
                                    <i className="fa-solid fa-users"></i>
                                </span>
                            <div className={cls.info__right__footer__card__arounder}>
                                <h2 style={{color: "#9675F1"}}>O'quvchilar soni</h2>
                                <h1 style={{color: "#6B21A8"}}>{data?.count}-ta</h1>
                            </div>
                        </div>
                        <div style={{background: "#E2FDEB", border: "2px solid #22C55E"}} className={cls.info__right__footer__card}>
                                <span style={{background: "#22C55E"}}>
                                    <i className="fa-solid fa-dollar"></i>
                                </span>
                            <div className={cls.info__right__footer__card__arounder}>
                                <h2 style={{color: "#16A384"}}>Sinf narxi</h2>
                                <h1 style={{color: "#166534"}}>{data?.price.toLocaleString()} uzs</h1>
                            </div>
                        </div>
                    </div>
                </div>

                {/*<div className={cls.info__text}>*/}
                {/*    <p>O'qitish tili: <span className={cls.info__name}>*/}
                {/*    {*/}
                {/*        data?.language?.name.length > 16 ?*/}
                {/*            `${data?.language?.name.slice(0, 16)}...` :*/}
                {/*            data?.language?.name*/}
                {/*    }*/}
                {/*</span></p>*/}
                {/*    <p className={cls.info__hoverName}>*/}
                {/*        {data?.language?.name}*/}
                {/*    </p>*/}
                {/*    {*/}
                {/*        data?.course_types?.name ? <p>Kurs turi: <span>{data?.course_types?.name}</span></p> : null*/}
                {/*    }*/}
                {/*    {*/}
                {/*        data?.level?.name ? <p>Level: <span>{data?.level?.name}</span></p> : null*/}
                {/*    }*/}
                {/*    {*/}
                {/*        data?.class_number?.number ?*/}
                {/*            <p>Sinf raqami: <span>{data?.class_number?.number}</span></p> : null*/}
                {/*    }*/}

                {/*    <p>Guruh narxi: <span>{data?.price}</span></p>*/}
                {/*    <p>Studentlar soni: <span>{data?.students.length}</span></p>*/}
                {/*    <div style={{alignSelf: "start"}}>*/}
                {/*        <Button onClick={() => navigate(`quarter/${id}`)}>Chorak Baholarni kurish</Button>*/}
                {/*    </div>*/}

                {/*    <div className={cls.info__addInfo}>*/}
                {/*        <i className="fas fa-plus"/>*/}
                {/*    </div>*/}


                {/*</div>*/}

            </EditableCard>
            <Modal
                extraClass={cls.infoModal}
                active={active}
                setActive={setActive}
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
                        placeholder={"Sinf nomi"}
                        // title={"Guruh nomi"}
                        register={register}
                        name={"name"}
                        required
                    />
                    <Select
                        extraClass={cls.form__select}
                        options={languages}
                        title={"Sinf tili"}
                        register={register}
                        name={"language"}
                        defaultValue={data?.language?.id}
                        required
                    />
                    <>
                        <Select
                            extraClass={cls.form__select}
                            options={schoolClassNumbers}
                            title={"Sinf raqami"}
                            register={register}
                            name={"class_number"}
                            defaultValue={data?.class_number?.id ? data?.class_number?.id : schoolClassNumbers.filter(item => item?.number === data?.class_number)[0]?.id}
                            required
                        />
                        <Input title={"Sinf narxi"} type={"number"} placeholder={"Amount"} register={register}
                               name={"price"}/>
                    </>
                    {
                        schoolClassColors.length <= 3 ?
                            <div className={cls.form__radios}>
                                {
                                    schoolClassColors.map(item => {
                                        return (
                                            <div className={cls.form__inner}>
                                                <Radio
                                                    extraClasses={cls.form__item}
                                                    onChange={() => setSelectColor(item.id)}
                                                    checked={selectColor ? selectColor === item.id : data?.color.id === item.id}
                                                    name={"color"}
                                                />
                                                {
                                                    item.name
                                                }
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            :
                            <Select
                                keyValue={"id"}
                                extraClass={cls.form__select}
                                title={"Sinf rangi"}
                                name={"color"}
                                options={schoolClassColors}
                                defaultValue={data?.color?.id ? data?.color?.id : schoolClassColors.filter(item => item?.name === data?.color)[0]?.id}
                                // value={selectedColor}
                                register={register}
                            />
                    }
                    <div className={cls.form__switch}>
                        <p>Guruh statusi: </p>
                        <Switch
                            activeSwitch={activeSwitch}
                            onChangeSwitch={setActiveSwitch}
                        />
                    </div>
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                        <Button
                            extraClass={cls.infoModal__btn}
                            onClick={handleSubmit(() => {
                                setIsDeleted(true)
                                setDelete(!deleteID)
                            })}
                            type={"danger"}
                        >
                            Delete group
                        </Button>
                        <Button id={"formChange"} extraClass={cls.infoModal__btn}>Change</Button>
                    </div>
                </Form>
                <ConfirmModal setActive={setDelete} active={deleteID} onClick={handleSubmit(onDelete)}
                              title={`Rostanham o'chirmoqchimisiz`} type={"danger"}/>

            </Modal>
            {/*<ConfirmModal*/}
            {/*    type={"danger"}*/}
            {/*    active={isDeleted}*/}
            {/*    setActive={setIsDeleted}*/}
            {/*    onClick={onDelete}*/}
            {/*/>*/}
        </>
    )
})
