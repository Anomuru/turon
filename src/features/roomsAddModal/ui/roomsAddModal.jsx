import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useParams} from "react-router-dom";

import {onAddAlertOptions} from "../../alert/model/slice/alertSlice";
import {getUserBranchId} from "entities/profile/userProfile/index.js";
import {fetchRoomsData} from "entities/rooms";
import {onAddRooms} from "entities/rooms/model/roomsSlice";
import {Modal} from 'shared/ui/modal';
import {Input} from 'shared/ui/input';
import {Button} from 'shared/ui/button';
import {API_URL, branchQueryId, headers, useHttp} from "shared/api/base";

import cls from './roomsAddModal.module.sass';

export const RoomModal = ({isOpen, onClose}) => {

    const userBranch = useSelector(getUserBranchId)

    const [groupName, setGroupName] = useState('');
    const [seatCount, setSeatCount] = useState('');
    const [order, setOrder] = useState('');
    const [electronicBoard, setElectronicBoard] = useState(false);
    const dispatch = useDispatch();
    const {"*": id} = useParams()
    const {request} = useHttp()

    const handleAddRoom = () => {
        const newRoom = {
            name: groupName,
            order: order,
            seats_number: parseInt(seatCount, 10),
            electronic_board: electronicBoard,
            deleted: false,
            branch: userBranch,
        };

        // dispatch(roomsAddThunk(newRoom))
        //     .then((action) => {
        //         if (roomsAddThunk.fulfilled.match(action)) {
        //             dispatch(addRoom(action.payload));

        //         }
        //     });

        request(`${API_URL}Rooms/rooms_create/`, "POST", JSON.stringify(newRoom), headers())
            .then(res => {
                dispatch(onAddRooms(res))
                dispatch(onAddAlertOptions({
                    type: "success",
                    status: true,
                    msg: "Xona muvofaqqiyatli qo'shildi"
                }))
            })
            .catch(err => {
                dispatch(onAddAlertOptions({
                    type: "error",
                    status: true,
                    msg: "Serverda hatolik "
                }))
            })


        setGroupName("")
        setSeatCount("")

        // dispatch(fetchRoomsData({id}));
        onClose();
    };


    if (!isOpen) return null;

    return (
        <Modal active={isOpen} setActive={onClose}>
            <div className={cls.filter}>
                <h1>Xona qo'shish</h1>
                <div>
                    <div>
                        <Input
                            title={"Xona nomi"}
                            type={"text"}
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                        />
                    </div>
                    <div>
                        <Input
                            title={"Xona raqami"}
                            type={"number"}
                            value={order}
                            onChange={(e) => setOrder(e.target.value)}
                        />
                        <Input
                            title={"O'rindiqlar soni"}
                            type={"number"}
                            value={seatCount}
                            onChange={(e) => setSeatCount(e.target.value)}
                        />
                    </div>
                    <div>
                        <Input
                            title={"Elektron doska (bor/yo'q)"}
                            type={"checkbox"}
                            checked={electronicBoard}
                            onChange={(e) => setElectronicBoard(e.target.checked)}
                        />
                    </div>
                    {/*<div>*/}
                    {/*    <Select*/}
                    {/*        title={"Branch"}*/}
                    {/*        extraClass={cls.filter__select}*/}
                    {/*        options={getBranches}*/}
                    {/*        onChangeOption={onSelectBranch}*/}
                    {/*    />*/}
                    {/*</div>*/}
                    <div className={cls.filter__switch}>
                        <Button onClick={handleAddRoom}>Add room</Button>
                        <Button onClick={onClose} extraClass={cls.buttonStyle}>Close</Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
