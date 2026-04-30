import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useSelector} from "react-redux";
import {API_URL, headers, useHttp} from "shared/api/base";
import {getUserBranchId} from "entities/profile/userProfile";
import {getSelectedLocations} from "features/locations/index.js";
import {Pagination} from "features/pagination";
import {DefaultPageLoader} from "shared/ui/defaultLoader/index.js";
import cls from "entities/accountingPageNew/ui/accountingPageNewTable/accountingPageNewTable.module.sass";

const fmt = (n) => Number(n || 0).toLocaleString();

const personLabel = (person) => {
    if (!person) return "—";
    return [person.name, person.surname].filter(Boolean).join(" ") || "—";
};

export const BranchTransactionsPage = () => {
    const {request} = useHttp();
    const branchId = useSelector(getUserBranchId);
    const selectedBranch = useSelector(getSelectedLocations);
    const branchForFilter = selectedBranch?.id ?? branchId;

    const PageSize = useMemo(() => 50, []);
    const [currentPage, setCurrentPage] = useState(1);
    const [paginationCount, setPaginationCount] = useState(0);
    const [totalCount, setTotalCount] = useState([]);

    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [sortConfig, setSortConfig] = useState({key: "date", direction: "desc"});

    const requestSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
        }));
    };

    const getArrow = (key) => {
        if (sortConfig.key !== key) return "↕";
        return sortConfig.direction === "asc" ? "↑" : "↓";
    };

    const sortedTransactions = useMemo(() => {
        const list = [...transactions];
        if (!sortConfig.key) return list;
        return list.sort((a, b) => {
            let x, y;
            if (sortConfig.key === "person") {
                x = personLabel(a.person);
                y = personLabel(b.person);
            } else if (sortConfig.key === "amount") {
                x = Number(a.amount);
                y = Number(b.amount);
            } else if (sortConfig.key === "date") {
                x = new Date(a.date);
                y = new Date(b.date);
            } else if (sortConfig.key === "payment_type") {
                x = a.payment_type?.name ?? "";
                y = b.payment_type?.name ?? "";
            } else {
                x = a[sortConfig.key] ?? "";
                y = b[sortConfig.key] ?? "";
            }
            if (x < y) return sortConfig.direction === "asc" ? -1 : 1;
            if (x > y) return sortConfig.direction === "asc" ? 1 : -1;
            return 0;
        });
    }, [transactions, sortConfig]);

    const loadData = useCallback(() => {
        if (!branchForFilter) return;
        setLoading(true);
        setError(null);
        const offset = (currentPage - 1) * PageSize;
        request(
            `${API_URL}Branch/branch_transactions/?branch=${branchForFilter}&limit=${PageSize}&offset=${offset}`,
            "GET", null, headers()
        )
            .then((res) => {
                if (Array.isArray(res?.results?.data)) {
                    setTransactions(res.results.data);
                    setTotalCount(Array.isArray(res.results.totalCount) ? res.results.totalCount : []);
                    setPaginationCount(res.count ?? 0);
                } else if (Array.isArray(res?.results)) {
                    setTransactions(res.results);
                    setPaginationCount(res.count ?? 0);
                } else if (Array.isArray(res)) {
                    setTransactions(res);
                    setPaginationCount(res.length);
                } else {
                    setError("Ma'lumotlarni yuklashda xatolik");
                }
            })
            .catch(() => setError("Serverga ulanib bo'lmadi"))
            .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [branchForFilter, currentPage]);

    useEffect(() => { loadData(); }, [loadData]);

    const totalAmount = totalCount.find(t => t.type === "amount")?.totalPayment ?? 0;

    return (
        <>
            <div className={cls.wrapper}>
                <div className={cls.header}>
                    <h2>To'lovlar ro'yxati</h2>
                    <div className={cls.info}>
                        <span className={cls.total}>
                            Jami summa: {fmt(totalAmount)} so'm
                        </span>
                    </div>
                </div>

                <div className={cls.tableWrapper}>
                    {loading ? <DefaultPageLoader status={true}/> : (
                        <table className={cls.table}>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th onClick={() => requestSort("person")}>
                                        Shaxs {getArrow("person")}
                                    </th>
                                    <th>Sabab</th>
                                    <th onClick={() => requestSort("amount")}>
                                        Summa {getArrow("amount")}
                                    </th>
                                    <th>Yo'nalish</th>
                                    <th onClick={() => requestSort("payment_type")}>
                                        To'lov turi {getArrow("payment_type")}
                                    </th>
                                    <th onClick={() => requestSort("date")}>
                                        Sana {getArrow("date")}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {error ? (
                                    <tr>
                                        <td colSpan={7} style={{textAlign: "center", color: "#ef4444", padding: "4rem 0"}}>
                                            {error}
                                        </td>
                                    </tr>
                                ) : sortedTransactions.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} style={{textAlign: "center", color: "#9ca3af", padding: "4rem 0"}}>
                                            Ma'lumot topilmadi
                                        </td>
                                    </tr>
                                ) : sortedTransactions.map((tx, idx) => (
                                    <tr key={tx.id}>
                                        <td>{(currentPage - 1) * PageSize + idx + 1}</td>
                                        <td style={{fontWeight: 500}}>{personLabel(tx.person)}</td>
                                        <td>{tx.reason || "—"}</td>
                                        <td>{fmt(tx.amount)} UZS</td>
                                        <td>
                                            <span className={cls.paymentType} style={{
                                                background: tx.direction === "give" ? "#dc2626" : "#0d9488",
                                                color: "#fff",
                                            }}>
                                                {tx.direction === "give" ? "Berildi" : "Olindi"}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={cls.paymentType}>
                                                {tx.payment_type?.name || "—"}
                                            </span>
                                        </td>
                                        <td>{tx.date || "—"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            <Pagination
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                pageSize={PageSize}
                onPageChange={(page) => setCurrentPage(page)}
                type={"custom"}
                totalCount={paginationCount}
            />
        </>
    );
};
