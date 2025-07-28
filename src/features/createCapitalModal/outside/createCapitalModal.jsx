import {Modal} from "../../../shared/ui/modal";
import {Form} from "../../../shared/ui/form";
import cls from "../../../pages/capitalPage/ui/capitalOutside/capitalPage.module.sass";
import {Input} from "../../../shared/ui/input";
import React, {useCallback, useEffect, useState} from "react";
import {useDropzone} from "react-dropzone";

export const CreateCapitalModal = ({
                                       setActiveModal,
                                       activeModal,
                                       changeItem,
                                       setChangedImages,
                                       handleSubmit,
                                       onClick,
                                       register
                                   }) => {
    return (
        <div>
            <Modal setActive={setActiveModal} active={activeModal}>
                <h1>Add</h1>
                <div style={{display: "flex", gap: "1rem", padding: "2rem"}}>
                    <ImageDrop
                        status={activeModal}
                        image={changeItem?.images}
                        setChangedImages={setChangedImages}

                    />
                    <Form extraClassname={cls.form} onSubmit={handleSubmit(onClick)}>
                        <Input required register={register} name={"name"} placeholder={"Name"}/>
                        <Input required register={register} name={"id_number"} placeholder={"Id number"}/>
                    </Form>
                </div>
            </Modal>
        </div>
    );
};


const ImageDrop = ({index, setChangedImages, image, status}) => {
    useEffect(() => {
        if (status) {
            setImg({})
        }
    }, [status])

    const [img, setImg] = useState({})
    const {getInputProps, getRootProps} = useDropzone({
        onDrop: (acceptedFiles) => {
            setImg(acceptedFiles[0])
            setChangedImages(acceptedFiles[0])
        }
    })

    const ImageRender = useCallback(({img, image}) => {
        return (
            img?.path ? <img src={URL.createObjectURL(img)} alt=""/>
                : status ? <>
                    <i className="far fa-image"/>

                    <input
                        required
                        type="file"
                        {...getInputProps()}
                    />
                </> : image?.url ? <img src={image.url} alt=""/> : <>
                    <i className="far fa-image"/>
                    <input

                        type="file"
                        {...getInputProps()}
                    />
                </>
        )
    }, [img, image])

    return (
        <div
            className={cls.items__item}
            {...getRootProps()}
        >
            <ImageRender
                img={img}
                image={image}
            />
        </div>
    )
}

