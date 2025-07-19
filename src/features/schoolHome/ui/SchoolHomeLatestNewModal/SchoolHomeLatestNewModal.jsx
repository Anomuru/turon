import {Modal} from "shared/ui/modal";
import {useDropzone} from "react-dropzone";
import React, {useEffect, useState} from "react";


import defImg from "shared/assets/images/Image Placeholder.svg"
import cls from "./SchoolHomeLatestNewModal.module.sass"
import {Input} from "shared/ui/input";
import {Textarea} from "shared/ui/textArea";
import {Button} from "shared/ui/button";
import {useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import {onAdd, onDelete, onEdit} from "../../../../entities/schoolHome/model/slice/SchoolHomeLatestNewSlice";
import {getSchoolLatestSlice} from "../../../../entities/schoolHome/model/selector/schoolLatestSelector";
import {SchoolHomeLatestNew} from "../../../../entities/schoolHome";
import {API_URL, header, headerImg, headersImg, useHttp} from "../../../../shared/api/base";
import {rgbSlice} from "../../../../entities/rgbData";
import {getLatestNew} from "../../../../entities/schoolHome/model/thunk/schoolLatestNewThunk";
import {getHomePageType} from "../../../../entities/schoolHome/model/selector/getHomePageSelector";
import {fetchHomePage} from "../../../../entities/schoolHome/model/thunk/getHomePageSelector";


export const SchoolHomeLatestNewModal = () => {
    const [addLatestNew, setAddLatestNew] = useState(false)
    const [editLatestNew, setEditLatestNew] = useState(false)


    const dispatch = useDispatch()

    const job = localStorage.getItem("job")
    const types = useSelector(getHomePageType)

    const id = types[3]?.id

    const latestNew = useSelector(getSchoolLatestSlice)
    const [deleteId, setDeleteId] = useState(null)

    useEffect(() => {
        dispatch(fetchHomePage())
    }, [])


    console.log(id , "id")

    useEffect(() => {
        dispatch(getLatestNew(id))
    }, [id])


    const {request} = useHttp()

    const {register, setValue, handleSubmit} = useForm()
    const [files, setFiles] = useState(null);
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

    const onClick = (data) => {


        const formData = new FormData
        formData.append("image", files[0])
        formData.append("name", data.name)
        formData.append("description", data.description)
        formData.append("date", data.date)
        formData.append("type", id)

        request(`${API_URL}Ui/fronted-pages/`, "POST", formData, headerImg())
            .then(res => {
                console.log(res)
                setValue("name", "")
                setValue("description", "")
                setValue("date", "")
                setFiles(null)
                dispatch(onAdd(res))
                console.log(res)
                setAddLatestNew(false)
            })
            .catch(err => console.log(err))


    }

    return (
        <div>


            <SchoolHomeLatestNew
                job={job === "smm"}
                data={latestNew}
                setAdd={setAddLatestNew}
                add={addLatestNew}
                setEdit={setEditLatestNew}
                setValue={setValue}
                setDeleteId={setDeleteId}
            />

            <Modal extraClass={cls.modalExtraClass} active={addLatestNew} setActive={setAddLatestNew}>
                <div className={cls.modal}>
                    <div {...getRootProps({className: 'dropzone'})}>
                        <input  {...getInputProps()}/>
                        {!files ? <img className={cls.def_img} src={defImg} alt=""/> :
                            <img style={{width: "31rem", height: "23rem "}} src={files?.map(item => item?.preview)}
                                 alt=""/>}
                    </div>
                    <Input required register={register} type={"date"} name={"date"} extraClassName={cls.modal__input}
                           placeholder={"Name"}/>
                    <Input required register={register} name={"name"} extraClassName={cls.modal__input}
                           placeholder={"Name"}/>
                    <Textarea required placeholder={"Text"} name={"description"} register={register}
                              extraClassName={cls.modal__input}/>
                </div>
                <div className={cls.modal__btn}>
                    <Button onClick={handleSubmit(onClick)} extraClass={cls.modal__btn_add}>Add</Button>
                    <Button onClick={handleSubmit(() => setAddLatestNew(false))}
                            extraClass={cls.modal__btn_cancel}>Cancel</Button>
                </div>
            </Modal>
            <SchoolHomeLatestEditModal setValue={setValue} setActive={setEditLatestNew} active={editLatestNew}
                                       register={register}
                                       handleSubmit={handleSubmit} deleteItemId={deleteId} id={id}/>
        </div>

    );
};

export const SchoolHomeLatestEditModal = ({active, setActive, register, handleSubmit, deleteItemId, id, setValue}) => {

    const dispatch = useDispatch()

    const {request} = useHttp()

    // const {register, setValue, handleSubmit} = useForm()
    const [files, setFiles] = useState(null);
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


    const onDeleteItem = (data) => {


        request(`${API_URL}Ui/fronted-pages/${deleteItemId.id}`, "DELETE", null, header())
            .then(res => {

                dispatch(onDelete(deleteItemId.id))

                setActive(false)
            })
    }


    const onUpdateItem = (data) => {
        const formData = new FormData

        if (files) {
            formData.append("image", files[0])
        }

        formData.append("name", data.name)
        formData.append("description", data.description)
        formData.append("date", data.date)
        formData.append("type", id)


        request(`${API_URL}Ui/fronted-pages/${deleteItemId.id}/`, "PATCH", formData, headerImg())
            .then(res => {
                dispatch(onEdit({id: deleteItemId.id, data: res}))
                setFiles(null)
                setValue("name", "")
                setValue("description", "")
                setValue("date", "")
                setActive(false)

            })

    }
    return (
        <Modal active={active} setActive={setActive}>
            <div className={cls.modal}>
                <div {...getRootProps({className: 'dropzone'})}>
                    <input  {...getInputProps()}/>
                    {!files ? <img style={{width: "31rem", height: "23rem "}}
                                   src={deleteItemId?.images?.map(item => item?.image)} alt=""/> :
                        <img style={{width: "31rem", height: "23rem "}} src={files?.map(item => item?.preview)}
                             alt=""/>}
                </div>
                <Input required register={register} name={"date"} type={"date"} extraClassName={cls.modal__input}
                       placeholder={"Name"}/>
                <Input required register={register} name={"name"} extraClassName={cls.modal__input}
                       placeholder={"Name"}/>
                <Textarea required placeholder={"Text"} name={"description"} register={register}
                          extraClassName={cls.modal__input}/>
            </div>
            <div className={cls.modal__btnEdit}>
                <Button onClick={handleSubmit(onDeleteItem)} extraClass={cls.modal__btn_delete}>Delete</Button>
                <div className={cls.modal__btn_mini}>
                    <Button onClick={handleSubmit(onUpdateItem)} extraClass={cls.modal__btn_add}>Edit</Button>
                    <Button onClick={handleSubmit(() => setActive(false))}
                            extraClass={cls.modal__btn_cancel}>Cancel</Button>
                </div>
            </div>
        </Modal>
    );
};