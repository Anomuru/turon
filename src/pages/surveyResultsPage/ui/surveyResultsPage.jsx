import React, {useCallback, useEffect, useState} from 'react';
import classNames from "classnames";
import {useDispatch, useSelector} from "react-redux";

import cls from "./surveyResultsPage.module.sass";
import {Table} from "shared/ui/table";
import {Modal} from "shared/ui/modal";
import {Select} from "shared/ui/select";
import {Input} from "shared/ui/input";
import {Textarea} from "shared/ui/textArea";
import {Button} from "shared/ui/button";

import {fetchTeachersData} from "entities/teachers";
import {getTeachers} from "entities/teachers";
import {fetchOnlyStudyingStudentsData} from "entities/students/model/studentsThunk";
import {getStudyingStudents} from "entities/students/model/selector/studentsSelector";
import {fetchParentList} from "entities/parents/model/parentThunk";
import {getParentsList} from "entities/parents/model/parentSelector";
import {API_URL, headers, ParamUrl, useHttp} from "shared/api/base";
import {onAddAlertOptions} from "features/alert/model/slice/alertSlice";
import {ConfirmModal} from "shared/ui/confirmModal/index.js";


export const SurveyResultsPage = () => {
    const dispatch = useDispatch();
    const [data, setData] = useState([]);
    const branchId = localStorage.getItem("branchId");
    const teachersList = useSelector(getTeachers);

    const parentsList = useSelector(getParentsList);


    const {request} = useHttp();

    const [deleteModalActive, setDeleteModalActive] = useState(false)
    const [teacherId, setTeacherId] = useState(null)
    const [itemId, setItemId] = useState(null)
    const [activeModal, setActiveModal] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [expandedTeacherId, setExpandedTeacherId] = useState(null);
    const [respondentType, setRespondentType] = useState('student'); // 'student' | 'parent'
    const [formData, setFormData] = useState({
        respondentId: "",
        status: "",
        comment: "",
        date: ""
    });
    const [satisfactionList, setSatisfactionList] = useState([]);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        if (branchId) {
            dispatch(fetchTeachersData({userBranchId: branchId}));
            dispatch(fetchParentList({branchId, deleted: "False"}));
            dispatch(fetchParentList({branchId}))
        }
    }, [branchId]);

    useEffect(() => {
        request(`${API_URL}Students/active-students/?branch=${branchId}`, "GET", null, headers())
            .then(res => {
                setData(res);
            })
    }, []);

    const fetchSatisfactionList = useCallback((teacherId) => {
        request(`${API_URL}Teachers/teacher-satisfaction/?teacher=${teacherId}`, "GET", null, headers())
            .then(res => {
                setSatisfactionList(res);
            })
            .catch(err => {
                console.error("Failed to fetch satisfaction list", err);
            });
    }, [request]);

    const handleTeacherClick = useCallback((teacher) => {
        if (expandedTeacherId === teacher.id) {
            setExpandedTeacherId(null);
            setSatisfactionList([]);
        } else {
            setExpandedTeacherId(teacher.id);
            fetchSatisfactionList(teacher.id);
        }
    }, [expandedTeacherId, fetchSatisfactionList]);

    const handleAddClick = (e, teacher) => {
        e.stopPropagation();
        setSelectedTeacher(teacher);
        resetForm();
        setActiveModal(true);
    };

    const resetForm = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        setFormData({
            respondentId: "",
            status: "",
            comment: "",
            date: now.toISOString().slice(0, 16)
        });
        setEditingId(null);

    };

    const handleChange = useCallback((key, value) => {
        setFormData(prev => ({
            ...prev,
            [key]: value
        }));
    }, []);

    const handleEdit = (item, teacher) => {
        setSelectedTeacher(teacher);
        setEditingId(item.id);
        setRespondentType(item.student ? 'student' : 'parent');
        setFormData({
            respondentId: item.student || item.parent || "",
            status: item.status,
            comment: item.comment,
            date: item.datetime ? item.datetime.slice(0, 16) : ""
        });
        setActiveModal(true);
    };

    const handleDelete = () => {


        request(`${API_URL}Teachers/teacher-satisfaction/${itemId}/`, "DELETE", null, headers())
            .then(res => {
                dispatch(onAddAlertOptions({
                    type: "success",
                    status: true,
                    msg: "Muvaffaqiyatli o'chirildi"
                }));
                setDeleteModalActive(false)
                fetchSatisfactionList(teacherId);
                if (editingId === itemId) {
                    resetForm();
                    setActiveModal(false);

                }
            })
            .catch(err => {
                dispatch(onAddAlertOptions({
                    type: "error",
                    status: true,
                    msg: "Xatolik yuz berdi"
                }));
            });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!selectedTeacher || !formData.respondentId || !formData.status || !formData.date) {
            dispatch(onAddAlertOptions({
                type: "warning",
                status: true,
                msg: "Iltimos, barcha maydonlarni to'ldiring"
            }));
            return;
        }

        const payload = {
            teacher: selectedTeacher.id,
            status: formData.status,
            comment: formData.comment,
            datetime: formData.date,
            [respondentType === 'student' ? 'student' : 'parent']: formData.respondentId
        };

        if (respondentType === 'student') {
            payload.parent = null;
        } else {
            payload.student = null;
        }

        const method = editingId ? "PATCH" : "POST";
        const url = editingId
            ? `${API_URL}Teachers/teacher-satisfaction/${editingId}/`
            : `${API_URL}Teachers/teacher-satisfaction/`;

        request(url, method, JSON.stringify(payload), headers())
            .then(res => {
                dispatch(onAddAlertOptions({
                    type: "success",
                    status: true,
                    msg: editingId ? "Muvaffaqiyatli yangilandi" : "Muvaffaqiyatli saqlandi"
                }));
                if (expandedTeacherId === selectedTeacher.id) {
                    fetchSatisfactionList(selectedTeacher.id);
                }
                setActiveModal(false);
                resetForm();
            })
            .catch(err => {
                dispatch(onAddAlertOptions({
                    type: "error",
                    status: true,
                    msg: "Xatolik yuz berdi"
                }));
                console.error(err);
            });
    };

    const studentOptions = data?.map(student => ({
        id: student.id,
        name: `${student.user.name} ${student.user.surname}`
    })) || [];

    const parentOptions = parentsList?.map(parent => ({
        id: parent.id,
        name: `${parent.name} ${parent.surname}`
    })) || [];

    const statusOptions = [
        {
            value: "good",
            name: "Yaxshi"
        },
        {value: "average", name: "O'rtacha"},
        {value: "bad", name: "Yomon"}
    ];

    const getRespondentName = (item) => {
        if (item.student_data) {
            return `${item.student_data.user.name} ${item.student_data.user.surname} (O'quvchi)`;
        } else if (item.parent_data) {
            return `${item.parent_data.name} ${item.parent_data.surname} (Ota-ona)`;
        } else if (item.student) {
            // Fallback if data object not present but ID is
            const s = data.find(s => s.id === item.student);
            return s ? `${s.user.name} ${s.user.surname} (O'quvchi)` : "O'quvchi";
        } else if (item.parent) {
            const p = parentsList.find(p => p.id === item.parent);
            return p ? `${p.name} ${p.surname} (Ota-ona)` : "Ota-ona";
        }
        return "Noma'lum";
    };

    console.log(parentsList, 'lost')

    return (

        <div className={cls.surveyResultsPage}>
            <div className={cls.surveyResultsPage__header}>
                <h1>O'qituvchilar so'rovnomasi</h1>
            </div>

            <div className={cls.surveyResultsPage__content}>
                <Table>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>F.I.O</th>
                        <th>Fan</th>
                        <th>Telefon</th>
                    </tr>
                    </thead>
                    <tbody>
                    {teachersList?.map((teacher, index) => (
                        <React.Fragment key={teacher.id}>
                            <tr
                                style={{cursor: "pointer"}}
                                className={classNames(cls.teacherRow, {
                                    [cls.expanded]: expandedTeacherId === teacher.id
                                })}
                                onClick={() => handleTeacherClick(teacher)}
                            >
                                <td>{index + 1}</td>
                                <td>
                                    {teacher?.name} {teacher?.surname}
                                </td>
                                <td>{teacher.subject[0]?.name ?? "Fan biriktirilmagan"}</td>
                                <td>{teacher?.phone}</td>
                            </tr>
                            {expandedTeacherId === teacher.id && (
                                <tr className={cls.accordionRow}>
                                    <td colSpan="4">
                                        <div className={cls.accordionContent}>
                                            <div className={cls.accordionContent__header}>
                                                <h3>So'rovnoma natijalari</h3>
                                                <Button onClick={(e) => handleAddClick(e, teacher)}>
                                                    Yangi qo'shish
                                                </Button>
                                            </div>

                                            <div className={cls.resultList}>
                                                {satisfactionList?.length > 0 ? (
                                                    satisfactionList.map(item => (
                                                        <div key={item.id} className={cls.resultItem}>
                                                            <div className={cls.resultItem__content}>
                                                                <div className="header">
                                                                        <span className="name">
                                                                            <i className={item.student ? "fas fa-user-graduate" : "fas fa-user"}></i>
                                                                            {getRespondentName(item)}
                                                                        </span>
                                                                    <span
                                                                        className="date">{item.datetime?.slice(0, 10)}</span>
                                                                </div>
                                                                <span className={classNames("status", item.status)}>
                                                                        {statusOptions.find(opt => opt.value === item.status)?.name || item.status}
                                                                    </span>
                                                                <p className="comment">{item.comment}</p>
                                                            </div>
                                                            <div className={cls.resultItem__actions}>
                                                                <button onClick={() => handleEdit(item, teacher)}
                                                                        title="Tahrirlash">
                                                                    <i className="fas fa-edit"></i>
                                                                    Tahrirlash
                                                                </button>
                                                                <button className="deleteBtn" onClick={() => {
                                                                    setDeleteModalActive(true)
                                                                    setItemId(item.id)
                                                                    setTeacherId(teacher.id)
                                                                }} title="O'chirish">
                                                                    <i className="fas fa-trash"></i>
                                                                    O'chirish
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p style={{
                                                        textAlign: "center",
                                                        color: "var(--app-gray-color)",
                                                        gridColumn: "1 / -1"
                                                    }}>Hozircha natijalar yo'q</p>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                    </tbody>
                </Table>
            </div>

            <Modal active={activeModal} setActive={setActiveModal} type="simple">
                <div className={cls.modalInner}>
                    <div className={cls.modalInner__header}>
                        <h3>{editingId ? "Tahrirlash" : "Yangi so'rovnoma"}</h3>
                        <p>{selectedTeacher?.name} {selectedTeacher?.surname}</p>
                    </div>

                    <div className={cls.modalInner__form}>
                        <div className={cls.modalInner__typeSwitch}>
                            <button
                                className={classNames({[cls.active]: respondentType === 'student'})}
                                onClick={() => {
                                    setRespondentType('student');
                                    handleChange('respondentId', "");
                                }}
                            >
                                O'quvchi
                            </button>
                            <button
                                className={classNames({[cls.active]: respondentType === 'parent'})}
                                onClick={() => {
                                    setRespondentType('parent');
                                    handleChange('respondentId', "");
                                }}
                            >
                                Ota-ona
                            </button>
                        </div>

                        <div className={cls.modalInner__field}>
                            <label>
                                {respondentType === 'student' ? "O'quvchi" : "Ota-ona"}
                            </label>
                            <Select
                                options={respondentType === 'student' ? studentOptions : parentOptions}

                                onChangeOption={(val) => handleChange('respondentId', val)}
                                value={formData.respondentId}
                                extraClass={cls.select}
                                titleOption="Tanlang"
                            />
                        </div>

                        <div className={cls.modalInner__field}>
                            <label>Holat</label>
                            <Select
                                options={statusOptions}
                                keyValue="value"
                                extraClass={cls.select}
                                onChangeOption={(val) => handleChange('status', val)}
                                value={formData.status}
                                titleOption="Tanlang"
                            />
                        </div>

                        <div className={cls.modalInner__field}>
                            <label>Izoh</label>
                            <Textarea
                                value={formData.comment}
                                onChange={(val) => handleChange('comment', val)}
                                placeholder="Izoh qoldiring..."
                            />
                        </div>

                        <div className={cls.modalInner__field}>
                            <label>Sana va vaqt</label>
                            <Input
                                type="datetime-local"
                                value={formData.date}
                                onChange={(e) => handleChange('date', e.target.value)}
                            />
                        </div>

                        <div className={cls.modalInner__actions}>
                            <Button type="danger" onClick={() => setActiveModal(false)}>Bekor qilish</Button>
                            <Button type="submit" onClick={handleSubmit}>
                                {editingId ? "Yangilash" : "Saqlash"}
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>

            <ConfirmModal
                type="danger"
                title="So'rovnoma natijasini o'chirish"
                text="So'rovnoma natijasini o'chirishni xohlaysizmi?"
                active={deleteModalActive}
                setActive={setDeleteModalActive}
                onClick={handleDelete}
            />
        </div>
    );
};
