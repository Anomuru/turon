import React, {useEffect, useState} from 'react';
import {useDropzone} from "react-dropzone";
import {useDispatch, useSelector} from "react-redux";
import {useForm} from "react-hook-form";

import {SchoolHomeMain} from "entities/schoolHome";
import {Input} from "shared/ui/input";
import {Textarea} from "shared/ui/textArea";
import {Button} from "shared/ui/button";
import {Modal} from "shared/ui/modal";

import cls from "./schoolHomeMainModal.module.sass";
import defImg from "shared/assets/images/Image Placeholder.svg";
import {Form} from "../../../../shared/ui/form";
import {
    fetchHomeMainData,
    fetchAddPrograms,
    editProgram, editDescription, fetchHomeMainDescription, addDescription
} from "../../../../entities/schoolHome/model/thunk/schoolHomeMainThunk";
import {
    getSchoolHomeMainDes,
    getSchoolHomeMainSecDes
} from "../../../../entities/schoolHome/model/selector/schoolHomeMainSelector";
import {API_URL, header, useHttp} from "../../../../shared/api/base";
import {onDeleteHomeBox} from "../../../../entities/schoolHome/model/slice/schoolHomeMain";


export const SchoolHomeMainModal = ({types}) => {

    const [mainActive, setMainActive] = useState(false)
    const [programActive, setProgramActive] = useState('')
    const [activeEditItem, setActiveEditItem] = useState({})

    const [files, setFiles] = useState(null);

    const {request} = useHttp()
    const formData = new FormData()
    const job = localStorage.getItem("job")
    const dispatch = useDispatch()
    const secDes = useSelector(getSchoolHomeMainSecDes)
    const des = useSelector(getSchoolHomeMainDes)

    useEffect(() => {
        if (types) {
            dispatch(fetchHomeMainData({id: types[1]?.id}))
            dispatch(fetchHomeMainDescription({id: types[7]?.id}))
            dispatch(fetchHomeMainDescription({id: types[9]?.id}))
        }
    }, [types])

    const {
        register,
        setValue,
        handleSubmit
    } = useForm()
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

    const onDeleteItem = () => {
        request(`${API_URL}Ui/fronted-pages/${activeEditItem?.id}/`, "DELETE", null, header())
            .then(res => {

                dispatch(onDeleteHomeBox(activeEditItem.id))

                setProgramActive(false)
                console.log(res)
            })
            .catch(err => console.log(err))
    }

    useEffect(() => {
        if (programActive === "add") {
            setValue("name", "")
            setValue("description", "")
            setFiles(null)
        }
        if (activeEditItem?.id && programActive === "edit") {
            setValue("name", activeEditItem?.name)
            setValue("description", activeEditItem?.description)
            setFiles([{preview: activeEditItem?.images[0]?.image}])
        }
    }, [activeEditItem, programActive])

    useEffect(() => {
        if (secDes || des) {
            setValue("programs_text", secDes && secDes[0]?.description)
            setValue("our_text", des && des[0]?.description)
        }
    }, [secDes, des])

    const onToggleProgramData = (data) => {
        formData.append("name", data.name)
        formData.append("description", data.description)
        formData.append("type", types[1]?.id)
        if (programActive === "add") {
            if (files) {
                formData.append("image", files[0])
            }
            dispatch(fetchAddPrograms({data: formData}))
        } else {
            if (files) {
                formData.append("image", files[0])
            }
            dispatch(editProgram({data: formData, id: activeEditItem?.id}))
        }
        setProgramActive(false)
        setFiles(null)
    }


    const onChangeMain = (data) => {

        if (secDes && secDes[0]?.id) {
            const res2 = {description: data?.programs_text, type: types[9]?.id}
            dispatch(editDescription({data: res2, id: secDes[0]?.id}))
        } else {
            dispatch(addDescription({description: data?.programs_text, type: types[9]?.id}))
        }
        if (des && des[0]?.id) {
            const res = {description: data?.our_text, type: types[7]?.id}
            dispatch(editDescription({data: res, id: des[0]?.id}))
        } else {
            dispatch(addDescription({description: data?.our_text, type: types[7]?.id}))
        }
        setProgramActive(false)
        setMainActive(false)
        setFiles(null)
    }

    return (
        <>


            <SchoolHomeMain
                setActiveEditItem={setActiveEditItem}
                setActive={setProgramActive}
                setMainActive={setMainActive}
                role={job === "smm"}
            />

            <Modal active={programActive} setActive={setProgramActive}>
                <Form
                    id={"toggle"}
                    typeSubmit={""}
                    onSubmit={handleSubmit(onToggleProgramData)}
                >
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

                        <Button onClick={handleSubmit(onDeleteItem)} extraClass={cls.modal__btn_delete}>Delete</Button>
                        <div className={cls.modal__btn_mini}>
                            <Button id={"toggle"} extraClass={cls.modal__btn_add}>Edit</Button>
                            <Button onClick={handleSubmit(() => setProgramActive(false))}
                                    extraClass={cls.modal__btn_cancel}>Cancel</Button>
                        </div>
                    </div>
                </Form>
            </Modal>

            <Modal active={mainActive} setActive={setMainActive}>
                <Form id={"change"} typeSubmit={""} onSubmit={handleSubmit(onChangeMain)}>
                    <div className={cls.editModal}>
                        <Textarea register={register} title={"Our vision text"} placeholder={"text"} name={"our_text"}/>
                        <Textarea register={register} title={"Programs text"} placeholder={"text"}
                                  name={"programs_text"}/>
                    </div>
                    <div className={cls.modal__btn}>
                        <Button id={"change"} extraClass={cls.modal__btn_add}>Edit</Button>
                        <Button onClick={handleSubmit(() => setMainActive(false))}
                                extraClass={cls.modal__btn_cancel}>Cancel</Button>
                    </div>
                </Form>
            </Modal>
        </>

    );
}
