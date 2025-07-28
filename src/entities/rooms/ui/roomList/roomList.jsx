import React, { useState, useEffect } from 'react';
import cls from "./roomsList.module.sass";
import { Switch } from "shared/ui/switch";
import { SkeletonCard } from "shared/ui/roomsSkeleton/roomsSkeleton";
import Icon from "shared/assets/images/room_image.svg";
import {Link} from "../../../../shared/ui/link";
import {DefaultLoader} from "../../../../shared/ui/defaultLoader";
import {useDispatch, useSelector} from "react-redux";
import {getFilteredRooms} from "../../../../features/filters/roomsFilter";
import {useNavigate} from "react-router";

export const RoomsList = ({ currentTableData }) => {
    const navigation = useNavigate()
    const [loading, setLoading] = useState(true);
    const [switchStates, setSwitchStates] = useState({});
    const dispatch = useDispatch()
    const getFilteredRoom = useSelector(getFilteredRooms)


    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

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
    // else if (currentTableData.length === 0)
    // {
    //     return (
    //         <div className={cls.skeletonContainer}>
    //             {Array.from({ length: 5 }).map((_, index) => (
    //                 <SkeletonCard key={index} />
    //             ))}
    //         </div>
    //     );
    // }

    const handleSwitchChange = (id) => {
        setSwitchStates(prevStates => ({
            ...prevStates,
            [id]: !prevStates[id]
        }));
    };

    const roomsToRender = getFilteredRoom && getFilteredRoom.length > 0 ? getFilteredRoom : currentTableData

    // if (!roomsToRender || roomsToRender.length === 0)
    // {
    //     return (
    //         <DefaultLoader/>
    //     )
    // }


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
