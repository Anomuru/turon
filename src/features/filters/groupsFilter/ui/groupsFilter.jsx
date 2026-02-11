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
import {getSearchValue} from "features/searchInput/index.js";
import {getSelectedLocations} from "features/locations/index.js";

export const GroupsFilter = React.memo(({active, setActive, setIsFilter , activeSwitch , setActiveSwitch , currentPage , pageSize}) => {


    const teacher = localStorage.getItem("selectedTeacher")

    const subjects = useSelector(getSubjectsData)
    const getTeacher = useSelector(getTeachers) ?? []

    const [selectedTeacher, setSelectedTeacher] = useState(teacher)

    const dispatch = useDispatch()
    const userBranchId = localStorage.getItem("branchId")
    const selectedBranch = useSelector(getSelectedLocations);
    const branchForFilter = selectedBranch?.id ?? userBranchId;
    const types = useSelector(getGroupTypes)

    localStorage.setItem("selectedTeacher" , selectedTeacher)
    localStorage.setItem("selectedSwitch" , `${activeSwitch}`)

    const search=useSelector(getSearchValue)

    useEffect(() => {
        dispatch(fetchGroupsDataWithFilter({
            teacherId: selectedTeacher,
            userBranchId: branchForFilter,
            deleted:activeSwitch,
            pageSize,
            currentPage,
            search
        }))
        setIsFilter(true)
    } , [selectedTeacher , activeSwitch, currentPage , search, branchForFilter])

    // function fetchGroups(teacher, type, subject) {
    //
    // }

    useEffect(() => {
        if (branchForFilter)
            dispatch(fetchTeachersData({userBranchId: branchForFilter}))
    }, [branchForFilter])

    useEffect(() => {
        // dispatch(fetchSubjects());
        dispatch(fetchSubjectsData())
        dispatch(fetchGroupTypeThunk())
    }, []);




    return (
        <Modal
            active={active}
            setActive={setActive}
        >
            <div className={cls.filter}>
                <h1>Filter</h1>
                <div className={cls.filter__container}>

                    {getTeacher && <Select
                        title={"Teacher"}
                        options={[{name: "Hamma", id: "all"}, ...getTeacher]}
                        extraClass={cls.filter__select}
                        onChangeOption={setSelectedTeacher}
                        defaultValue={teacher}
                    />}
                    <div className={cls.filter__switch}>
                        <p>O’chirilgan</p>
                        <Switch activeSwitch={activeSwitch} onChangeSwitch={setActiveSwitch}/>
                    </div>

                </div>
            </div>
        </Modal>
    );
})