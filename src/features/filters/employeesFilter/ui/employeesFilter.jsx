import {fetchEmployersData} from "entities/employer/model/slice/employersThunk.js";
import {getUserBranchId} from "entities/profile/userProfile/index.js";
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";

import {
    fetchLanguagesData,
    getLanguagesData,
    fetchVacancyData,
    getVacancyData
} from "entities/oftenUsed";

import {Modal} from "shared/ui/modal";
import {Input} from "shared/ui/input";
import {Select} from "shared/ui/select";
import {Switch} from "shared/ui/switch";
import {Button} from "shared/ui/button";

import {saveFilter, getSavedFilters, removeFilter} from "shared/lib/components/filterStorage/filterStorage";

import cls from "../../filters.module.sass";

export const EmployeesFilter = React.memo(({active, setActive, currentPage, pageSize}) => {
    const dispatch = useDispatch();
    const languages = useSelector(getLanguagesData);
    const jobsData = useSelector(getVacancyData);
    const branch = useSelector(getUserBranchId);

    const [selectedAgeFrom, setSelectedAgeFrom] = useState('');
    const [selectedAgeTo, setSelectedAgeTo] = useState('');
    const [selectedAge, setSelectedAge] = useState('');
    const [selectedJob, setSelectedJob] = useState('all');
    const [selectedLanguage, setSelectedLanguage] = useState('all');
    const [activeSwitch, setActiveSwitch] = useState(false);
    const [initialApplied, setInitialApplied] = useState(false);

    const jobOptions = jobsData?.map(job => ({
        id: job.group.id,
        name: job.group.name
    })) || [];

    function fetchEmployees(job, lang, ageRange, isDeleted, offset, limit) {
        dispatch(fetchEmployersData({
            job,
            branch,
            language: lang,
            age: ageRange,
            deleted: isDeleted ? "True" : "False",
            offset,
            limit
        }));
    }

    useEffect(() => {
        if (pageSize && currentPage && branch) {
            dispatch(fetchEmployersData({
                job: selectedJob,
                branch,
                language: selectedLanguage,
                age: selectedAge,
                deleted: activeSwitch ? "True" : "False",
                offset: (currentPage - 1) * pageSize,
                limit: pageSize
            }));
        }
    }, [pageSize, currentPage, branch])

    useEffect(() => {
        dispatch(fetchVacancyData());
        dispatch(fetchLanguagesData());
    }, [dispatch]);

    useEffect(() => {
        const saved = getSavedFilters()["employeesFilter"];
        if (branch && pageSize) {
            if (!initialApplied && saved) {
                const {
                    selectedAge,
                    selectedJob: job,
                    selectedLanguage: lang,
                    switchOn
                } = saved;

                const [from, to] = selectedAge?.split("-") || ["", ""];

                setSelectedAge(selectedAge || '');
                setSelectedAgeFrom(from);
                setSelectedAgeTo(to);
                setSelectedJob(job || 'all');
                setSelectedLanguage(lang || 'all');
                setActiveSwitch(switchOn ?? false);

                fetchEmployees(job, lang, selectedAge, switchOn, 0, pageSize);
                setInitialApplied(true);
            } else if (!initialApplied) {
                fetchEmployees(selectedJob, selectedLanguage, selectedAge, activeSwitch, 0, pageSize);
                setInitialApplied(true);
            }
        }
    }, [initialApplied, branch, pageSize]);

    const onSelectJob = (value) => {
        setSelectedJob(value);
    };

    const onSelectLanguage = (value) => {
        setSelectedLanguage(value);
    };

    const handleAgeFromBlur = (e) => {
        const value = e.target.value;
        setSelectedAgeFrom(value);
        setSelectedAge(`${value}-${selectedAgeTo}`);
    };

    const handleAgeToBlur = (e) => {
        const value = e.target.value;
        setSelectedAgeTo(value);
        setSelectedAge(`${selectedAgeFrom}-${value}`);
    };

    const onFilter = () => {
        fetchEmployees(selectedJob, selectedLanguage, selectedAge, activeSwitch, 0, pageSize);
        saveFilter("employeesFilter", {
            selectedAge,
            selectedJob,
            selectedLanguage,
            switchOn: activeSwitch
        });
    };

    const onDeleteFilter = () => {
        setSelectedJob("all");
        setSelectedLanguage("all");
        setSelectedAge("");
        setSelectedAgeFrom("");
        setSelectedAgeTo("");
        setActiveSwitch(false);

        fetchEmployees("all", "all", "", false, 0, pageSize);
        removeFilter("employeesFilter");
    };

    return (
        <Modal active={active} setActive={setActive}>
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
                            onChange={(e) => setSelectedAgeFrom(e.target.value)}
                            defaultValue={selectedAgeFrom}
                            value={selectedAgeFrom}
                            onBlur={handleAgeFromBlur}
                        />
                        <Input
                            type={"number"}
                            extraClassName={cls.filter__input}
                            placeholder={"Yosh (До)"}
                            onChange={(e) => setSelectedAgeTo(e.target.value)}
                            defaultValue={selectedAgeTo}
                            value={selectedAgeTo}
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
                        <Switch activeSwitch={activeSwitch} onChangeSwitch={() => setActiveSwitch(prev => !prev)}/>
                    </div>
                    <div className={cls.filter__switch}>
                        <Button onClick={onDeleteFilter} type={"danger"}>Tozalash</Button>
                        <Button onClick={onFilter}>Filter</Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
});
