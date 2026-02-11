import {memo, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";

import {Modal} from "shared/ui/modal";
import {Select} from "shared/ui/select";
import {Button} from "shared/ui/button";

import {fetchSubjectsData, getSubjectsData, fetchTeachersData, getTeacherData} from "entities/oftenUsed";
import {fetchFilterFlow, fetchFlows} from "entities/flows/model/slice/flowsThunk";
import {getUserBranchId} from "entities/profile/userProfile";

import {saveFilter, getSavedFilters, removeFilter} from "shared/lib/components/filterStorage/filterStorage";

import cls from "../../filters.module.sass";
import {getSearchValue} from "features/searchInput/index.js";
import {getSelectedLocations} from "features/locations/index.js";

export const FlowFilter = memo(({active, setActive, currentPage, pageSize}) => {

    const dispatch = useDispatch();

    const subjects = useSelector(getSubjectsData);
    const teachers = useSelector(getTeacherData) ?? [];
    const id = useSelector(getUserBranchId)
    const selectedBranch = useSelector(getSelectedLocations);
   const branchForFilter = selectedBranch?.id ?? id;
    const saved = getSavedFilters()["flowFilter"] ?? {};
    const {selectedSubject: subject, selectedTeacher: teacher} = saved;

    const [selectedSubject, setSelectedSubject] = useState(subject || "all");
    const [selectedTeacher, setSelectedTeacher] = useState(teacher || "all");
    const [initialApplied, setInitialApplied] = useState(false);


    const search  = useSelector(getSearchValue)

    const fetchFlowsData = (subject, teacher, offset, limit) => {
        dispatch(fetchFlows({
            branch: branchForFilter,
            subject,
            teacher,
            limit,
            offset
        }));
    };

    useEffect(() => {
        if (currentPage && pageSize && branchForFilter) {
            dispatch(fetchFlows({
                branch: branchForFilter,
                subject: selectedSubject,
                teacher: selectedTeacher,
                limit: pageSize,
                offset: (currentPage - 1) * pageSize,
                search
            }));
        }
    }, [currentPage, pageSize, branchForFilter , search])

    useEffect(() => {
        if (branchForFilter) {
            dispatch(fetchSubjectsData());
            dispatch(fetchTeachersData(branchForFilter));
        }
    }, [branchForFilter]);

    useEffect(() => {

        if (branchForFilter && pageSize) {
            if (!initialApplied && saved) {
                setSelectedSubject(subject || "all");
                setSelectedTeacher(teacher || "all");

                fetchFlowsData(subject, teacher, 0, pageSize);
                setInitialApplied(true);
            } else if (!initialApplied) {
                fetchFlowsData(selectedSubject, selectedTeacher, 0, pageSize);
                setInitialApplied(true);
            }
        }
    }, [initialApplied, branchForFilter, pageSize]);

    const onFilter = () => {
        fetchFlowsData(selectedSubject, selectedTeacher, 0, pageSize);
        saveFilter("flowFilter", {
            selectedSubject,
            selectedTeacher
        });
    };

    const onDeleteFilter = () => {
        setSelectedSubject("all");
        setSelectedTeacher("all");

        fetchFlowsData("all", "all", 0, pageSize);
        removeFilter("flowFilter");
    };

    return (
        <Modal active={active} setActive={setActive}>
            <div className={cls.filter}>
                <h1>Filter Flow</h1>
                <div className={cls.filter__container}>
                    {teachers &&  <Select
                        title={"Teacher"}
                        extraClass={cls.filter__select}
                        onChangeOption={(val) => setSelectedTeacher(val)}
                        defaultValue={selectedTeacher}
                        options={[{name: "Hamma", id: "all"}, ...teachers?.map(item => ({id: item?.id, name: `${item?.name}`}))]}
                    />}
                    <Select
                        title={"Fan"}
                        extraClass={cls.filter__select}
                        onChangeOption={(val) => setSelectedSubject(val)}
                        defaultValue={selectedSubject}
                        options={[{name: "Hamma", id: "all"}, ...subjects]}
                    />
                    <div className={cls.filter__switch}>
                        <Button onClick={onDeleteFilter} type={"danger"}>Tozalash</Button>
                        <Button onClick={onFilter}>Filter</Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
});
