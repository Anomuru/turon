import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useDispatch } from 'react-redux';
import { Modal } from 'shared/ui/modal';
import { Button } from 'shared/ui/button';
import {uploadRoomImageThunk} from "../model/roomImageAddThunk";
import cls from './roomImageAddModal.module.sass';
import defaultImage from 'shared/assets/images/default.png';
import {onAddAlertOptions} from "../../alert/model/slice/alertSlice";

export const RoomImageAddModal = ({ isOpen, onClose, roomId, onUpdate }) => {
    const dispatch = useDispatch();
    const [dropzones, setDropzones] = useState([{ id: Date.now(), files: [defaultImage] }]);

    const handleAddDropzone = () => {
        setDropzones([...dropzones, { id: Date.now(), files: [defaultImage] }]);
    };

    const handleDrop = (index, acceptedFiles) => {
        const newDropzones = dropzones.slice();
        newDropzones[index].files = acceptedFiles.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file)
        }));
        setDropzones(newDropzones);
    };

    const handleUploadImage = (index) => {
        const dropzone = dropzones[index];
        if (dropzone.files.length > 0 && dropzone.files[0] !== defaultImage) {
            const imageFile = dropzone.files[0];
            dispatch(uploadRoomImageThunk({ roomId, imageFile }))
                .then(() => {
                    dispatch(onAddAlertOptions({
                        type: "success",
                        status: true,
                        msg: "Rasm muvofaqqiyatli yuklandi"
                    }))
                    onClose();
                    onUpdate();
                });
        }
    };

    if (!isOpen) return null;

    return (
        <Modal active={isOpen} setActive={onClose}>
            <div className={cls.filter}>
                <div className={cls.filterHandler}>
                    {dropzones.map((dropzone, index) => (
                        <DropzoneComponent
                            key={dropzone.id}
                            index={index}
                            files={dropzone.files}
                            onDrop={(acceptedFiles) => handleDrop(index, acceptedFiles)}
                        />
                    ))}
                    <Button extraClass={cls.plusButton} onClick={handleAddDropzone}>+</Button>
                </div>
            </div>
            <div className={cls.buttonPanel}>
                <Button onClick={() => {
                    dropzones.forEach((_, index) => handleUploadImage(index));
                    onClose();
                }} className={cls.addButton}>Add</Button>
            </div>
        </Modal>
    );
};

const DropzoneComponent = ({ index, files, onDrop }) => {
    const { getRootProps, getInputProps } = useDropzone({
        accept: 'image/*',
        onDrop
    });

    return (
        <div {...getRootProps({ className: cls.dropzone })}>
            <input {...getInputProps()} />
            {files.length > 0 && files[0] !== defaultImage ? (
                <div className={cls.imagesContainer}>
                    {files.map((file, i) => (
                        <img key={i} src={file.preview} alt={`preview ${i}`} className={cls.imagePreview} />
                    ))}
                </div>
            ) : (
                <div className={cls.placeholder}>
                    <img src={defaultImage} alt="Default" className={cls.defaultImage} />
                </div>
            )}
        </div>
    );
};
