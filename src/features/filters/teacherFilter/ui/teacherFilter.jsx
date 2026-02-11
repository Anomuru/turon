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
import {getUserBranchId} from "entities/profile/userProfile/index.js";
import {Button} from "shared/ui/button/index.js";
import {getSearchValue} from "features/searchInput/index.js";
import {getSelectedLocations} from "features/locations/index.js";
import {getCurrentBranch} from "entities/oftenUsed/model/oftenUsedSelector.js";

export const TeacherFilter = React.memo(({active, setActive, setIsFilter , setActiveSwitch , activeSwitch , currentPage , pageSize}) => {
    const search = useSelector(getSearchValue);

    const teacherAgeTo = localStorage.getItem("teacherAgeTo")
    const teacherAgeFrom = localStorage.getItem("teacherAgeFrom")
    const teacherLanguage = localStorage.getItem("teacherLanguage")
    const teacherSubject = localStorage.getItem("teacherSubject")


    const dispatch = useDispatch()
    const languages = useSelector(getLanguagesData)
    const subjects = useSelector(getSubjectsData)
    // const userBranchId = useSelector(getUserBranchId)
    const [selectedAgeFrom, setSelectedAgeFrom] = useState(teacherAgeFrom)
    const [selectedAgeTo, setSelectedAgeTo] = useState(teacherAgeTo)
    const [selectedSubject, setSelectedSubject] = useState(teacherSubject)
    const [selectedLanguage, setSelectedLanguage] = useState(teacherLanguage)
    const {"*": id} = useParams()
    // const branchId = localStorage.getItem("branchId")
    const currentBranch = useSelector(getCurrentBranch)
    const ROLE = localStorage.getItem("job")
    const userBranchId = localStorage.getItem("branchId")
    const branchForFilter =
        ROLE === "director"
            ? currentBranch
            : userBranchId;


    //
    // useEffect(() => {
    //     if (selectedAgeFrom === null) {
    //         setSelectedAgeFrom("")
    //
    //     }
    //     if (selectedAgeTo === null) {
    //         setSelectedAgeTo("")
    //     }
    // } , [selectedAgeFrom  ,selectedAgeTo])

    localStorage.setItem("teacherAgeTo" , selectedAgeTo)
    localStorage.setItem("teacherAgeFrom" , selectedAgeFrom)
    localStorage.setItem("teacherLanguage" , selectedLanguage)
    localStorage.setItem("teacherSubject" , selectedSubject)
    localStorage.setItem("teacherStatus" , `${activeSwitch}`)

    // useEffect(() => {
    //     if (activeSwitch)
    //         setActiveSwitch(activeSwitch)
    // }, [activeSwitch])

    useEffect(() => {
        dispatch(fetchTeachersDataWithFilter({
            subjId: selectedSubject,
            langId: selectedLanguage,
            untilAge: selectedAgeTo,
            fromAge: selectedAgeFrom,
            userBranchId: branchForFilter,
            switchItem: activeSwitch,
            currentPage ,
            pageSize,
            search: search === null ? "" : search
        }))
        setIsFilter(true)
    } , [selectedSubject , selectedAgeFrom , selectedAgeTo , selectedLanguage , activeSwitch , currentPage , search, branchForFilter])

    const onSelectSubject = (value) => {
        if (value !== selectedSubject) {

            setSelectedSubject(value);

        }
        // const selectedSubjectData = subjects.find(subj => subj.id === Number(value));
        // const subjectId = selectedSubjectData.id;
        // dispatch(fetchTeachersDataWithFilter({subjId: subjectId}))

        // setActive(false)

    }

    const onSelectLanguage = (value) => {
        if (value !== selectedLanguage) {

            setSelectedLanguage(value);

        }
        // const selectedLanguageData = languages.find(lang => lang.id === Number(value));
        // const languageId = selectedLanguageData.id
        // dispatch(fetchTeachersDataWithFilter({langId: languageId}))
        // setActive(false)

    }









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
                        options={[{name: "All" , id: "all"} , ...subjects]}
                        extraClass={cls.filter__select}
                        defaultValue={teacherSubject}
                        onChangeOption={(value) => onSelectSubject(value)}
                    />

                    <div className={cls.filter__age}>
                        <Input
                            type={"number"}
                            extraClassName={cls.filter__input}
                            placeholder={"Yosh (От)"}
                            onChange={(e) => setSelectedAgeFrom(e.target.value)}
                            // onBlur={handleAgeFromBlur}
                            value={selectedAgeFrom}
                            defaultValue={selectedAgeFrom}
                        />
                        <Input
                            type={"number"}
                            extraClassName={cls.filter__input}
                            placeholder={"Yosh (До)"}
                            onChange={(e) => setSelectedAgeTo(e.target.value)}
                            // onBlur={handleAgeToBlur}
                            value={selectedAgeTo}
                            defaultValue={selectedAgeTo}
                        />
                    </div>
                    <Button onClick={() => {
                        setSelectedAgeTo("")
                        setSelectedAgeFrom("")
                    }} type={"danger"}>
                        Clear (Yoshlarni tozalash (ot do ) )
                    </Button>

                    <Select
                        title={"Til"}
                        options={[{name: "Hammasi" , id: "all"} ,  ...languages ]}
                        extraClass={cls.filter__select}
                        defaultValue={teacherLanguage}
                        onChangeOption={(value) => onSelectLanguage(value)}
                    />



                    <div className={cls.filter__switch}>
                        <p>O’chirilgan</p>
                        <Switch onChangeSwitch={setActiveSwitch} activeSwitch={activeSwitch}/>
                    </div>

                </div>
            </div>
        </Modal>
    );
})