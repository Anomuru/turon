import {roomImageReducer} from "features/roomImagePareModal/model/roomImageParseModalSlice";
import {roomssReducer} from "features/roomsEditModal";
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useParams} from 'react-router-dom';
import {fetchInsideRoom} from 'features/roomsEditModal/ui/roomThunk';
import cls from './roomsProfilePage.module.sass';
import Icon from 'shared/assets/images/room_image.svg';
import {getLoadingStatus, getRoomsID} from 'features/roomsEditModal/model';
import {Button} from 'shared/ui/button';
import {Switch} from 'shared/ui/switch';
import {RoomEditModal} from 'features/roomEditModal';
import {RoomImageAddModal} from 'features/roomImageAddModal';
import {fetchRoomImages} from 'features/roomImagePareModal/model/roomImageParseModalThunk';
import {getRoomImage} from 'features/roomImagePareModal/model';
import {API_URL} from "shared/api/base";
import {RoomImageParseModal} from "features/roomImagePareModal";
import {DefaultLoader, DefaultPageLoader} from "shared/ui/defaultLoader";
import {deleteRoomThunk} from "features/roomDeleteModal/model/roomDeleteThunk";
import {onAddAlertOptions} from "features/alert/model/slice/alertSlice";
import {ConfirmModal} from "../../../shared/ui/confirmModal";
import {useNavigate} from "react-router";
import {DynamicModuleLoader} from "shared/lib/components/DynamicModuleLoader/DynamicModuleLoader.jsx";

const reducers = {
    roomssSlice: roomssReducer,
    roomImageSlice: roomImageReducer
}

export const RoomsProfilePage = () => {
    const [switchStates, setSwitchStates] = useState({});
    const [active, setActive] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false)
    const [modal, setModal] = useState(false);
    const [window, setWindow] = useState(false);
    const [image, setImage] = useState(false);
    const [localRoomData, setLocalRoomData] = useState({});
    const {id} = useParams();
    // const {id} = useSelector(getBranch)
    const dispatch = useDispatch();
    const roomsID = useSelector(getRoomsID);
    const loading = useSelector(getLoadingStatus);
    const roomImageData = useSelector(getRoomImage);
    const API_URL_IMAGE = `${API_URL}media/`;
    const navigate = useNavigate()

    useEffect(() => {
        if (roomsID) {
            const initialSwitchStates = {
                [roomsID?.id]: roomsID.electronic_board || false,
            };
            setSwitchStates(initialSwitchStates);
            setLocalRoomData(roomsID);
        }
    }, [roomsID]);

    useEffect(() => {
        if (id) {
            dispatch(fetchInsideRoom(id));
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (id) {
            dispatch(fetchRoomImages(id));
        }
    }, [dispatch, id]);

    const handleSwitchChange = (id) => {
        setSwitchStates((prevStates) => ({
            ...prevStates,
            [id]: !prevStates[id],
        }));
    };

    const handleUpdateRoom = (updatedRoom) => {
        setSwitchStates((prevStates) => ({
            ...prevStates,
            [roomsID?.id]: updatedRoom.electronic_board,
        }));
        setLocalRoomData((prevData) => ({
            ...prevData,
            ...updatedRoom
        }));
    };
    const handleDelete = () => {
        dispatch(deleteRoomThunk(localRoomData?.id))
            .then((res) => {
                dispatch(onAddAlertOptions({
                    type: "success",
                    status: true,
                    msg: "Xona muvofaqqiyatli o'chirildi",
                }))
                setModal(false);
                navigate(-1)
            });
    };
    const handleImageUpdate = () => {
        dispatch(fetchRoomImages(id));
    };


    return (
        <DynamicModuleLoader reducers={reducers}>
            <div className={cls.container}>
                {
                    loading ? <DefaultPageLoader/>
                        :
                        <div className={cls.container_leftBox}>
                            <div className={cls.container_leftBox_buttonPanel}>
                                {localRoomData.can_delete ?
                                    <Button onClick={() => setModal(true)} extraClass={cls.buttonDelete}
                                            children={<i className="fa-solid fa-trash"></i>}/> : null
                                }

                            </div>
                            <div className={cls.container_leftBox_sliderBox}>
                        <span className={cls.visibleBlack} onClick={() => setImage(true)}>
                            <i className="fa-solid fa-file-arrow-up"></i>
                            Rasm yuklash
                        </span>
                                {roomImageData?.length > 0 ? (
                                    <img className={cls.container_leftBox_sliderBox_imgSlide}
                                         src={`${API_URL_IMAGE}${roomImageData[0]?.image}`} alt="Classroom Image"/>
                                ) : (
                                    <img className={cls.container_leftBox_sliderBox_imgSlide} src={Icon}
                                         alt="Default Icon"/>
                                )}
                                <span onClick={() => setWindow(true)} className={cls.roomSlider}
                                      title={"Rasmlarni ko'rish"}>
                            <i className="fa-solid fa-camera"></i>
                            <h4>{roomImageData?.length}</h4>
                        </span>
                            </div>

                            <h1 className={cls.container_leftBox_roomName}>{localRoomData?.name} - xonasi</h1>
                            <span className={cls.statusRoom}>Room</span>
                            <Button onClick={() => setActive(true)} extraClass={cls.changeButton} children={"Change"}/>
                            <div className={cls.container_leftBox_seatsNumberBox}>
                                <h4 className={cls.container_leftBox_seatsNumberBox_label}>O'rindiqlar soni</h4>
                                <h2 className={cls.container_leftBox_seatsNumberBox_label}>{localRoomData?.seats_number}</h2>
                            </div>
                            <div className={cls.container_leftBox_seatsNumberBox}>
                                <h4 className={cls.container_leftBox_seatsNumberBox_label}>Qo'shimcha</h4>
                                <div className={cls.arounder}>
                                    <h2 className={cls.container_leftBox_seatsNumberBox_label}>Elektron doska</h2>
                                    <Switch
                                        disabled
                                        activeSwitch={switchStates[localRoomData?.id]}
                                        onChangeSwitch={() => handleSwitchChange(localRoomData?.id)}
                                    />
                                </div>
                            </div>
                            <RoomImageParseModal isOpen={window} onClose={() => setWindow(false)}
                                                 roomId={localRoomData?.id}/>
                            <RoomImageAddModal isOpen={image} onClose={() => setImage(false)} roomId={localRoomData?.id}
                                               onUpdate={handleImageUpdate}/>
                            <ConfirmModal
                                type={isDeleted ? "success" : "danger"}
                                title={!isDeleted ? "O'chirmoq" : "Qaytarmoq"}
                                text={isDeleted ? "Studentni qaytarishni hohlaysizmi" : "Xonani o'chirishni hohlaysizmi"}
                                active={modal}
                                setActive={setModal}
                                onClick={handleDelete}
                            />
                            {localRoomData?.id && <RoomEditModal isOpen={active} onClose={() => setActive(false)}
                                                                 roomId={localRoomData.id}
                                                                 onUpdate={handleUpdateRoom}/>}
                        </div>
                }
                <div className={cls.container_rightBox}>
                </div>
            </div>
        </DynamicModuleLoader>
    );
};
