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

export const FlowFilter = memo(({active, setActive}) => {

    const dispatch = useDispatch();

    const subjects = useSelector(getSubjectsData);
    const teachers = useSelector(getTeacherData) ?? [];
    const id = useSelector(getUserBranchId)

    const [selectedSubject, setSelectedSubject] = useState("all");
    const [selectedTeacher, setSelectedTeacher] = useState("all");
    const [initialApplied, setInitialApplied] = useState(false);

    const fetchFlowsData = (subject, teacher) => {
        dispatch(fetchFlows({
            branch: id,
            subject,
            teacher
        }));
    };

    useEffect(() => {
        if (id) {
            dispatch(fetchSubjectsData());
            dispatch(fetchTeachersData(id));
        }
    }, [id]);

    useEffect(() => {
        const saved = getSavedFilters()["flowFilter"];
        if (id) {
            if (!initialApplied && saved) {
                const {selectedSubject: subject, selectedTeacher: teacher} = saved;

                setSelectedSubject(subject || "all");
                setSelectedTeacher(teacher || "all");

                fetchFlowsData(subject, teacher);
                setInitialApplied(true);
            } else if (!initialApplied) {
                fetchFlowsData(selectedSubject, selectedTeacher);
                setInitialApplied(true);
            }
        }
    }, [initialApplied, id]);

    const onFilter = () => {
        fetchFlowsData(selectedSubject, selectedTeacher);
        saveFilter("flowFilter", {
            selectedSubject,
            selectedTeacher
        });
    };

    const onDeleteFilter = () => {
        setSelectedSubject("all");
        setSelectedTeacher("all");

        fetchFlowsData("all", "all");
        removeFilter("flowFilter");
    };

    return (
        <Modal active={active} setActive={setActive}>
            <div className={cls.filter}>
                <h1>Filter</h1>
                <div className={cls.filter__container}>
                    <Select
                        title={"Teacher"}
                        extraClass={cls.filter__select}
                        onChangeOption={(val) => setSelectedTeacher(val)}
                        defaultValue={selectedTeacher}
                        options={[{name: "Hamma", id: "all"}, ...teachers.map(item => ({id: item.id, name: `${item.name} ${item.surname}`}))]}
                    />
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
