import {useState, useMemo} from "react";
import cls from "./accountingPageNewTable.module.sass";
import {useSelector} from "react-redux";
import {getAccountingNewPageLoading} from "entities/accountingPageNew/model/accountingNewSelector.js";
import {DefaultPageLoader} from "shared/ui/defaultLoader/index.js";

export const AccountingPageNewTable = ({activeFilter, data , selectType}) => {
    const [sortConfig, setSortConfig] = useState({
        key: "date",
        direction: "desc",
    });
    const [selectedPaymentType, setSelectedPaymentType] = useState(null);
    const loading = useSelector(getAccountingNewPageLoading)
    const formatAmount = (val) =>
        val?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    const payments = data?.results?.data || [];
    const totalCount = data?.results?.totalCount || [];

    // Sort va filter
    const sortedPayments = useMemo(() => {
        let sortable = [...payments];

        if (sortConfig.key) {
            sortable.sort((a, b) => {
                let x = a[sortConfig.key];
                let y = b[sortConfig.key];

                if (sortConfig.key === "payment_sum") {
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

        if (selectedPaymentType) {
            sortable = sortable.filter(
                (p) => p.payment_type_name === selectedPaymentType
            );
        }

        return sortable;
    }, [payments, sortConfig, selectedPaymentType]);

    const requestSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({key, direction});
    };

    const getArrow = (key) => {
        if (sortConfig.key !== key) return "↕";
        return sortConfig.direction === "asc" ? "↑" : "↓";
    };

    return (
        <div className={cls.wrapper} style={{height: activeFilter ? "32.5rem" : "49rem"}}>
            <div className={cls.header}>
                <h2>To‘lovlar ro‘yxati</h2>
                <div className={cls.info}>
          <span>
            {/*Ko‘rsatilmoqda: {sortedPayments.length} ta / Jami: {payments.length} ta*/}
          </span>
                    <span className={cls.total}>
            Jami summa:{" "}
                        {formatAmount(
                            totalCount.find((t) => t.type === "amount")?.totalPayment || 0
                        )}{" "}
                        so‘m
          </span>
                </div>
            </div>

            <div
                className={cls.tableWrapper}
                style={{height: activeFilter ? "26.5rem" : "inherit"}}
            >
                {loading ? <DefaultPageLoader status={true}/> :
                <table className={cls.table}>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th onClick={() => requestSort("name")}>
                            {selectType === "overhead" || selectType === "capital" ? "Nomi"  :"Ism Familiya"} {getArrow("name")}
                        </th>
                        <th onClick={() => requestSort("payment_sum")}>
                            Summa {getArrow("payment_sum")}
                        </th>
                        <th onClick={() => requestSort("date")}>
                            Sana
                            {/*{getArrow("date")}*/}
                        </th>
                        <th onClick={() => requestSort("payment_type_name")}>
                            To‘lov turi
                            {/*{getArrow("payment_type_name")}*/}
                        </th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {sortedPayments.map((p, idx) => (
                        <tr key={p.id}>
                            <td>{idx + 1}</td>
                            <td>
                                {selectType === "capital"  ? p.capital : p.name} {!p.capital ? p.surname ? p.surname : "" : ""}
                            </td>
                            <td>{formatAmount(p.payment_sum)}</td>
                            <td>
                                {p.date}

                                {/*{new Date(p.date).toLocaleDateString("uz-UZ", {*/}
                                {/*    day: "numeric",*/}
                                {/*    month: "short",*/}
                                {/*    year: "numeric",*/}
                                {/*})}*/}
                            </td>
                            <td>
                                <span className={cls.paymentType}>{p.payment_type_name}</span>
                            </td>
                            <td>
                                <i className="fa fa-pen"/>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>}
            </div>
        </div>
    );
};
