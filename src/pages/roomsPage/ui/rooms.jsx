import React, {useMemo, useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {RoomsFilter} from 'features/filters/roomsFilter';
import {RoomModal} from 'features/roomsAddModal';
import {getSearchValue} from 'features/searchInput';
import {fetchRoomsData} from 'entities/rooms/model/roomsThunk';
import {RoomsList} from 'entities/rooms/ui/roomList/roomList';
import {getUserBranchId} from "entities/profile/userProfile";
import {roomsReducer, getRoomsData} from "entities/rooms";
import {Button} from 'shared/ui/button';
import {DynamicModuleLoader} from "shared/lib/components/DynamicModuleLoader/DynamicModuleLoader";

import cls from './rooms.module.sass';

const reducers = {
    roomsSlice: roomsReducer,

}

export const Rooms = () => {
    const dispatch = useDispatch();

    const search = useSelector(getSearchValue);
    const roomsData = useSelector(getRoomsData);
    const userBranchId = useSelector(getUserBranchId)

    const [modal, setModal] = useState(false);
    const [active, setActive] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const PageSize = useMemo(() => 50, []);

    // useEffect(() => {
    //     if (!userBranchId) return;
    //     dispatch(fetchRoomsData({id: userBranchId}));
    // }, [dispatch, userBranchId]);

    const searchedRooms = useMemo(() => {
        const filteredRooms = roomsData?.filter(item => !item.deleted) || [];
        setCurrentPage(1);

        if (!search) return filteredRooms;

        return filteredRooms.filter(item =>
            item.name?.toLowerCase().includes(search.toLowerCase())
        );
    }, [roomsData, search]);

    return (
        <DynamicModuleLoader reducers={reducers}>
            <div className={cls.mainContainer}>
                <div className={cls.mainContainer_buttonPanelBox}>
                    <div className={cls.mainContainer_buttonPanelBox_leftCreateButton}>
                        <Button onClick={() => setActive(true)}>Xona qo'shish</Button>
                    </div>
                </div>
                <div className={cls.mainContainer_filterPanelBox}>
                    <Button
                        extraClass={cls.extraCutClassFilter}
                        type={'filter'}
                        onClick={() => setModal(true)}
                    >
                        Filter
                    </Button>
                    <div className={cls.mainContainer_filterPanelBox_rightFilterRadioGroupBox}></div>
                </div>
                <div className={cls.mainContainer_tablePanelBox}>
                    <RoomsList
                        currentTableData={searchedRooms.slice((currentPage - 1) * PageSize, currentPage * PageSize)}/>
                </div>
                <RoomsFilter active={modal} setActive={setModal} roomsData={searchedRooms}/>
                <div className={cls.paginationBox}>
                    {/*<Pagination*/}
                    {/*    search={search}*/}
                    {/*    users={searchedRooms}*/}
                    {/*    setCurrentPage={setCurrentPage}*/}
                    {/*    setCurrentTableData={setCurrentData}*/}
                    {/*    currentPage={currentPage}*/}
                    {/*    pageSize={PageSize}*/}
                    {/*    onPageChange={(page) => {*/}
                    {/*        setCurrentPage(page);*/}
                    {/*    }}*/}
                    {/*/>*/}
                </div>
                <RoomModal branch={userBranchId} isOpen={active} onClose={() => setActive(false)}/>
            </div>
        </DynamicModuleLoader>
    );
};
