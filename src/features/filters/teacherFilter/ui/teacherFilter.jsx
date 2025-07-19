import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";

import {Modal} from "shared/ui/modal";
import {Input} from "shared/ui/input";
import {Select} from "shared/ui/select";
import {Switch} from "shared/ui/switch";
import {
    fetchSubjectsData,
    fetchLanguagesData,
    getLanguagesData,
    getSubjectsData
} from "entities/oftenUsed";

import cls from "../../filters.module.sass";
import {useDispatch, useSelector} from "react-redux";
import {fetchDeletedTeachersData, fetchTeachersDataWithFilter} from "entities/teachers/model/teacherThunk";

export const TeacherFilter = React.memo(({active, setActive, setIsFilter , setActiveSwitch , activeSwitch}) => {

    const dispatch = useDispatch()
    const languages = useSelector(getLanguagesData)
    const subjects = useSelector(getSubjectsData)
    const [selectedAgeFrom, setSelectedAgeFrom] = useState()
    const [selectedAgeTo, setSelectedAgeTo] = useState()
    const [selectedSubject, setSelectedSubject] = useState("all")
    const [selectedLanguage, setSelectedLanguage] = useState("all")
    const {"*": id} = useParams()

    function fetchTeachers(sub, lang, from, to) {
        dispatch(fetchTeachersDataWithFilter({
            subjId: sub,
            langId: lang,
            untilAge: to,
            fromAge: from
        }))
        setIsFilter(true)
    }

    const onSelectSubject = (value) => {
        if (value !== selectedSubject) {

            setSelectedSubject(value);
            fetchTeachers(value, selectedLanguage, selectedAgeFrom, selectedAgeTo)
        }
        // const selectedSubjectData = subjects.find(subj => subj.id === Number(value));
        // const subjectId = selectedSubjectData.id;
        // dispatch(fetchTeachersDataWithFilter({subjId: subjectId}))

        // setActive(false)

    }

    const onSelectLanguage = (value) => {
        if (value !== selectedLanguage) {

            setSelectedLanguage(value);
            fetchTeachers(selectedSubject, value, selectedAgeFrom, selectedAgeTo)
        }
        // const selectedLanguageData = languages.find(lang => lang.id === Number(value));
        // const languageId = selectedLanguageData.id
        // dispatch(fetchTeachersDataWithFilter({langId: languageId}))
        // setActive(false)

    }

    const handleAgeFromBlur = (e) => {
        // if (e)
        setSelectedAgeFrom(e.target.value);
        fetchTeachers(selectedSubject, selectedLanguage, e.target.value, selectedAgeTo)
        // dispatch(fetchTeachersDataWithFilter({ fromAge: e.target.value, untilAge: selectedAgeTo }))


    }

    const handleAgeToBlur = (e) => {
        setSelectedAgeTo(e.target.value);
        fetchTeachers(selectedSubject, selectedLanguage, selectedAgeFrom, e.target.value)
        // dispatch(fetchTeachersDataWithFilter({ fromAge: selectedAgeFrom, untilAge: e.target.value }))
    }

    const onGetDelete = (value) => {
        setActiveSwitch(value)
        dispatch(fetchDeletedTeachersData({userBranchId: id}))
    }

    // const onChangeSwitch =() =>{
    //     setActiveSwitch(!activeSwitch)
    // }

    useEffect(() => {
        // dispatch(fetchSubjects())
        dispatch(fetchSubjectsData())
        dispatch(fetchLanguagesData())
    }, []);

    return (
        <Modal
            active={active}
            setActive={setActive}
        >
            <div className={cls.filter}>
                <h1>Filter</h1>
                <div className={cls.filter__container}>

                    <Select
                        title={"Fan"}
                        options={subjects}
                        extraClass={cls.filter__select}
                        onChangeOption={(value) => onSelectSubject(value)}
                    />

                    <div className={cls.filter__age}>
                        <Input
                            type={"number"}
                            extraClassName={cls.filter__input}
                            placeholder={"Yosh (От)"}
                            onChange={(e) => setSelectedAgeFrom(e.target.value)}
                            onBlur={handleAgeFromBlur}
                            defaultValue={selectedAgeFrom}
                        />
                        <Input
                            type={"number"}
                            extraClassName={cls.filter__input}
                            placeholder={"Yosh (До)"}
                            onChange={(e) => setSelectedAgeTo(e.target.value)}
                            onBlur={handleAgeToBlur}
                            defaultValue={selectedAgeTo}
                        />
                    </div>

                    <Select
                        title={"Til"}
                        options={languages}
                        extraClass={cls.filter__select}
                        onChangeOption={(value) => onSelectLanguage(value)}
                    />



                    <div className={cls.filter__switch}>
                        <p>O’chirilgan</p>
                        <Switch onChangeSwitch={onGetDelete} activeSwitch={activeSwitch}/>
                    </div>

                </div>
            </div>
        </Modal>
    );
})