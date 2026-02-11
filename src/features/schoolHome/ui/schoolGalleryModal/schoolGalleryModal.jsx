import React, {useEffect, useState} from 'react';

import {SchoolHomeGallery} from "entities/schoolHome";
import {Button} from "shared/ui/button";
import {Modal} from "shared/ui/modal";

import cls from "./schoolGalleryModal.module.sass";
import defImg from "../../../../shared/assets/images/Image Placeholder.svg";
import {useDropzone} from "react-dropzone";
import {Form, useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import {
    fetchAddGallery,
    fetchHomeGalleryData
} from "../../../../entities/schoolHome/model/thunk/schoolHomeGalleryThunk";
import {API_URL, header, headerImg, useHttp} from "../../../../shared/api/base";
import {DeleteGalary, ChangeGalary} from "../../../../entities/schoolHome/model/slice/schoolHomeGallerySlice";
import {getHomePageType} from "../../../../entities/schoolHome/model/selector/getHomePageSelector";
import {fetchHomePage} from "../../../../entities/schoolHome/model/thunk/getHomePageSelector";
import {Textarea} from "../../../../shared/ui/textArea";

export const SchoolGalleryModal = () => {

    const formData = new FormData()
    const dispatch = useDispatch()
    const {
        register,
        setValue,
        handleSubmit
    } = useForm()
    const [active, setActive] = useState(false)
    const [files, setFiles] = useState(null)
    const [activeEditItem, setActiveEditItem] = useState(null)

    const job = localStorage.getItem("job")

    const types = useSelector(getHomePageType)


    const {request} = useHttp()
    useEffect(() => {
        dispatch(fetchHomePage())
    }, [])

    useEffect(() => {
        dispatch(fetchHomePage())
    }, [])

    useEffect(() => {
        if (types) {
            dispatch(fetchHomeGalleryData({id: types[0]?.id}))

        }
    }, [types])

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

    const onDeleteImage = () => {
        return request(`${API_URL}Ui/fronted-pages/${activeEditItem.id}/`, "DELETE", null, header())
            .catch(err => {
                console.log(err)
            })
            .then(res => {
                console.log(res)
                dispatch(DeleteGalary(activeEditItem.id))
                setActive(false)
                setFiles(null)
            })
    }


    const onAddImage = (data) => {
        setActive(false)
        if (files) {
            formData.append("image", files[0])
            formData.append("type", types[0]?.id)
            formData.append("description", data.description)
            dispatch(fetchAddGallery({data: formData}))

        }
        setFiles(null)
    }

    const onChange = (data) => {

        if (files){
            formData.append("image", files[0])
        }
        formData.append("type", types[0]?.id)
        formData.append("description", data.description)

        return request(`${API_URL}Ui/fronted-pages/${activeEditItem.id}/`, "PATCH", formData, headerImg())
            .catch(err => {
                console.log(err)
            })
            .then(res => {
                console.log(res)
                dispatch(ChangeGalary({id: activeEditItem.id, data: res}))
                setActive(false)
                setFiles(null)
            })
    }

    const style = {
        width: "31rem",
        height: "23rem "
    }

    return (
        <>


            <SchoolHomeGallery
                setActiveEditItem={setActiveEditItem}
                setActive={setActive}
                setValue={setValue}
                job={job === "smm"}
            />

            <Modal
                active={active === "edit"}
                setActive={setActive}
                extraClass={cls.imageEdit}
            >
                <h1>Edit box</h1>
                <div className={cls.image}>
                    <div {...getRootProps({className: 'dropzone'})}>
                        <input  {...getInputProps()}/>
                        {!files ? <img style={style} src={activeEditItem?.images[0]?.image}
                                       alt=""/> :
                            <img style={style} src={files?.map(item => item?.preview)}
                                 alt=""/>}
                    </div>

                    <Textarea extraClassName={cls.textarea} name={"description"} register={register}/>
                </div>
                <div className={cls.imageEdit__btns}>
                    <Button onClick={handleSubmit(onDeleteImage)} extraClass={cls.imageEdit__btn_delete}>Delete</Button>
                    <div className={cls.imageEdit__btn_mini}>
                        <Button onClick={handleSubmit(onChange)} id={"toggle"} extraClass={cls.imageEdit__btn_add}>Edit</Button>
                        <Button onClick={handleSubmit(() => setActive(false))}
                                extraClass={cls.imageEdit__btn_cancel}>Cancel</Button>
                    </div>
                </div>
            </Modal>

            <Modal
                active={active === "add"}
                setActive={setActive}
                extraClass={cls.imageEdit}
            >
                <h1>Add box</h1>
                <div className={cls.image}>
                    <div {...getRootProps({className: 'dropzone'})}>
                        <input  {...getInputProps()}/>
                        {!files ? <img style={{width: "31rem", height: "23rem "}}
                                       src={activeEditItem?.images[0]?.image ?? defImg} alt=""/> :
                            <img style={{width: "31rem", height: "23rem "}} src={files?.map(item => item?.preview)}
                                 alt=""/>}
                    </div>
                    <Textarea extraClassName={cls.textarea} name={"description"} register={register}/>

                </div>
                <div className={cls.imageEdit__btns}>
                    <Button onClick={handleSubmit(onAddImage)} extraClass={cls.imageEdit__btn_add}>Add</Button>
                    <Button onClick={handleSubmit(() => setActive(false))}
                            extraClass={cls.imageEdit__btn_cancel}>Cancel</Button>
                </div>
            </Modal>

        </>
    );
}
