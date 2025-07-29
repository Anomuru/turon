import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";

import {Modal} from "shared/ui/modal";
import {Input} from "shared/ui/input";
import {Switch} from "shared/ui/switch";
import {fetchRoomsData} from "entities/rooms";
import {getUserBranchId} from "entities/profile/userProfile";

import cls from "../../filters.module.sass";

export const RoomsFilter = React.memo(({active, setActive, activeSwitch, setActiveSwitch}) => {

    const dispatch = useDispatch();

    const userBranchId = useSelector(getUserBranchId)

    const [selectedSeatFrom, setSelectedSeatFrom] = useState("");
    const [selectedSeatTo, setSelectedSeatTo] = useState("");
    const [selectedSeat, setSelectedSeat] = useState("")
    const [switchOn, setSwitchOn] = useState(true);

    useEffect(() => {
        dispatch(fetchRoomsData({
            boardCond: switchOn ? "True" : "False",
            selectedSeat: selectedSeat,
            id: userBranchId
        }));
    }, [switchOn, selectedSeat, userBranchId])

    useEffect(() => {
        if (selectedSeatTo.length && selectedSeatFrom.length)
            setSelectedSeat(`${selectedSeatFrom}-${selectedSeatTo}`)
    }, [selectedSeatTo, selectedSeatFrom])

    const onChangeSwitch = () => {
        const newSwitchState = !switchOn;
        setSwitchOn(newSwitchState);
    };

    const handleSeatFromBlur = (e) => {
        setSelectedSeatFrom(e.target.value);
    };

    const handleSeatToBlur = (e) => {
        setSelectedSeatTo(e.target.value);
    };

    return (
        <Modal
            active={active}
            setActive={setActive}
        >
            <div className={cls.filter}>
                <h1>Filter</h1>
                <div className={cls.filter__container}>
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
                        <Switch onChangeSwitch={onChangeSwitch} activeSwitch={switchOn}/>
                    </div>
                </div>
            </div>
        </Modal>
    );
});
