import {getVacancySystems} from "features/vacancyModals/vacancyPageAdd/model/selectors/selectors";
import React, { useEffect, useState } from 'react';
import { Modal } from "shared/ui/modal";
import { Input } from "shared/ui/input";
import { Select } from "shared/ui/select";
import cls from "./vacancyAdd.module.sass";
import { Button } from "shared/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { fetchVacancyData, vacancyPageAddThunk } from "features/vacancyModals/vacancyPageAdd";
import { addVacancy } from "features/vacancyModals/vacancyPageAdd/model/vacancyPageAddSlice";
import { getVacancyJobs } from "features/vacancyModals/vacancyPageAdd";

export const VacancyAdd = React.memo(({ active, setActive,systems }) => {
    const [subjectName, setSubjectName] = useState('');
    const [systemType, setSystemType] = useState('');
    const dispatch = useDispatch();


    const handleAdd = () => {
        const newVacancy = {
            name: subjectName,
            system_id: systemType
        };

        dispatch(vacancyPageAddThunk(newVacancy)).then((action) => {
            if (vacancyPageAddThunk.fulfilled.match(action)) {
                dispatch(addVacancy(action.payload));
            } else {
                console.error('Failed to add vacancy:', action.error);
            }
        });

        dispatch(fetchVacancyData())

        setActive(false)
    };

    return (
        <Modal
            active={active}
            setActive={setActive}
        >
            <div className={cls.filter}>
                <h1>Vakansiya qo'shish</h1>
                <div className={cls.filter__container}>
                    <Input
                        extraClassName={cls.filter__select}
                        placeholder={"Kasb nomi"}
                        value={subjectName}
                        onChange={(e) => setSubjectName(e.target.value)}
                    />
                    <Select
                        extraClass={cls.filter__select}
                        value={systemType}
                        onChangeOption={(value) => setSystemType(value)}
                        options={systems}
                    />
                    <Button
                        extraClass={cls.buttonChange}
                        onClick={handleAdd}
                    >
                        Qo'shish
                    </Button>
                </div>
            </div>
        </Modal>
    );
});
