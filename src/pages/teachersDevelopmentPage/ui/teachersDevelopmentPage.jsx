import React from 'react';
import classNames from 'classnames';
import { Modal } from 'shared/ui/modal';
import { Input } from 'shared/ui/input';
import { Textarea } from 'shared/ui/textArea';
import { Button } from 'shared/ui/button';
import { ConfirmModal } from 'shared/ui/confirmModal/index.js';
import { useTeacherPD } from 'features/teacherPD';
import cls from './teachersDevelopmentPage.module.sass';


const fmt = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('uz-UZ', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
};

const avatarLetters = (name, surname) =>
    `${name?.charAt(0) ?? ''}${surname?.charAt(0) ?? ''}`.toUpperCase();


export const TeachersDevelopmentPage = () => {
    const {
        pdList, loading, teachersList, formData, editingId,
        selectedPD, modalActive, setModalActive,
        deleteModalActive, setDeleteModalActive,
        drawerOpen, showAllParticipants, setShowAllParticipants,
        attendanceMap, handleStatusToggle,
        openAddModal, openEditModal, openDeleteModal,
        handleDeleteConfirm, handleChange, handleParticipantToggle, handleParticipantRemove,
        handleSubmit, openDetailDrawer, closeDetailDrawer,
    } = useTeacherPD();

    const speakerObj = (id) => teachersList?.find((t) => t.id === Number(id));


    const participantCandidates = teachersList?.filter(
        (t) => t.id !== Number(formData.speaker)
    ) ?? [];

    return (
        <div className={cls.page}>
            {/* ── Header ── */}
            <div className={cls.page__header}>
                <div className={cls.page__headerLeft}>
                    <div className={cls.page__headerIcon}>
                        <i className="fas fa-chalkboard-teacher" />
                    </div>
                    <div>
                        <h1>Teacher Professional Development</h1>
                        <p>Malaka oshirish mashg'ulotlari rejasi va tarixi</p>
                    </div>
                </div>
                <div className={cls.page__headerRight}>
                    <div className={cls.statCard}>
                        <span className={cls.statCard__num}>{pdList?.length ?? 0}</span>
                        <span className={cls.statCard__label}>Jami ma'ruzalar</span>
                    </div>
                    <button className={cls.addBtn} onClick={openAddModal}>
                        <i className="fas fa-plus" />
                        Yangi ma'ruza
                    </button>
                </div>
            </div>

            {/* ── Content ── */}
            <div className={cls.page__content}>
                {loading ? (
                    <div className={cls.spinner}>
                        <i className="fas fa-circle-notch fa-spin" />
                    </div>
                ) : pdList?.length ? (
                    <div className={cls.grid}>
                        {pdList.map((pd) => {
                            const sp = speakerObj(pd.speaker);
                            return (
                                <div
                                    key={pd.id}
                                    className={cls.card}
                                    onClick={() => openDetailDrawer(pd)}
                                >
                                    <div className={cls.card__top}>
                                        <div className={cls.card__icon}>
                                            <i className="fas fa-book-open" />
                                        </div>
                                        <div className={cls.card__actions}>
                                            <button
                                                className={cls.editBtn}
                                                onClick={(e) => { e.stopPropagation(); openEditModal(pd); }}
                                                title="Tahrirlash"
                                            >
                                                <i className="fas fa-edit" />
                                            </button>
                                            <button
                                                className={cls.deleteBtn}
                                                onClick={(e) => { e.stopPropagation(); openDeleteModal(pd.id); }}
                                                title="O'chirish"
                                            >
                                                <i className="fas fa-trash" />
                                            </button>
                                        </div>
                                    </div>

                                    <h3 className={cls.card__title}>{pd.title}</h3>

                                    {pd.description && (
                                        <p className={cls.card__desc}>{pd.description}</p>
                                    )}

                                    <div className={cls.card__meta}>
                                        <span className={cls.card__metaItem}>
                                            <i className="fas fa-calendar-alt" />
                                            {fmt(pd.datetime)}
                                        </span>
                                        <span className={cls.card__metaItem}>
                                            <i className="fas fa-microphone" />
                                            {sp ? `${pd.speaker_name
                                                } ${pd.speaker_surname
                                                }` : `Speaker #${pd.speaker}`}
                                        </span>
                                        <span className={cls.card__metaItem}>
                                            <i className="fas fa-users" />
                                            {pd.participants?.length ?? 0} ishtirokchi
                                        </span>
                                    </div>

                                    {pd.participants?.length > 0 && (
                                        <div className={cls.card__avatars}>
                                            {pd.participants.slice(0, 5).map((pid) => {

                                                return (
                                                    <div key={pid} className={cls.avatar} title={`${pid.name} ${pid.surname}`}>
                                                        {avatarLetters(pid.name, pid.surname)}
                                                    </div>
                                                );
                                            })}
                                            {pd.participants.length > 5 && (
                                                <div className={classNames(cls.avatar, cls.avatarMore)}>
                                                    +{pd.participants.length - 5}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className={cls.empty}>
                        <i className="fas fa-inbox" />
                        <p>Hozircha ma'ruzalar yo'q</p>
                        <button onClick={openAddModal}>Birinchi ma'ruzani qo'shing</button>
                    </div>
                )}
            </div>

            {/* ── Detail Drawer ── */}
            {drawerOpen && selectedPD && (
                <div className={cls.overlay} onClick={closeDetailDrawer}>
                    <div className={cls.drawer} onClick={(e) => e.stopPropagation()}>
                        <div className={cls.drawer__header}>
                            <div className={cls.drawer__icon}>
                                <i className="fas fa-book-open" />
                            </div>
                            <div>
                                <h2>{selectedPD.title}</h2>
                                <span>{fmt(selectedPD.datetime)}</span>
                            </div>
                            <button className={cls.drawer__close} onClick={closeDetailDrawer}>
                                <i className="fas fa-times" />
                            </button>
                        </div>

                        {selectedPD.description && (
                            <p className={cls.drawer__desc}>{selectedPD.description}</p>
                        )}

                        <div className={cls.drawer__section}>
                            <h4><i className="fas fa-microphone" /> Spiker</h4>
                            {(() => {
                                const sp = speakerObj(selectedPD.speaker);
                                return sp ? (
                                    <div className={cls.drawer__teacher}>
                                        <div className={cls.avatar}>{avatarLetters(sp.name, sp.surname)}</div>
                                        <div>
                                            <strong>{sp.name} {sp.surname}</strong>
                                            <span>{sp.subject?.[0]?.name ?? ''}</span>
                                        </div>
                                    </div>
                                ) : <span>Speaker #{selectedPD.speaker}</span>;
                            })()}
                        </div>

                        <div className={cls.drawer__section}>
                            <h4>
                                <i className="fas fa-users" />
                                Ishtirokchilar ({selectedPD.participants?.length ?? 0})
                                {selectedPD.participants?.length > 0 && (() => {
                                    const attendCount = selectedPD.participants.filter(
                                        (p) => (attendanceMap[p.id] !== undefined ? attendanceMap[p.id] : (p.status ?? 'pending')) === 'attended'
                                    ).length;
                                    const absentCount = selectedPD.participants.filter(
                                        (p) => (attendanceMap[p.id] !== undefined ? attendanceMap[p.id] : (p.status ?? 'pending')) === 'absent'
                                    ).length;
                                    return (
                                        <span className={cls.attendanceSummary}>
                                            <span className={cls.attendanceCame}>{attendCount} Kelganlar</span>
                                            <span className={cls.attendanceAbsent}>{absentCount} Kelmaganlar</span>
                                        </span>
                                    );
                                })()}
                            </h4>
                            <div className={cls.drawer__participants}>
                                {selectedPD.participants?.map((pid) => {
                                    const status = attendanceMap[pid.id] !== undefined
                                        ? attendanceMap[pid.id]
                                        : (pid.status ?? 'pending');
                                    const isAttended = status === 'attended';
                                    const isAbsent = status === 'absent';
                                    return (
                                        <div key={pid.id} className={classNames(cls.drawer__teacher, cls.drawer__teacherAttend, { [cls.drawer__teacherCame]: isAttended, [cls.drawer__teacherAbsent]: isAbsent })}>
                                            <div className={cls.avatar}>
                                                {avatarLetters(pid.name, pid.surname)}
                                            </div>
                                            <div>
                                                <strong>{`${pid.name} ${pid.surname}`}</strong>
                                                <span>{pid.subject?.[0]?.name ?? ''}</span>
                                            </div>
                                            <button
                                                type="button"
                                                className={classNames(
                                                    cls.attendanceBtn,
                                                    { [cls.attendanceBtnCame]: isAttended, [cls.attendanceBtnAbsent]: isAbsent, [cls.attendanceBtnPending]: !isAttended && !isAbsent }
                                                )}
                                                title={isAttended ? 'Kelmadi deb  belgilash' : 'Keldi deb belgilash'}
                                                onClick={() => handleStatusToggle(pid.id, status)}
                                            >
                                                <i className={`fas fa-${isAttended ? 'check' : isAbsent ? 'times' : 'clock'}`} />
                                                <span>{isAttended ? 'Keldi' : isAbsent ? 'Kelmadi' : 'Kutilmoqda'}</span>
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className={cls.drawer__footer}>
                            <button className={cls.editBtn2} onClick={() => { closeDetailDrawer(); openEditModal(selectedPD); }}>
                                <i className="fas fa-edit" /> Tahrirlash
                            </button>
                            <button className={cls.deleteBtn2} onClick={() => { closeDetailDrawer(); openDeleteModal(selectedPD.id); }}>
                                <i className="fas fa-trash" /> O'chirish
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Create / Edit Modal ── */}
            <Modal active={modalActive} setActive={setModalActive} type="simple">
                <div className={cls.modal}>
                    <div className={cls.modal__header}>
                        <div className={cls.modal__icon}>
                            <i className="fas fa-chalkboard-teacher" />
                        </div>
                        <h3>{editingId ? "Ma'ruzani  tahrirlash" : "Yangi ma'ruza qo'shish"}</h3>
                    </div>

                    <div className={cls.modal__form}>
                        {/* Title */}
                        <div className={cls.modal__field}>
                            <label className={cls.modal__field__label}><i className="fas fa-heading" /> Mavzu *</label>
                            <Input
                                placeholder="Ma'ruza mavzusi"
                                value={formData.title}
                                extraClassName={cls.select}
                                onChange={(e) => handleChange('title', e.target.value)}
                            />
                        </div>

                        {/* Speaker */}
                        <div className={cls.modal__field}>
                            <label className={cls.modal__field__label}><i className="fas fa-microphone" /> Spiker (O'qituvchi) *</label>
                            <select
                                className={cls.nativeSelect}
                                value={formData.speaker}
                                onChange={(e) => handleChange('speaker', e.target.value)}
                            >
                                <option value="">— tanlang —</option>
                                {teachersList?.map((t) => (
                                    <option key={t.id} value={t.id}>
                                        {t.name} {t.surname}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Datetime */}
                        <div className={cls.modal__field}>
                            <label className={cls.modal__field__label}><i className="fas fa-calendar-alt" /> Sana va vaqt *</label>
                            <Input
                                type="datetime-local"
                                extraClassName={cls.select}
                                value={formData.datetime}
                                onChange={(e) => handleChange('datetime', e.target.value)}
                            />
                        </div>

                        {/* Description */}
                        <div className={cls.modal__field}>
                            <label className={cls.modal__field__label}><i className="fas fa-align-left" /> Tavsif</label>
                            <Textarea
                                value={formData.description}
                                extraClassName={cls.select}
                                onChange={(val) => handleChange('description', val)}
                                placeholder="Ma'ruza haqida qisqacha..."
                            />
                        </div>

                        <div className={cls.modal__field}>
                            <label className={cls.modal__field__label}><i className="fas fa-users" /> Ishtirokchilar</label>

                            {editingId ? (
                                <div className={cls.participantEditSection}>
                                    {/* Joined participants */}
                                    {formData.participants.length > 0 ? (
                                        <div className={cls.participantList}>
                                            {formData.participants.map((pid) => {
                                                return (
                                                    <div key={pid.id ?? pid} className={cls.participantJoined}>
                                                        <div className={classNames(cls.avatar, cls.avatarSm)}>
                                                            {avatarLetters(pid.name, pid.surname)}
                                                        </div>
                                                        <span>{`${pid.name} ${pid.surname}`}</span>
                                                        <button
                                                            type="button"
                                                            className={cls.participantRemoveBtn}
                                                            title="O'chirish"
                                                            onClick={() => handleParticipantRemove(pid.id, formData.participants)}
                                                        >
                                                            <i className="fas fa-times" />
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <p className={cls.noTeachers}>Hali ishtirokchi qo&apos;shilmagan</p>
                                    )}

                                    {/* Add more toggle */}
                                    <button
                                        type="button"
                                        className={cls.addMoreBtn}
                                        onClick={() => setShowAllParticipants((v) => !v)}
                                    >
                                        <i className={`fas fa-${showAllParticipants ? 'chevron-up' : 'plus'}`} />
                                        {showAllParticipants ? 'Yopish' : "Ko'proq qo'shish"}
                                    </button>

                                    {/* Non-joined teachers */}
                                    {showAllParticipants && (() => {
                                        const nonJoined = participantCandidates.filter(
                                            (t) => !formData.participants.some((p) =>
                                                (typeof p === 'object' ? p.id : p) === t.id
                                            )
                                        );
                                        return nonJoined.length > 0 ? (
                                            <div className={cls.participantList}>
                                                {nonJoined.map((t) => (
                                                    <label
                                                        key={t.id}
                                                        className={cls.participantItem}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={false}
                                                            onChange={() => handleParticipantToggle(t)}
                                                        />
                                                        <div className={classNames(cls.avatar, cls.avatarSm)}>
                                                            {avatarLetters(t.name, t.surname)}
                                                        </div>
                                                        <span>{t.name} {t.surname}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className={cls.noTeachers}>Barcha o&apos;qituvchilar qo&apos;shilgan</p>
                                        );
                                    })()}
                                </div>
                            ) : (
                                /* ── ADD MODE: all teachers as checkboxes ── */
                                <div className={cls.participantList}>
                                    {participantCandidates.map((t) => {
                                        const checked = formData.participants.some((p) =>
                                            (typeof p === 'object' ? p.id : p) === t.id
                                        );
                                        return (
                                            <label
                                                key={t.id}
                                                className={classNames(cls.participantItem, { [cls.participantItemChecked]: checked })}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={checked}
                                                    onChange={() => handleParticipantToggle(t.id)}
                                                />
                                                <div className={classNames(cls.avatar, cls.avatarSm)}>
                                                    {avatarLetters(t.name, t.surname)}
                                                </div>
                                                <span>{t.name} {t.surname}</span>
                                            </label>
                                        );
                                    })}
                                    {participantCandidates.length === 0 && (
                                        <p className={cls.noTeachers}>
                                            {formData.speaker ? "Boshqa o'qituvchi yo'q" : "Avval spikerni tanlang"}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className={cls.modal__actions}>
                            <Button type="danger" onClick={() => setModalActive(false)}>
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
                title="PD sessiyani o'chirish"
                text="Ushbu sessiyani o'chirishni tasdiqlaysizmi?"
                active={deleteModalActive}
                setActive={setDeleteModalActive}
                onClick={handleDeleteConfirm}
            />
        </div>
    );
};
