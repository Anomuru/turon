import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";

import { fetchVacancyData, getVacancyJobs } from "features/vacancyModals/vacancyPageAdd";
import { fetchEmployersDataWithFilter } from "entities/employer";
import {
    fetchLanguagesData,
    getLanguagesData
} from "entities/oftenUsed"
import { Modal } from "shared/ui/modal";
import { Input } from "shared/ui/input";
import { Select } from "shared/ui/select";
import { Switch } from "shared/ui/switch";
import {
    fetchAgeTo,
    fetchAgeFrom,
    fetchAgeJobId,
    fetchLanguageId,
    fetchIsDelete
} from "../model/filterEmployeesSlice";

import cls from "../../filters.module.sass";

export const EmployeesFilter = React.memo(({ active, setActive, activeSwitch, setActiveSwitch }) => {

    const dispatch = useDispatch();
    const languages = useSelector(getLanguagesData);
    const [selectedAgeFrom, setSelectedAgeFrom] = useState('');
    const [selectedAgeTo, setSelectedAgeTo] = useState('');
    const [selectedJob, setSelectedJob] = useState('all');
    const [selectedLanguage, setSelectedLanguage] = useState('all');
    const jobsData = useSelector(getVacancyJobs);

    function fetchEmployees(job, lang, from, to) {
        dispatch(fetchEmployersDataWithFilter({
            jobId: job,
            langId: lang,
            fromAgeId: from,
            untilageId: to
        }));
    }

    const jobOptions = jobsData?.map(job => ({
        id: job.group.id,
        name: job.group.name
    })) || [];

    const onSelectJob = (value) => {
        if (value !== selectedJob) {

            setSelectedJob(value);
            dispatch(fetchAgeJobId(value))
            fetchEmployees(value, selectedLanguage, selectedAgeFrom, selectedAgeTo)
        }
        // const selectedJobData = jobOptions.find(job => job.id === Number(value));
        // if (selectedJobData) {
        //     const jobsId = selectedJobData.id;
        //     dispatch(fetchEmployersDataWithFilter({ jobId: jobsId }));
        // }
    };

    const onSelectLanguage = (value) => {
        if (value !== selectedLanguage) {

            setSelectedLanguage(value);
            dispatch(fetchLanguageId(value))
            fetchEmployees(selectedJob, value, selectedAgeFrom, selectedAgeTo)
        }
        // const selectedLanguageData = languages.find(lang => lang.id === Number(value));
        // if (selectedLanguageData) {
        //     const languageId = selectedLanguageData.id;
        //     dispatch(fetchEmployersDataWithFilter({ langId: languageId }));
        //     setActive(false);
        // }
    };

    const handleAgeFromBlur = (e) => {
        const value = e.target.value;
        setSelectedAgeFrom(value);
        dispatch(fetchAgeFrom(value))
        fetchEmployees(selectedJob, selectedLanguage, value, selectedAgeTo)
        // dispatch(fetchEmployersDataWithFilter({
        //     fromAgeId: value,
        //     untilageId: selectedAgeTo,
        // }));
    };

    const handleAgeToBlur = (e) => {
        const value = e.target.value;
        setSelectedAgeTo(value);
        dispatch(fetchAgeTo(value))
        fetchEmployees(selectedJob, selectedLanguage, selectedAgeFrom, value)
        // dispatch(fetchEmployersDataWithFilter({
        //     fromAgeId: selectedAgeFrom,
        //     untilageId: value,
        // }));
    };

    useEffect(() => {
        dispatch(fetchVacancyData());
        dispatch(fetchLanguagesData())
    }, [dispatch]);


    return (
        <Modal
            active={active}
            setActive={setActive}
        >
            <div className={cls.filter}>
                <h1>Filter</h1>
                <div className={cls.filter__container}>

                    <Select
                        title={"Ish"}
                        options={[{name: "Hamma", id: "all"}, ...jobOptions]}
                        extraClass={cls.filter__select}
                        onChangeOption={onSelectJob}
                        defaultValue={selectedJob}
                    />

                    <div className={cls.filter__age}>
                        <Input
                            type={"number"}
                            extraClassName={cls.filter__input}
                            placeholder={"Yosh (От)"}
                            value={selectedAgeFrom}
                            onChange={(e) => setSelectedAgeFrom(e.target.value)}
                            onBlur={handleAgeFromBlur}
                        />
                        <Input
                            type={"number"}
                            extraClassName={cls.filter__input}
                            placeholder={"Yosh (До)"}
                            value={selectedAgeTo}
                            onChange={(e) => setSelectedAgeTo(e.target.value)}
                            onBlur={handleAgeToBlur}
                        />
                    </div>

                    <Select
                        title={"Til"}
                        options={[{name: "Hamma", id: "all"}, ...languages]}
                        extraClass={cls.filter__select}
                        onChangeOption={onSelectLanguage}
                        defaultValue={selectedLanguage}
                    />

                    <div className={cls.filter__switch}>
                        <p>O’chirilgan</p>
                        <Switch activeSwitch={activeSwitch} onChangeSwitch={() => setActiveSwitch(prev => !prev)} />
                    </div>

                </div>
            </div>
        </Modal>
    );
});
