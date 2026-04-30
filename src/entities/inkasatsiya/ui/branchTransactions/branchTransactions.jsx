import React, { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { API_URL, headers, useHttp } from "shared/api/base";
import { getUserBranchId } from "entities/profile/userProfile";
import { getSelectedLocations } from "features/locations";
import { Table } from "shared/ui/table";

const fmt = (n) => Number(n || 0).toLocaleString();

export const BranchTransactions = ({
    extraClass,
    month,
    year,
    direction,
    showDeleted,
    onSummaryChange,
}) => {
    const { request } = useHttp();
    const branchId = useSelector(getUserBranchId);
    const selectedBranch = useSelector(getSelectedLocations);
    const branchForFilter = selectedBranch?.id ?? branchId;

    const [transactions, setTransactions] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);

    const loadData = useCallback(() => {
        if (!branchForFilter || !month || !year) return;
        setLoading(true);
        setError(null);
        onSummaryChange(null);
        const params = new URLSearchParams({ branch_id: branchForFilter });
        const url = showDeleted
            ? `${API_URL}Branch/branch_transaction/deleted/${month}/${year}/?${params}`
            : (() => {
                if (direction !== "all") params.set("direction", direction);
                return `${API_URL}Branch/branch_transaction/${month}/${year}/?${params}`;
            })();
        request(url, "GET", null, headers())
            .then((res) => {
                if (Array.isArray(res?.results?.data)) {
                    setTransactions(res.results.data);
                    onSummaryChange(res.results.totalCount ?? null);
                } else if (res?.success) {
                    setTransactions(Array.isArray(res.data) ? res.data : []);
                    onSummaryChange(res.summary ?? null);
                } else if (Array.isArray(res?.results)) {
                    setTransactions(res.results);
                    onSummaryChange(null);
                } else {
                    setError("Ma'lumotlarni yuklashda xatolik");
                }
            })
            .catch(() => setError("Serverga ulanib bo'lmadi"))
            .finally(() => setLoading(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [branchForFilter, month, year, direction, showDeleted]);

    useEffect(() => { loadData(); }, [loadData]);

    const personLabel = (person) => {
        if (!person) return "—";
        return [person.name, person.surname].filter(Boolean).join(" ") || "—";
    };

    if (loading) return <p style={{ textAlign: "center", color: "#9ca3af", padding: "4rem 0" }}>Yuklanmoqda...</p>;
    if (error) return <p style={{ textAlign: "center", color: "#ef4444", padding: "2rem 0" }}>{error}</p>;

    return (
        <div className={extraClass}>
            <Table>
                <thead style={{ position: "sticky", top: 0 }}>
                    <tr>
                        <th>No</th>
                        <th>Shaxs</th>
                        <th>Sabab</th>
                        <th>Summa</th>
                        <th>Yo'nalish</th>
                        <th>To'lov turi</th>
                        <th>Sana</th>
                        {showDeleted && <th>Holat</th>}
                    </tr>
                </thead>
                <tbody>
                    {transactions.length === 0 ? (
                        <tr>
                            <td colSpan={showDeleted ? 8 : 7} style={{ textAlign: "center", color: "#9ca3af", padding: "4rem 0" }}>
                                Ma'lumot topilmadi
                            </td>
                        </tr>
                    ) : transactions.map((tx, idx) => (
                        <tr key={tx.id}>
                            <td>{idx + 1}</td>
                            <td style={{ fontWeight: 500 }}>{personLabel(tx.person)}</td>
                            <td>{tx.reason || "—"}</td>
                            <td style={{ fontFamily: "monospace" }}>{fmt(tx.amount)} UZS</td>
                            <td>
                                <span style={{
                                    background: tx.direction === "give" ? "#dc2626" : "#0d9488",
                                    color: "#fff", fontSize: "1.2rem",
                                    padding: "3px 10px", borderRadius: 6,
                                    display: "inline-block",
                                }}>
                                    {tx.direction === "give" ? "Berildi" : "Olindi"}
                                </span>
                            </td>
                            <td>{tx.payment_type?.name || "—"}</td>
                            <td>{tx.date || "—"}</td>
                            {showDeleted && (
                                <td>
                                    <span style={{
                                        background: "#6b7280", color: "#fff",
                                        fontSize: "1.2rem", padding: "3px 10px",
                                        borderRadius: 6, display: "inline-block",
                                    }}>
                                        O'chirilgan
                                    </span>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};
