import React, { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';

import cls from './contributionsPage.module.sass';
import { Table } from 'shared/ui/table';
import { Modal } from 'shared/ui/modal';
import { Input } from 'shared/ui/input';
import { Textarea } from 'shared/ui/textArea';
import { Button } from 'shared/ui/button';
import { ConfirmModal } from 'shared/ui/confirmModal/index.js';

import { fetchTeachersData, getTeachers } from 'entities/teachers';
import { API_URL, headers, useHttp } from 'shared/api/base';
import { onAddAlertOptions } from 'features/alert/model/slice/alertSlice';
import { getCurrentBranch } from 'entities/oftenUsed/model/oftenUsedSelector.js';

const STATUS_OPTIONS = [
    { value: 'good', label: 'Yaxshi', icon: 'fas fa-smile', color: '#16a34a', bg: 'rgba(34,197,94,0.12)' },
    { value: 'average', label: 'Ortacha', icon: 'fas fa-meh', color: '#ca8a04', bg: 'rgba(234,179,8,0.12)' },
    { value: 'bad', label: 'Yomon', icon: 'fas fa-frown', color: '#dc2626', bg: 'rgba(239,68,68,0.12)' },
];

const getStatusMeta = (status) => STATUS_OPTIONS.find((s) => s.value === status) ?? STATUS_OPTIONS[1];

export const ContributionsPage = () => {
    const dispatch = useDispatch();
    const { request } = useHttp();
    const currentBranch = useSelector(getCurrentBranch);
    const ROLE = localStorage.getItem('job');
    const userBranchId = localStorage.getItem('branchId');
    const branchForFilter = ROLE === 'director' ? currentBranch : userBranchId;
    const userId = localStorage.getItem('user_id');
    const teachersList = useSelector(getTeachers);

    const [activeTab, setActiveTab] = useState('contributions');

    // ── Contributions ──────────────────────────────────────────────────────────
    const [contributions, setContributions] = useState([]);
    const [expandedTeacherId, setExpandedTeacherId] = useState(null);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [activeModal, setActiveModal] = useState(false);
    const [deleteModalActive, setDeleteModalActive] = useState(false);
    const [deleteItemId, setDeleteItemId] = useState(null);
    const [deleteTeacherId, setDeleteTeacherId] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ score: '', text: '', datetime: '' });

    // ── Professionalism ────────────────────────────────────────────────────────
    const [professionalisms, setProfessionalisms] = useState([]);
    const [expandedProfTeacherId, setExpandedProfTeacherId] = useState(null);
    const [selectedProfTeacher, setSelectedProfTeacher] = useState(null);
    const [profModalActive, setProfModalActive] = useState(false);
    const [profDeleteModalActive, setProfDeleteModalActive] = useState(false);
    const [deleteProfItemId, setDeleteProfItemId] = useState(null);
    const [deleteProfTeacherId, setDeleteProfTeacherId] = useState(null);
    const [editingProfId, setEditingProfId] = useState(null);
    const [profFormData, setProfFormData] = useState({ score: '', text: '', datetime: '' });

    // ── Teacher Conduct ────────────────────────────────────────────────────────
    const [conducts, setConducts] = useState([]);
    const [expandedConductTeacherId, setExpandedConductTeacherId] = useState(null);
    const [selectedConductTeacher, setSelectedConductTeacher] = useState(null);
    const [conductModalActive, setConductModalActive] = useState(false);
    const [conductDeleteModalActive, setConductDeleteModalActive] = useState(false);
    const [deleteConductItemId, setDeleteConductItemId] = useState(null);
    const [deleteConductTeacherId, setDeleteConductTeacherId] = useState(null);
    const [editingConductId, setEditingConductId] = useState(null);
    const [conductFormData, setConductFormData] = useState({ status: 'good', datetime: '', comment: '' });

    // ── Teacher Feedback ───────────────────────────────────────────────────────
    const [feedbacks, setFeedbacks] = useState([]);
    const [expandedFeedbackTeacherId, setExpandedFeedbackTeacherId] = useState(null);
    const [selectedFeedbackTeacher, setSelectedFeedbackTeacher] = useState(null);
    const [feedbackModalActive, setFeedbackModalActive] = useState(false);
    const [feedbackDeleteModalActive, setFeedbackDeleteModalActive] = useState(false);
    const [deleteFeedbackItemId, setDeleteFeedbackItemId] = useState(null);
    const [deleteFeedbackTeacherId, setDeleteFeedbackTeacherId] = useState(null);
    const [editingFeedbackId, setEditingFeedbackId] = useState(null);
    const [feedbackFormData, setFeedbackFormData] = useState({ status: 'average', datetime: '', comment: '' });

    const [teamCollab, setTeamCollab] = useState([]);
    const [expandedTeamCollabTeacherId, setExpandedTeamCollabTeacherId] = useState(null);
    const [selectedTeamCollabTeacher, setSelectedTeamCollabTeacher] = useState(null);
    const [teamCollabModalActive, setTeamCollabModalActive] = useState(false);
    const [teamCollabDeleteModalActive, setTeamCollabDeleteModalActive] = useState(false);
    const [deleteTeamCollabItemId, setDeleteTeamCollabItemId] = useState(null);
    const [deleteTeamCollabTeacherId, setDeleteTeamCollabTeacherId] = useState(null);
    const [editingTeamCollabId, setEditingTeamCollabId] = useState(null);
    const [teamCollabFormData, setTeamCollabFormData] = useState({ status: 'average', datetime: '', comment: '' });

    useEffect(() => {
        if (branchForFilter) {
            dispatch(fetchTeachersData({ userBranchId: branchForFilter }));
        }
    }, [branchForFilter]);

    const nowIso = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0, 16);
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'high';
        if (score >= 50) return 'mid';
        return 'low';
    };

    // ── Contributions handlers ─────────────────────────────────────────────────
    const resetForm = useCallback(() => {
        setFormData({ score: '', text: '', datetime: nowIso() });
        setEditingId(null);
    }, []);

    const fetchContributions = useCallback(
        (teacherId) => {
            request(`${API_URL}Teachers/teacher-contributions/?teacher=${teacherId}`, 'GET', null, headers())
                .then((res) => setContributions(res))
                .catch((err) => console.error('Failed to fetch contributions', err));
        },
        [request]
    );

    const handleTeacherClick = useCallback(
        (teacher) => {
            if (expandedTeacherId === teacher.id) {
                setExpandedTeacherId(null);
                setContributions([]);
            } else {
                setExpandedTeacherId(teacher.id);
                fetchContributions(teacher.id);
            }
        },
        [expandedTeacherId, fetchContributions]
    );

    const handleAddClick = (e, teacher) => {
        e.stopPropagation();
        setSelectedTeacher(teacher);
        resetForm();
        setActiveModal(true);
    };

    const handleEditClick = (e, item, teacher) => {
        e.stopPropagation();
        setSelectedTeacher(teacher);
        setEditingId(item.id);
        setFormData({ score: item.score ?? '', text: item.text ?? '', datetime: item.datetime ? item.datetime.slice(0, 16) : '' });
        setActiveModal(true);
    };

    const handleChange = useCallback((key, value) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedTeacher || formData.score === '' || !formData.datetime) {
            dispatch(onAddAlertOptions({ type: 'warning', status: true, msg: "Iltimos, barcha majburiy maydonlarni to'ldiring" }));
            return;
        }
        const payload = { teacher: selectedTeacher.id, score: Number(formData.score), text: formData.text, datetime: formData.datetime, user: userId };
        const method = editingId ? 'PATCH' : 'POST';
        const url = editingId ? `${API_URL}Teachers/teacher-contributions/${editingId}/` : `${API_URL}Teachers/teacher-contributions/`;
        request(url, method, JSON.stringify(payload), headers())
            .then(() => {
                dispatch(onAddAlertOptions({ type: 'success', status: true, msg: editingId ? 'Muvaffaqiyatli yangilandi' : 'Muvaffaqiyatli saqlandi' }));
                if (expandedTeacherId === selectedTeacher.id) fetchContributions(selectedTeacher.id);
                setActiveModal(false);
                resetForm();
            })
            .catch(() => dispatch(onAddAlertOptions({ type: 'error', status: true, msg: 'Xatolik yuz berdi' })));
    };

    const handleDeleteConfirm = () => {
        request(`${API_URL}Teachers/teacher-contributions/${deleteItemId}/`, 'DELETE', null, headers())
            .then(() => {
                dispatch(onAddAlertOptions({ type: 'success', status: true, msg: "Muvaffaqiyatli o'chirildi" }));
                setDeleteModalActive(false);
                fetchContributions(deleteTeacherId);
            })
            .catch(() => dispatch(onAddAlertOptions({ type: 'error', status: true, msg: 'Xatolik yuz berdi' })));
    };

    // ── Professionalism handlers ───────────────────────────────────────────────
    const resetProfForm = useCallback(() => {
        setProfFormData({ score: '', text: '', datetime: nowIso() });
        setEditingProfId(null);
    }, []);

    const fetchProfessionalisms = useCallback(
        (teacherId) => {
            request(`${API_URL}Teachers/teacher-professionalism/?teacher=${teacherId}`, 'GET', null, headers())
                .then((res) => setProfessionalisms(res))
                .catch((err) => console.error('Failed to fetch professionalisms', err));
        },
        [request]
    );

    const handleProfTeacherClick = useCallback(
        (teacher) => {
            if (expandedProfTeacherId === teacher.id) {
                setExpandedProfTeacherId(null);
                setProfessionalisms([]);
            } else {
                setExpandedProfTeacherId(teacher.id);
                fetchProfessionalisms(teacher.id);
            }
        },
        [expandedProfTeacherId, fetchProfessionalisms]
    );

    const handleProfAddClick = (e, teacher) => {
        e.stopPropagation();
        setSelectedProfTeacher(teacher);
        resetProfForm();
        setProfModalActive(true);
    };

    const handleProfEditClick = (e, item, teacher) => {
        e.stopPropagation();
        setSelectedProfTeacher(teacher);
        setEditingProfId(item.id);
        setProfFormData({ score: item.score ?? '', text: item.text ?? '', datetime: item.datetime ? item.datetime.slice(0, 16) : '' });
        setProfModalActive(true);
    };

    const handleProfChange = useCallback((key, value) => {
        setProfFormData((prev) => ({ ...prev, [key]: value }));
    }, []);

    const handleProfSubmit = (e) => {
        e.preventDefault();
        if (!selectedProfTeacher || profFormData.score === '' || !profFormData.datetime) {
            dispatch(onAddAlertOptions({ type: 'warning', status: true, msg: "Iltimos, barcha majburiy maydonlarni to'ldiring" }));
            return;
        }
        const payload = { teacher: selectedProfTeacher.id, score: Number(profFormData.score), text: profFormData.text, datetime: profFormData.datetime, user: userId };
        const method = editingProfId ? 'PATCH' : 'POST';
        const url = editingProfId ? `${API_URL}Teachers/teacher-professionalism/${editingProfId}/` : `${API_URL}Teachers/teacher-professionalism/`;
        request(url, method, JSON.stringify(payload), headers())
            .then(() => {
                dispatch(onAddAlertOptions({ type: 'success', status: true, msg: editingProfId ? 'Muvaffaqiyatli yangilandi' : 'Muvaffaqiyatli saqlandi' }));
                if (expandedProfTeacherId === selectedProfTeacher.id) fetchProfessionalisms(selectedProfTeacher.id);
                setProfModalActive(false);
                resetProfForm();
            })
            .catch(() => dispatch(onAddAlertOptions({ type: 'error', status: true, msg: 'Xatolik yuz berdi' })));
    };

    const handleProfDeleteConfirm = () => {
        request(`${API_URL}Teachers/teacher-professionalism/${deleteProfItemId}/`, 'DELETE', null, headers())
            .then(() => {
                dispatch(onAddAlertOptions({ type: 'success', status: true, msg: "Muvaffaqiyatli o'chirildi" }));
                setProfDeleteModalActive(false);
                fetchProfessionalisms(deleteProfTeacherId);
            })
            .catch(() => dispatch(onAddAlertOptions({ type: 'error', status: true, msg: 'Xatolik yuz berdi' })));
    };

    // ── Conduct handlers ───────────────────────────────────────────────────────
    const resetConductForm = useCallback(() => {
        setConductFormData({ status: 'good', datetime: nowIso(), comment: '' });
        setEditingConductId(null);
    }, []);

    const fetchConducts = useCallback(
        (teacherId) => {
            request(`${API_URL}Teachers/teacher-conduct/?teacher=${teacherId}`, 'GET', null, headers())
                .then((res) => setConducts(res))
                .catch((err) => console.error('Failed to fetch conducts', err));
        },
        [request]
    );

    const handleConductTeacherClick = useCallback(
        (teacher) => {
            if (expandedConductTeacherId === teacher.id) {
                setExpandedConductTeacherId(null);
                setConducts([]);
            } else {
                setExpandedConductTeacherId(teacher.id);
                fetchConducts(teacher.id);
            }
        },
        [expandedConductTeacherId, fetchConducts]
    );

    const handleConductAddClick = (e, teacher) => {
        e.stopPropagation();
        setSelectedConductTeacher(teacher);
        resetConductForm();
        setConductModalActive(true);
    };

    const handleConductEditClick = (e, item, teacher) => {
        e.stopPropagation();
        setSelectedConductTeacher(teacher);
        setEditingConductId(item.id);
        setConductFormData({ status: item.status ?? 'good', datetime: item.datetime ? item.datetime.slice(0, 16) : '', comment: item.comment ?? '' });
        setConductModalActive(true);
    };

    const handleConductChange = useCallback((key, value) => {
        setConductFormData((prev) => ({ ...prev, [key]: value }));
    }, []);

    const handleConductSubmit = (e) => {
        e.preventDefault();
        if (!selectedConductTeacher || !conductFormData.datetime) {
            dispatch(onAddAlertOptions({ type: 'warning', status: true, msg: "Iltimos, barcha majburiy maydonlarni to'ldiring" }));
            return;
        }
        const payload = { teacher: selectedConductTeacher.id, status: conductFormData.status, datetime: conductFormData.datetime, comment: conductFormData.comment };
        const method = editingConductId ? 'PATCH' : 'POST';
        const url = editingConductId ? `${API_URL}Teachers/teacher-conduct/${editingConductId}/` : `${API_URL}Teachers/teacher-conduct/`;
        request(url, method, JSON.stringify(payload), headers())
            .then(() => {
                dispatch(onAddAlertOptions({ type: 'success', status: true, msg: editingConductId ? 'Muvaffaqiyatli yangilandi' : 'Muvaffaqiyatli saqlandi' }));
                if (expandedConductTeacherId === selectedConductTeacher.id) fetchConducts(selectedConductTeacher.id);
                setConductModalActive(false);
                resetConductForm();
            })
            .catch(() => dispatch(onAddAlertOptions({ type: 'error', status: true, msg: 'Xatolik yuz berdi' })));
    };

    const handleConductDeleteConfirm = () => {
        request(`${API_URL}Teachers/teacher-conduct/${deleteConductItemId}/`, 'DELETE', null, headers())
            .then(() => {
                dispatch(onAddAlertOptions({ type: 'success', status: true, msg: "Muvaffaqiyatli o'chirildi" }));
                setConductDeleteModalActive(false);
                fetchConducts(deleteConductTeacherId);
            })
            .catch(() => dispatch(onAddAlertOptions({ type: 'error', status: true, msg: 'Xatolik yuz berdi' })));
    };

    // ── Feedback handlers ──────────────────────────────────────────────────────
    const resetFeedbackForm = useCallback(() => {
        setFeedbackFormData({ status: 'average', datetime: nowIso(), comment: '' });
        setEditingFeedbackId(null);
    }, []);

    const fetchFeedbacks = useCallback(
        (teacherId) => {
            request(`${API_URL}Teachers/teacher-feedback/?teacher=${teacherId}`, 'GET', null, headers())
                .then((res) => setFeedbacks(res))
                .catch((err) => console.error('Failed to fetch feedbacks', err));
        },
        [request]
    );

    const handleFeedbackTeacherClick = useCallback(
        (teacher) => {
            if (expandedFeedbackTeacherId === teacher.id) {
                setExpandedFeedbackTeacherId(null);
                setFeedbacks([]);
            } else {
                setExpandedFeedbackTeacherId(teacher.id);
                fetchFeedbacks(teacher.id);
            }
        },
        [expandedFeedbackTeacherId, fetchFeedbacks]
    );

    const handleFeedbackAddClick = (e, teacher) => {
        e.stopPropagation();
        setSelectedFeedbackTeacher(teacher);
        resetFeedbackForm();
        setFeedbackModalActive(true);
    };

    const handleFeedbackEditClick = (e, item, teacher) => {
        e.stopPropagation();
        setSelectedFeedbackTeacher(teacher);
        setEditingFeedbackId(item.id);
        setFeedbackFormData({ status: item.status ?? 'average', datetime: item.datetime ? item.datetime.slice(0, 16) : '', comment: item.comment ?? '' });
        setFeedbackModalActive(true);
    };

    const handleFeedbackChange = useCallback((key, value) => {
        setFeedbackFormData((prev) => ({ ...prev, [key]: value }));
    }, []);

    const handleFeedbackSubmit = (e) => {
        e.preventDefault();
        if (!selectedFeedbackTeacher || !feedbackFormData.datetime) {
            dispatch(onAddAlertOptions({ type: 'warning', status: true, msg: "Iltimos, barcha majburiy maydonlarni to'ldiring" }));
            return;
        }
        const payload = {
            user: Number(userId),
            teacher: selectedFeedbackTeacher.id,
            status: feedbackFormData.status,
            comment: feedbackFormData.comment,
            datetime: feedbackFormData.datetime };

        console.log(payload.datetime)
        const method = editingFeedbackId ? 'PATCH' : 'POST';
        const url = editingFeedbackId ? `${API_URL}Teachers/teacher-feedback/${editingFeedbackId}/` : `${API_URL}Teachers/teacher-feedback/`;
        request(url, method, JSON.stringify(payload), headers())
            .then(() => {
                dispatch(onAddAlertOptions({ type: 'success', status: true, msg: editingFeedbackId ? 'Muvaffaqiyatli yangilandi' : 'Muvaffaqiyatli saqlandi' }));
                if (expandedFeedbackTeacherId === selectedFeedbackTeacher.id) fetchFeedbacks(selectedFeedbackTeacher.id);
                setFeedbackModalActive(false);
                resetFeedbackForm();
            })
            .catch(() => dispatch(onAddAlertOptions({ type: 'error', status: true, msg: 'Xatolik yuz berdi' })));
    };

    const handleFeedbackDeleteConfirm = () => {
        request(`${API_URL}Teachers/teacher-feedback/${deleteFeedbackItemId}/`, 'DELETE', null, headers())
            .then(() => {
                dispatch(onAddAlertOptions({ type: 'success', status: true, msg: "Muvaffaqiyatli o'chirildi" }));
                setFeedbackDeleteModalActive(false);
                fetchFeedbacks(deleteFeedbackTeacherId);
            })
            .catch(() => dispatch(onAddAlertOptions({ type: 'error', status: true, msg: 'Xatolik yuz berdi' })));
    };

    //  team collaboration handlers

    const resetTeamCollabForm = useCallback(() => {
        setTeamCollabFormData({ status: 'average', datetime: nowIso(), comment: '' });
        setEditingTeamCollabId(null);
    }, []);

    const fetchTeamCollabs = useCallback(
        (teacherId) => {
            request(`${API_URL}Teachers/teacher-collaboration/?teacher=${teacherId}`, 'GET', null, headers())
                .then((res) => setTeamCollab(res))
                .catch((err) => console.error('Failed to fetch team collaboration', err));
        },
        [request]
    );

    const handleTeamCollabTeacherClick = useCallback(
        (teacher) => {
            if (expandedTeamCollabTeacherId === teacher.id) {
                setExpandedTeamCollabTeacherId(null);
                setTeamCollab([]);
            } else {
                setExpandedTeamCollabTeacherId(teacher.id);
                fetchTeamCollabs(teacher.id);
            }
        },
        [expandedTeamCollabTeacherId, fetchTeamCollabs]
    );

    const handleTeamCollabAddClick = (e, teacher) => {
        e.stopPropagation();
        setSelectedTeamCollabTeacher(teacher);
        resetTeamCollabForm();
        setTeamCollabModalActive(true);
    };

    const handleTeamCollabEditClick = (e, item, teacher) => {
        e.stopPropagation();
        setSelectedTeamCollabTeacher(teacher);
        setEditingTeamCollabId(item.id);
        setTeamCollabFormData({ status: item.status ?? 'average', datetime: item.datetime ? item.datetime.slice(0, 16) : '', comment: item.comment ?? '' });
        setTeamCollabModalActive(true);
    };

    const handleTeamCollabChange = useCallback((key, value) => {
        setTeamCollabFormData((prev) => ({ ...prev, [key]: value }));
    }, []);

    const handleTeamCollabSubmit = (e) => {
        e.preventDefault();
        if (!selectedTeamCollabTeacher || !teamCollabFormData.datetime) {
            dispatch(onAddAlertOptions({ type: 'warning', status: true, msg: "Iltimos, barcha majburiy maydonlarni to'ldiring" }));
            return;
        }
        const payload = {
            user: Number(userId),
            teacher: selectedTeamCollabTeacher.id,
            status: teamCollabFormData.status,
            comment: teamCollabFormData.comment,
            datetime: teamCollabFormData.datetime };

        console.log(payload.datetime)
        const method = editingTeamCollabId ? 'PATCH' : 'POST';
        const url = editingTeamCollabId ? `${API_URL}Teachers/teacher-collaboration/${editingTeamCollabId}/` : `${API_URL}Teachers/teacher-collaboration/`;
        request(url, method, JSON.stringify(payload), headers())
            .then(() => {
                dispatch(onAddAlertOptions({ type: 'success', status: true, msg: editingFeedbackId ? 'Muvaffaqiyatli yangilandi' : 'Muvaffaqiyatli saqlandi' }));
                if (expandedTeamCollabTeacherId === selectedTeamCollabTeacher.id) fetchTeamCollabs(selectedTeamCollabTeacher.id);
                setTeamCollabModalActive(false);
                resetTeamCollabForm();
            })
            .catch(() => dispatch(onAddAlertOptions({ type: 'error', status: true, msg: 'Xatolik yuz berdi' })));
    };

    const handleTeamCollabDeleteConfirm = () => {
        request(`${API_URL}Teachers/teacher-collaboration/${deleteTeamCollabItemId}/`, 'DELETE', null, headers())
            .then(() => {
                dispatch(onAddAlertOptions({ type: 'success', status: true, msg: "Muvaffaqiyatli o'chirildi" }));
                setTeamCollabDeleteModalActive(false);
                fetchTeamCollabs(deleteTeamCollabTeacherId);
            })
            .catch(() => dispatch(onAddAlertOptions({ type: 'error', status: true, msg: 'Xatolik yuz berdi' })));
    };

    // ── Score-based accordion cards ────────────────────────────────────────────
    const renderTeacherTable = ({ expandedId, onTeacherClick, onAddClick, onEditClick, onDeleteClick, items, emptyLabel, addBtnLabel }) => (
        <Table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>F.I.O</th>
                    <th>Fan</th>
                    <th>Telefon</th>
                    <th>Amal</th>
                </tr>
            </thead>
            <tbody>
                {teachersList?.map((teacher, index) => (
                    <React.Fragment key={teacher.id}>
                        <tr
                            className={classNames(cls.teacherRow, { [cls.expanded]: expandedId === teacher.id })}
                            onClick={() => onTeacherClick(teacher)}
                        >
                            <td><span className={cls.index}>{index + 1}</span></td>
                            <td>
                                <div className={cls.teacherInfo}>
                                    <div className={cls.teacherAvatar}>{teacher.name?.charAt(0)}{teacher.surname?.charAt(0)}</div>
                                    <span>{teacher.name} {teacher.surname}</span>
                                </div>
                            </td>
                            <td><span className={cls.subjectBadge}>{teacher.subject?.[0]?.name ?? 'Fan biriktirilmagan'}</span></td>
                            <td>{teacher.phone}</td>
                            <td>
                                <div className={cls.rowActions}>
                                    <button className={cls.addBtn} onClick={(e) => onAddClick(e, teacher)} title="Baho qo'shish">
                                        <i style={{ color: 'white' }} className="fas fa-plus" />
                                        Baho qo'shish
                                    </button>
                                    <span className={classNames(cls.chevron, { [cls.chevronOpen]: expandedId === teacher.id })}>
                                        <i className="fas fa-chevron-down" />
                                    </span>
                                </div>
                            </td>
                        </tr>

                        {expandedId === teacher.id && (
                            <tr className={cls.accordionRow}>
                                <td colSpan="5">
                                    <div className={cls.accordion}>
                                        <div className={cls.accordion__header}>
                                            <h3><i className="fas fa-history" />Baho tarixi</h3>
                                            <button className={cls.addScoreBtn} onClick={(e) => onAddClick(e, teacher)}>
                                                <i className="fas fa-plus" />Yangi baho
                                            </button>
                                        </div>
                                        {items?.length > 0 ? (
                                            <div className={cls.accordion__grid}>
                                                {items.map((item) => (
                                                    <div key={item.id} className={cls.scoreCard}>
                                                        <div className={cls.scoreCard__top}>
                                                            <div className={classNames(cls.scoreBadge, cls[getScoreColor(item.score)])}>
                                                                <i className="fas fa-star" />{item.score}
                                                            </div>
                                                            <span className={cls.scoreDate}>
                                                                <i className="fas fa-calendar-alt" />{item.datetime?.slice(0, 10)}
                                                            </span>
                                                        </div>
                                                        {item.text && <p className={cls.scoreText}>{item.text}</p>}
                                                        <div className={cls.scoreCard__actions}>
                                                            <button className={cls.editBtn} onClick={(e) => onEditClick(e, item, teacher)}>
                                                                <i className="fas fa-edit" />Tahrirlash
                                                            </button>
                                                            <button className={cls.deleteBtn} onClick={(e) => { e.stopPropagation(); onDeleteClick(item.id, teacher.id); }}>
                                                                <i className="fas fa-trash" />O'chirish
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className={cls.emptyState}>
                                                <i className="fas fa-inbox" />
                                                <p>{emptyLabel}</p>
                                                <button onClick={(e) => onAddClick(e, teacher)}>{addBtnLabel}</button>
                                            </div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        )}
                    </React.Fragment>
                ))}

                {(!teachersList || teachersList.length === 0) && (
                    <tr><td colSpan="5">
                        <div className={cls.emptyState}><i className="fas fa-search" /><p>O'qituvchilar topilmadi</p></div>
                    </td></tr>
                )}
            </tbody>
        </Table>
    );

    // ── Status-based accordion cards (conduct & feedback) ─────────────────────
    const renderStatusTable = ({ expandedId, onTeacherClick, onAddClick, onEditClick, onDeleteClick, items, emptyLabel, addBtnLabel, addBtnIcon }) => (
        <Table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>F.I.O</th>
                    <th>Fan</th>
                    <th>Telefon</th>
                    <th>Amal</th>
                </tr>
            </thead>
            <tbody>
                {teachersList?.map((teacher, index) => (
                    <React.Fragment key={teacher.id}>
                        <tr
                            className={classNames(cls.teacherRow, { [cls.expanded]: expandedId === teacher.id })}
                            onClick={() => onTeacherClick(teacher)}
                        >
                            <td><span className={cls.index}>{index + 1}</span></td>
                            <td>
                                <div className={cls.teacherInfo}>
                                    <div className={cls.teacherAvatar}>{teacher.name?.charAt(0)}{teacher.surname?.charAt(0)}</div>
                                    <span>{teacher.name} {teacher.surname}</span>
                                </div>
                            </td>
                            <td><span className={cls.subjectBadge}>{teacher.subject?.[0]?.name ?? 'Fan biriktirilmagan'}</span></td>
                            <td>{teacher.phone}</td>
                            <td>
                                <div className={cls.rowActions}>
                                    <button className={cls.addBtn} onClick={(e) => onAddClick(e, teacher)} title="Qo'shish">
                                        <i style={{ color: 'white' }} className={`fas fa-${addBtnIcon ?? 'plus'}`} />
                                        Qo'shish
                                    </button>
                                    <span className={classNames(cls.chevron, { [cls.chevronOpen]: expandedId === teacher.id })}>
                                        <i className="fas fa-chevron-down" />
                                    </span>
                                </div>
                            </td>
                        </tr>

                        {expandedId === teacher.id && (
                            <tr className={cls.accordionRow}>
                                <td colSpan="5">
                                    <div className={cls.accordion}>
                                        <div className={cls.accordion__header}>
                                            <h3><i className="fas fa-history" />Yozuvlar tarixi</h3>
                                            <button className={cls.addScoreBtn} onClick={(e) => onAddClick(e, teacher)}>
                                                <i className="fas fa-plus" />Yangi yozuv
                                            </button>
                                        </div>
                                        {items?.length > 0 ? (
                                            <div className={cls.accordion__grid}>
                                                {items.map((item) => {
                                                    const meta = getStatusMeta(item.status);
                                                    return (
                                                        <div key={item.id} className={cls.scoreCard}>
                                                            <div className={cls.scoreCard__top}>
                                                                <span
                                                                    className={cls.statusBadge}
                                                                    style={{ background: meta.bg, color: meta.color }}
                                                                >
                                                                    <i className={meta.icon} />{meta.label}
                                                                </span>
                                                                <span className={cls.scoreDate}>
                                                                    <i className="fas fa-calendar-alt" />{item.datetime?.slice(0, 10)}
                                                                </span>
                                                            </div>
                                                            {item.comment && <p className={cls.scoreText}>{item.comment}</p>}
                                                            <div className={cls.scoreCard__actions}>
                                                                <button className={cls.editBtn} onClick={(e) => onEditClick(e, item, teacher)}>
                                                                    <i className="fas fa-edit" />Tahrirlash
                                                                </button>
                                                                <button className={cls.deleteBtn} onClick={(e) => { e.stopPropagation(); onDeleteClick(item.id, teacher.id); }}>
                                                                    <i className="fas fa-trash" />O'chirish
                                                                </button>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div className={cls.emptyState}>
                                                <i className="fas fa-inbox" />
                                                <p>{emptyLabel}</p>
                                                <button onClick={(e) => onAddClick(e, teacher)}>{addBtnLabel}</button>
                                            </div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        )}
                    </React.Fragment>
                ))}

                {(!teachersList || teachersList.length === 0) && (
                    <tr><td colSpan="5">
                        <div className={cls.emptyState}><i className="fas fa-search" /><p>O'qituvchilar topilmadi</p></div>
                    </td></tr>
                )}
            </tbody>
        </Table>
    );

    // ── Status radio/select component ──────────────────────────────────────────
    const StatusRadio = ({ value, onChange }) => (
        <div className={cls.statusRadioGroup}>
            {STATUS_OPTIONS.map((opt) => (
                <label
                    key={opt.value}
                    className={classNames(cls.statusRadioLabel, { [cls.statusRadioChecked]: value === opt.value })}
                    style={value === opt.value ? { borderColor: opt.color, background: opt.bg } : {}}
                >
                    <input
                        type="radio"
                        name="status"
                        value={opt.value}
                        checked={value === opt.value}
                        onChange={() => onChange(opt.value)}
                        className={cls.statusRadioInput}
                    />
                    <i className={opt.icon} style={{ color: opt.color }} />
                    <span style={value === opt.value ? { color: opt.color, fontWeight: 700 } : {}}>{opt.label}</span>
                </label>
            ))}
        </div>
    );

    const tabConfig = [
        { key: 'contributions', label: 'Hissa', icon: 'fas fa-star' },
        { key: 'professionalism', label: 'Professionallik', icon: 'fas fa-award' },
        { key: 'conduct', label: 'Xulq', icon: 'fas fa-clipboard-check' },
        { key: 'feedback', label: 'Fikr-mulohaza', icon: 'fas fa-comments' },
        {key: "teamcollab", label: "Jamoa bilan hamkorlik", icon: "fas fa-users"},
    ];

    const headerTitles = {
        contributions: { title: "O'qituvchilarni baholash", subtitle: "Direktorning o'qituvchilarga baho berish tizimi", icon: 'fas fa-star' },
        professionalism: { title: 'Professionallik baholash', subtitle: "O'qituvchilarning professionallik darajasini baholash", icon: 'fas fa-award' },
        conduct: { title: "Xulq-atvor nazorati", subtitle: "O'qituvchi xulq-atvorini kuzatish va baholash", icon: 'fas fa-clipboard-check' },
        feedback: { title: "Fikr-mulohazalar", subtitle: "O'qituvchilar haqida fikr va mulohazalar", icon: 'fas fa-comments' },
        teamcollab: { title: "Jamoa bilan hamkorlik", subtitle: "O'qituvchilarning jamoa bilan hamkorlik darajasini baholash", icon: "fas fa-users" },
    };

    const current = headerTitles[activeTab];

    return (
        <div className={cls.page}>
            {/* Header */}
            <div className={cls.page__header}>
                <div className={cls.page__headerLeft}>
                    <div className={cls.page__headerIcon}>
                        <i className={current.icon} />
                    </div>
                    <div>
                        <h1>{current.title}</h1>
                        <p>{current.subtitle}</p>
                    </div>
                </div>

                <div className={cls.page__headerRight}>
                    <div className={cls.tabSwitch}>
                        {tabConfig.map((tab) => (
                            <button
                                key={tab.key}
                                className={classNames(cls.tabBtn, { [cls.tabBtnActive]: activeTab === tab.key })}
                                onClick={() => setActiveTab(tab.key)}
                            >
                                <i className={tab.icon} />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className={cls.page__headerStats}>
                        <div className={cls.statCard}>
                            <span className={cls.statCard__num}>{teachersList?.length ?? 0}</span>
                            <span className={cls.statCard__label}>O'qituvchilar</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className={cls.page__content}>
                {activeTab === 'contributions' &&
                    renderTeacherTable({
                        expandedId: expandedTeacherId,
                        onTeacherClick: handleTeacherClick,
                        onAddClick: handleAddClick,
                        onEditClick: handleEditClick,
                        onDeleteClick: (itemId, teacherId) => { setDeleteItemId(itemId); setDeleteTeacherId(teacherId); setDeleteModalActive(true); },
                        items: contributions,
                        emptyLabel: "Hozircha baholar yo'q",
                        addBtnLabel: "Birinchi bahoni qo'shing",
                    })}

                {activeTab === 'professionalism' &&
                    renderTeacherTable({
                        expandedId: expandedProfTeacherId,
                        onTeacherClick: handleProfTeacherClick,
                        onAddClick: handleProfAddClick,
                        onEditClick: handleProfEditClick,
                        onDeleteClick: (itemId, teacherId) => { setDeleteProfItemId(itemId); setDeleteProfTeacherId(teacherId); setProfDeleteModalActive(true); },
                        items: professionalisms,
                        emptyLabel: "Hozircha professionallik baholari yo'q",
                        addBtnLabel: "Birinchi bahoni qo'shing",
                    })}

                {activeTab === 'conduct' &&
                    renderStatusTable({
                        expandedId: expandedConductTeacherId,
                        onTeacherClick: handleConductTeacherClick,
                        onAddClick: handleConductAddClick,
                        onEditClick: handleConductEditClick,
                        onDeleteClick: (itemId, teacherId) => { setDeleteConductItemId(itemId); setDeleteConductTeacherId(teacherId); setConductDeleteModalActive(true); },
                        items: conducts,
                        emptyLabel: "Hozircha xulq yozuvlari yo'q",
                        addBtnLabel: "Birinchi yozuvni qo'shing",
                        addBtnIcon: 'clipboard-check',
                    })}

                {activeTab === 'feedback' &&
                    renderStatusTable({
                        expandedId: expandedFeedbackTeacherId,
                        onTeacherClick: handleFeedbackTeacherClick,
                        onAddClick: handleFeedbackAddClick,
                        onEditClick: handleFeedbackEditClick,
                        onDeleteClick: (itemId, teacherId) => { setDeleteFeedbackItemId(itemId); setDeleteFeedbackTeacherId(teacherId); setFeedbackDeleteModalActive(true); },
                        items: feedbacks,
                        emptyLabel: "Hozircha fikr-mulohazalar yo'q",
                        addBtnLabel: "Birinchi fikrni qo'shing",
                        addBtnIcon: 'comments',
                    })}
                {activeTab === 'teamcollab' &&
                    renderStatusTable({
                        expandedId: expandedTeamCollabTeacherId,
                        onTeacherClick: handleTeamCollabTeacherClick,
                        onAddClick: handleTeamCollabAddClick,
                        onEditClick: handleTeamCollabEditClick,
                        onDeleteClick: (itemId, teacherId) => { setDeleteTeamCollabItemId(itemId); setDeleteTeamCollabTeacherId(teacherId); setTeamCollabDeleteModalActive(true); },
                        items: teamCollab,
                        emptyLabel: "Hozircha ma'lumotlar yo'q",
                        addBtnLabel: "Birinchi ma'lumotni qo'shing",
                        addBtnIcon: 'user-group',
                    })}
            </div>

            {/* ── Contributions Modal ── */}
            <Modal active={activeModal} setActive={setActiveModal} type="simple">
                <div className={cls.modal}>
                    <div className={cls.modal__header}>
                        <div className={cls.modal__icon}><i className="fas fa-star" /></div>
                        <h3>{editingId ? 'Bahoni tahrirlash' : "Baho qo'shish"}</h3>
                        <p className={cls.modal__teacher}>{selectedTeacher?.name} {selectedTeacher?.surname}</p>
                    </div>
                    <div className={cls.modal__form}>
                        <div className={cls.modal__field}>
                            <label><i className="fas fa-star" /> Ball (0 – 100)</label>
                            <Input type="number" placeholder="Masalan: 85" value={formData.score} extraClassName={cls.select} onChange={(e) => handleChange('score', e.target.value)} />
                        </div>
                        <Textarea value={formData.text} extraClassName={cls.select} onChange={(val) => handleChange('text', val)} placeholder="Izohlang..." />
                        <div className={cls.modal__field}>
                            <label><i className="fas fa-calendar-alt" /> Sana va vaqt</label>
                            <Input extraClassName={cls.select} type="datetime-local" value={formData.datetime} onChange={(e) => handleChange('datetime', e.target.value)} />
                        </div>
                        <div className={cls.modal__actions}>
                            <Button type="danger" onClick={() => setActiveModal(false)}>Bekor qilish</Button>
                            <Button type="submit" onClick={handleSubmit}>{editingId ? 'Yangilash' : 'Saqlash'}</Button>
                        </div>
                    </div>
                </div>
            </Modal>
            <ConfirmModal type="danger" title="Bahoni o'chirish" text="Ushbu bahoni o'chirishni tasdiqlaysizmi?" active={deleteModalActive} setActive={setDeleteModalActive} onClick={handleDeleteConfirm} />

            {/* ── Professionalism Modal ── */}
            <Modal active={profModalActive} setActive={setProfModalActive} type="simple">
                <div className={cls.modal}>
                    <div className={cls.modal__header}>
                        <div className={classNames(cls.modal__icon, cls.modal__iconProf)}><i className="fas fa-award" /></div>
                        <h3>{editingProfId ? 'Bahoni tahrirlash' : "Professionallik baho qo'shish"}</h3>
                        <p className={cls.modal__teacher}>{selectedProfTeacher?.name} {selectedProfTeacher?.surname}</p>
                    </div>
                    <div className={cls.modal__form}>
                        <div className={cls.modal__field}>
                            <label><i className="fas fa-award" /> Ball (0 – 100)</label>
                            <Input type="number" placeholder="Masalan: 85" value={profFormData.score} extraClassName={cls.select} onChange={(e) => handleProfChange('score', e.target.value)} />
                        </div>
                        <Textarea value={profFormData.text} extraClassName={cls.select} onChange={(val) => handleProfChange('text', val)} placeholder="Izohlang..." />
                        <div className={cls.modal__field}>
                            <label><i className="fas fa-calendar-alt" /> Sana va vaqt</label>
                            <Input extraClassName={cls.select} type="datetime-local" value={profFormData.datetime} onChange={(e) => handleProfChange('datetime', e.target.value)} />
                        </div>
                        <div className={cls.modal__actions}>
                            <Button type="danger" onClick={() => setProfModalActive(false)}>Bekor qilish</Button>
                            <Button type="submit" onClick={handleProfSubmit}>{editingProfId ? 'Yangilash' : 'Saqlash'}</Button>
                        </div>
                    </div>
                </div>
            </Modal>
            <ConfirmModal type="danger" title="Bahoni o'chirish" text="Ushbu professionallik bahosini o'chirishni tasdiqlaysizmi?" active={profDeleteModalActive} setActive={setProfDeleteModalActive} onClick={handleProfDeleteConfirm} />

            {/* ── Conduct Modal ── */}
            <Modal active={conductModalActive} setActive={setConductModalActive} type="simple">
                <div className={cls.modal}>
                    <div className={cls.modal__header}>
                        <div className={classNames(cls.modal__icon, cls.modal__iconConduct)}><i className="fas fa-clipboard-check" /></div>
                        <h3>{editingConductId ? 'Xulqni tahrirlash' : "Xulq yozuvi qo'shish"}</h3>
                        <p className={cls.modal__teacher}>{selectedConductTeacher?.name} {selectedConductTeacher?.surname}</p>
                    </div>
                    <div className={cls.modal__form}>
                        <div className={cls.modal__field}>
                            <label><i className="fas fa-signal" /> Holat</label>
                            <StatusRadio value={conductFormData.status} onChange={(v) => handleConductChange('status', v)} />
                        </div>
                        <div className={cls.modal__field}>
                            <label><i className="fas fa-calendar-alt" /> Sana va vaqt</label>
                            <Input extraClassName={cls.select} type="datetime-local" value={conductFormData.datetime} onChange={(e) => handleConductChange('datetime', e.target.value)} />
                        </div>
                        <Textarea value={conductFormData.comment} extraClassName={cls.select} onChange={(val) => handleConductChange('comment', val)} placeholder="Izoh..." />
                        <div className={cls.modal__actions}>
                            <Button type="danger" onClick={() => setConductModalActive(false)}>Bekor qilish</Button>
                            <Button type="submit" onClick={handleConductSubmit}>{editingConductId ? 'Yangilash' : 'Saqlash'}</Button>
                        </div>
                    </div>
                </div>
            </Modal>
            <ConfirmModal type="danger" title="Xulq yozuvini o'chirish" text="Ushbu xulq yozuvini o'chirishni tasdiqlaysizmi?" active={conductDeleteModalActive} setActive={setConductDeleteModalActive} onClick={handleConductDeleteConfirm} />

            {/* ── Feedback Modal ── */}
            <Modal active={feedbackModalActive} setActive={setFeedbackModalActive} type="simple">
                <div className={cls.modal}>
                    <div className={cls.modal__header}>
                        <div className={classNames(cls.modal__icon, cls.modal__iconFeedback)}><i className="fas fa-comments" /></div>
                        <h3>{editingFeedbackId ? 'Fikrni tahrirlash' : "Fikr-mulohaza qo'shish"}</h3>
                        <p className={cls.modal__teacher}>{selectedFeedbackTeacher?.name} {selectedFeedbackTeacher?.surname}</p>
                    </div>
                    <div className={cls.modal__form}>
                        <div className={cls.modal__field}>
                            <label><i className="fas fa-signal" /> Holat</label>
                            <StatusRadio value={feedbackFormData.status} onChange={(v) => handleFeedbackChange('status', v)} />
                        </div>
                        <div className={cls.modal__field}>
                            <label><i className="fas fa-calendar-alt" /> Sana va vaqt</label>
                            <Input extraClassName={cls.select} type="datetime-local" value={feedbackFormData.datetime} onChange={(e) => handleFeedbackChange('datetime', e.target.value)} />
                        </div>
                        <Textarea value={feedbackFormData.comment} extraClassName={cls.select} onChange={(val) => handleFeedbackChange('comment', val)} placeholder="Fikringizni yozing..." />
                        <div className={cls.modal__actions}>
                            <Button type="danger" onClick={() => setFeedbackModalActive(false)}>Bekor qilish</Button>
                            <Button type="submit" onClick={handleFeedbackSubmit}>{editingFeedbackId ? 'Yangilash' : 'Saqlash'}</Button>
                        </div>
                    </div>
                </div>
            </Modal>
            <ConfirmModal type="danger" title="Fikrni o'chirish" text="Ushbu fikr-mulohazani o'chirishni tasdiqlaysizmi?" active={feedbackDeleteModalActive} setActive={setFeedbackDeleteModalActive} onClick={handleFeedbackDeleteConfirm} />


            <Modal active={teamCollabModalActive} setActive={setTeamCollabModalActive} type="simple">
                <div className={cls.modal}>
                    <div className={cls.modal__header}>
                        <div className={classNames(cls.modal__icon, cls.modal__iconFeedback)}><i className="fas fa-comments" /></div>
                        <h3>{editingFeedbackId ? "Ma'lumotni tahrirlash" : "Ma'lumot qo'shish"}</h3>
                        <p className={cls.modal__teacher}>{selectedTeamCollabTeacher?.name} {selectedTeamCollabTeacher?.surname}</p>
                    </div>
                    <div className={cls.modal__form}>
                        <div className={cls.modal__field}>
                            <label><i className="fas fa-signal" /> Holat</label>
                            <StatusRadio value={teamCollabFormData.status} onChange={(v) => handleTeamCollabChange('status', v)} />
                        </div>
                        <div className={cls.modal__field}>
                            <label><i className="fas fa-calendar-alt" /> Sana va vaqt</label>
                            <Input extraClassName={cls.select} type="datetime-local" value={teamCollabFormData.datetime} onChange={(e) => handleTeamCollabChange('datetime', e.target.value)} />
                        </div>
                        <Textarea value={teamCollabFormData.comment} extraClassName={cls.select} onChange={(val) => handleTeamCollabChange('comment', val)} placeholder="Fikringizni yozing..." />
                        <div className={cls.modal__actions}>
                            <Button type="danger" onClick={() => setTeamCollabModalActive(false)}>Bekor qilish</Button>
                            <Button type="submit" onClick={handleTeamCollabSubmit}>{editingFeedbackId ? 'Yangilash' : 'Saqlash'}</Button>
                        </div>
                    </div>
                </div>
            </Modal>
            <ConfirmModal type="danger" title="Ma'lumotni o'chirish" text="Ushbu ma'lumotni o'chirishni tasdiqlaysizmi?" active={teamCollabDeleteModalActive} setActive={setTeamCollabDeleteModalActive} onClick={handleTeamCollabDeleteConfirm} />
        </div>
    );
};
