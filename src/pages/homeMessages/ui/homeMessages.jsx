import {useEffect, useState} from "react";
import styles from "./HomeMessages.module.sass";
import {API_URL, headers, useHttp} from "shared/api/base.js";
import {DefaultPageLoader} from "shared/ui/defaultLoader/index.js";



const enquiryColors = {
    "General Enquiry": { color: "#6366f1", bg: "#eef2ff" },
    investor: { color: "#10b981", bg: "#ecfdf5" },
    partner: { color: "#f59e0b", bg: "#fffbeb" },
    corporate: { color: "#8b5cf6", bg: "#f5f3ff" },
};

const statusConfig = {
    new: { label: "Yangi", color: "#3b82f6", bg: "#eff6ff" },
    replied: { label: "Javob berildi", color: "#10b981", bg: "#ecfdf5" },
    archived: { label: "Arxivlandi", color: "#9ca3af", bg: "#f3f4f6" },
};

const ENQUIRY_TYPES = [
    "General Enquiry",
    "Investor",
    "Partner",
    "Corporate",
];

export const HomeMessages = () => {
    const [messages, setMessages] = useState([]);
    const [selected, setSelected] = useState(null);
    const {request}=  useHttp()
    const [loading , setLoading] = useState(true)

    useEffect(() => {
        request(`${API_URL}Ui/messages/` , "GET" , null , headers())
            .then(res => {
                setMessages(res)
                setLoading(false)
            })
    }, []);

    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState("all");

    const filtered = messages.filter((m) => {
        const matchSearch =
            m.name.toLowerCase().includes(search.toLowerCase()) ||
            m.email.toLowerCase().includes(search.toLowerCase()) ||
            m.organization.toLowerCase().includes(search.toLowerCase());

        const matchType =
            filterType === "all" || m.enquiry_type === filterType;

        return matchSearch && matchType;
    });

    const updateStatus = (id, status) => {
        setMessages((prev) =>
            prev.map((m) => (m.id === id ? { ...m, status } : m))
        );

        if (selected?.id === id) {
            setSelected((prev) => ({ ...prev, status }));
        }
    };

    const stats = {
        total: messages.length,
        new: messages.filter((m) => m.status === "new").length,
        replied: messages.filter((m) => m.status === "replied").length,
    };

    return (
        <div className={styles.page}>
            {/* Stats */}
            {/*<div className={styles.statsRow}>*/}
            {/*    <div className={styles.statCard}>*/}
            {/*        <span className={styles.statNum}>{stats.total}</span>*/}
            {/*        <span className={styles.statLabel}>Jami Xabarlar</span>*/}
            {/*    </div>*/}

            {/*    <div className={styles.statCard}>*/}
            {/*        <span className={styles.statNum}>{stats.new}</span>*/}
            {/*        <span className={styles.statLabel}>Yangi</span>*/}
            {/*    </div>*/}

            {/*    <div className={styles.statCard}>*/}
            {/*        <span className={styles.statNum}>{stats.replied}</span>*/}
            {/*        <span className={styles.statLabel}>Javob Berilgan</span>*/}
            {/*    </div>*/}
            {/*</div>*/}

            {/* Header */}
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Xabarlar</h1>
                    <p className={styles.subtitle}>
                        Saytdan kelgan barcha murojaatlar
                    </p>
                </div>

                {/*<div className={styles.controls}>*/}
                {/*    <select*/}
                {/*        value={filterType}*/}
                {/*        onChange={(e) => setFilterType(e.target.value)}*/}
                {/*        className={styles.filterSelect}*/}
                {/*    >*/}
                {/*        <option value="all">Barcha turlar</option>*/}
                {/*        {ENQUIRY_TYPES.map((t) => (*/}
                {/*            <option key={t} value={t}>*/}
                {/*                {t}*/}
                {/*            </option>*/}
                {/*        ))}*/}
                {/*    </select>*/}

                {/*    <input*/}
                {/*        type="text"*/}
                {/*        placeholder="Qidirish..."*/}
                {/*        value={search}*/}
                {/*        onChange={(e) => setSearch(e.target.value)}*/}
                {/*        className={styles.searchInput}*/}
                {/*    />*/}
                {/*</div>*/}
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
                        <th className={styles.th}>Murojaat Turi</th>
                        <th className={styles.th}>Vaqt</th>
                    </tr>
                    </thead>

                    <tbody>
                    {filtered.map((row , index) => (
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

                            <td className={`${styles.td} ${styles.muted}`}>
                                {row.phone || "—"}
                            </td>

                            <td className={styles.td}>
                  <span
                      className={styles.badge}
                      style={{
                          color:
                          enquiryColors[row.enquiryType]?.color,
                          backgroundColor:
                          enquiryColors[row.enquiryType]?.bg,
                      }}
                  >
                    {row.enquiry_type}
                  </span>
                            </td>


                            <td className={`${styles.td} ${styles.muted}`}>
                                {row.date}
                            </td>



                        </tr>
                    ))}
                    </tbody>
                </table>

                {!loading && filtered.length === 0 && (
                    <div className={styles.empty}>
                        Hech qanday xabar topilmadi
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
                            <div>
                                <h2 className={styles.modalTitle}>
                                    {selected.name}
                                </h2>
                            </div>
                            <button
                                className={styles.closeBtn}
                                onClick={() => setSelected(null)}
                            >
                                ✕
                            </button>
                        </div>

                        <div className={styles.modalBody}>
                            <div className={styles.infoGrid}>
                                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>
                    Email
                  </span>
                                    <span className={styles.infoValue}>
                    {selected.email}
                  </span>
                                </div>

                                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>
                    Telefon
                  </span>
                                    <span className={styles.infoValue}>
                    {selected.phone || "—"}
                  </span>
                                </div>

                                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>
                    Murojaat Turi
                  </span>
                                    <span
                                        className={styles.badge}
                                        style={{
                                            color:
                                            enquiryColors[selected.enquiry_type]
                                                ?.color,
                                            backgroundColor:
                                            enquiryColors[selected.enquiry_type]
                                                ?.bg,
                                        }}
                                    >
                    {selected.enquiry_type}
                  </span>
                                </div>

                                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>
                    Vaqt
                  </span>
                                    <span className={styles.infoValue}>
                    {selected.submittedAt}
                  </span>
                                </div>
                            </div>

                            <div style={{ marginTop: 20 }}>
                <span className={styles.infoLabel}>
                  Xabar
                </span>
                                <p className={styles.msgBox}>
                                    {selected.message}
                                </p>
                            </div>

                            <div className={styles.modalFooter}>
                                <div>
                                    <select
                                        value={selected.status}
                                        onChange={(e) =>
                                            updateStatus(
                                                selected.id,
                                                e.target.value
                                            )
                                        }
                                        className={styles.select}
                                    >
                                        {Object.entries(statusConfig).map(
                                            ([key, val]) => (
                                                <option key={key} value={key}>
                                                    {val.label}
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>

                                <a
                                    href={`mailto:${selected.email}`}
                                    className={styles.replyBtn}
                                    onClick={() =>
                                        updateStatus(selected.id, "replied")
                                    }
                                >
                                    ✉️ Javob Yozish
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

