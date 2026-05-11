import { useMemo, useState } from "react";
import cls from "./overheadTypesTable.module.sass";
import { Button } from "shared/ui/button";

export const TransactionsTable = ({ data, loading, onEdit, onDelete, onRowClick, showDeleted = false }) => {
    const [sortConfig, setSortConfig] = useState({
        key: "date",
        direction: "desc",
    });

    const formatAmount = (val) =>
        val?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    const personLabel = (person) => {
        if (!person) return "—";
        const full = [person.name, person.surname].filter(Boolean).join(" ");
        return full || "—";
    };

    const sortedData = useMemo(() => {
        let sortable = [...(data || [])];

        if (sortConfig.key) {
            sortable.sort((a, b) => {
                let x = a[sortConfig.key];
                let y = b[sortConfig.key];

                if (sortConfig.key === "amount") {
                    x = Number(x);
                    y = Number(y);
                }
                if (sortConfig.key === "date") {
                    x = new Date(x || 0);
                    y = new Date(y || 0);
                }
                if (sortConfig.key === "person") {
                    x = personLabel(a.person);
                    y = personLabel(b.person);
                }

                if (x < y) return sortConfig.direction === "asc" ? -1 : 1;
                if (x > y) return sortConfig.direction === "asc" ? 1 : -1;
                return 0;
            });
        }

        return sortable;
    }, [data, sortConfig]);

    const requestSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    const getArrow = (key) => {
        if (sortConfig.key !== key) return "↕";
        return sortConfig.direction === "asc" ? "↑" : "↓";
    };

    return (
        <div className={cls.wrapper}>
            <div className={cls.tableWrapper}>
                {loading ? (
                    <div className={cls.loading}>Yuklanmoqda...</div>
                ) : (
                    <table className={cls.table}>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th onClick={() => requestSort("person")}>
                                    Shaxs {getArrow("person")}
                                </th>
                                <th onClick={() => requestSort("reason")}>
                                    Sabab {getArrow("reason")}
                                </th>
                                <th onClick={() => requestSort("amount")}>
                                    Summa {getArrow("amount")}
                                </th>
                                <th onClick={() => requestSort("direction")}>
                                    Yo'nalish {getArrow("direction")}
                                </th>
                                <th>To'lov turi</th>
                                <th onClick={() => requestSort("date")}>
                                    Sana {getArrow("date")}
                                </th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedData.length === 0 ? (
                                <tr>
                                    <td colSpan={8} style={{ textAlign: "center", padding: "2rem" }}>
                                        Ma'lumot topilmadi
                                    </td>
                                </tr>
                            ) : (
                                sortedData.map((tx, idx) => (
                                    <tr
                                        key={tx.id}
                                        onClick={() => onRowClick && onRowClick(tx)}
                                        style={{ cursor: onRowClick ? "pointer" : "default" }}
                                    >
                                        <td>{idx + 1}</td>
                                        <td>{personLabel(tx.person)}</td>
                                        <td>{tx.reason || "—"}</td>
                                        <td>{formatAmount(tx.amount)} UZS</td>
                                        <td>
                                            <span className={cls.badge}>
                                                {tx.direction === "give" ? "Berildi" : "Olindi"}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={cls.paymentType}>
                                                {tx.payment_type?.name || "—"}
                                            </span>
                                        </td>
                                        <td>{tx.date || "—"}</td>
                                        <td>
                                            {showDeleted ? (
                                                <span style={{ color: "#6b7280" }}>O'chirilgan</span>
                                            ) : (
                                                <div style={{ display: "flex", gap: "1rem" }}>
                                                    {onEdit && (
                                                        <i
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onEdit(tx);
                                                            }}
                                                            style={{ color: "#6b7280", fontSize: "1.6rem", cursor: "pointer" }}
                                                            className="fa fa-pen"
                                                        />
                                                    )}
                                                    {onDelete && (
                                                        <i
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onDelete(tx);
                                                            }}
                                                            style={{ color: "red", fontSize: "1.6rem", cursor: "pointer" }}
                                                            className="fa fa-trash"
                                                        />
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};
