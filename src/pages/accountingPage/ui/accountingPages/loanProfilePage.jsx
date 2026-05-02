import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
    fetchLoanProfile,
    updateLoanProfile,
    repayLoan,
    cancelLoan,
    clearLoanProfile,
    getLoanProfile,
    getLoanProfileLoading,
    getLoanProfileError,
    getLoanProfileUpdating,
    getLoanProfileRepaying,
    getLoanProfileCancelling,
} from "entities/loanProfile";
import cls from "./loanProfile.module.sass";

const fmt = (n) => {
    const num = Number(n || 0);
    if (num >= 1000000) {
        return `${(num / 1000000).toFixed(1)} mln`;
    }
    return num.toLocaleString("uz-UZ");
};

const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
};

const getDaysRemaining = (dueDate) => {
    if (!dueDate) return null;
    const now = new Date();
    const due = new Date(dueDate);
    const diff = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
    return diff;
};

const DonutProgress = ({ percentage }) => {
    const radius = 35.5;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className={cls.donutProgress}>
            <svg>
                <circle className={cls.track} cx="40" cy="40" r={radius} />
                <circle
                    className={cls.progress}
                    cx="40"
                    cy="40"
                    r={radius}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                />
            </svg>
            <div className={cls.percentage}>{percentage}%</div>
        </div>
    );
};

const SkeletonLoader = () => (
    <div className={cls.container}>
        <div className={cls.mainCard}>
            <div className={cls.header}>
                <div className={`${cls.avatar} ${cls.skeleton}`} />
                <div className={cls.headerInfo} style={{ flex: 1 }}>
                    <div className={`${cls.skeleton}`} style={{ height: "18px", width: "60%", marginBottom: "8px" }} />
                    <div className={`${cls.skeleton}`} style={{ height: "14px", width: "40%" }} />
                </div>
            </div>
            <div className={cls.amountBlock}>
                <div className={`${cls.skeleton}`} style={{ height: "80px", width: "100%" }} />
            </div>
            <div className={cls.statChips}>
                <div className={`${cls.skeleton}`} style={{ height: "60px" }} />
                <div className={`${cls.skeleton}`} style={{ height: "60px" }} />
                <div className={`${cls.skeleton}`} style={{ height: "60px" }} />
            </div>
        </div>
    </div>
);

export const LoanProfilePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const loan = useSelector(getLoanProfile);
    const loading = useSelector(getLoanProfileLoading);
    const error = useSelector(getLoanProfileError);
    const updating = useSelector(getLoanProfileUpdating);
    const repaying = useSelector(getLoanProfileRepaying);
    const cancelling = useSelector(getLoanProfileCancelling);

    const [modal, setModal] = useState(null);
    const [repayForm, setRepayForm] = useState({ amount: "", date: "", payment_type_id: 1 });
    const [editForm, setEditForm] = useState({ due_date: "", reason: "", notes: "" });
    const [cancelForm, setCancelForm] = useState({ cancelled_reason: "" });
    const [formError, setFormError] = useState("");

    useEffect(() => {
        if (id) {
            dispatch(fetchLoanProfile(id));
        }
        return () => {
            dispatch(clearLoanProfile());
        };
    }, [dispatch, id]);

    useEffect(() => {
        if (loan && modal === "edit") {
            setEditForm({
                due_date: loan.due_date || "",
                reason: loan.reason || "",
                notes: loan.notes || "",
            });
        }
    }, [loan, modal]);

    const handleRepaySubmit = async (e) => {
        e.preventDefault();
        setFormError("");

        const amount = Number(repayForm.amount);
        if (!amount || amount <= 0) {
            setFormError("Summa kiritilishi shart");
            return;
        }
        if (amount > loan.remaining_amount) {
            setFormError("Summa qoldiqdan oshmasligi kerak");
            return;
        }
        if (!repayForm.date) {
            setFormError("Sana kiritilishi shart");
            return;
        }

        const result = await dispatch(
            repayLoan({
                id: loan.id,
                amount,
                payment_type_id: repayForm.payment_type_id,
                date: repayForm.date,
            })
        );

        if (result.type.endsWith("/fulfilled")) {
            setModal(null);
            setRepayForm({ amount: "", date: "", payment_type_id: 1 });
            dispatch(fetchLoanProfile(id));
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setFormError("");

        const result = await dispatch(
            updateLoanProfile({
                id: loan.id,
                ...editForm,
            })
        );

        if (result.type.endsWith("/fulfilled")) {
            setModal(null);
        }
    };

    const handleCancelSubmit = async (e) => {
        e.preventDefault();
        setFormError("");

        if (!cancelForm.cancelled_reason.trim()) {
            setFormError("Bekor qilish sababi kiritilishi shart");
            return;
        }

        const result = await dispatch(
            cancelLoan({
                id: loan.id,
                cancelled_reason: cancelForm.cancelled_reason,
            })
        );

        if (result.type.endsWith("/fulfilled")) {
            setModal(null);
            setCancelForm({ cancelled_reason: "" });
        }
    };

    if (loading) {
        return <SkeletonLoader />;
    }

    if (error || !loan) {
        return (
            <div className={cls.container}>
                <p style={{ textAlign: "center", color: "#e74c3c" }}>Ma'lumotlarni yuklashda xatolik</p>
            </div>
        );
    }

    const getInitials = () => {
        if (!loan.counterparty) return "?";
        const surname = loan.counterparty.surname || "";
        return surname.charAt(0).toUpperCase() || "?";
    };

    const getStatusBadge = () => {
        if (loan.status === "cancelled") {
            return <span className={`${cls.badge} ${cls.statusCancelled}`}>Bekor qilingan</span>;
        }
        if (loan.is_settled) {
            return <span className={`${cls.badge} ${cls.statusSettled}`}>Yopilgan</span>;
        }
        return <span className={`${cls.badge} ${cls.statusActive}`}>Faol</span>;
    };

    const getDirectionBadge = () => {
        if (loan.direction === "out") {
            return <span className={`${cls.badge} ${cls.directionOut}`}>↑ Berilgan</span>;
        }
        return <span className={`${cls.badge} ${cls.directionIn}`}>↓ Olingan</span>;
    };

    const getCardClass = () => {
        if (loan.status === "cancelled") return `${cls.mainCard} ${cls.cancelled}`;
        if (loan.is_settled) return `${cls.mainCard} ${cls.settled}`;
        return `${cls.mainCard} ${cls.active}`;
    };

    const percentage = loan.principal_amount > 0 ? Math.round((loan.paid_total / loan.principal_amount) * 100) : 0;
    const daysRemaining = getDaysRemaining(loan.due_date);

    return (
        <>
            <div className={cls.container}>
                <div className={getCardClass()}>
                    {loan.is_settled && (
                        <div className={cls.settledBanner}>
                            ✓ Qarz {formatDate(loan.settled_date)} da to'liq yopildi
                        </div>
                    )}

                    <div className={cls.header}>
                        <div className={cls.avatar}>{getInitials()}</div>
                        <div className={cls.headerInfo}>
                            <div className={cls.name}>
                                {loan.counterparty?.surname || ""} {loan.counterparty?.name || ""}
                            </div>
                            {loan.counterparty?.phone && <div className={cls.phone}>{loan.counterparty.phone}</div>}
                        </div>
                        <div className={cls.badges}>
                            {getStatusBadge()}
                            {getDirectionBadge()}
                        </div>
                    </div>

                    <div className={cls.amountBlock}>
                        <div className={cls.amountInfo}>
                            <div className={cls.amountLabel}>Jami qarz</div>
                            <div className={cls.amountValue}>
                                {fmt(loan.principal_amount)}
                                <span className={cls.amountUnit}>so'm</span>
                            </div>
                            {daysRemaining !== null && daysRemaining >= 0 && (
                                <div className={cls.amountSubtext}>{daysRemaining} kun qoldi</div>
                            )}
                            {daysRemaining !== null && daysRemaining < 0 && (
                                <div className={cls.amountSubtext} style={{ color: "#e74c3c" }}>
                                    {Math.abs(daysRemaining)} kun kechikdi
                                </div>
                            )}
                        </div>
                        <DonutProgress percentage={percentage} />
                    </div>

                    <div className={cls.statChips}>
                        <div className={cls.statChip}>
                            <div className={cls.statLabel}>To'langan</div>
                            <div className={`${cls.statValue} ${cls.paid}`}>{fmt(loan.paid_total)}</div>
                        </div>
                        <div className={cls.statChip}>
                            <div className={cls.statLabel}>Qolgan</div>
                            <div className={`${cls.statValue} ${cls.remaining}`}>{fmt(loan.remaining_amount)}</div>
                        </div>
                        <div className={cls.statChip}>
                            <div className={cls.statLabel}>Berilgan</div>
                            <div className={`${cls.statValue} ${cls.issued}`}>{formatDate(loan.issued_date)}</div>
                        </div>
                    </div>

                    {(loan.reason || loan.notes) && (
                        <div className={`${cls.notesBlock} ${loan.status === "cancelled" ? cls.cancelled : ""}`}>
                            {loan.reason && (
                                <>
                                    <div className={cls.notesReason}>Sabab</div>
                                    <div className={cls.notesText}>{loan.reason}</div>
                                </>
                            )}
                            {loan.notes && <div className={cls.notesText}>{loan.notes}</div>}
                            {loan.due_date && <div className={cls.notesMuddat}>Muddat: {formatDate(loan.due_date)}</div>}
                            {loan.cancelled_reason && (
                                <div className={cls.cancelledReason}>Bekor qilish sababi: {loan.cancelled_reason}</div>
                            )}
                        </div>
                    )}

                    {!loan.is_settled && loan.status !== "cancelled" && (
                        <div className={cls.actions}>
                            <button className={cls.btnPrimary} onClick={() => setModal("repay")} disabled={repaying}>
                                {repaying ? "Yuklanmoqda..." : "To'lov kiritish"}
                            </button>
                            <button className={cls.btnSecondary} onClick={() => setModal("edit")} disabled={updating}>
                                Tahrirlash
                            </button>
                            <button className={cls.btnDanger} onClick={() => setModal("cancel")} disabled={cancelling}>
                                Bekor
                            </button>
                        </div>
                    )}
                </div>

                {/* Payment History Card - placeholder for now */}
                <div className={cls.historyCard}>
                    <div className={cls.historyHeader}>
                        <div className={cls.historyTitle}>To'lovlar tarixi</div>
                        <div className={cls.historyCount}>0</div>
                    </div>
                    <div className={cls.paymentList}>
                        <p style={{ textAlign: "center", color: "#aaa", fontSize: "13px" }}>To'lovlar yo'q</p>
                    </div>
                </div>
            </div>

            {/* Repay Modal */}
            {modal === "repay" && (
                <div className={cls.modalOverlay} onClick={() => setModal(null)}>
                    <div className={cls.modal} onClick={(e) => e.stopPropagation()}>
                        <h3 className={cls.modalTitle}>To'lov kiritish</h3>
                        <form onSubmit={handleRepaySubmit}>
                            <div className={cls.modalField}>
                                <label className={cls.modalLabel}>Summa (so'm)</label>
                                <input
                                    type="number"
                                    className={cls.modalInput}
                                    value={repayForm.amount}
                                    onChange={(e) => setRepayForm({ ...repayForm, amount: e.target.value })}
                                    placeholder="Masalan: 5000000"
                                />
                            </div>
                            <div className={cls.modalField}>
                                <label className={cls.modalLabel}>Sana</label>
                                <input
                                    type="date"
                                    className={cls.modalInput}
                                    value={repayForm.date}
                                    onChange={(e) => setRepayForm({ ...repayForm, date: e.target.value })}
                                />
                            </div>
                            <div className={cls.modalField}>
                                <label className={cls.modalLabel}>To'lov turi</label>
                                <select
                                    className={cls.modalInput}
                                    value={repayForm.payment_type_id}
                                    onChange={(e) =>
                                        setRepayForm({ ...repayForm, payment_type_id: Number(e.target.value) })
                                    }
                                >
                                    <option value={1}>Naqd</option>
                                    <option value={2}>Bank o'tkazma</option>
                                    <option value={3}>Karta</option>
                                </select>
                            </div>
                            {formError && <div className={cls.modalError}>{formError}</div>}
                            <div className={cls.modalActions}>
                                <button type="submit" className={cls.btnPrimary} disabled={repaying}>
                                    {repaying ? "Yuklanmoqda..." : "Tasdiqlash"}
                                </button>
                                <button
                                    type="button"
                                    className={cls.btnSecondary}
                                    onClick={() => setModal(null)}
                                    disabled={repaying}
                                >
                                    Bekor qilish
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {modal === "edit" && (
                <div className={cls.modalOverlay} onClick={() => setModal(null)}>
                    <div className={cls.modal} onClick={(e) => e.stopPropagation()}>
                        <h3 className={cls.modalTitle}>Qarzni tahrirlash</h3>
                        <form onSubmit={handleEditSubmit}>
                            <div className={cls.modalField}>
                                <label className={cls.modalLabel}>Tugash sanasi</label>
                                <input
                                    type="date"
                                    className={cls.modalInput}
                                    value={editForm.due_date}
                                    onChange={(e) => setEditForm({ ...editForm, due_date: e.target.value })}
                                />
                            </div>
                            <div className={cls.modalField}>
                                <label className={cls.modalLabel}>Sabab</label>
                                <input
                                    type="text"
                                    className={cls.modalInput}
                                    value={editForm.reason}
                                    onChange={(e) => setEditForm({ ...editForm, reason: e.target.value })}
                                    placeholder="Masalan: Biznes uchun qarz"
                                />
                            </div>
                            <div className={cls.modalField}>
                                <label className={cls.modalLabel}>Izohlar</label>
                                <textarea
                                    className={cls.modalTextarea}
                                    value={editForm.notes}
                                    onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                                    placeholder="Qo'shimcha ma'lumotlar"
                                />
                            </div>
                            {formError && <div className={cls.modalError}>{formError}</div>}
                            <div className={cls.modalActions}>
                                <button type="submit" className={cls.btnPrimary} disabled={updating}>
                                    {updating ? "Yuklanmoqda..." : "Saqlash"}
                                </button>
                                <button
                                    type="button"
                                    className={cls.btnSecondary}
                                    onClick={() => setModal(null)}
                                    disabled={updating}
                                >
                                    Bekor qilish
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Cancel Modal */}
            {modal === "cancel" && (
                <div className={cls.modalOverlay} onClick={() => setModal(null)}>
                    <div className={cls.modal} onClick={(e) => e.stopPropagation()}>
                        <h3 className={cls.modalTitle}>Qarzni bekor qilish</h3>
                        <form onSubmit={handleCancelSubmit}>
                            <div className={cls.modalField}>
                                <label className={cls.modalLabel}>Bekor qilish sababi</label>
                                <textarea
                                    className={cls.modalTextarea}
                                    value={cancelForm.cancelled_reason}
                                    onChange={(e) => setCancelForm({ cancelled_reason: e.target.value })}
                                    placeholder="Sabab kiriting"
                                />
                            </div>
                            {formError && <div className={cls.modalError}>{formError}</div>}
                            <div className={cls.modalActions}>
                                <button type="submit" className={cls.btnDanger} disabled={cancelling}>
                                    {cancelling ? "Yuklanmoqda..." : "Bekor qilish"}
                                </button>
                                <button
                                    type="button"
                                    className={cls.btnSecondary}
                                    onClick={() => setModal(null)}
                                    disabled={cancelling}
                                >
                                    Yopish
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};
