import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { API_URL, headers, useHttp } from 'shared/api/base';
import { onAddAlertOptions } from 'features/alert/model/slice/alertSlice';
import { fetchTeacherPDList, getTeacherPDList, getTeacherPDLoading } from 'entities/teacherPD';
import { fetchTeachersData, getTeachers } from 'entities/teachers';
import { getCurrentBranch } from 'entities/oftenUsed/model/oftenUsedSelector.js';

const EMPTY_FORM = {
    title: '',
    speaker: '',
    datetime: '',
    description: '',
    participants: [],
};

const nowIso = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
};

export const useTeacherPD = () => {
    const dispatch = useDispatch();
    const { request } = useHttp();

    const currentBranch = useSelector(getCurrentBranch);
    const ROLE = localStorage.getItem('job');
    const userBranchId = localStorage.getItem('branchId');
    const branchForFilter = ROLE === 'director' ? currentBranch : userBranchId;
    const userId = localStorage.getItem('user_id');

    const pdList = useSelector(getTeacherPDList);
    const loading = useSelector(getTeacherPDLoading);
    const teachersList = useSelector(getTeachers);

    // Modal state
    const [modalActive, setModalActive] = useState(false);
    const [deleteModalActive, setDeleteModalActive] = useState(false);
    const [deleteItemId, setDeleteItemId] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ ...EMPTY_FORM, datetime: nowIso() });
    const [showAllParticipants, setShowAllParticipants] = useState(false);

    // Detail drawer state
    const [selectedPD, setSelectedPD] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);

    useEffect(() => {
        if (branchForFilter) {
            dispatch(fetchTeachersData({ userBranchId: branchForFilter }));
        }
    }, [branchForFilter]);

    const refreshList = useCallback(() => {
        dispatch(fetchTeacherPDList({branch: branchForFilter}));
    }, [branchForFilter]);

    useEffect(() => {
        if  (branchForFilter) {
            refreshList();
        }
    }, [branchForFilter]);

    const resetForm = useCallback(() => {
        setFormData({ ...EMPTY_FORM, datetime: nowIso() });
        setEditingId(null);
        setShowAllParticipants(false);
    }, []);

    const openAddModal = useCallback(() => {
        resetForm();
        setModalActive(true);
    }, [resetForm]);

    const openEditModal = useCallback((pd) => {
        setEditingId(pd.id);
        setFormData({
            title: pd.title ?? '',
            speaker: pd.speaker ?? '',
            datetime: pd.datetime ? pd.datetime.slice(0, 16) : nowIso(),
            description: pd.description ?? '',
            participants: pd.participants ?? [],
        });
        setShowAllParticipants(false);
        setModalActive(true);
    }, []);

    const handleChange = useCallback((key, value) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    }, []);

    const handleParticipantToggle = useCallback((teacher) => {
        // teacher can be a full object {id, name, ...} or just a numeric id when removing
        const teacherId = typeof teacher === 'object' ? teacher.id : teacher;
        setFormData((prev) => {
            const already = prev.participants.some((p) =>
                (typeof p === 'object' ? p.id : p) === teacherId
            );
            return {
                ...prev,
                participants: already
                    ? prev.participants.filter((p) => (typeof p === 'object' ? p.id : p) !== teacherId)
                    : [...prev.participants, teacher],
            };
        });
    }, []);

    // Remove a joined participant and immediately save to API
    const handleParticipantRemove = useCallback(
        (teacherId, currentParticipants) => {
            const updatedParticipants = currentParticipants
                .filter((p) => (typeof p === 'object' ? p.id : p) !== teacherId)
                .map((p) => (typeof p === 'object' ? p.id : p));

            // Update local form state
            setFormData((prev) => ({
                ...prev,
                participants: prev.participants.filter(
                    (p) => (typeof p === 'object' ? p.id : p) !== teacherId
                ),
            }));

            // Persist to API immediately
            request(
                `${API_URL}Teachers/teacher-pd/${editingId}/`,
                'PATCH',
                JSON.stringify({ participants: updatedParticipants }),
                headers()
            )
                .then(() => {
                    dispatch(
                        onAddAlertOptions({
                            type: 'success',
                            status: true,
                            msg: "Ishtirokchi o'chirildi",
                        })
                    );
                })
                .catch(() => {
                    dispatch(
                        onAddAlertOptions({ type: 'error', status: true, msg: 'Xatolik yuz berdi' })
                    );
                });
        },
        [editingId, request, dispatch]
    );


    const handleSubmit = useCallback(
        (e) => {
            e.preventDefault();
            if (!formData.title || !formData.speaker || !formData.datetime) {
                dispatch(
                    onAddAlertOptions({
                        type: 'warning',
                        status: true,
                        msg: "Iltimos, barcha majburiy maydonlarni to'ldiring",
                    })
                );
                return;
            }

            const payload = {
                title: formData.title,
                speaker: Number(formData.speaker),
                datetime: formData.datetime,
                description: formData.description,
                participants: !editingId ? formData.participants : formData.participants.map((itm => itm.id)),
                created_by: Number(userId),
            };

            console.log(formData.participants);
            const method = editingId ? 'PATCH' : 'POST';
            const url = editingId
                ? `${API_URL}Teachers/teacher-pd/${editingId}/`
                : `${API_URL}Teachers/teacher-pd/`;

            request(url, method, JSON.stringify(payload), headers())
                .then(() => {
                    dispatch(
                        onAddAlertOptions({
                            type: 'success',
                            status: true,
                            msg: editingId ? 'Muvaffaqiyatli yangilandi' : 'Muvaffaqiyatli saqlandi',
                        })
                    );
                    setModalActive(false);
                    resetForm();
                    refreshList();
                })
                .catch(() =>
                    dispatch(
                        onAddAlertOptions({ type: 'error', status: true, msg: 'Xatolik yuz berdi' })
                    )
                );
        },
        [formData, editingId, userId, request, dispatch, resetForm, refreshList]
    );

    const openDeleteModal = useCallback((id) => {
        setDeleteItemId(id);
        setDeleteModalActive(true);
    }, []);

    const handleDeleteConfirm = useCallback(() => {
        fetch(`${API_URL}Teachers/teacher-pd/${deleteItemId}/`, {
            method: 'DELETE',
            mode: 'cors',
            headers: headers(),
        })
            .then((res) => {
                if (!res.ok) throw new Error(`Status: ${res.status}`);
                dispatch(
                    onAddAlertOptions({ type: 'success', status: true, msg: "Muvaffaqiyatli o'chirildi" })
                );
                setDeleteModalActive(false);
                setDeleteItemId(null);
                refreshList();
            })
            .catch(() =>
                dispatch(onAddAlertOptions({ type: 'error', status: true, msg: 'Xatolik yuz berdi' }))
            );
    }, [deleteItemId, request, dispatch, refreshList]);

    // Attendance (came/not came) state per participant
    const [attendanceMap, setAttendanceMap] = useState({});

    const openDetailDrawer = useCallback((pd) => {
        // Seed attendanceMap from existing status values on participants
        const initial = {};
        (pd.participants ?? []).forEach((p) => {
            if (p.id !== undefined) initial[p.id] = p.status ?? 'absent';
        });
        setAttendanceMap(initial);
        setSelectedPD(pd);
        setDrawerOpen(true);
    }, []);

    const closeDetailDrawer = useCallback(() => {
        setDrawerOpen(false);
        setSelectedPD(null);
        setAttendanceMap({});
    }, []);

    const handleStatusToggle = useCallback(
        (participantId, currentStatus) => {

            const newStatus = currentStatus === 'attended' ? 'absent' : 'attended';
            setAttendanceMap((prev) => ({ ...prev, [participantId]: newStatus }));
            request(
                `${API_URL}Teachers/teacher-pd-status/${participantId}/`,
                'PATCH',
                JSON.stringify({ status: newStatus }),
                headers()
            )
                .then(() => {
                    dispatch(
                        onAddAlertOptions({
                            type: 'success',
                            status: true,
                            msg: newStatus === 'attended' ? 'Keldi deb belgilandi' : 'Kelmadi deb belgilandi',
                        })
                    );
                })
                .catch(() => {
                    // Revert on error
                    setAttendanceMap((prev) => ({ ...prev, [participantId]: currentStatus }));
                    dispatch(
                        onAddAlertOptions({ type: 'error', status: true, msg: 'Xatolik yuz berdi' })
                    );
                });
        },
        [request, dispatch]
    );

    return {
        // data
        pdList,
        loading,
        teachersList,
        formData,
        editingId,
        selectedPD,
        showAllParticipants,
        setShowAllParticipants,
        attendanceMap,
        // modal
        modalActive,
        setModalActive,
        deleteModalActive,
        setDeleteModalActive,
        drawerOpen,
        // actions
        openAddModal,
        openEditModal,
        openDeleteModal,
        handleDeleteConfirm,
        handleChange,
        handleParticipantToggle,
        handleParticipantRemove,
        handleSubmit,
        openDetailDrawer,
        closeDetailDrawer,
        handleStatusToggle,
    };
};
