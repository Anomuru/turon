import {fetchLanguagesData, fetchSubjectsData, getLanguagesData, getSubjectsData} from "entities/oftenUsed";
import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";

import {Modal} from "shared/ui/modal";
import {Input} from "shared/ui/input";
import {Select} from "shared/ui/select";
import {Switch} from "shared/ui/switch";
// import {getLanguagesData, getSubjectsData} from "pages/registerPage";
// import {fetchLanguages, fetchSubjects} from "pages/registerPage";
import {
    fetchOnlyDeletedStudentsData,
    fetchOnlyNewStudentsData,
    fetchOnlyStudyingStudentsData
} from "entities/students";

import cls from "../../filters.module.sass";
import {fetchDeletedNewStudentsThunk} from "entities/students";
import {getUserBranchId} from "entities/profile/userProfile/index.js";
import {Button} from "shared/ui/button/index.js";

export const StudentsFilter = React.memo(({active, setActive, activePage, setIsFilter, branchId}) => {
    const lang = localStorage.getItem("selectedLang")
    const ageFrom = localStorage.getItem("ageFrom")
    const ageTo = localStorage.getItem("ageTo")
    const [selectedAgeFrom, setSelectedAgeFrom] = useState(ageFrom !== null ? ageFrom : "" )
    const [selectedAgeTo, setSelectedAgeTo] = useState(ageTo !== null ? ageTo : "")
    const [selectedSubject, setSelectedSubject] = useState("all")
    const [selectedLang, setSelectedLanguage] = useState(lang)
    const [selectedClass, setSelectedClass] = useState("all")
    const [isSwitch, setIsSwitch] = useState(false);
    const dispatch = useDispatch()
    const languages = useSelector(getLanguagesData)
    const subjects = useSelector(getSubjectsData)
    localStorage.setItem("selectedLang" , selectedLang)
    localStorage.setItem("ageFrom" , selectedAgeFrom)
    localStorage.setItem("ageTo" , selectedAgeTo)
    const userBranchId = localStorage.getItem("branchId")


    console.log(ageFrom , ageTo)

   useEffect(() => {

       if (activePage === "studying_students") {
           dispatch(fetchOnlyStudyingStudentsData({
               subjId: selectedSubject,
               langId: lang,
               fromAge: selectedAgeFrom,
               untilAge: selectedAgeTo,
               userBranchId
           }))
       } else if (activePage === "new_students") {
           dispatch(fetchOnlyNewStudentsData({
               subjId: selectedSubject,
               langId: lang,
               fromAge: selectedAgeFrom,
               untilAge: selectedAgeTo,
               userBranchId
           }))
       }else {
           dispatch(fetchOnlyDeletedStudentsData({
               subjId: selectedSubject,
               langId: lang,
               fromAge: selectedAgeFrom,
               untilAge: selectedAgeTo,
               userBranchId
           }))
       }
   } , [ selectedLang, selectedAgeTo , selectedSubject , selectedAgeFrom , activePage])

    const onSelectSubject = (value) => {
        if (value !== selectedSubject) {
            setSelectedSubject(value);
            fetchStudents(selectedAgeFrom, selectedAgeTo, value, selectedLang)
        }
    }

    const onSelectLanguage =(value) => {



        if (value !== selectedLang) {

            setSelectedLanguage(value);

        }
    }

    const handleAgeFromBlur = (e) => {
        setSelectedAgeFrom(e.target.value);

    }

    const handleAgeToBlur = (e) => {
        setSelectedAgeTo(e.target.value);

    }

    const handleSwitchData = () => {
        const newState = !isSwitch;
        setIsSwitch(newState);

        if (newState) {
            dispatch(fetchDeletedNewStudentsThunk(branchId));
        } else {
            dispatch(fetchOnlyNewStudentsData({userBranchId: branchId}));
        }
    }


    useEffect(() => {
        dispatch(fetchSubjectsData())
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
                    {/*{*/}
                    {/*    activePage !== "deleted" ? <Select*/}
                    {/*        title={"Fan"}*/}
                    {/*        options={[{name: "Hamma", id: "all"}, ...subjects]}*/}
                    {/*        extraClass={cls.filter__select}*/}
                    {/*        onChangeOption={(value) => onSelectSubject(value)}*/}
                    {/*        defaultValue={selectedSubject}*/}
                    {/*    /> : null*/}
                    {/*}*/}

                    {/*{*/}
                    {/*    activePage === "deleted_students" ? <Select*/}
                    {/*        title={"Sinf"}*/}
                    {/*        extraClass={cls.filter__select}*/}
                    {/*        onChangeOption={setSelectedClass}*/}
                    {/*        defaultValue={selectedClass}*/}
                    {/*    /> : null*/}
                    {/*}*/}

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
                    <Button type={"danger"} onClick={() => {
                        setSelectedAgeTo(null)
                        setSelectedAgeFrom(null)
                    }}>Clear (Yoshlarni tozalash)</Button>
                    <Select
                        title={"Til"}
                        options={[{name: "Hamma", id: "all"}, ...languages]}
                        extraClass={cls.filter__select}
                        onChangeOption={setSelectedLanguage}
                        defaultValue={lang}
                    />
                    <div className={cls.filter__switch}>
                        <p>O’chirilgan</p>
                        <Switch onChangeSwitch={handleSwitchData} activeSwitch={isSwitch}/>
                    </div>
                </div>
            </div>
        </Modal>
    );
})
