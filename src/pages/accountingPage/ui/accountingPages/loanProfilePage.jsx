import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL, headers, useHttp } from "shared/api/base";
import { DefaultPageLoader } from "shared/ui/defaultLoader/index.js";
import cls from "./overheadTypes.module.sass";

const fmt = (n) => Number(n || 0).toLocaleString();

const personLabel = (person) => {
    if (!person) return "—";
    return [person.name, person.surname].filter(Boolean).join(" ") || "—";
};

export const LoanProfilePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { request } = useHttp();

    const [loan, setLoan] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        setError(null);
        request(`${API_URL}Branch/branch_loans/${id}/`, "GET", null, headers())
            .then((res) => {
                if (res?.success && res?.data) {
                    setLoan(res.data);
                } else {
                    setError(res?.message || "Ma'lumotlarni yuklashda xatolik");
                }
            })
            .catch(() => setError("Serverga ulanib bo'lmadi"))
            .finally(() => setLoading(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    if (loading) {
        return <DefaultPageLoader status={true} />;
    }

    if (error) {
        return (
            <div className={cls.page}>
                <div className={cls.header}>
                    <button className={cls.backBtn} onClick={() => navigate(-1)}>
                        ← Orqaga
                    </button>
                    <h2 className={cls.title}>Qarz profili</h2>
                </div>
                <p className={cls.error}>{error}</p>
            </div>
        );
    }

    if (!loan) {
        return (
            <div className={cls.page}>
                <div className={cls.header}>
                    <button className={cls.backBtn} onClick={() => navigate(-1)}>
                        ← Orqaga
                    </button>
                    <h2 className={cls.title}>Qarz profili</h2>
                </div>
                <p className={cls.empty}>Ma'lumot topilmadi</p>
            </div>
        );
    }

    const statusBadge = () => {
        if (loan.status === "cancelled") {
            return <span className={cls.badgeGray}>Bekor qilingan</span>;
        }
        if (loan.is_settled) {
            return <span className={cls.badgeGreen}>To'langan</span>;
        }
        return <span className={cls.badgeYellow}>Faol</span>;
    };

    const directionBadge = () => {
        if (loan.direction === "out") {
            return <span className={cls.badgeRed}>Berildi</span>;
        }
        return <span className={cls.badgeGreen}>Olindi</span>;
    };

    return (
        <div className={cls.page}>
            <div className={cls.header}>
                <button className={cls.backBtn} onClick={() => navigate(-1)}>
                    ← Orqaga
                </button>
                <h2 className={cls.title}>Qarz profili #{loan.id}</h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                {/* Status cards */}
                <div className={cls.cards}>
                    <div className={cls.card}>
                        <div className={cls.cardHeader}>
                            Asosiy summa <span>💰</span>
                        </div>
                        <div className={cls.cardAmount}>{fmt(loan.principal_amount)} UZS</div>
                    </div>
                    <div className={cls.card}>
                        <div className={cls.cardHeader}>
                            To'langan <span>✅</span>
                        </div>
                        <div className={cls.cardAmount} style={{ color: "#16a34a" }}>
                            {fmt(loan.paid_total)} UZS
                        </div>
                    </div>
                    <div className={cls.card}>
                        <div className={cls.cardHeader}>
                            Qoldiq <span>📊</span>
                        </div>
                        <div className={cls.cardAmount} style={{ color: loan.remaining_amount > 0 ? "#dc2626" : "#16a34a" }}>
                            {fmt(loan.remaining_amount)} UZS
                        </div>
                    </div>
                </div>

                {/* Loan details */}
                <div className={cls.tableWrapper}>
                    <table className={cls.table}>
                        <tbody>
                            <tr>
                                <td style={{ fontWeight: 600, width: "30%" }}>Kontragent</td>
                                <td>{personLabel(loan.counterparty)}</td>
                            </tr>
                            {loan.counterparty?.phone && (
                                <tr>
                                    <td style={{ fontWeight: 600 }}>Telefon</td>
                                    <td>{loan.counterparty.phone}</td>
                                </tr>
                            )}
                            <tr>
                                <td style={{ fontWeight: 600 }}>Yo'nalish</td>
                                <td>{directionBadge()}</td>
                            </tr>
                            <tr>
                                <td style={{ fontWeight: 600 }}>Status</td>
                                <td>{statusBadge()}</td>
                            </tr>
                            <tr>
                                <td style={{ fontWeight: 600 }}>Berilgan sana</td>
                                <td>{loan.issued_date || "—"}</td>
                            </tr>
                            <tr>
                                <td style={{ fontWeight: 600 }}>Tugash sanasi</td>
                                <td>{loan.due_date || "—"}</td>
                            </tr>
                            {loan.settled_date && (
                                <tr>
                                    <td style={{ fontWeight: 600 }}>To'langan sana</td>
                                    <td>{loan.settled_date}</td>
                                </tr>
                            )}
                            {loan.reason && (
                                <tr>
                                    <td style={{ fontWeight: 600 }}>Sabab</td>
                                    <td>{loan.reason}</td>
                                </tr>
                            )}
                            {loan.notes && (
                                <tr>
                                    <td style={{ fontWeight: 600 }}>Izohlar</td>
                                    <td>{loan.notes}</td>
                                </tr>
                            )}
                            {loan.cancelled_reason && (
                                <tr>
                                    <td style={{ fontWeight: 600 }}>Bekor qilish sababi</td>
                                    <td style={{ color: "#dc2626" }}>{loan.cancelled_reason}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
