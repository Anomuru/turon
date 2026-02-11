import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { editRoomThunk } from "../model/roomEditThunk";
import { Modal } from 'shared/ui/modal';
import { Input } from 'shared/ui/input';
import { Button } from 'shared/ui/button';
import cls from './roomEditModal.module.sass';
import { getRoomsID } from "../../roomsEditModal/model";
import {onAddAlertOptions} from "../../alert/model/slice/alertSlice";
import {API_URL, headers, useHttp} from "../../../shared/api/base";
import {getRoomEdit} from "features/roomEditModal/model/selectors/selectors.js";
import {onChangeRoom} from "features/roomsEditModal/ui/roomSlice.js";

export const RoomEditModal = ({ isOpen, onClose, roomId, onUpdate }) => {
    const dispatch = useDispatch();
    const room = useSelector(getRoomsID);
    const [groupName, setGroupName] = useState('');
    const [groupOrder, setGroupOrder] = useState('');
    const [seatCount, setSeatCount] = useState('');
    const [electronicBoard, setElectronicBoard] = useState(false);


    useEffect(() => {
        if (room) {
            setGroupName(room.name);
            setGroupOrder(room.order);
            setSeatCount(room.seats_number);
            setElectronicBoard(room.electronic_board);
        }
    }, [room]);


    const {request } = useHttp()
    const handleEditRoom = () => {
        if (!roomId) return;
        const updatedRoom = {
            name: groupName,
            order: groupOrder,
            seats_number: parseInt(seatCount, 10),
            electronic_board: electronicBoard,
        };


        // request(`${API_URL}Rooms/rooms_update/${roomId}/`, 'PATCH', JSON.stringify(data) , headers())
        //     .then(res => {
        //
        //     })
        //     .catch(err => {
        //     })

        dispatch(editRoomThunk({ id: roomId, updatedRoom }))
            .then((res) => {
                dispatch(onAddAlertOptions({
                    type: "success",
                    status: true,
                    msg: "Xona muvofaqqiyatli tahrirlandi"
                }))
                dispatch(onChangeRoom(res?.payload))
                onUpdate(updatedRoom);
                onClose();
            });
    };


    // const handleDeleteRoom = () => {
    //    request(`${API_URL}Rooms/rooms_delete/${roomId}/`)
    //        .then(dis)
    // };

    if (!isOpen) return null;

    return (
        <Modal active={isOpen} setActive={onClose}>
            <div className={cls.filter}>
                <h1>Edit room</h1>
                <div>
                    <div>
                        <Input
                            title={"Group name"}
                            type={"text"}
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                        />
                        <Input
                            title={"Group order"}
                            type={"number"}
                            value={groupOrder}
                            onChange={(e) => setGroupOrder(e.target.value)}
                        />
                    </div>
                    <div>
                        <Input
                            title={"Count sitter"}
                            type={"number"}
                            value={seatCount}
                            onChange={(e) => setSeatCount(e.target.value)}
                        />
                    </div>
                    <div>
                        <Input
                            title={"Electronic Board"}
                            type={"checkbox"}
                            checked={electronicBoard}
                            onChange={(e) => setElectronicBoard(e.target.checked)}
                        />
                    </div>
                    <div className={cls.filter__switch}>
                        <Button onClick={handleEditRoom} children={"Edit room"} />
                    </div>
                    {/*<div className={cls.filter__switch}>*/}
                    {/*    <Button onClick={handleDeleteRoom} children={"Edit room"} />*/}
                    {/*</div>*/}
                </div>
            </div>
        </Modal>
    );
};
