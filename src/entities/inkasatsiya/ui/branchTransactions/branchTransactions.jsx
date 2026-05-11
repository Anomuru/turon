import React from "react";
import { Table } from "shared/ui/table";

const fmt = (n) => Number(n || 0).toLocaleString();

export const BranchTransactions = ({
    extraClass,
    branchTransactionsData,
}) => {
    const personLabel = (person) => {
        if (!person) return "—";
        return [person.name, person.surname].filter(Boolean).join(" ") || "—";
    };

    // Combine given and received data
    const givenData = branchTransactionsData?.given?.data || [];
    const receivedData = branchTransactionsData?.received?.data || [];
    const allTransactions = [...givenData, ...receivedData].sort((a, b) => {
        // Sort by date descending
        return new Date(b.date) - new Date(a.date);
    });

    if (!branchTransactionsData) {
        return <p style={{ textAlign: "center", color: "#9ca3af", padding: "4rem 0" }}>Ma'lumot topilmadi</p>;
    }

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
                    </tr>
                </thead>
                <tbody>
                    {allTransactions.length === 0 ? (
                        <tr>
                            <td colSpan={7} style={{ textAlign: "center", color: "#9ca3af", padding: "4rem 0" }}>
                                Ma'lumot topilmadi
                            </td>
                        </tr>
                    ) : allTransactions.map((tx, idx) => (
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
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};
