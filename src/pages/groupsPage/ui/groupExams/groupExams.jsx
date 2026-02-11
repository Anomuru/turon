import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";

import { Input } from "shared/ui/input/index.js";
import { Select } from "shared/ui/select/index.js";
import { Table } from "shared/ui/table/index.js";
import { Modal } from "shared/ui/modal/index.js";
import { ConfirmModal } from "shared/ui/confirmModal/index.js";
import { DynamicModuleLoader } from "shared/lib/components/DynamicModuleLoader/DynamicModuleLoader.jsx";
import { API_URL, headers, useHttp } from "shared/api/base.js";

import { fetchTeachersData, getTeachers } from "entities/teachers/index.js";
import { fetchGroupsDataWithFilter, getGroupsListData, groupsReducer } from "entities/groups/index.js";
import { fetchGroupProfile, getGroupProfileData } from "entities/profile/groupProfile/index.js";
import { fetchSubjectsData, getSubjectsData } from "entities/oftenUsed/index.js";
import { onAddAlertOptions } from "features/alert/index.js";

import cls from "./groupExams.module.sass";

const reducers = {
    groups: groupsReducer,
}

export const GroupExams = () => {

    const { request } = useHttp()
    const {
        register,
        handleSubmit,
        setValue,
        reset
    } = useForm()

    const dispatch = useDispatch()
    const branchID = localStorage.getItem("branchId")

    // Data Selectors
    const teacherData = useSelector(getTeachers)
    const group = useSelector(getGroupProfileData)
    const groups = useSelector(getGroupsListData)
    const subjects = useSelector(getSubjectsData)
    const groupsState = useSelector(state => state.groups);



    // State
    const [data, setData] = useState([])
    const [addModalActive, setAddModalActive] = useState(false) // Add Modal
    const [editModalActive, setEditModalActive] = useState(false) // Edit Modal
    const [deleteModalActive, setDeleteModalActive] = useState(false) // Delete Modal
    const [loading, setLoading] = useState(false)

    // Selection State
    const [selectedId, setSelectedId] = useState(null)
    const [editItem, setEditItem] = useState({})

    // Add Form State (Local state for better control over custom inputs if needed, 
    // though RHF is better. Keeping local state to match previous pattern but fixing logic)
    const [title, setTitle] = useState("")
    const [groupId, setGroupId] = useState(0)
    const [teacherId, setTeacherId] = useState("")
    const [studentId, setStudentId] = useState("")
    const [subjectId, setSubjectId] = useState("")
    const [score, setScore] = useState("")
    const [date, setDate] = useState("")

    const studentsList = group?.students
    const groupsList = React.useMemo(() => {
        if (!groupsState) return [];
        return groupsState.data?.map(g => ({
            id: g.id,
            name: g.name
        }));
    }, [groupsState]);

    console.log(groupsState, "list")

    const studentList = React.useMemo(() => {
        if (!studentsList) return [];
        return studentsList.map(s => ({
            id: s.id,
            name: s.user.name
        }));
    }, [studentsList]);

    useEffect(() => {
        dispatch(fetchTeachersData({ userBranchId: branchID }))
        dispatch(fetchGroupsDataWithFilter({ userBranchId: branchID, search: "" }))
        dispatch(fetchSubjectsData())
    }, [branchID])

    useEffect(() => {
        if (!groupId) return;
        dispatch(fetchGroupProfile({ id: groupId }))
    }, [groupId])

    const fetchData = async () => {
        try {
            const res = await request(`${API_URL}Students/student-exam-results/`, "GET", null, headers())
            setData(res)
        } catch (err) {
            console.error(err)
        }
    }


    useEffect(() => {
        fetchData()
    }, []);

    const clearAddForm = () => {
        setTitle("")
        setGroupId("")
        setTeacherId("")
        setStudentId("")
        setSubjectId("")
        setScore("")
        setDate("")
    }

    const handleSubmitData = async (e) => {
        e?.preventDefault();
        setLoading(true)
        const data = {
            title: title,
            group: groupId,
            teacher: teacherId,
            student: studentId,
            subject: subjectId,
            score: score,
            datetime: date
        }

        try {
            await request(`${API_URL}Students/student-exam-results/`, "POST", JSON.stringify(data), headers())
            dispatch(onAddAlertOptions({
                type: "success",
                status: true,
                msg: "Imtihon natijasi qo'shildi"
            }))
            setAddModalActive(false)
            clearAddForm()
            fetchData()
        } catch (e) {
            console.error(e)
            dispatch(onAddAlertOptions({
                type: "error",
                status: true,
                msg: "Xatolik yuz berdi"
            }))
        } finally {
            setLoading(false)
        }
    }

    const onSubmitChange = async (formData) => {
        const source = {
            ...formData,
        }

        // We are using RHF for edit, but we might need to handle the Selects via local state updates if they dont play nice.
        // For now, assuming RHF `register` works with existing Inputs/Selects or `defaultValue` is enough.

        await request(`${API_URL}Students/student-exam-results/${selectedId}/`, "PUT", JSON.stringify(source), headers())
            .then(res => {
                dispatch(onAddAlertOptions({
                    type: "success",
                    status: true,
                    msg: `Ma'lumot o'zgartirildi`
                }))
                setEditModalActive(false)
                fetchData()
            })
    }

    const handleDelete = () => {
        request(`${API_URL}Students/student-exam-results/${selectedId}/`, "DELETE", null, headers())
            .then(res => {
                dispatch(onAddAlertOptions({
                    type: "success",
                    status: true,
                    msg: "Ma'lumot o'chirildi"
                }))
                setDeleteModalActive(false)
                fetchData()
            })
    };

    const openEditModal = (item) => {
        setEditItem(item)
        setSelectedId(item.id)
        setEditModalActive(true)

        // Timeout to allow modal to render before setting values if needed, or straight away
        setValue("title", item.title)
        setValue("score", item.score)
        setValue("datetime", item.datetime)
        setValue("group", item.group)
        setValue("teacher", item.teacher)
        setValue("student", item.student)
        setValue("subject", item.subject)
    }

    const renderTableRows = (data) => {
        return data.map((item, index) => (
            <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.student_surname} {item.student_name}</td>
                <td>{item.title}</td>
                <td>{item.group_name}</td>
                <td>{item.subject_name}</td>
                <td>{item.teacher_name} {item.teacher_surname}</td>
                <td className={cls.scoreCell}>{item.score}</td>
                <td className={cls.actionCell}>
                    <button className={`${cls.actionBtn} ${cls.edit}`} onClick={() => openEditModal(item)}>
                        <i className="fa-solid fa-pen" />
                    </button>
                    <button className={`${cls.actionBtn} ${cls.delete}`} onClick={() => {
                        setSelectedId(item.id)
                        setDeleteModalActive(true)
                    }}>
                        <i style={{color: "#c94d50"}} className="fa-solid fa-trash" />
                    </button>
                </td>
            </tr>
        ))
    }

    return (
        <DynamicModuleLoader reducers={reducers}>
            <div className={cls.pageContainer}>

                <div className={cls.header}>
                    <h1>Imtihon natijalari</h1>
                    <button className={cls.addBtn} onClick={() => setAddModalActive(true)}>
                        <i style={{marginTop: "0.5rem"}} className="fa-solid fa-plus" /> Imtihon natijasini qo'shish
                    </button>
                </div>

                <div className={cls.tableContainer}>
                    <div className={cls.tableWrapper}>
                        <Table extraClass={cls.table}>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>O'quvchining ismi</th>
                                    <th>Imtihon mavzusi</th>
                                    <th>Guruhi</th>
                                    <th>Fani</th>
                                    <th>O'qituvchisi</th>
                                    <th>Natijasi</th>
                                    <th style={{ textAlign: 'center' }}>Qulayliklar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {renderTableRows(data)}
                            </tbody>
                        </Table>
                    </div>
                </div>

                {/* ADD Modal */}
                <Modal active={addModalActive} setActive={setAddModalActive}>
                    <div className={cls.modalHeader}>
                        <h2>Imtihon natijasini qo'shsih</h2>
                    </div>
                    <form id="addForm" onSubmit={handleSubmitData} className={cls.modalForm}>
                        <div className={cls.column}>
                            <Input
                                title="Mavzusi"
                                placeholder="Imtihon mavzusi"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                            <Select
                                title="Guruhi"
                                onChangeOption={setGroupId}
                                options={groupsList}
                                titleOption="Guruhni tanlang"
                                required
                                extraClass={cls.modalForm__select}
                            />
                            <Select
                                title="O'quvchi"
                                onChangeOption={setStudentId}
                                options={studentList}
                                titleOption="O'quvchini tanlang"
                                extraClass={cls.modalForm__select}
                                required
                            />
                        </div>
                        <div className={cls.column}>
                            <Select
                                title="Fan"
                                onChangeOption={setSubjectId}
                                options={subjects}
                                titleOption="Fan tanlang"
                                extraClass={cls.modalForm__select}

                                required
                            />
                            <Select
                                title="O'qituvchi"
                                onChangeOption={setTeacherId}
                                options={teacherData}
                                titleOption="O'qituvchini tanlang"
                                required
                                extraClass={cls.modalForm__select}
                            />
                            <Input
                                title="Natija"
                                placeholder="0"
                                value={score}
                                onChange={(e) => setScore(e.target.value)}
                                required
                            />
                            <Input
                                title="Sana"
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                            />
                        </div>
                    </form>
                    <div className={cls.modalActions}>
                        <button className={cls.cancelBtn} type="button" onClick={() => setAddModalActive(false)}>Bekor qilish</button>
                        <button className={cls.submitBtn} form="addForm" type="submit" disabled={loading}>
                            {loading ? "Qo'shilmoqda..." : "Qo'shish"}
                        </button>
                    </div>
                </Modal>

                {/* Edit Modal */}
                <Modal active={editModalActive} setActive={setEditModalActive}>
                    <div className={cls.modalHeader}>
                        <h2>Natijani tahrirlash</h2>
                    </div>
                    <form id="editForm" onSubmit={handleSubmit(onSubmitChange)} className={cls.modalForm}>
                        <div className={cls.column}>
                            <Input
                                title="Mavzusi"
                                placeholder="Imtihon mavzusi"
                                register={register}
                                name="title"
                            />
                            <Input
                                title="Natija"
                                placeholder="Natija"
                                register={register}
                                name="score"
                            />
                            <Input
                                title="Sana"
                                register={register}
                                name="datetime"
                                type="date"
                            />
                        </div>
                        <div className={cls.column}>
                            <Select
                                title="Guruhi"
                                name="group"
                                register={register}
                                options={groupsList}
                                extraClass={cls.modalForm__select}
                                defaultValue={editItem.group}
                            />
                            <Select
                                title="Oqituvchi"
                                name="teacher"
                                register={register}
                                options={teacherData}
                                defaultValue={editItem.teacher}
                                extraClass={cls.modalForm__select}
                            />
                            <Select
                                name="O'quvchi"
                                title="Student"
                                register={register}
                                options={studentList}
                                defaultValue={editItem.student}
                                extraClass={cls.modalForm__select}
                            />
                            <Select
                                name="Fan"
                                title="Subject"
                                register={register}
                                options={subjects}
                                defaultValue={editItem.subject}
                                extraClass={cls.modalForm__select}
                            />
                        </div>
                    </form>
                    <div className={cls.modalActions}>
                        <button className={cls.cancelBtn} type="button" onClick={() => setEditModalActive(false)}>Bekor qilish</button>
                        <button className={cls.submitBtn} form="editForm" type="submit">Yangilash</button>
                    </div>
                </Modal>

                <ConfirmModal
                    type="danger"
                    title="Natijani o'chirish"
                    text="Natijani rostan ham o'chirmoqchimisiz?"
                    active={deleteModalActive}
                    setActive={setDeleteModalActive}
                    onClick={handleDelete}
                />
            </div>
        </DynamicModuleLoader>
    );
};

