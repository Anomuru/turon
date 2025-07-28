import React, { useState } from 'react';

import { Modal } from "shared/ui/modal";
import { Input } from "shared/ui/input";
import { Select } from "shared/ui/select";
import { Switch } from "shared/ui/switch";

import cls from "../../filters.module.sass";
import { useDispatch } from "react-redux";
import { fetchFilteredRooms } from "../model/filterRoomsThunk";

export const RoomsFilter = React.memo(({ active, setActive, activeSwitch, setActiveSwitch }) => {

    const [selectedSeatFrom, setSelectedSeatFrom] = useState();
    const [selectedSeatTo, setSelectedSeatTo] = useState();
    const [selectedTeacher, setSelectedTeacher] = useState();
    const [switchOn, setSwitchOn] = useState(true);
    const dispatch = useDispatch();

    const onChangeSwitch = () => {
        const newSwitchState = !switchOn;
        setSwitchOn(newSwitchState);
        dispatch(fetchFilteredRooms({
            boardCond: newSwitchState ? "True" : "False"
        }));
    };

    const handleSeatFromBlur = (e) => {
        setSelectedSeatFrom(e.target.value);
        dispatch(fetchFilteredRooms({
            seatFromId: e.target.value,
            seatUntilId: selectedSeatTo,
        }));
    };

    const handleSeatToBlur = (e) => {
        setSelectedSeatTo(e.target.value);
        dispatch(fetchFilteredRooms({
            seatFromId: selectedSeatFrom,
            seatUntilId: e.target.value,
        }));
    };



    return (
        <Modal
            active={active}
            setActive={setActive}
        >
            <div className={cls.filter}>
                <h1>Filter</h1>
                <div className={cls.filter__container}>

                    {/*<Select*/}
                    {/*    title={"Teacher"}*/}
                    {/*    extraClass={cls.filter__select}*/}
                    {/*    onChangeOption={setSelectedTeacher}*/}
                    {/*/>*/}

                    <div className={cls.filter__age}>
                        <Input
                            type={"number"}
                            extraClassName={cls.filter__input}
                            placeholder={"O’rindiqlar soni (От)"}
                            onChange={(e) => setSelectedSeatFrom(e.target.value)}
                            defaultValue={selectedSeatFrom}
                            onBlur={handleSeatFromBlur}
                        />
                        <Input
                            type={"number"}
                            extraClassName={cls.filter__input}
                            placeholder={"O’rindiqlar soni (До)"}
                            onChange={(e) => setSelectedSeatTo(e.target.value)}
                            defaultValue={selectedSeatTo}
                            onBlur={handleSeatToBlur}
                        />
                    </div>

                    <div className={cls.filter__switch}>
                        <p>Doska</p>
                        <Switch onChangeSwitch={onChangeSwitch} activeSwitch={switchOn} />
                    </div>

                </div>
            </div>
        </Modal>
    );
});
