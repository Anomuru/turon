import { useMemo, useState } from "react";
import cls from "./overheadTypesTable.module.sass";

export const UniversalTable = ({
    data,
    loading,
    columns,
    renderRow,
    onSort,
    emptyMessage = "Ma'lumot topilmadi"
}) => {
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: "asc",
    });

    const sortedData = useMemo(() => {
        if (!data) return [];
        let sortable = [...data];

        if (sortConfig.key && onSort) {
            sortable.sort((a, b) => {
                let x = a[sortConfig.key];
                let y = b[sortConfig.key];

                // Handle numbers
                if (typeof x === 'number' || !isNaN(Number(x))) {
                    x = Number(x);
                    y = Number(y);
                }
                // Handle dates
                if (sortConfig.key.includes('date')) {
                    x = new Date(x || 0);
                    y = new Date(y || 0);
                }

                if (x < y) return sortConfig.direction === "asc" ? -1 : 1;
                if (x > y) return sortConfig.direction === "asc" ? 1 : -1;
                return 0;
            });
        }

        return sortable;
    }, [data, sortConfig, onSort]);

    const requestSort = (key) => {
        if (!onSort) return;
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    const getArrow = (key) => {
        if (!onSort) return "";
        if (sortConfig.key !== key) return " ↕";
        return sortConfig.direction === "asc" ? " ↑" : " ↓";
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
                                {columns.map((col, idx) => (
                                    <th
                                        key={idx}
                                        onClick={() => col.sortKey ? requestSort(col.sortKey) : null}
                                        style={{ cursor: col.sortKey ? 'pointer' : 'default' }}
                                    >
                                        {col.label}{col.sortKey ? getArrow(col.sortKey) : ''}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {sortedData.length === 0 ? (
                                <tr>
                                    <td colSpan={columns.length} style={{ textAlign: "center", padding: "2rem" }}>
                                        {emptyMessage}
                                    </td>
                                </tr>
                            ) : (
                                sortedData.map((item, idx) => renderRow(item, idx))
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};
