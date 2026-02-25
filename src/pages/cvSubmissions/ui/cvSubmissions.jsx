import {useEffect, useState} from "react";
import styles from "./cvSubmissions.module.sass";
import {API_URL, headers, useHttp} from "shared/api/base.js";
import {DefaultPageLoader} from "shared/ui/defaultLoader/index.js";
import {Button} from "antd";




export const CvSubmissions = () => {
    const [submissions, setSubmissions] = useState([]);
    const [selected, setSelected] = useState(null);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const {request} = useHttp()

    useEffect(() => {
        request(`${API_URL}Ui/vacancies/`, "GET", null, headers())
            .then(res => {
                setSubmissions(res)
                setLoading(false);

            })
            .catch(err => {
                console.log(err)
                setLoading(true);
            })
    }, [])


    const filtered = submissions.filter(
        (s) =>
            s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.email.toLowerCase().includes(search.toLowerCase())
    );

    const updateStatus = (id, status) => {
        setSubmissions((prev) =>
            prev.map((s) => (s.id === id ? {...s, status} : s))
        );

        if (selected?.id === id) {
            setSelected((prev) => ({...prev, status}));
        }
    };

    return (
        <div className={styles.page}>
            {/* Header */}
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>CV Arizalar</h1>
                    <p className={styles.subtitle}>
                        {submissions.length} ta ariza qabul qilindi
                    </p>
                </div>

                <div style={{display: "flex", gap: "5px" , alignItems: "center"}}>
                    <Button>Qabul qilinganlar </Button>
                    <Button>Rad etilganlar</Button>
                    <input
                        type="text"
                        placeholder="Ism yoki email bo'yicha qidirish..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>
            </div>

            {/* Table */}
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead className={styles.thead}>
                    <tr>
                        <th className={styles.th}>#</th>
                        <th className={styles.th}>To'liq Ism</th>
                        <th className={styles.th}>Email</th>
                        <th className={styles.th}>Telefon</th>
                        <th className={styles.th}>CV Fayl</th>
                        <th className={styles.th}>Yuborilgan Vaqt</th>
                        {/*<th className={styles.th}>Status</th>*/}
                    </tr>
                    </thead>

                    <tbody>
                    {filtered.map((row, index) => (
                        <tr
                            key={row.id}
                            className={styles.tr}
                            onClick={() => setSelected(row)}
                        >
                            <td className={styles.td}>{index + 1}</td>

                            <td className={`${styles.td} ${styles.bold}`}>
                                {row.name}
                            </td>

                            <td className={styles.td}>{row.email}</td>
                            <td className={styles.td}>{row.phone}</td>

                            <td className={styles.td}>
                  <span className={styles.fileChip}>
                    📄 kurish
                  </span>
                            </td>

                            <td className={styles.td}>{row.date}</td>

                            {/*          <td className={styles.td}>*/}
                            {/*<span*/}
                            {/*    className={styles.statusBadge}*/}
                            {/*    style={{*/}
                            {/*        // color: statusConfig[row.status].color,*/}
                            {/*        // backgroundColor: statusConfig[row.status].bg,*/}
                            {/*    }}*/}
                            {/*>*/}
                            {/*  /!*{statusConfig[row.status].label}*!/*/}
                            {/*</span>*/}
                            {/*          </td>*/}

                            {/*<td*/}
                            {/*    className={styles.td}*/}
                            {/*    onClick={(e) => e.stopPropagation()}*/}
                            {/*>*/}
                            {/*    <select*/}
                            {/*        value={row.status}*/}
                            {/*        onChange={(e) =>*/}
                            {/*            updateStatus(row.id, e.target.value)*/}
                            {/*        }*/}
                            {/*        className={styles.select}*/}
                            {/*    >*/}
                            {/*        {Object.entries(statusConfig).map(([key, val]) => (*/}
                            {/*            <option key={key} value={key}>*/}
                            {/*                {val.label}*/}
                            {/*            </option>*/}
                            {/*        ))}*/}
                            {/*    </select>*/}
                            {/*</td>*/}
                        </tr>
                    ))}
                    </tbody>
                </table>

                {!loading && filtered.length === 0 && (
                    <div className={styles.empty}>
                        Hech qanday ariza topilmadi
                    </div>
                )}
                {loading && <DefaultPageLoader/>}
            </div>

            {/* Modal */}
            {selected && (
                <div
                    className={styles.overlay}
                    onClick={() => setSelected(null)}
                >
                    <div
                        className={styles.modal}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>
                                Ariza Tafsiloti
                            </h2>
                            <button
                                className={styles.closeBtn}
                                onClick={() => setSelected(null)}
                            >
                                ✕
                            </button>
                        </div>

                        <div className={styles.modalBody}>
                            <div className={styles.detailRow}>
                <span className={styles.detailLabel}>
                  To'liq Ism:
                </span>
                                <span className={styles.detailValue}>
                  {selected.fullName}
                </span>
                            </div>

                            <div className={styles.detailRow}>
                <span className={styles.detailLabel}>
                  Email:
                </span>
                                <span className={styles.detailValue}>
                  {selected.email}
                </span>
                            </div>

                            <div className={styles.detailRow}>
                <span className={styles.detailLabel}>
                  Telefon:
                </span>
                                <span className={styles.detailValue}>
                  {selected.phone}
                </span>
                            </div>

                            <div className={styles.detailRow}>
                <span className={styles.detailLabel}>
                  CV Fayl:
                </span>
                                <span
                                    className={styles.detailValue}
                                    style={{color: "#3b82f6"}}
                                >
                  <a target={"_blank"} href={selected.cv}>📄 kurish</a>
                </span>
                            </div>


                            <div style={{marginTop: 16}}>
                <span className={styles.detailLabel}>
                  Xat:
                </span>
                                <p className={styles.coverLetterText}>
                                    {selected.letter}
                                </p>
                            </div>

                            <div className={styles.modalActions}>
                                <button
                                    className={styles.actionBtn}
                                    style={{backgroundColor: "#10b981"}}
                                    onClick={() =>
                                        updateStatus(selected.id, "accepted")
                                    }
                                >
                                    ✓ Qabul Qilish
                                </button>

                                <button
                                    className={styles.actionBtn}
                                    style={{backgroundColor: "#ef4444"}}
                                    onClick={() =>
                                        updateStatus(selected.id, "rejected")
                                    }
                                >
                                    ✕ Rad Etish
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

