import {Modal} from "shared/ui/modal";
import {useDropzone} from "react-dropzone";
import React, {useEffect, useState} from "react";


import defImg from "shared/assets/images/Image Placeholder.svg"
import cls from "./schoolHomeStudentProfileModal.module.sass"
import {Input} from "shared/ui/input";
import {Textarea} from "shared/ui/textArea";
import {Button} from "shared/ui/button";
import {useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import {onAdd, onDelete, onEdit} from "../../../../entities/schoolHome/model/slice/schoolHomeStudentProfileSlice";
import {getSchoolProfileData, SchoolHomeStudentProfile} from "../../../../entities/schoolHome";
import {getStudentProfile} from "../../../../entities/schoolHome/model/thunk/schoolStudentProfileThunk";
import {API_URL, header, headerImg, useHttp} from "../../../../shared/api/base";
import {fetchHomePage} from "../../../../entities/schoolHome/model/thunk/getHomePageSelector";
import {getHomePageType} from "../../../../entities/schoolHome/model/selector/getHomePageSelector";


export const SchoolHomeStudentProfileModal = () => {
    const [add, setAdd] = useState(false)
    const [edit, setEdit] = useState(false)
    const profileData = useSelector(getSchoolProfileData)
    const [deleteId, setDeleteId] = useState(null)


    const job = localStorage.getItem("job")


    const types = useSelector(getHomePageType)
    const dispatch = useDispatch()

    const {request} = useHttp()
    const id = types[2]?.id

    useEffect(() => {
        dispatch(fetchHomePage())
    } , [])


    useEffect(() => {
        dispatch(getStudentProfile(id))
    }, [id])


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
        formData.append("type", id)


        request(`${API_URL}Ui/fronted-pages/`, "POST", formData, headerImg())
            .then(res => {
                setValue("name", "")
                setValue("description", "")
                setValue("date", "")
                setFiles(null)
                dispatch(onAdd(res))
                console.log(res)
                setAdd(false)
            })
            .catch(err => console.log(err))


    }

    return (


        <>

            <SchoolHomeStudentProfile
                job={job === "smm"}
                setDeleteId={setDeleteId}
                setEdit={setEdit}
                add={add}
                setAdd={setAdd}
                setValue={setValue}
                data={profileData}
            />

            <Modal active={add} setActive={setAdd}>
                <div className={cls.modal}>
                    <div {...getRootProps({className: 'dropzone'})}>
                        <input  {...getInputProps()}/>
                        {!files ? <img src={defImg} alt=""/> :
                            <img style={{width: "31rem", height: "23rem "}} src={files?.map(item => item?.preview)}
                                 alt=""/>}
                    </div>
                    <Input required register={register} name={"name"} extraClassName={cls.modal__input}
                           placeholder={"Name"}/>
                    <Textarea required placeholder={"Text"} name={"description"} register={register}
                              extraClassName={cls.modal__input}/>
                </div>
                <div className={cls.modal__btn}>
                    <Button onClick={handleSubmit(onClick)} extraClass={cls.modal__btn_add}>Add</Button>
                    <Button onClick={handleSubmit(() => setAdd(false))}
                            extraClass={cls.modal__btn_cancel}>Cancel</Button>
                </div>
            </Modal>

            <SchoolHomeStudentEditModal
                deleteItemId={deleteId}
                handleSubmit={handleSubmit}
                register={register}
                setActive={setEdit}
                active={edit}
                id={id}
                setValue={setValue}
            />

        </>
    );
};


export const SchoolHomeStudentEditModal = ({active, setActive, deleteItemId, handleSubmit, register, id, setValue}) => {

    const dispatch = useDispatch()
    // const {register, setValue, handleSubmit} = useForm()
    const {request} = useHttp()
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
                <Input required register={register} name={"name"} extraClassName={cls.modal__input}
                       placeholder={"Name"}/>
                <Textarea required placeholder={"Text"} name={"description"} register={register}
                          extraClassName={cls.modal__input}/>
            </div>
            <div className={cls.modal__btn}>
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

