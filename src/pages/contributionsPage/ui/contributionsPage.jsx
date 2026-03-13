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


    const [contributions, setContributions] = useState([]);
    const [expandedTeacherId, setExpandedTeacherId] = useState(null);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [activeModal, setActiveModal] = useState(false);
    const [deleteModalActive, setDeleteModalActive] = useState(false);
    const [deleteItemId, setDeleteItemId] = useState(null);
    const [deleteTeacherId, setDeleteTeacherId] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ score: '', text: '', datetime: '' });


    const [professionalisms, setProfessionalisms] = useState([]);
    const [expandedProfTeacherId, setExpandedProfTeacherId] = useState(null);
    const [selectedProfTeacher, setSelectedProfTeacher] = useState(null);
    const [profModalActive, setProfModalActive] = useState(false);
    const [profDeleteModalActive, setProfDeleteModalActive] = useState(false);
    const [deleteProfItemId, setDeleteProfItemId] = useState(null);
    const [deleteProfTeacherId, setDeleteProfTeacherId] = useState(null);
    const [editingProfId, setEditingProfId] = useState(null);
    const [profFormData, setProfFormData] = useState({ score: '', text: '', datetime: '' });

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


    const resetForm = useCallback(() => {
        setFormData({ score: '', text: '', datetime: nowIso() });
        setEditingId(null);
    }, []);

    const fetchContributions = useCallback(
        (teacherId) => {
            request(
                `${API_URL}Teachers/teacher-contributions/?teacher=${teacherId}`,
                'GET',
                null,
                headers()
            )
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
        setFormData({
            score: item.score ?? '',
            text: item.text ?? '',
            datetime: item.datetime ? item.datetime.slice(0, 16) : '',
        });
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
        const payload = {
            teacher: selectedTeacher.id,
            score: Number(formData.score),
            text: formData.text,
            datetime: formData.datetime,
            user: userId,
        };
        const method = editingId ? 'PATCH' : 'POST';
        const url = editingId
            ? `${API_URL}Teachers/teacher-contributions/${editingId}/`
            : `${API_URL}Teachers/teacher-contributions/`;

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

    const resetProfForm = useCallback(() => {
        setProfFormData({ score: '', text: '', datetime: nowIso() });
        setEditingProfId(null);
    }, []);

    const fetchProfessionalisms = useCallback(
        (teacherId) => {
            request(
                `${API_URL}Teachers/teacher-professionalism/?teacher=${teacherId}`,
                'GET',
                null,
                headers()
            )
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
        setProfFormData({
            score: item.score ?? '',
            text: item.text ?? '',
            datetime: item.datetime ? item.datetime.slice(0, 16) : '',
        });
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
        const payload = {
            teacher: selectedProfTeacher.id,
            score: Number(profFormData.score),
            text: profFormData.text,
            datetime: profFormData.datetime,
            user: userId,
        };
        const method = editingProfId ? 'PATCH' : 'POST';
        const url = editingProfId
            ? `${API_URL}Teachers/teacher-professionalism/${editingProfId}/`
            : `${API_URL}Teachers/teacher-professionalism/`;

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


    const renderTeacherTable = ({
        expandedId,
        onTeacherClick,
        onAddClick,
        onEditClick,
        onDeleteClick,
        items,
        emptyLabel,
        addBtnLabel,
    }) => (
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
                            className={classNames(cls.teacherRow, {
                                [cls.expanded]: expandedId === teacher.id,
                            })}
                            onClick={() => onTeacherClick(teacher)}
                        >
                            <td>
                                <span className={cls.index}>{index + 1}</span>
                            </td>
                            <td>
                                <div className={cls.teacherInfo}>
                                    <div className={cls.teacherAvatar}>
                                        {teacher.name?.charAt(0)}
                                        {teacher.surname?.charAt(0)}
                                    </div>
                                    <span>
                                        {teacher.name} {teacher.surname}
                                    </span>
                                </div>
                            </td>
                            <td>
                                <span className={cls.subjectBadge}>
                                    {teacher.subject?.[0]?.name ?? 'Fan biriktirilmagan'}
                                </span>
                            </td>
                            <td>{teacher.phone}</td>
                            <td>
                                <div className={cls.rowActions}>
                                    <button
                                        className={cls.addBtn}
                                        onClick={(e) => onAddClick(e, teacher)}
                                        title="Baho qo'shish"
                                    >
                                        <i style={{ color: 'white' }} className="fas fa-plus" />
                                        Baho qo'shish
                                    </button>
                                    <span
                                        className={classNames(cls.chevron, {
                                            [cls.chevronOpen]: expandedId === teacher.id,
                                        })}
                                    >
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
                                            <h3>
                                                <i className="fas fa-history" />
                                                Baho tarixi
                                            </h3>
                                            <button
                                                className={cls.addScoreBtn}
                                                onClick={(e) => onAddClick(e, teacher)}
                                            >
                                                <i className="fas fa-plus" />
                                                Yangi baho
                                            </button>
                                        </div>

                                        {items?.length > 0 ? (
                                            <div className={cls.accordion__grid}>
                                                {items.map((item) => (
                                                    <div key={item.id} className={cls.scoreCard}>
                                                        <div className={cls.scoreCard__top}>
                                                            <div
                                                                className={classNames(
                                                                    cls.scoreBadge,
                                                                    cls[getScoreColor(item.score)]
                                                                )}
                                                            >
                                                                <i className="fas fa-star" />
                                                                {item.score}
                                                            </div>
                                                            <span className={cls.scoreDate}>
                                                                <i className="fas fa-calendar-alt" />
                                                                {item.datetime?.slice(0, 10)}
                                                            </span>
                                                        </div>

                                                        {item.text && (
                                                            <p className={cls.scoreText}>{item.text}</p>
                                                        )}

                                                        <div className={cls.scoreCard__actions}>
                                                            <button
                                                                className={cls.editBtn}
                                                                onClick={(e) => onEditClick(e, item, teacher)}
                                                            >
                                                                <i className="fas fa-edit" />
                                                                Tahrirlash
                                                            </button>
                                                            <button
                                                                className={cls.deleteBtn}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    onDeleteClick(item.id, teacher.id);
                                                                }}
                                                            >
                                                                <i className="fas fa-trash" />
                                                                O'chirish
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className={cls.emptyState}>
                                                <i className="fas fa-inbox" />
                                                <p>{emptyLabel}</p>
                                                <button onClick={(e) => onAddClick(e, teacher)}>
                                                    {addBtnLabel}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        )}
                    </React.Fragment>
                ))}

                {(!teachersList || teachersList.length === 0) && (
                    <tr>
                        <td colSpan="5">
                            <div className={cls.emptyState}>
                                <i className="fas fa-search" />
                                <p>O'qituvchilar topilmadi</p>
                            </div>
                        </td>
                    </tr>
                )}
            </tbody>
        </Table>
    );

    return (
        <div className={cls.page}>
            {/* Header */}
            <div className={cls.page__header}>
                <div className={cls.page__headerLeft}>
                    <div className={cls.page__headerIcon}>
                        <i className={activeTab === 'contributions' ? 'fas fa-star' : 'fas fa-award'} />
                    </div>
                    <div>
                        <h1>
                            {activeTab === 'contributions'
                                ? "O'qituvchilarni baholash"
                                : "Professionallik baholash"}
                        </h1>
                        <p>
                            {activeTab === 'contributions'
                                ? "Direktorning o'qituvchilarga baho berish tizimi"
                                : "O'qituvchilarning professionallik darajasini baholash"}
                        </p>
                    </div>
                </div>

                <div className={cls.page__headerRight}>

                    <div className={cls.tabSwitch}>
                        <button
                            className={classNames(cls.tabBtn, {
                                [cls.tabBtnActive]: activeTab === 'contributions',
                            })}
                            onClick={() => setActiveTab('contributions')}
                        >
                            <i className="fas fa-star" />
                            Hissa
                        </button>
                        <button
                            className={classNames(cls.tabBtn, {
                                [cls.tabBtnActive]: activeTab === 'professionalism',
                            })}
                            onClick={() => setActiveTab('professionalism')}
                        >
                            <i className="fas fa-award" />
                            Professionallik
                        </button>
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
                {activeTab === 'contributions'
                    ? renderTeacherTable({
                          expandedId: expandedTeacherId,
                          onTeacherClick: handleTeacherClick,
                          onAddClick: handleAddClick,
                          onEditClick: handleEditClick,
                          onDeleteClick: (itemId, teacherId) => {
                              setDeleteItemId(itemId);
                              setDeleteTeacherId(teacherId);
                              setDeleteModalActive(true);
                          },
                          items: contributions,
                          emptyLabel: "Hozircha baholar yo'q",
                          addBtnLabel: "Birinchi bahoni qo'shing",
                      })
                    : renderTeacherTable({
                          expandedId: expandedProfTeacherId,
                          onTeacherClick: handleProfTeacherClick,
                          onAddClick: handleProfAddClick,
                          onEditClick: handleProfEditClick,
                          onDeleteClick: (itemId, teacherId) => {
                              setDeleteProfItemId(itemId);
                              setDeleteProfTeacherId(teacherId);
                              setProfDeleteModalActive(true);
                          },
                          items: professionalisms,
                          emptyLabel: "Hozircha professionallik baholari yo'q",
                          addBtnLabel: "Birinchi bahoni qo'shing",
                      })}
            </div>

            <Modal active={activeModal} setActive={setActiveModal} type="simple">
                <div className={cls.modal}>
                    <div className={cls.modal__header}>
                        <div className={cls.modal__icon}>
                            <i className="fas fa-star" />
                        </div>
                        <h3>{editingId ? 'Bahoni tahrirlash' : "Baho qo'shish"}</h3>
                        <p className={cls.modal__teacher}>
                            {selectedTeacher?.name} {selectedTeacher?.surname}
                        </p>
                    </div>

                    <div className={cls.modal__form}>
                        <div className={cls.modal__field}>
                            <label>
                                <i className="fas fa-star" /> Ball (0 – 100)
                            </label>
                            <Input
                                type="number"
                                placeholder="Masalan: 85"
                                value={formData.score}
                                extraClassName={cls.select}
                                onChange={(e) => handleChange('score', e.target.value)}
                            />
                        </div>

                        <Textarea
                            value={formData.text}
                            extraClassName={cls.select}
                            onChange={(val) => handleChange('text', val)}
                            placeholder="Izohlang..."
                        />

                        <div className={cls.modal__field}>
                            <label>
                                <i className="fas fa-calendar-alt" /> Sana va vaqt
                            </label>
                            <Input
                                extraClassName={cls.select}
                                type="datetime-local"
                                value={formData.datetime}
                                onChange={(e) => handleChange('datetime', e.target.value)}
                            />
                        </div>

                        <div className={cls.modal__actions}>
                            <Button type="danger" onClick={() => setActiveModal(false)}>
                                Bekor qilish
                            </Button>
                            <Button type="submit" onClick={handleSubmit}>
                                {editingId ? 'Yangilash' : 'Saqlash'}
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>

            <ConfirmModal
                type="danger"
                title="Bahoni o'chirish"
                text="Ushbu bahoni o'chirishni tasdiqlaysizmi?"
                active={deleteModalActive}
                setActive={setDeleteModalActive}
                onClick={handleDeleteConfirm}
            />

            <Modal active={profModalActive} setActive={setProfModalActive} type="simple">
                <div className={cls.modal}>
                    <div className={cls.modal__header}>
                        <div className={classNames(cls.modal__icon, cls.modal__iconProf)}>
                            <i className="fas fa-award" />
                        </div>
                        <h3>{editingProfId ? 'Bahoni tahrirlash' : "Professionallik baho qo'shish"}</h3>
                        <p className={cls.modal__teacher}>
                            {selectedProfTeacher?.name} {selectedProfTeacher?.surname}
                        </p>
                    </div>

                    <div className={cls.modal__form}>
                        <div className={cls.modal__field}>
                            <label>
                                <i className="fas fa-award" /> Ball (0 – 100)
                            </label>
                            <Input
                                type="number"
                                placeholder="Masalan: 85"
                                value={profFormData.score}
                                extraClassName={cls.select}
                                onChange={(e) => handleProfChange('score', e.target.value)}
                            />
                        </div>

                        <Textarea
                            value={profFormData.text}
                            extraClassName={cls.select}
                            onChange={(val) => handleProfChange('text', val)}
                            placeholder="Izohlang..."
                        />

                        <div className={cls.modal__field}>
                            <label>
                                <i className="fas fa-calendar-alt" /> Sana va vaqt
                            </label>
                            <Input
                                extraClassName={cls.select}
                                type="datetime-local"
                                value={profFormData.datetime}
                                onChange={(e) => handleProfChange('datetime', e.target.value)}
                            />
                        </div>

                        <div className={cls.modal__actions}>
                            <Button type="danger" onClick={() => setProfModalActive(false)}>
                                Bekor qilish
                            </Button>
                            <Button type="submit" onClick={handleProfSubmit}>
                                {editingProfId ? 'Yangilash' : 'Saqlash'}
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>

            <ConfirmModal
                type="danger"
                title="Bahoni o'chirish"
                text="Ushbu professionallik bahosini o'chirishni tasdiqlaysizmi?"
                active={profDeleteModalActive}
                setActive={setProfDeleteModalActive}
                onClick={handleProfDeleteConfirm}
            />
        </div>
    );
};
