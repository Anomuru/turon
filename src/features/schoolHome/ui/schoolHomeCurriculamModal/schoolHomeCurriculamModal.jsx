import React, {useContext, useEffect, useRef, useState} from "react";
import {SchoolHomeCurricular} from "entities/schoolHome";
import {useDispatch, useSelector} from "react-redux";
import {
    getCurricularData,
    getExtraCurricularData
} from "entities/schoolHome/model/selector/schoolCurricularSelector";
import {Modal} from "shared/ui/modal";
import {Input} from "shared/ui/input";


import cls from "./schoolHomeCurriculamModal.module.sass"
import {Textarea} from "shared/ui/textArea";
import backImg from "shared/assets/icons/skew870.svg";
import {useDropzone} from "react-dropzone";
import defImg from "shared/assets/images/Image Placeholder.svg"
import {Button} from "shared/ui/button";
import {useForm} from "react-hook-form";

import {
    onAddCurricular,
    onDeleteCurricular,
    onEditCurricular, onExtraAddCurricular, onExtraDeleteCurricular, onExtraEditCurricular
} from "entities/schoolHome/model/slice/schoolCurricularSlice";
import {API_URL, header, headerImg, useHttp} from "shared/api/base";
import {getCurriculum, getExtraCurriculum} from "entities/schoolHome/model/thunk/curriculumThunk";
import {getUserJob} from "../../../../entities/profile/userProfile";
import {getHomePageType} from "../../../../entities/schoolHome/model/selector/getHomePageSelector";
import {fetchHomePage} from "../../../../entities/schoolHome/model/thunk/getHomePageSelector";
import {HomeContext} from "../../../../shared/lib/context/homeContext";

export const SchoolHomeCurriculamModal = () => {
    const {setSectionTop} = useContext(HomeContext)

    const sectionRef = useRef()

    useEffect(() => {
        setSectionTop(cur => ({...cur, curricular: sectionRef?.current?.offsetTop}))
    }, [setSectionTop])

    const curricularData = useSelector(getCurricularData)
    const extraCurricularData = useSelector(getExtraCurricularData)





    const [activeAdd, setActiveAdd] = useState(false)
    const [activeEdit, setActiveEdit] = useState(false)

    const [deleteId, setDeleteId] = useState(null)
    const [deleteIdExtra, setDeleteIdExtra] = useState(null)
    const {register, setValue, handleSubmit} = useForm()


    const job = localStorage.getItem("job")





    const [extraCurricular, setActiveExtraCurricular] = useState(false)
    const [extraCurricularEdit, setActiveExtraCurricularEdit] = useState(false)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchHomePage())
    } , [])

    useEffect(() => {
       dispatch(getCurriculum())
       dispatch(getExtraCurriculum())

    }, [])



    return (
        <div ref={sectionRef}>
            <SchoolHomeCurricular

                job={job === "smm"}
                data={curricularData}
                extraCurricularData={extraCurricularData}


                setValue={setValue}
                setActiveEdit={setActiveEdit}
                setDeleteId={setDeleteId}
                setActive={setActiveAdd}

                setActiveExtraCurricular={setActiveExtraCurricular}

                setActiveExtraCurricularEdit={setActiveExtraCurricularEdit}
                setDeleteIdExtra={setDeleteIdExtra}
            />


            <SchoolCurriculumAdd
                active={activeAdd}
                setActive={setActiveAdd}
            />

            <SchoolCurriculumEdit
                handleSubmit={handleSubmit}
                register={register}
                setValue={setValue}
                idItem={deleteId}
                setActive={setActiveEdit}
                active={activeEdit}
            />





            <SchoolExtraCurriculumAdd
                active={extraCurricular}
                setActive={setActiveExtraCurricular}
            />


            <SchoolExtraCurriculumEdit register={register} setValue={setValue} idItem={deleteIdExtra}
                                       setActive={setActiveExtraCurricularEdit} active={extraCurricularEdit}
                                       handleSubmit={handleSubmit}/>

        </div>
    );
};


export const SchoolCurriculumAdd = ({active, setActive}) => {

    const dispatch = useDispatch()
    const {register, handleSubmit, setValue} = useForm()
    const [files, setFiles] = useState(null);

    const {request} = useHttp()
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
    const myStyle = {
        backgroundImage: `url(${backImg})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover"
    }


    const onAddItem = (data) => {

        const formData = new FormData
        formData.append("image", files[0])
        formData.append("name", data.name)
        formData.append("description", data.description)
        formData.append("type", 7)

        request(`${API_URL}Ui/fronted-pages/`, "POST", formData, headerImg())
            .then(res => {
                console.log(res)
                setValue("name", "")
                setValue("text", "")
                setFiles(null)
                dispatch(onAddCurricular(res))
                console.log(res)
                setActive(false)
            })
            .catch(err => console.log(err))







    }

    return (
        <Modal typeIcon setActive={setActive} active={active}>
            <div className={cls.curriculam}>
                <div className={cls.curriculam__input}>
                    <Input placeholder={"Text"} register={register} name={"name"}/>
                    <Textarea placeholder={"Text"} register={register} name={"description"}/>
                </div>
                <div style={myStyle} className={cls.curriculam__aside}>

                    <div {...getRootProps({className: 'dropzone'})}>
                        <input  {...getInputProps()}/>
                        {!files ? <img style={{width: "31rem", height: "23rem "}} src={defImg} alt=""/> :
                            <img style={{width: "31rem", height: "23rem "}} src={files?.map(item => item?.preview)}
                                 alt=""/>}
                    </div>
                </div>
            </div>
            <div className={cls.modal__btn}>

                <Button onClick={handleSubmit(onAddItem)} extraClass={cls.modal__btn_add}>Add</Button>
                <Button onClick={handleSubmit(() => setActive(false))}
                        extraClass={cls.modal__btn_cancel}>Cancel</Button>

            </div>
        </Modal>
    )
}


export const SchoolCurriculumEdit = ({active, setActive, handleSubmit, setValue, register, idItem}) => {


    const {request} = useHttp()
    const dispatch = useDispatch()
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
    const myStyle = {
        backgroundImage: `url(${backImg})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover"
    }


    const onDeleteItem = (data) => {


        request(`${API_URL}Ui/fronted-pages/${idItem.id}` , "DELETE" , null , header() )
            .then(res => {

                dispatch(onDeleteCurricular(idItem.id))

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
        formData.append("type", 7)


        request(`${API_URL}Ui/fronted-pages/${idItem.id}/`, "PATCH", formData, headerImg())
            .then(res => {
                dispatch(onEditCurricular({id: idItem.id, data: res}))
                setFiles(null)
                setValue("name", "")
                setValue("description", "")

                setActive(false)

            })



    }

    return (
        <Modal typeIcon setActive={setActive} active={active}>
            <div className={cls.curriculam}>
                <div className={cls.curriculam__input}>
                    <Input placeholder={"Text"} register={register} name={"name"}/>
                    <Textarea placeholder={"Text"} register={register} name={"description"}/>
                </div>
                <div style={myStyle} className={cls.curriculam__aside}>

                    <div {...getRootProps({className: 'dropzone'})}>
                        <input  {...getInputProps()}/>
                        {!files ? <img style={{width: "31rem", height: "23rem "}} src={idItem?.images?.map(item => item?.image)} alt=""/> :
                            <img style={{width: "31rem", height: "23rem "}} src={files?.map(item => item?.preview)}
                                 alt=""/>}
                    </div>
                </div>
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
    )
}


export const SchoolExtraCurriculumAdd = ({setActive, active}) => {


    const dispatch = useDispatch()

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





    const onAddItem = (data) => {

        const formData = new FormData
        formData.append("image", files[0])
        formData.append("name", data.name)
        formData.append("description", data.description)
        formData.append("type", 6)

        request(`${API_URL}Ui/fronted-pages/`, "POST", formData, headerImg())
            .then(res => {
                console.log(res)
                setValue("name", "")
                setValue("text", "")

                setFiles(null)
                dispatch(onExtraAddCurricular(res))
                console.log(res)
                setActive(false)
            })
            .catch(err => console.log(err))
    }

    return (
        <Modal extraClass={cls.modalExtraClass} active={active} setActive={setActive}>
            <div className={cls.modalExtra}>
                <div {...getRootProps({className: 'dropzone'})}>
                    <input  {...getInputProps()}/>
                    {!files ? <img className={cls.dropzone} src={defImg} alt=""/> :
                        <img className={cls.dropzone}  src={files?.map(item => item?.preview)}
                             alt=""/>}
                </div>
                <Input required register={register} name={"name"} extraClassName={cls.modalExtra__input}
                       placeholder={"Name"}/>
                <Textarea required placeholder={"Text"} name={"description"} register={register}
                          extraClassName={cls.modalExtra__input}/>
            </div>
            <div className={cls.modal__btn}>
                <Button onClick={handleSubmit(onAddItem)} extraClass={cls.modal__btn_add}>Add</Button>
                <Button onClick={handleSubmit(() => setActive(false))}
                        extraClass={cls.modal__btn_cancel}>Cancel</Button>
            </div>
        </Modal>
    )
}


export const SchoolExtraCurriculumEdit = ({active, setActive, handleSubmit, setValue, register, idItem}) => {
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



        request(`${API_URL}Ui/fronted-pages/${idItem.id}` , "DELETE" , null , header() )
            .then(res => {
                dispatch(onExtraDeleteCurricular(idItem.id))
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
        formData.append("type", 6)


        request(`${API_URL}Ui/fronted-pages/${idItem.id}/`, "PATCH", formData, headerImg())
            .then(res => {
                dispatch(onExtraEditCurricular({id: idItem.id, data: res}))
                setFiles(null)
                setValue("name", "")
                setValue("description", "")
                setActive(false)

            })

    }
    return (
        <Modal typeIcon setActive={setActive} active={active}>
            <div className={cls.modalExtra}>
                <div {...getRootProps({className: 'dropzone'})}>
                    <input  {...getInputProps()}/>
                    {!files ? <img  style={{width: "31rem", height: "23rem "}} src={idItem?.images?.map(item => item?.image)} alt=""/> :
                        <img style={{width: "31rem", height: "23rem "}} src={files?.map(item => item?.preview)}
                             alt=""/>}
                </div>
                <Input required register={register} name={"name"} extraClassName={cls.modalExtra__input}
                       placeholder={"Name"}/>
                <Textarea required placeholder={"Text"} name={"description"} register={register}
                          extraClassName={cls.modalExtra__input}/>
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
}