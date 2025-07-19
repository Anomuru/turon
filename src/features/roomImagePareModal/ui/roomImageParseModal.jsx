import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal } from 'shared/ui/modal';
import cls from './roomImageParseModal.module.sass';
import { API_URL } from "../../../shared/api/base";
import { fetchRoomImages } from 'features/roomImagePareModal/model/roomImageParseModalThunk';
import { getRoomImage } from 'features/roomImagePareModal/model';
import { useParams } from "react-router-dom";

export const RoomImageParseModal = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const roomImageData = useSelector(getRoomImage);
    const API_URL_IMAGE = `${API_URL}media/`;
    const [index, setIndex] = useState(0);
    const roomImagesRef = useRef(null);

    useEffect(() => {
        if (id) {
            dispatch(fetchRoomImages(id));
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (roomImagesRef.current) {
            roomImagesRef.current.style.transition = 'transform 0.5s ease-in-out';
            roomImagesRef.current.style.transform = `translateX(${index * -560}px)`;
        }
    }, [index, roomImageData]);

    const changeImage = (newIndex) => {
        if (newIndex >= roomImageData.length) {
            setIndex(0);
        } else if (newIndex < 0) {
            setIndex(roomImageData.length - 1);
        } else {
            setIndex(newIndex);
        }
    };

    const rightButtonClick = () => {
        changeImage(index + 1);
    };

    const leftButtonClick = () => {
        changeImage(index - 1);
    };

    return (
        <Modal active={isOpen} setActive={onClose}>
            <div className={cls.filter}>
                <span className={cls.leftArrow} onClick={leftButtonClick}>
                    <i className="fa-solid fa-chevron-left"></i>
                </span>

                <div className={cls.carouselBox}>
                    <div className={cls.arounder} ref={roomImagesRef}>
                        {Array.isArray(roomImageData) ? (
                            roomImageData.map((item) => (
                                <img
                                    className={cls.roomImages}
                                    key={item.id}
                                    src={`${API_URL_IMAGE}${item.image}`}
                                    alt="Room"
                                />
                            ))
                        ) : (
                            <div>No images found</div>
                        )}
                    </div>
                </div>
                <span className={cls.rightArrow} onClick={rightButtonClick}>
                    <i className="fa-solid fa-chevron-right"></i>
                </span>
            </div>
        </Modal>
    );
};
