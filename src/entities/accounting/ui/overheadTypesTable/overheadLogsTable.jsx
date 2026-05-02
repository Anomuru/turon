import { useMemo, useState } from "react";
import cls from "./overheadTypesTable.module.sass";
import { Button } from "shared/ui/button";

export const OverheadLogsTable = ({ data, loading, onPay }) => {
    const [sortConfig, setSortConfig] = useState({
        key: "date",
        direction: "desc",
    });

    const formatAmount = (val) =>
        val?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    const sortedData = useMemo(() => {
        let sortable = [...(data || [])];

        if (sortConfig.key) {
            sortable.sort((a, b) => {
                let x = a[sortConfig.key];
                let y = b[sortConfig.key];

                if (sortConfig.key === "cost") {
                    x = Number(x);
                    y = Number(y);
                }
                if (sortConfig.key === "date" || sortConfig.key === "paid_date") {
                    x = new Date(x || 0);
                    y = new Date(y || 0);
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
                                <th onClick={() => requestSort("overhead_type_name")}>
                                    Tur nomi {getArrow("overhead_type_name")}
                                </th>
                                <th onClick={() => requestSort("cost")}>
                                    Narxi {getArrow("cost")}
                                </th>
                                <th>Holat</th>
                                <th onClick={() => requestSort("date")}>
                                    Sana {getArrow("date")}
                                </th>
                                <th onClick={() => requestSort("paid_date")}>
                                    To'lov sanasi {getArrow("paid_date")}
                                </th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedData.length === 0 ? (
                                <tr>
                                    <td colSpan={7} style={{ textAlign: "center", padding: "2rem" }}>
                                        Ma'lumot topilmadi
                                    </td>
                                </tr>
                            ) : (
                                sortedData.map((log, idx) => (
                                    <tr key={log.id}>
                                        <td>{idx + 1}</td>
                                        <td>{log.overhead_type_name}</td>
                                        <td>{formatAmount(log.cost)} UZS</td>
                                        <td>
                                            <span className={cls.badge}>
                                                {log.is_prepaid ? "Oldindan" : log.is_paid ? "To'langan" : "To'lanmagan"}
                                            </span>
                                        </td>
                                        <td>{log.date || "—"}</td>
                                        <td>{log.paid_date || "—"}</td>
                                        <td>
                                            {!log.is_paid && onPay && (
                                                <Button type="success" onClick={() => onPay(log)}>
                                                    To'lash
                                                </Button>
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
