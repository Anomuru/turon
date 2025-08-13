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

export const StudentsFilter = React.memo(({active, setActive, activePage, pageSize , currentPage}) => {
    const lang = localStorage.getItem("selectedLang")
    const ageFrom = localStorage.getItem("ageFrom")
    const ageTo = localStorage.getItem("ageTo")
    const studentSwitch = localStorage.getItem("studentSwitch")
    const [selectedAgeFrom, setSelectedAgeFrom] = useState(ageFrom !== null ? ageFrom : "")
    const [selectedAgeTo, setSelectedAgeTo] = useState(ageTo !== null ? ageTo : "")
    const [selectedLang, setSelectedLanguage] = useState(lang)
    const [isSwitch, setIsSwitch] = useState(studentSwitch === "true");
    const dispatch = useDispatch()
    const languages = useSelector(getLanguagesData)
    localStorage.setItem("selectedLang", selectedLang)
    localStorage.setItem("ageFrom", selectedAgeFrom)
    localStorage.setItem("ageTo", selectedAgeTo)
    localStorage.setItem("studentSwitch", `${isSwitch}`)
    const userBranchId = localStorage.getItem("branchId")


    console.log(ageFrom, ageTo)

    useEffect(() => {

        if (activePage === "studying_students") {
            dispatch(fetchOnlyStudyingStudentsData({
                langId: lang,
                fromAge: selectedAgeFrom,
                untilAge: selectedAgeTo,
                userBranchId,
                currentPage,
                pageSize

            }))
        } else if (activePage === "new_students") {

            if (isSwitch) {
                dispatch(fetchDeletedNewStudentsThunk({
                    langId: lang,
                    fromAge: selectedAgeFrom,
                    untilAge: selectedAgeTo,
                    userBranchId,
                    currentPage,
                    pageSize
                }));

            } else {
                dispatch(fetchOnlyNewStudentsData({
                    langId: lang,
                    fromAge: selectedAgeFrom,
                    untilAge: selectedAgeTo,
                    userBranchId,
                    currentPage,
                    pageSize
                }))
            }
        } else {
            dispatch(fetchOnlyDeletedStudentsData({
                langId: lang,
                fromAge: selectedAgeFrom,
                untilAge: selectedAgeTo,
                userBranchId,
                currentPage,
                pageSize
            }))
        }
    }, [selectedLang, selectedAgeTo, selectedAgeFrom, activePage , isSwitch , currentPage])


    const handleAgeFromBlur = (e) => {
        setSelectedAgeFrom(e.target.value);

    }

    const handleAgeToBlur = (e) => {
        setSelectedAgeTo(e.target.value);

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
                    {activePage === "new_students" && <div className={cls.filter__switch}>
                        <p>O’chirilgan</p>
                        <Switch onChangeSwitch={setIsSwitch} activeSwitch={isSwitch}/>
                    </div>}
                </div>
            </div>
        </Modal>
    );
})
