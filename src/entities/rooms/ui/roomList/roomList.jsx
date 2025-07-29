import React, { useState, useEffect } from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router";

import {getFilteredRooms} from "features/filters/roomsFilter";
import {getRoomsLoading} from "entities/rooms";
import { Switch } from "shared/ui/switch";
import { SkeletonCard } from "shared/ui/roomsSkeleton/roomsSkeleton";

import cls from "./roomsList.module.sass";
import Icon from "shared/assets/images/room_image.svg";

export const RoomsList = ({ currentTableData }) => {
    const navigation = useNavigate()
    const dispatch = useDispatch()

    const getFilteredRoom = useSelector(getFilteredRooms)
    const loading = useSelector(getRoomsLoading)

    const [switchStates, setSwitchStates] = useState({});


    useEffect(() => {
        const initialSwitchStates = currentTableData.reduce((acc, item) => {
            acc[item.id] = item.electronic_board || false;
            return acc;
        }, {});
        setSwitchStates(initialSwitchStates);
    }, [currentTableData]);

    if (loading) {
        return (
            <div className={cls.skeletonContainer}>
                {Array.from({ length: 5 }).map((_, index) => (
                    <SkeletonCard key={index} />
                ))}
            </div>
        );
    }

    const handleSwitchChange = (id) => {
        setSwitchStates(prevStates => ({
            ...prevStates,
            [id]: !prevStates[id]
        }));
    };

    const roomsToRender = getFilteredRoom && getFilteredRoom.length > 0 ? getFilteredRoom : currentTableData

    return roomsToRender?.map((item, index) => (
        <>
            {!item.deleted && (
                // <Link extraClass={cls.extraStyle} to={`roomsProfilePage/${item.id}`}>
                    <div onClick={() => navigation(`roomsProfilePage/${item.id}`)} key={index} className={cls.mainContainer_tablePanelBox_cardBox}>
                        <div className={cls.mainContainer_tablePanelBox_cardBox_imgBox}>
                            <img src={Icon} alt="" className={cls.mainContainer_tablePanelBox_cardBox_imgBox_img}/>
                        </div>
                        <div className={cls.mainContainer_tablePanelBox_cardBox_articleBox}>
                            <div className={cls.mainContainer_tablePanelBox_cardBox_articleBox_sitterBox}>
                                <h2 className={cls.mainContainer_tablePanelBox_cardBox_articleBox_sitterBox_sitterArticle}>O'rindiqlar soni</h2>
                                <h2 className={cls.mainContainer_tablePanelBox_cardBox_articleBox_sitterBox_sitterCounter}>{item?.seats_number}</h2>
                            </div>
                            <div className={cls.mainContainer_tablePanelBox_cardBox_articleBox_boardBox}>
                                <h2 className={cls.mainContainer_tablePanelBox_cardBox_articleBox_boardBox_isBoard}>Elektron doska</h2>
                                <Switch
                                    key={`switch-${index}`}
                                    disabled
                                    activeSwitch={switchStates[item.id]}
                                    onChangeSwitch={() => handleSwitchChange(item.id)}
                                />
                            </div>
                            <div className={cls.mainContainer_tablePanelBox_cardBox_articleBox_roomNumBox}>
                                <h2 className={cls.mainContainer_tablePanelBox_cardBox_articleBox_roomNumBox_roomNum}>{item?.name}</h2>
                            </div>
                        </div>
                    </div>
                // </Link>
            ) }
        </>

    ));
};
