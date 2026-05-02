import { useMemo, useState } from "react";
import cls from "./overheadTypesTable.module.sass";
import { Button } from "shared/ui/button";

export const OverheadTypesTable = ({ data, loading, title, onDelete, onEdit, showActions = true }) => {
    const [sortConfig, setSortConfig] = useState({
        key: "id",
        direction: "asc",
    });

    const formatAmount = (val) =>
        val?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    const sortedData = useMemo(() => {
        let sortable = [...(data || [])];

        if (sortConfig.key) {
            sortable.sort((a, b) => {
                let x = a[sortConfig.key];
                let y = b[sortConfig.key];

                if (sortConfig.key === "cost" || sortConfig.key === "amount") {
                    x = Number(x);
                    y = Number(y);
                }
                if (sortConfig.key === "date") {
                    x = new Date(x);
                    y = new Date(y);
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
            {title && (
                <div className={cls.header}>
                    <h2>{title}</h2>
                </div>
            )}

            <div className={cls.tableWrapper}>
                {loading ? (
                    <div className={cls.loading}>Yuklanmoqda...</div>
                ) : (
                    <table className={cls.table}>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th onClick={() => requestSort("name")}>
                                    Nomi {getArrow("name")}
                                </th>
                                <th onClick={() => requestSort("cost")}>
                                    Narxi {getArrow("cost")}
                                </th>
                                <th>O'zgartiriladi</th>
                                <th onClick={() => requestSort("order")}>
                                    Tartib {getArrow("order")}
                                </th>
                                {showActions && <th></th>}
                            </tr>
                        </thead>
                        <tbody>
                            {sortedData.length === 0 ? (
                                <tr>
                                    <td colSpan={showActions ? 6 : 5} style={{ textAlign: "center", padding: "2rem" }}>
                                        Ma'lumot topilmadi
                                    </td>
                                </tr>
                            ) : (
                                sortedData.map((item, idx) => (
                                    <tr key={item.id}>
                                        <td>{idx + 1}</td>
                                        <td>{item.name}</td>
                                        <td>{formatAmount(item.cost)} UZS</td>
                                        <td>
                                            <span className={cls.badge}>
                                                {item.changeable ? "Ha" : "Yo'q"}
                                            </span>
                                        </td>
                                        <td>{item.order}</td>
                                        {showActions && (
                                            <td>
                                                <div style={{ display: "flex", gap: "1rem" }}>
                                                    {onEdit && (
                                                        <i
                                                            onClick={() => onEdit(item)}
                                                            style={{ color: "#6b7280", fontSize: "1.6rem", cursor: "pointer" }}
                                                            className="fa fa-pen"
                                                        />
                                                    )}
                                                    {onDelete && (
                                                        <i
                                                            onClick={() => onDelete(item)}
                                                            style={{ color: "red", fontSize: "1.6rem", cursor: "pointer" }}
                                                            className="fa fa-trash"
                                                        />
                                                    )}
                                                </div>
                                            </td>
                                        )}
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
