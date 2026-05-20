import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { API_URL, headers, useHttp } from "shared/api/base";
import { getUserBranchId } from "entities/profile/userProfile";
import { getCapitalTypes } from "entities/capital";
import { getPaymentType } from "entities/capital/model/thunk/capitalThunk";
import { getLoans, getOutstandingLoans, fetchBranchLoans, fetchOutstandingLoans, createLoan } from "entities/loans";
import { Button } from "shared/ui/button";
import { Select } from "shared/ui/select";
import { Modal } from "shared/ui/modal";
import { Radio } from "shared/ui/radio";
import { Input } from "shared/ui/input";
import { UniversalTable } from "entities/accounting/ui/overheadTypesTable";
import cls from "./overheadTypes.module.sass";

const now = new Date();

const MONTHS = [
    { id: 1, name: "Yanvar" }, { id: 2, name: "Fevral" }, { id: 3, name: "Mart" },
    { id: 4, name: "Aprel" }, { id: 5, name: "May" }, { id: 6, name: "Iyun" },
    { id: 7, name: "Iyul" }, { id: 8, name: "Avgust" }, { id: 9, name: "Sentabr" },
    { id: 10, name: "Oktabr" }, { id: 11, name: "Noyabr" }, { id: 12, name: "Dekabr" },
];

const YEARS = Array.from({ length: 5 }, (_, i) => {
    const y = now.getFullYear() - 2 + i;
    return { id: y, name: String(y) };
});

const STATUS_OPTIONS = [
    { id: "all", name: "Hammasi" },
    { id: "paid", name: "To'langan" },
    { id: "partial", name: "Qisman to'langan" },
    { id: "unpaid", name: "To'lanmagan" },
];


const LOAN_DIRECTION_OPTIONS = [
    { id: "all", name: "Hammasi" },
    { id: "in", name: "Kirim" },
    { id: "out", name: "Chiqim" },
];

const LOAN_STATUS_OPTIONS = [
    { id: "all", name: "Hammasi" },
    { id: "active", name: "Faol" },
    { id: "settled", name: "To'langan" },
    { id: "cancelled", name: "Bekor qilingan" },
];

const IS_GIVE_OPTIONS = [
    { id: "true", name: "Berildi" },
    { id: "false", name: "Olindi" },
];

const fmt = (n) => Number(n || 0).toLocaleString();

const requestJson = async (url, method = "GET", body = null) => {
    const response = await fetch(url, { method, mode: "cors", body, headers: headers() });
    let data = null;

    try {
        data = await response.json();
    } catch {
        data = null;
    }

    if (!response.ok) {
        const error = new Error(data?.message || `Server xatosi: ${response.status}`);
        error.data = data;
        throw error;
    }

    return data;
};

const getLogPayments = (log) => Array.isArray(log?.payments) ? log.payments : [];
const getPaidAmount = (log) => Number(log?.paid_amount ?? (log?.is_paid ? log?.cost : 0) ?? 0);
const getRemainingAmount = (log) => Number(log?.remaining_amount ?? Math.max(0, Number(log?.cost || 0) - getPaidAmount(log)));
const getPaymentStatus = (log) => log?.payment_status || (log?.is_paid ? "paid" : "unpaid");

const getStatusLabel = (log) => {
    if (log?.is_prepaid) return "Oldindan";

    const status = getPaymentStatus(log);
    if (status === "paid") return "To'langan";
    if (status === "partial") return "Qisman";
    return "To'lanmagan";
};

const getStatusClassName = (log) => {
    const status = getPaymentStatus(log);
    if (status === "paid") return cls.badgeGreen;
    if (status === "partial") return cls.badgeYellow;
    return cls.badgeRed;
};

// ── TypesTab ─────────────────────────────────────────────────────────────────

const TypesTab = () => {
    const { request } = useHttp();
    const branchId = useSelector(getUserBranchId);
    const [types, setTypes] = useState([]);
    const [loading, setLoading] = useState(false);

    const [editModal, setEditModal] = useState(false);
    const [editTarget, setEditTarget] = useState(null);
    const [editForm, setEditForm] = useState({ name: "", cost: "", changeable: false, order: "" });
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState(null);

    const loadTypes = () => {
        if (!branchId) return;
        setLoading(true);
        request(`${API_URL}Overhead/overheads_type/?branch_id=${branchId}`, "GET", null, headers())
            .then((res) => setTypes(res?.data ?? (Array.isArray(res) ? res : [])))
            .catch(() => { })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadTypes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [branchId]);

    const openEdit = (item) => {
        setEditTarget(item);
        setEditForm({
            name: item.name || "",
            cost: String(item.cost || ""),
            changeable: item.changeable ?? false,
            order: String(item.order || ""),
        });
        setFormError(null);
        setEditModal(true);
    };

    const closeEdit = () => {
        setEditModal(false);
        setEditTarget(null);
        setFormError(null);
    };

    const handleSubmit = () => {
        if (!editForm.name.trim()) { setFormError("Nomni kiriting"); return; }
        if (!editForm.changeable && (editForm.cost === "" || Number(editForm.cost) < 0)) { setFormError("To'g'ri narx kiriting"); return; }

        setSubmitting(true);
        setFormError(null);
        request(
            `${API_URL}Overhead/overheads_type/${editTarget.id}/`,
            "PATCH",
            JSON.stringify({
                name: editForm.name.trim(),
                cost: Number(editForm.cost),
                changeable: editForm.changeable,
                order: Number(editForm.order) || 0,
                branch_id: branchId,
            }),
            headers()
        )
            .then((res) => {
                if (res?.id || res?.success || res?.name) { closeEdit(); loadTypes(); }
                else setFormError(res?.message || "Xatolik yuz berdi");
            })
            .catch(() => setFormError("Serverga ulanib bo'lmadi"))
            .finally(() => setSubmitting(false));
    };

    const columns = [
        { label: "No", sortKey: null },
        { label: "Nomi", sortKey: "name" },
        { label: "Narxi", sortKey: "cost" },
        { label: "O'zgartiriladi", sortKey: null },
        { label: "Tartib", sortKey: "order" },
        { label: "", sortKey: null },
    ];

    const renderRow = (item, idx) => (
        <tr key={item.id}>
            <td>{idx + 1}</td>
            <td>{item.name}</td>
            <td>{fmt(item.cost)} UZS</td>
            <td>
                <span className={cls.badge}>
                    {item.changeable ? "Ha" : "Yo'q"}
                </span>
            </td>
            <td>{item.order}</td>
            <td>
                {!item.changeable && (
                    <i
                        onClick={() => openEdit(item)}
                        style={{ color: "#6b7280", fontSize: "1.4rem", cursor: "pointer" }}
                        className="fa fa-pen"
                    />
                )}
            </td>
        </tr>
    );

    return (
        <>
            <UniversalTable data={types} loading={loading} columns={columns} renderRow={renderRow} onSort={true} />

            <Modal active={editModal} setActive={closeEdit}>
                <div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.4rem", minWidth: 340 }}>
                    <h3 style={{ fontSize: "1.8rem", fontWeight: 700, margin: 0 }}>Xarajat turini tahrirlash</h3>

                    <Input
                        type="text"
                        title="Nomi *"
                        value={editForm.name}
                        onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                    />
                    {!editForm.changeable && (
                        <Input
                            type="number"
                            title="Narxi *"
                            value={editForm.cost}
                            onChange={(e) => setEditForm((f) => ({ ...f, cost: e.target.value }))}
                        />
                    )}
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <input
                            id="changeable-check"
                            type="checkbox"
                            checked={editForm.changeable}
                            onChange={(e) => setEditForm((f) => ({ ...f, changeable: e.target.checked }))}
                            style={{ width: "1.6rem", height: "1.6rem", cursor: "pointer" }}
                        />
                        <label htmlFor="changeable-check" style={{ fontSize: "1.4rem", cursor: "pointer" }}>
                            O'zgartiriladi
                        </label>
                    </div>

                    {formError && <span style={{ color: "#ef4444", fontSize: "1.3rem" }}>{formError}</span>}

                    <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
                        <Button type="filter" onClick={closeEdit} disabled={submitting}>Bekor</Button>
                        <Button type="success" onClick={handleSubmit} disabled={submitting}>
                            {submitting ? "Saqlanmoqda..." : "Saqlash"}
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

// ── LogsTab ───────────────────────────────────────────────────────────────────

const LogsTab = ({ focusLogId, initialMonth, initialYear }) => {
    const { request } = useHttp();
    const dispatch = useDispatch();
    const branchId = useSelector(getUserBranchId);
    const paymentTypes = useSelector(getCapitalTypes);
    const focusedLogRef = useRef(null);

    const [month, setMonth] = useState(initialMonth || now.getMonth() + 1);
    const [year, setYear] = useState(initialYear || now.getFullYear());
    const [status, setStatus] = useState("all");

    const [summary, setSummary] = useState(null);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [payModal, setPayModal] = useState(false);
    const [selectedLog, setSelectedLog] = useState(null);
    const [paymentTypeId, setPaymentTypeId] = useState("");
    const [paymentAmount, setPaymentAmount] = useState("");
    const [paymentNote, setPaymentNote] = useState("");
    const [payDate, setPayDate] = useState(now.toISOString().slice(0, 10));
    const [paying, setPaying] = useState(false);
    const [payError, setPayError] = useState(null);
    const [paymentsModal, setPaymentsModal] = useState(false);
    const [paymentsLoading, setPaymentsLoading] = useState(false);
    const [paymentsError, setPaymentsError] = useState(null);
    const [paymentsDetails, setPaymentsDetails] = useState(null);
    const [deletingPaymentId, setDeletingPaymentId] = useState(null);
    const [converting, setConverting] = useState(false);
    const [generatingLogs, setGeneratingLogs] = useState(false);
    const [generateError, setGenerateError] = useState(null);
    const [editLogModal, setEditLogModal] = useState(false);
    const [editLog, setEditLog] = useState(null);
    const [editLogCost, setEditLogCost] = useState("");
    const [editLogError, setEditLogError] = useState(null);
    const [updatingLog, setUpdatingLog] = useState(false);
    const [deleteLogModal, setDeleteLogModal] = useState(false);
    const [deleteLog, setDeleteLog] = useState(null);
    const [deleteLogError, setDeleteLogError] = useState(null);
    const [deletingLog, setDeletingLog] = useState(false);

    useEffect(() => {
        dispatch(getPaymentType());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadLogs = useCallback(() => {
        if (!branchId || !month || !year) return;
        setLoading(true);
        setError(null);
        const params = new URLSearchParams({ branch_id: branchId, status });
        request(
            `${API_URL}Overhead/overhead_type_logs/${month}/${year}/?${params}`,
            "GET", null, headers()
        )
            .then((res) => {
                if (res?.success) {
                    setSummary(res.summary);
                    setLogs(Array.isArray(res.data) ? res.data : []);
                } else {
                    setError("Ma'lumotlarni yuklashda xatolik");
                }
            })
            .catch(() => setError("Serverga ulanib bo'lmadi"))
            .finally(() => setLoading(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [branchId, month, year, status]);

    useEffect(() => { loadLogs(); }, [loadLogs]);

    const openPayModal = (log) => {
        setSelectedLog(log);
        setPaymentTypeId(paymentTypes?.[0]?.id ? String(paymentTypes[0].id) : "");
        setPaymentAmount(String(getRemainingAmount(log) || log.cost || ""));
        setPaymentNote("");
        setPayDate(now.toISOString().slice(0, 10));
        setPayError(null);
        setPayModal(true);
    };

    const closePayModal = () => {
        setPayModal(false);
        setSelectedLog(null);
        setPaymentAmount("");
        setPaymentNote("");
        setPayError(null);
    };

    const refreshSelectedLogPayments = (log = selectedLog) => {
        if (!log?.id) return Promise.resolve(null);

        setPaymentsLoading(true);
        setPaymentsError(null);

        return requestJson(`${API_URL}Overhead/overhead_type_logs/${log.id}/payments/`)
            .then((res) => {
                setPaymentsDetails(res);
                setSelectedLog((prev) => prev?.id === log.id ? {
                    ...prev,
                    paid_amount: res.paid_amount,
                    remaining_amount: res.remaining_amount,
                    payment_status: res.payment_status,
                    payments: res.payments,
                } : prev);
                return res;
            })
            .catch((error) => {
                setPaymentsError(error?.message || "To'lovlarni yuklashda xatolik");
                return null;
            })
            .finally(() => setPaymentsLoading(false));
    };

    const openPaymentsModal = (log) => {
        setSelectedLog(log);
        setPaymentsDetails({
            log_id: log.id,
            cost: log.cost,
            paid_amount: getPaidAmount(log),
            remaining_amount: getRemainingAmount(log),
            payment_status: getPaymentStatus(log),
            payments: getLogPayments(log),
        });
        setPaymentsError(null);
        setPaymentsModal(true);
        refreshSelectedLogPayments(log);
    };

    const closePaymentsModal = () => {
        setPaymentsModal(false);
        setPaymentsDetails(null);
        setPaymentsError(null);
        setDeletingPaymentId(null);
    };

    const handlePay = (useLegacy = false) => {
        if (!paymentTypeId) { setPayError("To'lov turini tanlang"); return; }
        const amount = Number(paymentAmount);
        const remainingAmount = getRemainingAmount(selectedLog);

        if (!useLegacy && (!Number.isFinite(amount) || amount <= 0)) {
            setPayError("To'g'ri summa kiriting");
            return;
        }
        if (!useLegacy && amount > remainingAmount) {
            setPayError(`To'lov summasi qoldiqdan oshmasligi kerak. Qoldiq: ${fmt(remainingAmount)} UZS`);
            return;
        }

        setPaying(true);
        setPayError(null);
        const url = useLegacy
            ? `${API_URL}Overhead/overhead_type_logs/pay/`
            : `${API_URL}Overhead/overhead_type_logs/${selectedLog.id}/payments/add/`;
        const body = useLegacy
            ? {
                payment_type_id: Number(paymentTypeId),
                branch_id: branchId,
                date: payDate,
                log_id: selectedLog.id,
                amount: selectedLog.cost,
            }
            : {
                payment_type_id: Number(paymentTypeId),
                branch_id: branchId,
                date: payDate,
                amount,
                note: paymentNote.trim() || undefined,
            };

        requestJson(
            url,
            "POST",
            JSON.stringify(body)
        )
            .then((res) => {
                if (res?.success) { closePayModal(); loadLogs(); }
                else setPayError(res?.message || "Xatolik yuz berdi");
            })
            .catch((error) => {
                const remaining = error?.data?.remaining_amount;
                if (remaining !== undefined && remaining !== null) {
                    setPaymentAmount(String(remaining));
                }
                setPayError(error?.message || "Serverga ulanib bo'lmadi");
            })
            .finally(() => setPaying(false));
    };

    const handleDeletePayment = (paymentId) => {
        setDeletingPaymentId(paymentId);
        setPaymentsError(null);

        requestJson(`${API_URL}Overhead/overhead_type_logs/payments/${paymentId}/delete/`, "DELETE")
            .then((res) => {
                if (res?.success) {
                    loadLogs();
                    return refreshSelectedLogPayments(selectedLog);
                }
                setPaymentsError(res?.message || "To'lovni o'chirishda xatolik");
                return null;
            })
            .catch((error) => setPaymentsError(error?.message || "Serverga ulanib bo'lmadi"))
            .finally(() => setDeletingPaymentId(null));
    };

    const handleConvertToSplit = () => {
        if (!selectedLog?.id) return;

        setConverting(true);
        setPaymentsError(null);

        requestJson(`${API_URL}Overhead/overhead_type_logs/${selectedLog.id}/convert-to-split/`, "POST")
            .then((res) => {
                if (res?.success) {
                    loadLogs();
                    return refreshSelectedLogPayments(selectedLog);
                }
                setPaymentsError(res?.message || "Konvertatsiyada xatolik");
                return null;
            })
            .catch((error) => setPaymentsError(error?.message || "Serverga ulanib bo'lmadi"))
            .finally(() => setConverting(false));
    };

    const handleGenerateLogs = () => {
        setGeneratingLogs(true);
        setGenerateError(null);

        requestJson(
            `${API_URL}Overhead/overhead_type_logs/generate/${month}/${year}/`,
            "POST",
            JSON.stringify({ branch_id: branchId })
        )
            .then((res) => {
                if (res?.success) loadLogs();
                else setGenerateError(res?.message || "Loglarni yaratishda xatolik");
            })
            .catch((error) => setGenerateError(error?.message || "Serverga ulanib bo'lmadi"))
            .finally(() => setGeneratingLogs(false));
    };

    const openEditLogModal = (log) => {
        setEditLog(log);
        setEditLogCost(String(log.cost || ""));
        setEditLogError(null);
        setEditLogModal(true);
    };

    const closeEditLogModal = () => {
        setEditLogModal(false);
        setEditLog(null);
        setEditLogCost("");
        setEditLogError(null);
    };

    const handleUpdateLog = () => {
        const cost = Number(editLogCost);

        if (!Number.isFinite(cost) || cost <= 0) {
            setEditLogError("Cost musbat son bo'lishi kerak");
            return;
        }

        setUpdatingLog(true);
        setEditLogError(null);

        requestJson(
            `${API_URL}Overhead/overhead_type_logs/${editLog.id}/update/`,
            "PATCH",
            JSON.stringify({ cost })
        )
            .then((res) => {
                if (res?.success) {
                    closeEditLogModal();
                    loadLogs();
                } else {
                    setEditLogError(res?.message || "Logni yangilashda xatolik");
                }
            })
            .catch((error) => {
                const paidAmount = error?.data?.paid_amount;
                const fallback = paidAmount !== undefined && paidAmount !== null
                    ? `Allaqachon ${fmt(paidAmount)} UZS to'langan. Avval to'lovlarni o'chiring.`
                    : "Serverga ulanib bo'lmadi";
                setEditLogError(error?.message || fallback);
            })
            .finally(() => setUpdatingLog(false));
    };

    const openDeleteLogModal = (log) => {
        setDeleteLog(log);
        setDeleteLogError(null);
        setDeleteLogModal(true);
    };

    const closeDeleteLogModal = () => {
        setDeleteLogModal(false);
        setDeleteLog(null);
        setDeleteLogError(null);
    };

    const handleDeleteLog = () => {
        if (!deleteLog?.id) return;

        setDeletingLog(true);
        setDeleteLogError(null);

        requestJson(`${API_URL}Overhead/overhead_type_logs/${deleteLog.id}/delete/`, "DELETE")
            .then((res) => {
                if (res?.success) {
                    closeDeleteLogModal();
                    loadLogs();
                } else {
                    setDeleteLogError(res?.message || "Logni o'chirishda xatolik");
                }
            })
            .catch((error) => setDeleteLogError(error?.message || "Serverga ulanib bo'lmadi"))
            .finally(() => setDeletingLog(false));
    };

    useEffect(() => {
        if (!focusLogId || focusedLogRef.current === String(focusLogId) || !logs.length) return;

        const log = logs.find((item) => String(item.id) === String(focusLogId));
        if (!log) return;

        focusedLogRef.current = String(focusLogId);
        openPaymentsModal(log);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [focusLogId, logs]);

    const columns = [
        { label: "No", sortKey: null },
        { label: "Tur nomi", sortKey: "overhead_type_name" },
        { label: "Narxi", sortKey: "cost" },
        { label: "To'langan", sortKey: "paid_amount" },
        { label: "Qoldiq", sortKey: "remaining_amount" },
        { label: "Holat", sortKey: null },
        { label: "Sana", sortKey: "date" },
        { label: "To'lov sanasi", sortKey: "paid_date" },
        { label: "", sortKey: null },
    ];

    const renderRow = (log, idx) => {
        const status = getPaymentStatus(log);
        const paidAmount = getPaidAmount(log);
        const remainingAmount = getRemainingAmount(log);
        const progress = Number(log.cost) > 0 ? Math.min(100, Math.round((paidAmount / Number(log.cost)) * 100)) : 0;
        const canAddPayment = status !== "paid" && remainingAmount > 0;
        const hasPayments = getLogPayments(log).length > 0;
        const isLegacyPaid = status === "paid" && !hasPayments;
        const canEditLog = status !== "paid" || hasPayments;
        const canDeleteLog = status === "unpaid" && !log.overhead_id && !hasPayments;

        return (
            <tr key={log.id}>
                <td>{idx + 1}</td>
                <td>{log.overhead_type_name}</td>
                <td>{fmt(log.cost)} UZS</td>
                <td>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", minWidth: "13rem" }}>
                        <span>{fmt(paidAmount)} UZS</span>
                        {status === "partial" && (
                            <div style={{ height: 5, background: "#e5e7eb", borderRadius: 5, overflow: "hidden" }}>
                                <div style={{ width: `${progress}%`, height: "100%", background: "#d97706" }} />
                            </div>
                        )}
                    </div>
                </td>
                <td>{fmt(remainingAmount)} UZS</td>
                <td>
                    <span className={getStatusClassName(log)}>
                        {getStatusLabel(log)}
                    </span>
                </td>
                <td>{log.date || "—"}</td>
                <td>{log.paid_date || "—"}</td>
                <td>
                    <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
                        {canAddPayment && (
                            <Button type="success" onClick={() => openPayModal(log)}>
                                {status === "partial" ? "Qo'shish" : "To'lash"}
                            </Button>
                        )}
                        {(hasPayments || isLegacyPaid) && (
                            <Button type="filter" onClick={() => openPaymentsModal(log)}>
                                To'lovlar
                            </Button>
                        )}
                        {/* Log editing is temporarily hidden on Oylik xarajatlar. */}
                        {/* {canEditLog && (
                            <Button type="filter" onClick={() => openEditLogModal(log)}>
                                Narx
                            </Button>
                        )} */}
                        {/* Log deletion is temporarily hidden on Oylik xarajatlar. */}
                        {/* {canDeleteLog && (
                            <Button type="danger" onClick={() => openDeleteLogModal(log)}>
                                O'chirish
                            </Button>
                        )} */}
                    </div>
                </td>
            </tr>
        );
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {/* Filters */}
            <div className={cls.filters}>
                <Select options={MONTHS} defaultValue={month} onChangeOption={(v) => setMonth(Number(v))} titleOption="Oy" />
                <Select options={YEARS} defaultValue={year} onChangeOption={(v) => setYear(Number(v))} titleOption="Yil" />
                <Select options={STATUS_OPTIONS} defaultValue={status} onChangeOption={setStatus} titleOption="Status" />
                {/* Log generation is temporarily hidden on Oylik xarajatlar. */}
                {/* <Button type="filter" onClick={handleGenerateLogs} disabled={generatingLogs}>
                    {generatingLogs ? "Yaratilmoqda..." : "Loglarni yaratish"}
                </Button> */}
            </div>
            {generateError && <p className={cls.error}>{generateError}</p>}

            {/* Summary cards */}
            {summary && (
                <div className={cls.cards}>
                    <div className={cls.card}>
                        <div className={cls.cardHeader}>
                            Jami <span>📊</span>
                        </div>
                        <div className={cls.cardAmount}>{fmt(summary.total_sum)} UZS</div>
                        <div className={cls.cardBadge}>{summary.total_count} ta</div>
                    </div>
                    <div className={cls.card}>
                        <div className={cls.cardHeader}>
                            To'langan <span>✅</span>
                        </div>
                        <div className={cls.cardAmount} style={{ color: "#16a34a" }}>{fmt(summary.paid_sum)} UZS</div>
                        <div className={`${cls.cardBadge} ${cls.cardBadgeGreen}`}>{summary.paid_count} ta</div>
                    </div>
                    <div className={cls.card}>
                        <div className={cls.cardHeader}>
                            To'lanmagan <span>❌</span>
                        </div>
                        <div className={cls.cardAmount} style={{ color: "#dc2626" }}>{fmt(summary.unpaid_sum)} UZS</div>
                        <div className={`${cls.cardBadge} ${cls.cardBadgeRed}`}>{summary.unpaid_count} ta</div>
                    </div>
                </div>
            )}

            {error && <p className={cls.error}>{error}</p>}

            <UniversalTable data={logs} loading={loading} columns={columns} renderRow={renderRow} onSort={true} />

            <Modal active={payModal} setActive={closePayModal}>
                <div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.8rem", minWidth: 320 }}>
                    <h3 style={{ fontSize: "1.8rem", fontWeight: 700, margin: 0 }}>
                        To'lov: {selectedLog?.overhead_type_name}
                    </h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        <div>
                            <span style={{ fontSize: "1.3rem", color: "#6b7280" }}>Narxi: </span>
                            <span style={{ fontSize: "1.6rem", fontWeight: 700 }}>{fmt(selectedLog?.cost)} UZS</span>
                        </div>
                        <div>
                            <span style={{ fontSize: "1.3rem", color: "#6b7280" }}>Qoldiq: </span>
                            <span style={{ fontSize: "1.6rem", fontWeight: 700 }}>{fmt(getRemainingAmount(selectedLog))} UZS</span>
                        </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                        <span style={{ fontSize: "1.3rem", color: "#6b7280" }}>To'lov turi</span>
                        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
                            {paymentTypes?.map((pt) => (
                                <Radio key={pt.id} name="paymentType" value={String(pt.id)}
                                    checked={paymentTypeId === String(pt.id)}
                                    onChange={(v) => setPaymentTypeId(v)}>
                                    {pt.name}
                                </Radio>
                            ))}
                        </div>
                    </div>
                    <Input
                        type="number"
                        title="Summa"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                    />
                    <Input type="date" title="Sana" value={payDate} onChange={(e) => setPayDate(e.target.value)} />
                    <label style={{ display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "1.3rem", color: "#6b7280" }}>
                        Izoh
                        <textarea
                            value={paymentNote}
                            onChange={(e) => setPaymentNote(e.target.value)}
                            style={{
                                minHeight: "7rem",
                                border: "1px solid #d1d5db",
                                borderRadius: 6,
                                padding: "0.8rem",
                                resize: "vertical",
                                fontSize: "1.4rem",
                            }}
                        />
                    </label>
                    {payError && <span style={{ color: "#ef4444", fontSize: "1.3rem" }}>{payError}</span>}
                    <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end", flexWrap: "wrap" }}>
                        <Button type="filter" onClick={closePayModal} disabled={paying}>Bekor</Button>
                        {getPaymentStatus(selectedLog) === "unpaid" && getLogPayments(selectedLog).length === 0 && (
                            <Button type="filter" onClick={() => handlePay(true)} disabled={paying}>
                                To'liq to'lash
                            </Button>
                        )}
                        <Button type="success" onClick={() => handlePay(false)} disabled={paying}>
                            {paying ? "Yuborilmoqda..." : "Qisman to'lash"}
                        </Button>
                    </div>
                </div>
            </Modal>

            <Modal active={paymentsModal} setActive={closePaymentsModal}>
                <div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.6rem", minWidth: 420, maxWidth: 680 }}>
                    <h3 style={{ fontSize: "1.8rem", fontWeight: 700, margin: 0 }}>
                        To'lovlar: {selectedLog?.overhead_type_name}
                    </h3>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
                        <div>
                            <span style={{ fontSize: "1.2rem", color: "#6b7280" }}>Narxi</span>
                            <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>{fmt(paymentsDetails?.cost ?? selectedLog?.cost)} UZS</div>
                        </div>
                        <div>
                            <span style={{ fontSize: "1.2rem", color: "#6b7280" }}>To'langan</span>
                            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#16a34a" }}>{fmt(paymentsDetails?.paid_amount)} UZS</div>
                        </div>
                        <div>
                            <span style={{ fontSize: "1.2rem", color: "#6b7280" }}>Qoldiq</span>
                            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#dc2626" }}>{fmt(paymentsDetails?.remaining_amount)} UZS</div>
                        </div>
                    </div>

                    {paymentsLoading && <div style={{ fontSize: "1.3rem", color: "#6b7280" }}>Yuklanmoqda...</div>}
                    {paymentsError && <span style={{ color: "#ef4444", fontSize: "1.3rem" }}>{paymentsError}</span>}

                    {getPaymentStatus(selectedLog) === "paid" && getLogPayments(selectedLog).length === 0 && (
                        <div style={{ display: "flex", justifyContent: "flex-start" }}>
                            <Button type="warning" onClick={handleConvertToSplit} disabled={converting}>
                                {converting ? "O'tkazilmoqda..." : "Splitga o'tkazish"}
                            </Button>
                        </div>
                    )}

                    <div style={{ overflowX: "auto" }}>
                        <table className={cls.table}>
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>To'lov turi</th>
                                    <th>Summa</th>
                                    <th>Sana</th>
                                    <th>Izoh</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {getLogPayments(paymentsDetails).length === 0 ? (
                                    <tr>
                                        <td colSpan={6} style={{ textAlign: "center", padding: "2rem" }}>
                                            To'lovlar topilmadi
                                        </td>
                                    </tr>
                                ) : (
                                    getLogPayments(paymentsDetails).map((payment, idx) => (
                                        <tr key={payment.id}>
                                            <td>{idx + 1}</td>
                                            <td>{payment.payment_type_name || "—"}</td>
                                            <td>{fmt(payment.amount)} UZS</td>
                                            <td>{payment.paid_date || "—"}</td>
                                            <td>{payment.note || "—"}</td>
                                            <td>
                                                <Button
                                                    type="danger"
                                                    onClick={() => handleDeletePayment(payment.id)}
                                                    disabled={deletingPaymentId === payment.id}
                                                >
                                                    {deletingPaymentId === payment.id ? "..." : "O'chirish"}
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
                        {Number(paymentsDetails?.remaining_amount ?? 0) > 0 && (
                            <Button
                                type="success"
                                onClick={() => {
                                    setPaymentsModal(false);
                                    openPayModal({
                                        ...selectedLog,
                                        paid_amount: paymentsDetails?.paid_amount,
                                        remaining_amount: paymentsDetails?.remaining_amount,
                                        payment_status: paymentsDetails?.payment_status,
                                        payments: paymentsDetails?.payments,
                                    });
                                }}
                            >
                                To'lov qo'shish
                            </Button>
                        )}
                        <Button type="filter" onClick={closePaymentsModal}>Yopish</Button>
                    </div>
                </div>
            </Modal>

            {/* Log editing modal is temporarily hidden on Oylik xarajatlar. */}
            {/* <Modal active={editLogModal} setActive={closeEditLogModal}>
                <div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.6rem", minWidth: 340 }}>
                    <h3 style={{ fontSize: "1.8rem", fontWeight: 700, margin: 0 }}>
                        Narxni o'zgartirish: {editLog?.overhead_type_name}
                    </h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        <div>
                            <span style={{ fontSize: "1.2rem", color: "#6b7280" }}>To'langan</span>
                            <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>{fmt(getPaidAmount(editLog))} UZS</div>
                        </div>
                        <div>
                            <span style={{ fontSize: "1.2rem", color: "#6b7280" }}>Qoldiq</span>
                            <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>{fmt(getRemainingAmount(editLog))} UZS</div>
                        </div>
                    </div>
                    {getPaymentStatus(editLog) === "paid" && getLogPayments(editLog).length > 0 && Number(editLogCost) > Number(editLog?.cost || 0) && (
                        <span style={{ color: "#d97706", fontSize: "1.3rem" }}>
                            Narx oshirilsa, log qayta qisman to'langan holatga o'tishi mumkin.
                        </span>
                    )}
                    <Input
                        type="number"
                        title="Yangi narx"
                        value={editLogCost}
                        onChange={(e) => setEditLogCost(e.target.value)}
                    />
                    {editLogError && <span style={{ color: "#ef4444", fontSize: "1.3rem" }}>{editLogError}</span>}
                    <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
                        <Button type="filter" onClick={closeEditLogModal} disabled={updatingLog}>Bekor</Button>
                        <Button type="success" onClick={handleUpdateLog} disabled={updatingLog}>
                            {updatingLog ? "Saqlanmoqda..." : "Saqlash"}
                        </Button>
                    </div>
                </div>
            </Modal> */}

            {/* Log deletion modal is temporarily hidden on Oylik xarajatlar. */}
            {/* <Modal active={deleteLogModal} setActive={closeDeleteLogModal}>
                <div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.6rem", minWidth: 360 }}>
                    <h3 style={{ fontSize: "1.8rem", fontWeight: 700, margin: 0 }}>
                        Logni o'chirish
                    </h3>
                    <p style={{ fontSize: "1.4rem", margin: 0 }}>
                        {deleteLog?.overhead_type_name} logini o'chirmoqchimisiz? Bu amalni bekor qilib bo'lmaydi.
                    </p>
                    {deleteLogError && <span style={{ color: "#ef4444", fontSize: "1.3rem" }}>{deleteLogError}</span>}
                    <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
                        <Button type="filter" onClick={closeDeleteLogModal} disabled={deletingLog}>Bekor</Button>
                        <Button type="danger" onClick={handleDeleteLog} disabled={deletingLog}>
                            {deletingLog ? "O'chirilmoqda..." : "O'chirish"}
                        </Button>
                    </div>
                </div>
            </Modal> */}
        </div>
    );
};

// ── Helper functions for loans ───────────────────────────────────────────────

const fmtShort = (n) => {
    if (!n && n !== 0) return "—";
    if (n >= 1000000) return (n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 1) + " mln";
    if (n >= 1000) return (n / 1000).toFixed(0) + " ming";
    return n.toLocaleString();
};

const initials = (cp) => {
    if (!cp) return "?";
    const first = cp.surname?.[0] || "";
    const second = cp.name?.[0] || "";
    return (first + second).toUpperCase();
};

const daysLeft = (due) => {
    if (!due) return 0;
    return Math.ceil((new Date(due) - new Date()) / 86400000);
};

const isOverdue = (loan) => {
    return loan.status === "active" && daysLeft(loan.due_date) < 0;
};

// ── OutstandingGroup ─────────────────────────────────────────────────────────

const OutstandingGroup = ({ item, expanded, onToggle, onLoanClick, fmtShort, initials, pct }) => {
    const loans = item.open_loans || item.loans || [];
    const remaining = item.outstanding || item.remaining_total || 0;

    const handleHeaderClick = () => {
        // If there's only one loan, go directly to profile
        if (loans.length === 1) {
            onLoanClick(loans[0].id);
        } else {
            // Otherwise toggle accordion
            onToggle();
        }
    };

    return (
        <div className={cls.outstandingGroup}>
            <div className={cls.outstandingGroupHeader} onClick={handleHeaderClick} style={{ cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
                    <div className={cls.avatarLarge}>
                        {initials(item.counterparty)}
                    </div>
                    <div>
                        <div style={{ fontSize: "1.3rem", fontWeight: 600, color: "#111" }}>
                            {item.counterparty.name} {item.counterparty.surname}
                        </div>
                        <div style={{ fontSize: "1.1rem", color: "#bbb" }}>
                            {loans.length} ta tranzaksiya
                        </div>
                    </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
                    <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "1.3rem", fontWeight: 700, color: "oklch(0.45 0.15 25)" }}>
                            {fmtShort(remaining)} so'm
                        </div>
                        <div style={{ fontSize: "1.1rem", color: "#bbb" }}>Qolgan</div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.4rem" }}>
                        <div style={{ fontSize: "1rem", fontWeight: 600, color: "#888" }}>{pct}%</div>
                        <div style={{ width: "60px", height: "4px", background: "#f0f0f0", borderRadius: "99px", overflow: "hidden" }}>
                            <div style={{ width: `${pct}%`, height: "100%", background: "#3b6ef0", transition: "width 0.3s" }} />
                        </div>
                    </div>

                    {loans.length > 1 && (
                        <div style={{ color: "#ccc", fontSize: "1.4rem", transition: "transform 0.2s", transform: expanded ? "rotate(180deg)" : "rotate(0)" }}>
                            ▼
                        </div>
                    )}
                </div>
            </div>

            {expanded && loans.length > 0 && (
                <div className={cls.outstandingGroupBody}>
                    {loans.map((loan) => (
                        <div
                            key={loan.id}
                            className={cls.outstandingLoanRow}
                            onClick={() => onLoanClick(loan.id)}
                            style={{ cursor: "pointer" }}
                        >
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: "1.2rem", fontWeight: 500, color: "#555", marginBottom: "0.3rem" }}>
                                    {loan.reason || "—"}
                                </div>
                                <div style={{ fontSize: "1.1rem", color: "#ccc" }}>
                                    {loan.issued_date} → {loan.due_date || "—"}
                                </div>
                            </div>
                            <div style={{ textAlign: "right" }}>
                                <div style={{ fontSize: "1.2rem", fontWeight: 600, color: "#111" }}>
                                    {fmtShort(loan.remaining_amount)} so'm
                                </div>
                                <div style={{ fontSize: "1.1rem", color: "#ccc" }}>
                                    qoldi: {fmtShort(loan.principal_amount)} so'm dan
                                </div>
                            </div>
                            <button
                                className={cls.outstandingLoanLink}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onLoanClick(loan.id);
                                }}
                            >
                                Ko'rish →
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// ── AdvancedFilterPanel ──────────────────────────────────────────────────────

const AdvancedFilterPanel = ({ filters, onApply, onReset, onClose }) => {
    const [localFilters, setLocalFilters] = useState(filters);

    const handleApply = () => {
        onApply(localFilters);
    };

    return (
        <div className={cls.filterPanel}>
            <h4 style={{ fontSize: "1.4rem", fontWeight: 600, marginBottom: "1.5rem" }}>Qo'shimcha filtrlar</h4>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                <Input
                    type="date"
                    title="Muddat (dan)"
                    value={localFilters.due_date_after}
                    onChange={(e) => setLocalFilters({ ...localFilters, due_date_after: e.target.value })}
                />
                <Input
                    type="date"
                    title="Muddat (gacha)"
                    value={localFilters.due_date_before}
                    onChange={(e) => setLocalFilters({ ...localFilters, due_date_before: e.target.value })}
                />
                <Input
                    type="date"
                    title="Berilgan sana (dan)"
                    value={localFilters.issued_date_after}
                    onChange={(e) => setLocalFilters({ ...localFilters, issued_date_after: e.target.value })}
                />
                <Input
                    type="date"
                    title="Berilgan sana (gacha)"
                    value={localFilters.issued_date_before}
                    onChange={(e) => setLocalFilters({ ...localFilters, issued_date_before: e.target.value })}
                />
                <Input
                    type="number"
                    title="Summa (min)"
                    value={localFilters.principal_min}
                    onChange={(e) => setLocalFilters({ ...localFilters, principal_min: e.target.value })}
                />
                <Input
                    type="number"
                    title="Summa (max)"
                    value={localFilters.principal_max}
                    onChange={(e) => setLocalFilters({ ...localFilters, principal_max: e.target.value })}
                />
            </div>

            <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
                <Button type="filter" onClick={onReset}>Tozalash</Button>
                <Button type="success" onClick={handleApply}>Qo'llash</Button>
            </div>
        </div>
    );
};

// ── LoansTab ──────────────────────────────────────────────────────────────────

const LoansTab = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const branchId = useSelector(getUserBranchId);
    const loans = useSelector(getLoans);
    const outstanding = useSelector(getOutstandingLoans);
    const paymentTypes = useSelector(getCapitalTypes);

    const [activeView, setActiveView] = useState("list");
    const [direction, setDirection] = useState("all");
    const [status, setStatus] = useState("all");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);

    // Pagination
    const [offset, setOffset] = useState(0);
    const PAGE_LIMIT = 15;

    // Advanced filters
    const [showAdvFilters, setShowAdvFilters] = useState(false);
    const [advFilters, setAdvFilters] = useState({
        due_date_after: "",
        due_date_before: "",
        issued_date_after: "",
        issued_date_before: "",
        principal_min: "",
        principal_max: "",
    });

    const [createModal, setCreateModal] = useState(false);
    const [formData, setFormData] = useState({
        counterparty_name: "",
        counterparty_surname: "",
        counterparty_phone: "",
        direction: "out",
        principal_amount: "",
        issued_date: now.toISOString().slice(0, 10),
        due_date: "",
        payment_type_id: "",
        reason: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState(null);

    // Outstanding expanded state
    const [expandedGroups, setExpandedGroups] = useState({});

    useEffect(() => {
        dispatch(getPaymentType());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const activeFilterCount = () => {
        let count = 0;
        if (advFilters.due_date_after) count++;
        if (advFilters.due_date_before) count++;
        if (advFilters.issued_date_after) count++;
        if (advFilters.issued_date_before) count++;
        if (advFilters.principal_min) count++;
        if (advFilters.principal_max) count++;
        return count;
    };

    useEffect(() => {
        if (!branchId) return;
        setLoading(true);
        const params = { branch: branchId, limit: PAGE_LIMIT, offset };
        if (direction !== "all") params.direction = direction;
        if (status !== "all") params.status = status;
        if (search) params.search = search;

        // Add advanced filters
        if (advFilters.due_date_after) params.due_date_after = advFilters.due_date_after;
        if (advFilters.due_date_before) params.due_date_before = advFilters.due_date_before;
        if (advFilters.issued_date_after) params.issued_date_after = advFilters.issued_date_after;
        if (advFilters.issued_date_before) params.issued_date_before = advFilters.issued_date_before;
        if (advFilters.principal_min) params.principal_min = advFilters.principal_min;
        if (advFilters.principal_max) params.principal_max = advFilters.principal_max;

        dispatch(fetchBranchLoans(params)).finally(() => setLoading(false));
    }, [branchId, direction, status, search, offset, advFilters, dispatch]);

    const loadOutstanding = () => {
        if (!branchId) return;
        setLoading(true);
        const params = { branch: branchId };
        if (direction !== "all") params.direction = direction;
        dispatch(fetchOutstandingLoans(params)).finally(() => setLoading(false));
    };

    useEffect(() => {
        if (activeView === "outstanding") {
            loadOutstanding();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeView, branchId, direction]);

    // Reset offset when filters change
    useEffect(() => {
        setOffset(0);
    }, [direction, status, search, advFilters]);

    const handleLoanClick = (loanId) => {
        navigate(`/platform/accounting/loanProfile/${loanId}`);
    };

    const applyAdvFilters = (filters) => {
        setAdvFilters(filters);
        setShowAdvFilters(false);
    };

    const resetAdvFilters = () => {
        setAdvFilters({
            due_date_after: "",
            due_date_before: "",
            issued_date_after: "",
            issued_date_before: "",
            principal_min: "",
            principal_max: "",
        });
        setShowAdvFilters(false);
    };

    const openCreateModal = () => {
        setFormData({
            counterparty_name: "",
            counterparty_surname: "",
            counterparty_phone: "",
            direction: "out",
            principal_amount: "",
            issued_date: now.toISOString().slice(0, 10),
            due_date: "",
            payment_type_id: paymentTypes?.[0]?.id ? String(paymentTypes[0].id) : "",
            reason: "",
        });
        setFormError(null);
        setCreateModal(true);
    };

    const closeCreateModal = () => {
        setCreateModal(false);
        setFormData({
            counterparty_name: "",
            counterparty_surname: "",
            counterparty_phone: "",
            direction: "out",
            principal_amount: "",
            issued_date: now.toISOString().slice(0, 10),
            due_date: "",
            payment_type_id: "",
            reason: "",
        });
        setFormError(null);
    };

    const handleSubmit = () => {
        if (!formData.counterparty_name.trim()) { setFormError("Ismni kiriting"); return; }
        if (!formData.counterparty_surname.trim()) { setFormError("Familiyani kiriting"); return; }
        if (!formData.counterparty_phone.trim()) { setFormError("Telefonni kiriting"); return; }
        if (Number(formData.principal_amount) <= 0) { setFormError("To'g'ri summa kiriting"); return; }
        if (!formData.reason.trim()) { setFormError("Sababni kiriting"); return; }
        if (!formData.payment_type_id) { setFormError("To'lov turini tanlang"); return; }
        if (formData.direction === "out" && !formData.due_date) { setFormError("Muddatni kiriting"); return; }

        const body = {
            branch_id: branchId,
            counterparty_id: 0,
            counterparty_name: formData.counterparty_name.trim(),
            counterparty_surname: formData.counterparty_surname.trim(),
            counterparty_phone: formData.counterparty_phone.trim(),
            direction: formData.direction,
            principal_amount: Number(formData.principal_amount),
            issued_date: formData.issued_date,
            payment_type_id: Number(formData.payment_type_id),
            reason: formData.reason.trim(),
        };

        if (formData.direction === "out" && formData.due_date) {
            body.due_date = formData.due_date;
        }

        setSubmitting(true);
        setFormError(null);

        dispatch(createLoan(body))
            .unwrap()
            .then(() => {
                closeCreateModal();
                const params = { branch: branchId };
                if (direction !== "all") params.direction = direction;
                if (status !== "all") params.status = status;
                if (search) params.search = search;
                dispatch(fetchBranchLoans(params));
            })
            .catch((error) => {
                setFormError(error || "Xatolik yuz berdi");
            })
            .finally(() => {
                setSubmitting(false);
            });
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {/* Toolbar */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {/* View toggle buttons */}
                <div style={{ display: "flex", gap: "1rem" }}>
                    <button
                        className={`${cls.viewToggle} ${activeView === "list" ? cls.viewToggleActive : ""}`}
                        onClick={() => setActiveView("list")}
                    >
                        Ro'yxat
                    </button>
                    <button
                        className={`${cls.viewToggle} ${activeView === "outstanding" ? cls.viewToggleActive : ""}`}
                        onClick={() => setActiveView("outstanding")}
                    >
                        Faol tranzaksiyalar
                    </button>
                </div>

                {/* Filters row */}
                <div className={cls.filters}>
                    {activeView === "list" && (
                        <Select
                            options={LOAN_STATUS_OPTIONS}
                            defaultValue={status}
                            onChangeOption={setStatus}
                            titleOption="Status"
                        />
                    )}

                    <Select
                        options={LOAN_DIRECTION_OPTIONS}
                        defaultValue={direction}
                        onChangeOption={setDirection}
                        titleOption="Yo'nalish"
                    />

                    {activeView === "list" && (
                        <Input
                            type="text"
                            placeholder="Qidirish..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            extraClassName={cls.loansSearchInput}
                        />
                    )}

                    <div style={{ marginLeft: "auto" }}>
                        <Button type="success" onClick={openCreateModal}>+ Tranzaksiya qo'shish</Button>
                    </div>
                </div>
            </div>

            {/* Loading skeleton */}
            {loading && activeView === "list" && (
                <p className={cls.empty}>Yuklanmoqda...</p>
            )}

            {!loading && activeView === "list" && (
                <UniversalTable
                    data={loans.results || []}
                    loading={false}
                    columns={[
                        { label: "No", sortKey: null },
                        { label: "Kontragent", sortKey: "counterparty" },
                        { label: "Sabab", sortKey: "reason" },
                        { label: "Asosiy summa", sortKey: "principal_amount" },
                        { label: "To'langan", sortKey: "paid_total" },
                        { label: "Qoldiq", sortKey: "remaining_amount" },
                        { label: "Yo'nalish", sortKey: "direction" },
                        { label: "Status", sortKey: "status" },
                        { label: "Berilgan sana", sortKey: "issued_date" },
                        { label: "Muddat", sortKey: "due_date" },
                    ]}
                    renderRow={(loan, idx) => {
                        const overdue = isOverdue(loan);
                        return (
                            <tr
                                key={loan.id}
                                onClick={() => handleLoanClick(loan.id)}
                                className={overdue ? cls.overdueRow : ""}
                                style={{ cursor: "pointer" }}
                            >
                                <td>{offset + idx + 1}</td>
                                <td>
                                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                        <div className={cls.avatar}>
                                            {initials(loan.counterparty)}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: "1.2rem", color: "#111" }}>
                                                {loan.counterparty?.name} {loan.counterparty?.surname}
                                            </div>
                                            <div style={{ fontSize: "1rem", color: "#ccc" }}>
                                                {loan.counterparty?.phone || "—"}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ maxWidth: "160px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {loan.reason || "—"}
                                </td>
                                <td style={{ fontWeight: 600 }}>
                                    {fmtShort(loan.principal_amount)} so'm
                                </td>
                                <td style={{ fontWeight: 500, color: "oklch(0.38 0.13 145)" }}>
                                    {fmtShort(loan.paid_total)}
                                </td>
                                <td style={{ fontWeight: 500, color: "oklch(0.45 0.15 25)" }}>
                                    {fmtShort(loan.remaining_amount)}
                                </td>
                                <td>
                                    <span className={loan.direction === "out" ? cls.badgeDirOut : cls.badgeDirIn}>
                                        {loan.direction === "out" ? "↑ Berilgan" : "↓ Olingan"}
                                    </span>
                                </td>
                                <td>
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3rem" }}>
                                        <span className={
                                            loan.status === "active" ? cls.badgeStatusActive :
                                            loan.status === "settled" ? cls.badgeStatusSettled :
                                            cls.badgeStatusCancelled
                                        }>
                                            {loan.status === "active" ? "Faol" :
                                             loan.status === "settled" ? "Yopilgan" :
                                             "Bekor qilingan"}
                                        </span>
                                        {overdue && (
                                            <span style={{ fontSize: "1rem", color: "oklch(0.45 0.15 25)", fontWeight: 500 }}>
                                                {Math.abs(daysLeft(loan.due_date))} kun o'tgan
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td style={{ color: "#aaa" }}>
                                    {loan.issued_date || "—"}
                                </td>
                                <td style={{
                                    color: overdue ? "oklch(0.45 0.15 25)" : "#aaa",
                                    fontWeight: overdue ? 600 : 400
                                }}>
                                    {loan.due_date || "—"}
                                </td>
                            </tr>
                        );
                    }}
                    onSort={true}
                />
            )}

            {/* Pagination */}
            {!loading && activeView === "list" && loans.results && loans.results.length > 0 && (
                <div className={cls.pagination}>
                    <div className={cls.paginationInfo}>
                        Jami <strong>{loans.count || 0}</strong> ta · {Math.floor(offset / PAGE_LIMIT) + 1}/{Math.ceil((loans.count || 0) / PAGE_LIMIT)} sahifa
                    </div>
                    <div className={cls.paginationButtons}>
                        <button
                            className={cls.paginationBtn}
                            disabled={offset === 0}
                            onClick={() => setOffset(Math.max(0, offset - PAGE_LIMIT))}
                        >
                            ‹
                        </button>
                        {(() => {
                            const totalPages = Math.ceil((loans.count || 0) / PAGE_LIMIT);
                            const currentPage = Math.floor(offset / PAGE_LIMIT) + 1;
                            const pages = [];

                            let startPage = Math.max(1, currentPage - 2);
                            let endPage = Math.min(totalPages, startPage + 4);

                            if (endPage - startPage < 4) {
                                startPage = Math.max(1, endPage - 4);
                            }

                            for (let i = startPage; i <= endPage; i++) {
                                pages.push(
                                    <button
                                        key={i}
                                        className={`${cls.paginationBtn} ${i === currentPage ? cls.paginationBtnActive : ""}`}
                                        onClick={() => setOffset((i - 1) * PAGE_LIMIT)}
                                    >
                                        {i}
                                    </button>
                                );
                            }
                            return pages;
                        })()}
                        <button
                            className={cls.paginationBtn}
                            disabled={offset + PAGE_LIMIT >= (loans.count || 0)}
                            onClick={() => setOffset(offset + PAGE_LIMIT)}
                        >
                            ›
                        </button>
                    </div>
                </div>
            )}

            {!loading && activeView === "outstanding" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                    {(!outstanding || outstanding.length === 0) ? (
                        <p className={cls.empty}>Faol tranzaksiyalar topilmadi</p>
                    ) : outstanding.map((item) => {
                        const groupKey = `${item.counterparty.id}-${item.direction}`;
                        const pct = item.loaned_total > 0 ? Math.round((item.paid_total / item.loaned_total) * 100) : 0;

                        return (
                            <OutstandingGroup
                                key={groupKey}
                                item={item}
                                expanded={expandedGroups[groupKey] || false}
                                onToggle={() => setExpandedGroups({ ...expandedGroups, [groupKey]: !expandedGroups[groupKey] })}
                                onLoanClick={handleLoanClick}
                                fmtShort={fmtShort}
                                initials={initials}
                                pct={pct}
                            />
                        );
                    })}
                </div>
            )}

            <Modal active={createModal} setActive={closeCreateModal}>
                <div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "0.5rem", minWidth: 360 }}>
                    <h3 style={{ fontSize: "1.8rem", fontWeight: 700, margin: 0 }}>Yangi tranzaksiya</h3>

                    <Input
                        type="text"
                        title="Ism *"
                        value={formData.counterparty_name}
                        onChange={(e) => setFormData((f) => ({ ...f, counterparty_name: e.target.value }))}
                    />

                    <Input
                        type="text"
                        title="Familiya *"
                        value={formData.counterparty_surname}
                        onChange={(e) => setFormData((f) => ({ ...f, counterparty_surname: e.target.value }))}
                    />

                    <Input
                        type="text"
                        title="Telefon *"
                        value={formData.counterparty_phone}
                        onChange={(e) => setFormData((f) => ({ ...f, counterparty_phone: e.target.value }))}
                    />

                    <Select
                        options={[
                            { id: "out", name: "Chiqim (Filial berdi)" },
                            { id: "in", name: "Kirim (Filial oldi)" }
                        ]}
                        defaultValue={formData.direction}
                        onChangeOption={(v) => setFormData((f) => ({ ...f, direction: v }))}
                        titleOption="Yo'nalish *"
                        extraClass={cls.selectFull}
                    />

                    <Input
                        type="number"
                        title="Asosiy summa *"
                        value={formData.principal_amount}
                        onChange={(e) => setFormData((f) => ({ ...f, principal_amount: e.target.value }))}
                    />

                    <Input
                        type="text"
                        title="Sabab *"
                        value={formData.reason}
                        onChange={(e) => setFormData((f) => ({ ...f, reason: e.target.value }))}
                    />

                    <Select
                        options={paymentTypes?.map((pt) => ({ id: String(pt.id), name: pt.name })) ?? []}
                        defaultValue={formData.payment_type_id}
                        onChangeOption={(v) => setFormData((f) => ({ ...f, payment_type_id: v }))}
                        titleOption="To'lov turi *"
                        extraClass={cls.selectFull}
                    />

                    <Input
                        type="date"
                        title="Berilgan sana *"
                        value={formData.issued_date}
                        onChange={(e) => setFormData((f) => ({ ...f, issued_date: e.target.value }))}
                    />

                    <Input
                        type="date"
                        title="Muddat *"
                        value={formData.due_date}
                        onChange={(e) => setFormData((f) => ({ ...f, due_date: e.target.value }))}
                    />

                    {formError && <span style={{ color: "#ef4444", fontSize: "1.3rem" }}>{formError}</span>}

                    <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
                        <Button type="filter" onClick={closeCreateModal} disabled={submitting}>Bekor</Button>
                        <Button type="success" onClick={handleSubmit} disabled={submitting}>
                            {submitting ? "Yuborilmoqda..." : "Qo'shish"}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

// ── Tab bar ───────────────────────────────────────────────────────────────────

const TABS = [
    { id: "types", label: "Xarajat turlari" },
    { id: "logs", label: "Oylik xarajatlar" },
    { id: "loans", label: "Tranzaksiyalar" },
];

// ── Main component ────────────────────────────────────────────────────────────

export const OverheadTypes = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const queryTab = searchParams.get("tab");
    const focusLogId = searchParams.get("log_id");
    const queryMonth = Number(searchParams.get("month"));
    const queryYear = Number(searchParams.get("year"));
    const [activeTab, setActiveTab] = useState(queryTab || (focusLogId ? "logs" : "types"));

    useEffect(() => {
        if (queryTab) setActiveTab(queryTab);
        else if (focusLogId) setActiveTab("logs");
    }, [queryTab, focusLogId]);

    return (
        <div className={cls.page}>
            {/* Header */}
            <div className={cls.header}>
                <button className={cls.backBtn} onClick={() => navigate(-1)}>
                    ← Orqaga
                </button>
                <h2 className={cls.title}>Xarajat turlari</h2>
            </div>

            {/* Tabs */}
            <div className={cls.tabs}>
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        className={`${cls.tab} ${activeTab === tab.id ? cls.tabActive : ""}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className={cls.tabContent}>
                {activeTab === "types" && <TypesTab />}
                {activeTab === "logs" && (
                    <LogsTab
                        focusLogId={focusLogId}
                        initialMonth={queryMonth || undefined}
                        initialYear={queryYear || undefined}
                    />
                )}
                {activeTab === "loans" && <LoansTab />}
            </div>
        </div>
    );
};
