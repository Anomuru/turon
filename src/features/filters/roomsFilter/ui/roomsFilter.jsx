import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";

import {Button} from "shared/ui/button";
import {Modal} from "shared/ui/modal";
import {Input} from "shared/ui/input";
import {Select} from "shared/ui/select";
import {Switch} from "shared/ui/switch";
import {fetchRoomsData} from "entities/rooms";
import {getUserBranchId} from "entities/profile/userProfile";
import {saveFilter, getSavedFilters, removeFilter} from "shared/lib/components/filterStorage/filterStorage";

import cls from "../../filters.module.sass";

const list = [
    {
        id: "all",
        name: "Hammasi"
    },
    {
        id: "yes",
        name: "Bor"
    },
    {
        id: "no",
        name: "Yo'q"
    }
]

export const RoomsFilter = React.memo(({active, setActive, activeSwitch, setActiveSwitch}) => {

    const dispatch = useDispatch();

    const userBranchId = useSelector(getUserBranchId)

    const [selectedSeatFrom, setSelectedSeatFrom] = useState("");
    const [selectedSeatTo, setSelectedSeatTo] = useState("");
    // const [selectedSeat, setSelectedSeat] = useState("")
    const [switchOn, setSwitchOn] = useState("all");
    const [initialApplied, setInitialApplied] = useState(false);

    useEffect(() => {
        const saved = getSavedFilters()["roomsFilter"];
        if (userBranchId) {
            if (saved && !initialApplied) {
                const [from, to] = saved.selectedSeat?.split("-") || ["", ""];
                setSelectedSeatFrom(from);
                setSelectedSeatTo(to);
                // setSelectedSeat(saved.selectedSeat);
                setSwitchOn(saved.switchOn);

                dispatch(fetchRoomsData({
                    boardCond: saved.switchOn === "yes" ? "True" : saved.switchOn === "no" ? "False" : "all",
                    selectedSeat: saved.selectedSeat,
                    id: userBranchId
                }));

                setInitialApplied(true);
                // return null;
            } else {
                dispatch(fetchRoomsData({
                    id: userBranchId
                }));
            }
        }
    }, [userBranchId]);


    const onFilter = () => {
        const fullSeat = `${selectedSeatFrom}-${selectedSeatTo}`;
        // setSelectedSeat(fullSeat);

        console.log(switchOn, "switchOn")

        dispatch(fetchRoomsData({
            boardCond: switchOn === "yes" ? "True" : switchOn === "no" ? "False" : "all",
            selectedSeat: fullSeat,
            id: userBranchId
        }));

        saveFilter("roomsFilter", {
            selectedSeat: fullSeat,
            switchOn
        });
    }


    const onDeleteFilter = () => {
        setSelectedSeatFrom("");
        setSelectedSeatTo("");
        // setSelectedSeat("");
        setSwitchOn("all");

        dispatch(fetchRoomsData({id: userBranchId}));
        removeFilter("roomsFilter");
    }

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
                        {/*<p>Doska</p>*/}
                        <Select
                            onChangeOption={setSwitchOn}
                            title={"Doska"}
                            options={list}
                        />
                        {/*<Switch onChangeSwitch={onChangeSwitch} activeSwitch={switchOn}/>*/}
                    </div>
                    <div className={cls.filter__switch}>
                        <Button onClick={() => onDeleteFilter()} type={"danger"}>Tozalash</Button>
                        <Button onClick={() => onFilter()}>Filter</Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
});
