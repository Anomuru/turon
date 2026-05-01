import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { API_URL, headers, useHttp } from "shared/api/base";
import { getUserBranchId } from "entities/profile/userProfile";
import { getCapitalTypes } from "entities/capital";
import { getPaymentType } from "entities/capital/model/thunk/capitalThunk";
import { fetchLoans, getLoans, getLoansLoading, getLoansError } from "entities/loans";
import { Button } from "shared/ui/button";
import { Select } from "shared/ui/select";
import { Modal } from "shared/ui/modal";
import { Radio } from "shared/ui/radio";
import { Input } from "shared/ui/input";
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
    { id: "unpaid", name: "To'lanmagan" },
];

const DIRECTION_OPTIONS = [
    { id: "all", name: "Hammasi" },
    { id: "give", name: "Berildi" },
    { id: "receive", name: "Olindi" },
];

const IS_GIVE_OPTIONS = [
    { id: "true", name: "Berildi" },
    { id: "false", name: "Olindi" },
];

const fmt = (n) => Number(n || 0).toLocaleString();

// ── TypesTab ─────────────────────────────────────────────────────────────────

const TypesTab = () => {
    const { request } = useHttp();
    const branchId = useSelector(getUserBranchId);
    const [types, setTypes] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!branchId) return;
        setLoading(true);
        request(`${API_URL}Overhead/overheads_type/?branch_id=${branchId}`, "GET", null, headers())
            .then((res) => setTypes(res?.data ?? (Array.isArray(res) ? res : [])))
            .catch(() => { })
            .finally(() => setLoading(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [branchId]);

    if (loading) return <p className={cls.empty}>Yuklanmoqda...</p>;

    return (
        <div className={cls.tableWrapper}>
            <table className={cls.table}>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Nomi</th>
                        <th className={cls.right}>Narxi</th>
                        <th className={cls.center}>O'zgartiriladi</th>
                        <th className={cls.center}>Tartib</th>
                    </tr>
                </thead>
                <tbody>
                    {types.length === 0 ? (
                        <tr>
                            <td colSpan={5} className={cls.empty}>Ma'lumot topilmadi</td>
                        </tr>
                    ) : types.map((t) => (
                        <tr key={t.id}>
                            <td style={{ color: "#9ca3af" }}>{t.id}</td>
                            <td style={{ fontWeight: 500 }}>{t.name}</td>
                            <td className={cls.right} style={{ fontFamily: "monospace" }}>{fmt(t.cost)} UZS</td>
                            <td className={cls.center}>
                                <span className={t.changeable ? cls.badgeGreen : cls.badgeGray}>
                                    {t.changeable ? "Ha" : "Yo'q"}
                                </span>
                            </td>
                            <td className={cls.center} style={{ color: "#6b7280" }}>{t.order}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// ── LogsTab ───────────────────────────────────────────────────────────────────

const LogsTab = () => {
    const { request } = useHttp();
    const dispatch = useDispatch();
    const branchId = useSelector(getUserBranchId);
    const paymentTypes = useSelector(getCapitalTypes);

    const [month, setMonth] = useState(now.getMonth() + 1);
    const [year, setYear] = useState(now.getFullYear());
    const [status, setStatus] = useState("all");

    const [summary, setSummary] = useState(null);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [payModal, setPayModal] = useState(false);
    const [selectedLog, setSelectedLog] = useState(null);
    const [paymentTypeId, setPaymentTypeId] = useState("");
    const [payDate, setPayDate] = useState(now.toISOString().slice(0, 10));
    const [paying, setPaying] = useState(false);
    const [payError, setPayError] = useState(null);

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
        setPayDate(now.toISOString().slice(0, 10));
        setPayError(null);
        setPayModal(true);
    };

    const handlePay = () => {
        if (!paymentTypeId) { setPayError("To'lov turini tanlang"); return; }
        setPaying(true);
        setPayError(null);
        request(
            `${API_URL}Overhead/overhead_type_logs/pay/`,
            "POST",
            JSON.stringify({
                payment_type_id: Number(paymentTypeId),
                branch_id: branchId,
                date: payDate,
                log_id: selectedLog.id,
                amount: selectedLog.cost,
            }),
            headers()
        )
            .then((res) => {
                if (res?.success) { setPayModal(false); loadLogs(); }
                else setPayError(res?.message || "Xatolik yuz berdi");
            })
            .catch(() => setPayError("Serverga ulanib bo'lmadi"))
            .finally(() => setPaying(false));
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {/* Filters */}
            <div className={cls.filters}>
                <Select options={MONTHS} defaultValue={month} onChangeOption={(v) => setMonth(Number(v))} titleOption="Oy" />
                <Select options={YEARS} defaultValue={year} onChangeOption={(v) => setYear(Number(v))} titleOption="Yil" />
                <Select options={STATUS_OPTIONS} defaultValue={status} onChangeOption={setStatus} titleOption="Status" />
            </div>

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

            {loading && <p className={cls.empty}>Yuklanmoqda...</p>}
            {error && <p className={cls.error}>{error}</p>}

            {!loading && !error && (
                <div className={cls.tableWrapper}>
                    <table className={cls.table}>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Tur nomi</th>
                                <th className={cls.right}>Narxi</th>
                                <th className={cls.center}>Holat</th>
                                <th className={cls.center}>Sana</th>
                                <th className={cls.center}>To'lov sanasi</th>
                                <th />
                            </tr>
                        </thead>
                        <tbody>
                            {logs.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className={cls.empty}>Ma'lumot topilmadi</td>
                                </tr>
                            ) : logs.map((log, idx) => (
                                <tr key={log.id}>
                                    <td style={{ color: "#9ca3af" }}>{idx + 1}</td>
                                    <td style={{ fontWeight: 500 }}>{log.overhead_type_name}</td>
                                    <td className={cls.right} style={{ fontFamily: "monospace" }}>{fmt(log.cost)} UZS</td>
                                    <td className={cls.center}>
                                        {log.is_prepaid
                                            ? <span className={cls.badgeYellow}>Oldindan</span>
                                            : log.is_paid
                                                ? <span className={cls.badgeGreen}>To'langan</span>
                                                : <span className={cls.badgeRed}>To'lanmagan</span>
                                        }
                                    </td>
                                    <td className={cls.center} style={{ color: "#6b7280" }}>{log.date || "—"}</td>
                                    <td className={cls.center} style={{ color: "#6b7280" }}>{log.paid_date || "—"}</td>
                                    <td className={cls.center}>
                                        {!log.is_paid && (
                                            <Button type="success" onClick={() => openPayModal(log)}>To'lash</Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Modal active={payModal} setActive={setPayModal}>
                <div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.8rem", minWidth: 320 }}>
                    <h3 style={{ fontSize: "1.8rem", fontWeight: 700, margin: 0 }}>
                        To'lov: {selectedLog?.overhead_type_name}
                    </h3>
                    <div>
                        <span style={{ fontSize: "1.3rem", color: "#6b7280" }}>Summa: </span>
                        <span style={{ fontSize: "1.8rem", fontWeight: 700 }}>{fmt(selectedLog?.cost)} UZS</span>
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
                    <Input type="date" title="Sana" value={payDate} onChange={(e) => setPayDate(e.target.value)} />
                    {payError && <span style={{ color: "#ef4444", fontSize: "1.3rem" }}>{payError}</span>}
                    <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
                        <Button type="filter" onClick={() => setPayModal(false)} disabled={paying}>Bekor</Button>
                        <Button type="success" onClick={handlePay} disabled={paying}>
                            {paying ? "Yuborilmoqda..." : "To'lash"}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

// ── TransactionsTab ───────────────────────────────────────────────────────────

const TransactionsTab = () => {
    const { request } = useHttp();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const branchId = useSelector(getUserBranchId);
    const paymentTypes = useSelector(getCapitalTypes);

    const [month, setMonth] = useState(now.getMonth() + 1);
    const [year, setYear] = useState(now.getFullYear());
    const [direction, setDirection] = useState("all");
    const [showDeleted, setShowDeleted] = useState(false);

    const [summary, setSummary] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formModal, setFormModal] = useState(false);
    const [editTarget, setEditTarget] = useState(null);
    const [formData, setFormData] = useState({
        person_name: "",
        amount: "", is_give: "true", reason: "",
        payment_type_id: "", date: now.toISOString().slice(0, 10),
    });
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState(null);

    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState(null);

    useEffect(() => {
        dispatch(getPaymentType());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadData = useCallback(() => {
        if (!branchId || !month || !year) return;
        setLoading(true);
        setError(null);
        setSummary(null);
        const params = new URLSearchParams({ branch_id: branchId });
        const url = showDeleted
            ? `${API_URL}Branch/branch_transaction/deleted/${month}/${year}/?${params}`
            : (() => { if (direction !== "all") params.set("direction", direction); return `${API_URL}Branch/branch_transaction/${month}/${year}/?${params}`; })();
        request(url, "GET", null, headers())
            .then((res) => {
                if (res?.success) {
                    setSummary(res.summary ?? null);
                    setTransactions(Array.isArray(res.data) ? res.data : []);
                } else {
                    setError("Ma'lumotlarni yuklashda xatolik");
                }
            })
            .catch(() => setError("Serverga ulanib bo'lmadi"))
            .finally(() => setLoading(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [branchId, month, year, direction, showDeleted]);

    useEffect(() => { loadData(); }, [loadData]);

    const emptyForm = () => ({
        person_name: "",
        amount: "", is_give: "true", reason: "",
        payment_type_id: paymentTypes?.[0]?.id ? String(paymentTypes[0].id) : "",
        date: new Date().toISOString().slice(0, 10),
    });

    const closeFormModal = () => {
        setFormModal(false);
        setEditTarget(null);
        setFormData(emptyForm());
        setFormError(null);
    };

    const openCreate = () => {
        setEditTarget(null);
        setFormData(emptyForm());
        setFormError(null);
        setFormModal(true);
    };

    const openEdit = (tx) => {
        setEditTarget(tx);
        setFormData({
            person_name: [tx.person?.name, tx.person?.surname].filter(Boolean).join(" "),
            amount: String(tx.amount),
            is_give: String(tx.is_give),
            reason: tx.reason || "",
            payment_type_id: String(tx.payment_type?.id || ""),
            date: tx.date || new Date().toISOString().slice(0, 10),
        });
        setFormError(null);
        setFormModal(true);
    };

    const handleSubmit = () => {
        if (!formData.person_name.trim()) { setFormError("Ism va familiyani kiriting"); return; }
        if (Number(formData.amount) <= 0) { setFormError("To'g'ri summa kiriting"); return; }
        if (!formData.reason.trim()) { setFormError("Sababni kiriting"); return; }
        if (!formData.payment_type_id) { setFormError("To'lov turini tanlang"); return; }

        const body = {
            amount: Number(formData.amount),
            is_give: formData.is_give === "true",
            reason: formData.reason.trim(),
            payment_type_id: Number(formData.payment_type_id),
            branch_id: branchId,
            date: formData.date,
            person_name: formData.person_name.trim(),
        };

        setSubmitting(true);
        setFormError(null);

        const url = editTarget
            ? `${API_URL}Branch/branch_transaction/${editTarget.id}/update/`
            : `${API_URL}Branch/branch_transaction/`;
        const method = editTarget ? "PUT" : "POST";

        request(url, method, JSON.stringify(body), headers())
            .then((res) => {
                if (res?.success) { closeFormModal(); loadData(); }
                else setFormError(res?.message || "Xatolik yuz berdi");
            })
            .catch(() => setFormError("Serverga ulanib bo'lmadi"))
            .finally(() => setSubmitting(false));
    };

    const handleDelete = () => {
        if (!deleteTarget) return;
        setDeleting(true);
        setDeleteError(null);
        request(
            `${API_URL}Branch/branch_transaction/${deleteTarget.id}/delete/`,
            "DELETE", null, headers()
        )
            .then((res) => {
                if (res?.success) { setDeleteTarget(null); loadData(); }
                else setDeleteError(res?.message || "O'chirishda xatolik");
            })
            .catch(() => setDeleteError("Serverga ulanib bo'lmadi"))
            .finally(() => setDeleting(false));
    };

    const personLabel = (person) => {
        if (!person) return "—";
        const full = [person.name, person.surname].filter(Boolean).join(" ");
        return full || "—";
    };

    const handleRowClick = (tx) => {
        if (tx.id) {
            navigate(`/platform/accounting/loanProfile/${tx.id}`);
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <div className={cls.filters}>
                <Select options={MONTHS} defaultValue={month} onChangeOption={(v) => setMonth(Number(v))} titleOption="Oy" />
                <Select options={YEARS} defaultValue={year} onChangeOption={(v) => setYear(Number(v))} titleOption="Yil" />
                {!showDeleted && (
                    <Select options={DIRECTION_OPTIONS} defaultValue={direction} onChangeOption={setDirection} titleOption="Yo'nalish" />
                )}
                <div className={cls.filterActions}>
                    <button
                        className={`${cls.deletedToggle} ${showDeleted ? cls.deletedToggleActive : ""}`}
                        onClick={() => setShowDeleted((v) => !v)}
                    >
                        <i className="fa fa-trash" style={{ marginRight: "0.5rem" }} />
                        O'chirilganlar
                    </button>
                    {!showDeleted && (
                        <Button type="success" onClick={openCreate}>+ Qo'shish</Button>
                    )}
                </div>
            </div>

            {summary && (
                <div className={cls.cards}>
                    <div className={cls.card}>
                        <div className={cls.cardHeader}>Berildi <span>📤</span></div>
                        <div className={cls.cardAmount} style={{ color: "#dc2626" }}>{fmt(summary.total_given)} UZS</div>
                    </div>
                    <div className={cls.card}>
                        <div className={cls.cardHeader}>Olindi <span>📥</span></div>
                        <div className={cls.cardAmount} style={{ color: "#16a34a" }}>{fmt(summary.total_received)} UZS</div>
                    </div>
                    <div className={cls.card}>
                        <div className={cls.cardHeader}>Saldo <span>📊</span></div>
                        <div className={cls.cardAmount} style={{ color: summary.net >= 0 ? "#16a34a" : "#dc2626" }}>
                            {summary.net >= 0 ? "+" : ""}{fmt(summary.net)} UZS
                        </div>
                    </div>
                </div>
            )}

            {loading && <p className={cls.empty}>Yuklanmoqda...</p>}
            {error && <p className={cls.error}>{error}</p>}

            {!loading && !error && (
                <div className={cls.tableWrapper}>
                    <table className={cls.table}>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Shaxs</th>
                                <th>Sabab</th>
                                <th className={cls.right}>Summa</th>
                                <th className={cls.center}>Yo'nalish</th>
                                <th className={cls.center}>To'lov turi</th>
                                <th className={cls.center}>Sana</th>
                                <th />
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className={cls.empty}>Ma'lumot topilmadi</td>
                                </tr>
                            ) : transactions.map((tx, idx) => (
                                <tr key={tx.id} onClick={() => handleRowClick(tx)} style={{ cursor: "pointer" }}>
                                    <td style={{ color: "#9ca3af" }}>{idx + 1}</td>
                                    <td style={{ fontWeight: 500 }}>{personLabel(tx.person)}</td>
                                    <td style={{ color: "#374151" }}>{tx.reason || "—"}</td>
                                    <td className={cls.right} style={{ fontFamily: "monospace" }}>{fmt(tx.amount)} UZS</td>
                                    <td className={cls.center}>
                                        {tx.direction === "give"
                                            ? <span className={cls.badgeRed}>Berildi</span>
                                            : <span className={cls.badgeGreen}>Olindi</span>}
                                    </td>
                                    <td className={cls.center} style={{ color: "#6b7280" }}>{tx.payment_type?.name || "—"}</td>
                                    <td className={cls.center} style={{ color: "#6b7280" }}>{tx.date || "—"}</td>
                                    <td className={cls.center}>
                                        {showDeleted
                                            ? <span className={cls.badgeGray}>O'chirilgan</span>
                                            : (
                                                <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center" }}>
                                                    <i className={`fa fa-pen ${cls.iconEdit}`} onClick={(e) => { e.stopPropagation(); openEdit(tx); }} />
                                                    <i className={`fa fa-trash ${cls.iconDelete}`} onClick={(e) => { e.stopPropagation(); setDeleteTarget(tx); }} />
                                                </div>
                                            )
                                        }
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Modal active={formModal} setActive={closeFormModal}>
                <div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem", minWidth: 360 }}>
                    <h3 style={{ fontSize: "1.8rem", fontWeight: 700, margin: 0 }}>
                        {editTarget ? "Tranzaksiyani tahrirlash" : "Yangi tranzaksiya"}
                    </h3>

                    <Input type="text" title="Ism va familiya *" value={formData.person_name}
                        onChange={(e) => setFormData((f) => ({ ...f, person_name: e.target.value }))} />

                    <Select
                        options={IS_GIVE_OPTIONS}
                        defaultValue={formData.is_give}
                        onChangeOption={(v) => setFormData((f) => ({ ...f, is_give: v }))}
                        titleOption="Yo'nalish *"
                        extraClass={cls.selectFull}
                    />

                    <Input type="number" title="Summa *" value={formData.amount}
                        onChange={(e) => setFormData((f) => ({ ...f, amount: e.target.value }))} />

                    <Input type="text" title="Sabab *" value={formData.reason}
                        onChange={(e) => setFormData((f) => ({ ...f, reason: e.target.value }))} />

                    <Select
                        options={paymentTypes?.map((pt) => ({ id: String(pt.id), name: pt.name })) ?? []}
                        defaultValue={formData.payment_type_id}
                        onChangeOption={(v) => setFormData((f) => ({ ...f, payment_type_id: v }))}
                        titleOption="To'lov turi *"
                        extraClass={cls.selectFull}
                    />

                    <Input type="date" title="Sana *" value={formData.date}
                        onChange={(e) => setFormData((f) => ({ ...f, date: e.target.value }))} />

                    {formError && <span style={{ color: "#ef4444", fontSize: "1.3rem" }}>{formError}</span>}

                    <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
                        <Button type="filter" onClick={closeFormModal} disabled={submitting}>Bekor</Button>
                        <Button type="success" onClick={handleSubmit} disabled={submitting}>
                            {submitting ? "Yuborilmoqda..." : (editTarget ? "Saqlash" : "Qo'shish")}
                        </Button>
                    </div>
                </div>
            </Modal>

            <Modal active={!!deleteTarget} setActive={() => { setDeleteTarget(null); setDeleteError(null); }}>
                <div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem", minWidth: 300 }}>
                    <h3 style={{ fontSize: "1.8rem", fontWeight: 700, margin: 0 }}>O'chirishni tasdiqlang</h3>
                    <p style={{ fontSize: "1.4rem", color: "#374151", margin: 0 }}>
                        Bu tranzaksiya o'chirilsinmi?
                    </p>
                    {deleteError && <span style={{ color: "#ef4444", fontSize: "1.3rem" }}>{deleteError}</span>}
                    <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
                        <Button type="filter" onClick={() => { setDeleteTarget(null); setDeleteError(null); }} disabled={deleting}>Bekor</Button>
                        <button className={cls.btnDanger} onClick={handleDelete} disabled={deleting}>
                            {deleting ? "O'chirilmoqda..." : "O'chirish"}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

// ── LoansTab ──────────────────────────────────────────────────────────────────

const LoansTab = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const branchId = useSelector(getUserBranchId);

    const loans = useSelector(getLoans);
    const loading = useSelector(getLoansLoading);
    const error = useSelector(getLoansError);

    const [filters, setFilters] = useState({
        direction: "",
        status: "",
        search: "",
    });

    useEffect(() => {
        if (branchId) {
            dispatch(fetchLoans({ branchId, filters }));
        }
    }, [dispatch, branchId, filters]);

    const handleRowClick = (loan) => {
        if (loan.id) {
            navigate(`/platform/accounting/loanProfile/${loan.id}`);
        }
    };

    const personLabel = (person) => {
        if (!person) return "—";
        return [person.name, person.surname].filter(Boolean).join(" ") || "—";
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {/* Filters */}
            <div className={cls.filters}>
                <Input
                    type="text"
                    title="Qidiruv"
                    value={filters.search}
                    onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
                    placeholder="Ism, sabab bo'yicha qidirish..."
                />
                <Select
                    options={[
                        { id: "", name: "Hammasi" },
                        { id: "in", name: "Olindi" },
                        { id: "out", name: "Berildi" },
                    ]}
                    defaultValue={filters.direction}
                    onChangeOption={(v) => setFilters((f) => ({ ...f, direction: v }))}
                    titleOption="Yo'nalish"
                />
                <Select
                    options={[
                        { id: "", name: "Hammasi" },
                        { id: "active", name: "Faol" },
                        { id: "settled", name: "To'langan" },
                        { id: "cancelled", name: "Bekor qilingan" },
                    ]}
                    defaultValue={filters.status}
                    onChangeOption={(v) => setFilters((f) => ({ ...f, status: v }))}
                    titleOption="Status"
                />
            </div>

            {loading && <p className={cls.empty}>Yuklanmoqda...</p>}
            {error && <p className={cls.error}>{error}</p>}

            {!loading && !error && (
                <div className={cls.tableWrapper}>
                    <table className={cls.table}>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Kontragent</th>
                                <th className={cls.right}>Asosiy summa</th>
                                <th className={cls.right}>To'langan</th>
                                <th className={cls.right}>Qoldiq</th>
                                <th className={cls.center}>Yo'nalish</th>
                                <th className={cls.center}>Status</th>
                                <th className={cls.center}>Berilgan sana</th>
                                <th className={cls.center}>Tugash sanasi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loans.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className={cls.empty}>Ma'lumot topilmadi</td>
                                </tr>
                            ) : loans.map((loan, idx) => (
                                <tr key={loan.id} onClick={() => handleRowClick(loan)} style={{ cursor: "pointer" }}>
                                    <td style={{ color: "#9ca3af" }}>{idx + 1}</td>
                                    <td style={{ fontWeight: 500 }}>{personLabel(loan.counterparty)}</td>
                                    <td className={cls.right} style={{ fontFamily: "monospace" }}>{fmt(loan.principal_amount)} UZS</td>
                                    <td className={cls.right} style={{ fontFamily: "monospace", color: "#16a34a" }}>{fmt(loan.paid_total)} UZS</td>
                                    <td className={cls.right} style={{ fontFamily: "monospace", color: loan.remaining_amount > 0 ? "#dc2626" : "#16a34a" }}>
                                        {fmt(loan.remaining_amount)} UZS
                                    </td>
                                    <td className={cls.center}>
                                        {loan.direction === "out"
                                            ? <span className={cls.badgeRed}>Berildi</span>
                                            : <span className={cls.badgeGreen}>Olindi</span>}
                                    </td>
                                    <td className={cls.center}>
                                        {loan.status === "cancelled"
                                            ? <span className={cls.badgeGray}>Bekor qilingan</span>
                                            : loan.is_settled
                                                ? <span className={cls.badgeGreen}>To'langan</span>
                                                : <span className={cls.badgeYellow}>Faol</span>
                                        }
                                    </td>
                                    <td className={cls.center} style={{ color: "#6b7280" }}>{loan.issued_date || "—"}</td>
                                    <td className={cls.center} style={{ color: "#6b7280" }}>{loan.due_date || "—"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

// ── Tab bar ───────────────────────────────────────────────────────────────────

const TABS = [
    { id: "types", label: "Xarajat turlari" },
    { id: "logs", label: "Oylik xarajatlar" },
    { id: "transactions", label: "Filial tranzaksiyalari" },
    { id: "loans", label: "Qarzlar" },
];

// ── Main component ────────────────────────────────────────────────────────────

export const OverheadTypes = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("types");

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
            {activeTab === "types" && <TypesTab />}
            {activeTab === "logs" && <LogsTab />}
            {activeTab === "transactions" && <TransactionsTab />}
            {activeTab === "loans" && <LoansTab />}
        </div>
    );
};
