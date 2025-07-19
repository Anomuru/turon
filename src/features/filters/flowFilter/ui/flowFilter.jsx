import {fetchFlows} from "entities/flows";
import {fetchFilterFlow} from "entities/flows/model/slice/flowsThunk";
import {memo, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router";

import {Modal} from "shared/ui/modal";
import {Select} from "shared/ui/select";
import {Input} from "shared/ui/input";
import {Switch} from "shared/ui/switch";
import {fetchSubjectsData, getSubjectsData} from "entities/oftenUsed";
import {fetchTeachersData, getTeachers} from "entities/teachers";
import {getSubjectId, getTeacherId} from "../model/flowFilterSlice";

import cls from "../../filters.module.sass"

export const FlowFilter = memo(({active, setActive}) => {

    const {"*": id} = useParams()

    const dispatch = useDispatch()
    const subjects = useSelector(getSubjectsData)
    const teachers = useSelector(getTeachers)

    useEffect(() => {
        dispatch(fetchSubjectsData())
        dispatch(fetchTeachersData({userBranchId: id}))
    }, [id])

    const [selectedCoinFrom, setSelectedCoinFrom] = useState()
    const [selectedCoinTo, setSelectedCoinTo] = useState()
    const [selectedStudentFrom, setSelectedStudentFrom] = useState()
    const [selectedStudentTo, setSelectedStudentTo] = useState()

    const [selectedSubject, setSelectedSubject] = useState("all")
    const [selectedTeacher, setSelectedTeacher] = useState("all")

    const [activeRange, setActiveRange] = useState(false)
    const [activeDeleted, setActiveDeleted] = useState(false)

    function fetchFlowsData(subject, teacher) {
        dispatch(fetchFilterFlow({subject, teacher}))
    }

    const onChangeSubject = (value) => {
        if (value !== selectedSubject) {
            setSelectedSubject(value)
            fetchFlowsData(value, selectedTeacher?.id ?? selectedTeacher)
            dispatch(getSubjectId(value))
        }
    }

    const onChangeTeacher = (value) => {
        if (value !== selectedTeacher) {
            setSelectedTeacher(teachers.filter(item => item.id === +value)[0])
            fetchFlowsData(selectedSubject, value)
            dispatch(getTeacherId(value))
        }
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
                        extraClass={cls.filter__select}
                        onChangeOption={onChangeTeacher}
                        defaultValue={selectedTeacher?.id ?? selectedTeacher}
                        options={[{name: "Hamma", id: "all"}, ...teachers]}
                    />

                    <Select
                        title={"Fan"}
                        extraClass={cls.filter__select}
                        onChangeOption={onChangeSubject}
                        defaultValue={selectedSubject}
                        options={[{name: "Hamma", id: "all"}, ...selectedTeacher?.subject ?? []]}
                    />

                    {/*<div className={cls.filter__switch}>*/}
                    {/*    <p>Rang</p>*/}
                    {/*    <Switch*/}
                    {/*        activeSwitch={activeRange}*/}
                    {/*        onChangeSwitch={() => setActiveRange(!activeRange)}*/}
                    {/*    />*/}
                    {/*</div>*/}

                    {/*<div className={cls.filter__age}>*/}
                    {/*    <Input*/}
                    {/*        type={"number"}*/}
                    {/*        extraClassName={cls.filter__input}*/}
                    {/*        placeholder={"Studentlar soni (От)"}*/}
                    {/*        onChange={setSelectedStudentFrom}*/}
                    {/*        value={selectedStudentFrom}*/}
                    {/*    />*/}
                    {/*    <Input*/}
                    {/*        type={"number"}*/}
                    {/*        extraClassName={cls.filter__input}*/}
                    {/*        placeholder={"Studentlar soni (До)"}*/}
                    {/*        onChange={setSelectedStudentTo}*/}
                    {/*        value={selectedStudentTo}*/}
                    {/*    />*/}
                    {/*</div>*/}

                    {/*<div className={cls.filter__age}>*/}
                    {/*    <Input*/}
                    {/*        type={"number"}*/}
                    {/*        extraClassName={cls.filter__input}*/}
                    {/*        placeholder={"Coin (От)"}*/}
                    {/*        onChange={setSelectedCoinFrom}*/}
                    {/*        value={selectedCoinFrom}*/}
                    {/*    />*/}
                    {/*    <Input*/}
                    {/*        type={"number"}*/}
                    {/*        extraClassName={cls.filter__input}*/}
                    {/*        placeholder={"Coin (До)"}*/}
                    {/*        onChange={setSelectedCoinTo}*/}
                    {/*        value={selectedCoinTo}*/}
                    {/*    />*/}
                    {/*</div>*/}

                    {/*<div className={cls.filter__switch}>*/}
                    {/*    <p>O’chirilgan</p>*/}
                    {/*    <Switch*/}
                    {/*        activeSwitch={activeDeleted}*/}
                    {/*        onChangeSwitch={() => setActiveDeleted(!activeDeleted)}*/}
                    {/*    />*/}
                    {/*</div>*/}

                </div>
            </div>
        </Modal>
    )
})
