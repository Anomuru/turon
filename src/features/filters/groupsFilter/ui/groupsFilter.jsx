import React, {useEffect, useState} from 'react';
import {API_URL, headers, useHttp} from "shared/api/base";
import {Modal} from "shared/ui/modal";
import {Input} from "shared/ui/input";
import {Select} from "shared/ui/select";
import {Switch} from "shared/ui/switch";

import {useDispatch, useSelector} from "react-redux";
import {getUserBranchId} from "entities/profile/userProfile";
import {fetchTeachersData, getTeachers} from "entities/teachers";
import {fetchGroupsDataWithFilter, fetchGroupTypeThunk, getGroupTypes} from "entities/groups";
import {
    getSubjectsData,
    fetchSubjectsData
} from "entities/oftenUsed";
import {fetchTeachersDataWithFilter} from "entities/teachers/model/teacherThunk";

import cls from "../../filters.module.sass";

export const GroupsFilter = React.memo(({active, setActive, setIsFilter}) => {

    const branch = localStorage.getItem("selectedBranch")
    const subjects = useSelector(getSubjectsData)
    const getTeacher = useSelector(getTeachers)
    const [selectedSubject, setSelectedSubject] = useState("all")
    const [selectedTeacher, setSelectedTeacher] = useState("all")
    const [selectedType, setSelectedType] = useState("all")
    const [activeSwitch, setActiveSwitch] = useState(false)
    const dispatch = useDispatch()
    const userBranchId = useSelector(getUserBranchId)
    const types = useSelector(getGroupTypes)

    function fetchGroups(teacher, type, subject) {
        dispatch(fetchGroupsDataWithFilter({
            teacherId: teacher,
            typeId: type,
            subjId: subject,
            userBranchId: branch
        }))
        setIsFilter(true)
    }

    useEffect(() => {
        if (branch)
            dispatch(fetchTeachersData({userBranchId: branch}))
    }, [branch])

    useEffect(() => {
        // dispatch(fetchSubjects());
        dispatch(fetchSubjectsData())
        dispatch(fetchGroupTypeThunk())
    }, []);

    const onSelectTeacher = (value) => {
        if (value !== selectedTeacher) {
            setSelectedTeacher(value)
            fetchGroups(value, selectedType, selectedSubject)
        }
        // dispatch(fetchGroupsDataWithFilter({teacherId: value}))

    }

    const onSelectType = (value) => {
        if (value !== selectedType) {

            setSelectedType(value)

            fetchGroups(selectedTeacher, value, selectedSubject)
        }
        // dispatch(fetchGroupsDataWithFilter({typeId: value}))
    }

    const onSelectSubject = (value) => {
        if (value !== selectedSubject) {

            setSelectedSubject(value);
            fetchGroups(selectedTeacher, selectedType, value)
        }
        // const selectedSubjectData = subjects.find(subj => subj.id === Number(value));
        // const subjectId = selectedSubjectData.id;
        // dispatch(fetchGroupsDataWithFilter({
        //     subjId: subjectId
        // }))
    }
    return (
        <Modal
            active={active}
            setActive={setActive}
        >
            <div className={cls.filter}>
                <h1>Filter</h1>
                <div className={cls.filter__container}>

                    <Select
                        title={"Teacher"}
                        options={[{name: "Hamma", id: "all"}, ...getTeacher]}
                        extraClass={cls.filter__select}
                        onChangeOption={onSelectTeacher}
                        defaultValue={selectedTeacher}
                    />
                    <Select
                        title={"Fan"}
                        options={[{name: "Hamma", id: "all"}, ...subjects]}
                        extraClass={cls.filter__select}
                        onChangeOption={(value) => onSelectSubject(value)}
                        defaultValue={selectedSubject}
                    />
                    <Select
                        title={"Kurs turi"}
                        options={[{name: "Hamma", id: "all"}, ...types]}
                        extraClass={cls.filter__select}
                        onChangeOption={onSelectType}
                        defaultValue={selectedType}
                    />


                    <div className={cls.filter__switch}>
                        <p>O’chirilgan</p>
                        <Switch activeSwitch={activeSwitch} onChangeSwitch={setActiveSwitch}/>
                    </div>

                </div>
            </div>
        </Modal>
    );
})