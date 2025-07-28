import React, {memo, useCallback, useEffect, useState} from 'react';
import classNames from "classnames";
import {useForm} from "react-hook-form";

import {Modal} from "shared/ui/modal";
import {Input} from "shared/ui/input";
import {Textarea} from "shared/ui/textArea";
import {Form} from "shared/ui/form";
import {Button} from "shared/ui/button";

import cls from "./schoolVisionMission.module.sass";
import image from "shared/assets/images/Rectangle 1.png";
import {API_URL, header, headerImg, useHttp} from "../../../../shared/api/base";
import {useDispatch, useSelector} from "react-redux";
import {getVissionData} from "../../../../entities/schoolHome/model/selector/missionSchoolSelector";
import {getVisionSchool} from "../../../../entities/schoolHome/model/thunk/missionSchoolThunk";
import {fetchHomePage} from "../../../../entities/schoolHome/model/thunk/getHomePageSelector";
import {useDropzone} from "react-dropzone";

import defImg from "../../../../shared/assets/images/Image Placeholder.svg";
import {onAdd, onDelete, onEdit} from "../../../../entities/schoolHome/model/slice/missionSchoolSlice";


export const SchoolVisionMission = memo(() => {

    const {
        register,
        setValue,
        handleSubmit
    } = useForm()

    const [active, setActive] = useState()
    const [activeTextEdit, setActiveTextEdit] = useState(false)
    const [activeEditItem, setActiveEditItem] = useState(null)
    const [activeEditImage, setActiveEditImage] = useState(false)
    const [files, setFiles] = useState(null)
    const {getRootProps, getInputProps} = useDropzone({
        accept: {
            'image/*': [],
        },
        onDrop: (acceptedFiles) => {
            setFiles(
                acceptedFiles.map((file) =>
                    Object.assign(file, {
                        preview: URL.createObjectURL(file),
                    })
                )
            );
        },
    });
    const [addActive, setAddActive] = useState(false)

    const dispatch = useDispatch()

    const list = useSelector(getVissionData)

    const {request} = useHttp()

    useEffect(() => {
        dispatch(fetchHomePage())
    }, [])

    useEffect(() => {

        dispatch(getVisionSchool({id: 5}))
    }, [])


    const job = localStorage.getItem("job")

    const renderListItem = useCallback(() => {
        return list.map(item => {
            return (
                <div
                    key={item?.title}
                    onClick={() => {
                        setActive(item?.id)
                        setActiveEditItem(item)
                    }}
                    className={classNames(cls.container__item, {
                        [cls.active]: item?.id === active
                    })}
                >
                    <h3>{item?.name}</h3>
                    <p>{item?.description}</p>
                </div>
            )
        })
    }, [list, active])

    useEffect(() => {
        setValue("name", activeEditItem?.name)
        setValue("description", activeEditItem?.description)

    }, [activeEditItem])



    const onCreate = (data) => {

        const formData = new FormData()

        if (files){
            formData.append("images", files[0])
        }
        formData.append("name", data.name)
        formData.append("description", data.description)

        formData.append("type", 5)




        request(`${API_URL}Ui/fronted-pages/`, "POST", formData, headerImg())
            .then(res => {
                setAddActive(false)
                dispatch(onAdd(res))
                setFiles(null)
                setValue("name" , "")
                setValue("description" , "")

            })
            .catch(err => {
                console.log(err)
            })
    }

    const onDeleteText = (id) => {
        request(`${API_URL}Ui/fronted-pages/${id}/`, "DELETE", null, header())
            .then(res => {
                dispatch(onDelete(id))

                setActiveTextEdit(false)
            })
            .catch(err => {
                console.log(err)
            })

    }


    const onChangeText = (data) => {

        const formData = new FormData()

        if (files){
            formData.append("images", files[0])
        }
        formData.append("name", data.name)
        formData.append("description", data.description)

        formData.append("type", 5)

        request(`${API_URL}Ui/fronted-pages/${activeEditItem.id}/`, "PATCH", formData, headerImg())
            .then(res => {
                setActiveTextEdit(false)

                dispatch(onEdit({id: activeEditItem.id , data: res}))
            })
            .catch(err => {
                console.log(err)
            })
    }

    console.log(list)

    return (
        <>


            <div className={cls.visionMission}>
                <div className={cls.visionMission__info}>
                    <h1 className={cls.visionMission__title}>Vision mission</h1>
                    <div className={cls.container}>
                        {renderListItem()}
                    </div>
                    {job && <div
                        onClick={() => setActiveTextEdit(!activeTextEdit)}
                        className={cls.visionMission__change}
                        style={{right: "2.8rem", left: "none"}}
                    >
                        <i className={classNames("fas fa-edit")}/>
                    </div>}
                </div>
                <div
                    className={cls.visionMission__image}
                >
                    <div className={cls.visionMission__imageFilter}>
                        {job && <div
                            onClick={() => setActiveEditImage(!activeEditImage)}
                            className={cls.visionMission__change}
                            style={{left: "5rem"}}
                        >
                            <i className={classNames("fas fa-edit")}/>
                        </div>}
                        {job && list.length <5  ?
                            <div
                                onClick={() => setAddActive(true)}
                                className={cls.visionMission__add}>
                                <i
                                    className={classNames(
                                        "fas fa-plus",
                                        cls.visionMission__icon
                                    )}
                                />
                            </div> : null}
                    </div>
                    <img
                        src={image}
                        alt=""
                    />
                </div>
            </div>


            <Modal
                setActive={setAddActive}
                active={addActive}
            >
                <h1>Add box</h1>
                <Form
                    onSubmit={handleSubmit(onCreate)}
                    typeSubmit={""}
                    extraClassname={cls.textEdit}
                >


                    <div className={cls.image}>
                        <div {...getRootProps({className: 'dropzone'})}>
                            <input  {...getInputProps()}/>
                            {!files ? <img style={{width: "31rem", height: "23rem "}} src={defImg} alt=""/> :
                                <img style={{width: "31rem", height: "23rem "}} src={files?.map(item => item?.preview)}
                                     alt=""/>}
                        </div>
                    </div>


                    <div>
                        <Input
                            register={register}
                            name={"name"}
                            placeholder={"Name"}
                        />
                        <Textarea
                            register={register}
                            name={"description"}
                            placeholder={"Text"}
                        />
                    </div>
                    <div className={cls.textEdit__btns}>
                        <Button>Add</Button>
                    </div>
                </Form>
            </Modal>


            <Modal
                setActive={setActiveTextEdit}
                active={activeTextEdit}
            >
                <Form
                    onSubmit={handleSubmit(onChangeText)}
                    typeSubmit={""}
                    extraClassname={cls.textEdit}
                >
                    <h1>Edit box</h1>
                    <div>
                        <Input
                            register={register}
                            name={"name"}
                            placeholder={"Name"}
                        />
                        <Textarea
                            register={register}
                            name={"description"}
                            placeholder={"Text"}
                        />
                    </div>
                    <div className={cls.textEdit__btns}>
                        <Button
                            type={"danger"}
                            onClick={() => onDeleteText(activeEditItem?.id)}
                        >
                            Delete
                        </Button>
                        <Button>Add</Button>
                    </div>
                </Form>
            </Modal>

            <Modal
                active={activeEditImage}
                setActive={setActiveEditImage}
                extraClass={cls.imageEdit}
            >
                <h1>Edit box</h1>
                <div className={cls.image}>
                    <div className={cls.image__container}>
                        <i className="far fa-image"/>
                    </div>
                </div>
                <div className={cls.imageEdit__btns}>
                    <Button
                        type={"danger"}
                        onClick={() => onDeleteText(activeEditItem?.id)}
                    >
                        Delete
                    </Button>
                    <Button>Add</Button>
                </div>
            </Modal>
        </>
    );
})
