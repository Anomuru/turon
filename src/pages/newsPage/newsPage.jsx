import {useEffect, useRef, useState} from "react";
import {API_URL, headers, headersImg, useHttp} from "shared/api/base.js";
import {useDispatch, useSelector} from "react-redux";
import {fetchNews, onAddNews, onEditNews, onRemoveNews} from "pages/newsPage/model/newsSlice.js";
import {DefaultPageLoader} from "shared/ui/defaultLoader/index.js";



const emptyForm = {
    title: "",
    description: "",
    image: null,
    imagePreview: null,
    date: new Date().toISOString().slice(0, 10),
};


const CreateModal = ({onClose, onSave, editItem}) => {
    const isEdit = !!editItem;
    const [form, setForm] = useState(
        isEdit
            ? {
                title: editItem.title,
                description: editItem.content,
                image: null,
                imagePreview: editItem.image || null,
                date: editItem.date
            }
            : emptyForm
    );
    const [errors, setErrors] = useState({});
    const fileRef = useRef();

    const validate = () => {
        const e = {};
        if (!form.title.trim()) e.title = "Sarlavha majburiy";
        if (!form.description.trim()) e.description = "Tavsif majburiy";
        if (!form.date) e.date = "Sana majburiy";
        return e;
    };

    const handleImage = (file) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) =>
            setForm((p) => ({...p, image: file, imagePreview: ev.target.result}));
        reader.readAsDataURL(file);
        setErrors((p) => ({...p, image: undefined}));
    };

    const handleChange = (field, value) => {
        setForm((p) => ({...p, [field]: value}));
        setErrors((p) => ({...p, [field]: undefined}));
    };

    const handleSubmit = () => {
        const e = validate();
        if (Object.keys(e).length > 0) {
            setErrors(e);
            return;
        }

        onSave({
            id: editItem?.id,
            title: form.title,
            description: form.description,
            image: form.image, // ❗ FILE yuboriladi
            date: form.date,
            status: editItem?.status || "published",
        }, isEdit);

    };

    return (
        <div style={S.overlay} onClick={onClose}>
            <div style={S.modal} onClick={(e) => e.stopPropagation()}>

                {/* Modal Header */}
                <div style={S.modalHead}>
                    <div style={S.modalHeadLeft}>
                        <div style={S.modalIcon}>📰</div>
                        <div>
                            <h2 style={S.modalTitle}>{isEdit ? "Yangilikni Tahrirlash" : "Yangilik Yaratish"}</h2>
                            <p style={S.modalSub}>{isEdit ? "Ma'lumotlarni yangilang" : "Yangi yangilik qo'shing"}</p>
                        </div>
                    </div>
                    <button style={S.closeBtn} onClick={onClose}>✕</button>
                </div>

                {/* Modal Body */}
                <div style={S.modalBody}>
                    <div style={S.twoCol}>

                        {/* LEFT */}
                        <div style={S.leftCol}>
                            {/* Title */}
                            <div style={S.field}>
                                <label style={S.label}>Sarlavha <span style={S.req}>*</span></label>
                                <input
                                    type="text"
                                    placeholder="Yangilik sarlavhasi..."
                                    value={form.title}
                                    onChange={(e) => handleChange("title", e.target.value)}
                                    style={{...S.input, ...(errors.title ? S.errInput : {})}}
                                />
                                {errors.title && <span style={S.errMsg}>{errors.title}</span>}
                                <span style={S.hint}>{form.title.length} / 120</span>
                            </div>

                            {/* Description */}
                            <div style={S.field}>
                                <label style={S.label}>Tavsif <span style={S.req}>*</span></label>
                                <textarea
                                    placeholder="Yangilik haqida batafsil..."
                                    value={form.description}
                                    onChange={(e) => handleChange("description", e.target.value)}
                                    rows={5}
                                    style={{...S.textarea, ...(errors.description ? S.errInput : {})}}
                                />
                                {errors.description && <span style={S.errMsg}>{errors.description}</span>}
                            </div>

                            {/* Date */}
                            <div style={S.field}>
                                <label style={S.label}>Sana <span style={S.req}>*</span></label>
                                <input
                                    type="date"
                                    value={form.date}
                                    onChange={(e) => handleChange("date", e.target.value)}
                                    style={{...S.input, ...(errors.date ? S.errInput : {})}}
                                />
                                {errors.date && <span style={S.errMsg}>{errors.date}</span>}
                            </div>
                        </div>

                        {/* RIGHT - Image */}
                        <div style={S.rightCol}>
                            <label style={S.label}>Muqova Rasm</label>
                            <div
                                style={{
                                    ...S.dropZone,
                                    ...(form.imagePreview ? S.dropFilled : {}),
                                }}
                                onClick={() => fileRef.current.click()}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    handleImage(e.dataTransfer.files[0]);
                                }}
                                onDragOver={(e) => e.preventDefault()}
                            >
                                {form.imagePreview ? (
                                    <div style={S.previewWrap}>
                                        <img src={form.imagePreview} alt="" style={S.previewImg}/>
                                        <div style={S.previewHover}>
                                            <span style={{
                                                color: "#fff",
                                                fontWeight: 600,
                                                fontSize: 13
                                            }}>O'zgartirish</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div style={S.dropInner}>
                                        <span style={{fontSize: 40}}>🖼️</span>
                                        <p style={S.dropText}>Rasm yuklash</p>
                                        <p style={S.dropHint}>Bosing yoki tashlang</p>
                                        <span style={S.dropBadge}>PNG · JPG · WEBP</span>
                                    </div>
                                )}
                            </div>
                            <input
                                ref={fileRef}
                                type="file"
                                accept="image/*"
                                style={{display: "none"}}
                                onChange={(e) => handleImage(e.target.files[0])}
                            />
                            {form.image && (
                                <div style={S.fileRow}>
                                    <span style={S.fileName}>📄 {form.image.name}</span>
                                    <button
                                        style={S.removeBtn}
                                        onClick={() => setForm((p) => ({...p, image: null, imagePreview: null}))}
                                    >✕
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div style={S.modalFoot}>
                    <button style={S.cancelBtn} onClick={onClose}>Bekor qilish</button>
                    <button style={S.saveBtn} onClick={handleSubmit}>{isEdit ? "✓ Saqlash" : "✓ Nashr Etish"}</button>
                </div>
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────────
   DETAIL MODAL
───────────────────────────────────────────── */
const DetailModal = ({item, onClose, onDelete}) => (
    <div style={S.overlay} onClick={onClose}>
        <div style={{...S.modal, maxWidth: 520}} onClick={(e) => e.stopPropagation()}>
            <div style={S.modalHead}>
                <h2 style={{...S.modalTitle, fontSize: 18}}>Yangilik Tafsiloti</h2>
                <button style={S.closeBtn} onClick={onClose}>✕</button>
            </div>
            {item.image && (
                <img src={item.image} alt="" style={{width: "100%", height: 220, objectFit: "cover"}}/>
            )}
            <div style={{padding: 24}}>
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 12
                }}>
                    <h3 style={{fontSize: 18, fontWeight: 700, color: "#111827", margin: 0, flex: 1}}>{item.title}</h3>
                    <span style={{
                        ...S.statusBadge,
                        color: item.status === "published" ? "#10b981" : "#f59e0b",
                        backgroundColor: item.status === "published" ? "#ecfdf5" : "#fffbeb",
                        marginLeft: 12,
                    }}>
            {item.status === "published" ? "Nashr" : "Qoralama"}
          </span>
                </div>
                <p style={{fontSize: 13, color: "#6b7280", marginBottom: 16}}>📅 {item.date}</p>
                <p style={{fontSize: 14, color: "#374151", lineHeight: 1.7, margin: 0}}>{item.content}</p>
                <div style={{display: "flex", gap: 10, marginTop: 24}}>
                    <button style={S.cancelBtn} onClick={onClose}>Yopish</button>
                    <button
                        style={{...S.saveBtn, backgroundColor: "#ef4444"}}
                        onClick={() => {
                            onDelete(item.id);
                            onClose();
                        }}
                    >
                        🗑 O'chirish
                    </button>
                </div>
            </div>
        </div>
    </div>
);

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export const NewsPage = () => {
    const {data , loading} = useSelector(state => state.newsSlice)
    const [newsList, setNewsList] = useState([]);
    useEffect(() => {
        setNewsList(data)
    }, [data]);
    const [showCreate, setShowCreate] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [detail, setDetail] = useState(null);
    const [search, setSearch] = useState("");
    const formData = new FormData(); // ❗ har safar yangi

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchNews())
    }, [])


    const {request} = useHttp()

    const filtered = newsList.filter(
        (n) =>
            n.title.toLowerCase().includes(search.toLowerCase()) ||
            n.content.toLowerCase().includes(search.toLowerCase())
    );

    const handleSave = (item, isEdit) => {


        formData.append("title", item.title);
        formData.append("content", item.description);
        formData.append("date", item.date);
        // formData.append("status", item.status);

        // ❗ agar rasm mavjud bo‘lsa File sifatida yuboramiz
        if (item.image instanceof File) {
            formData.append("image", item.image);
        }


        if (isEdit) {
            request(
                `${API_URL}Ui/news/${item.id}/`,
                "PATCH",
                formData,
                headersImg()
            ).then(res => {
                console.log(res)
                dispatch(onEditNews({id: item.id, data: res}))
                setEditItem(null)
            })
        } else {
            request(
                `${API_URL}Ui/news/`,
                "POST",
                formData,
                headersImg()
            )
                .then(res => {
                    dispatch(onAddNews(res))
                    setShowCreate(false)

                })
        }


    };
    const handleDelete = (id) =>{
        request(`${API_URL}Ui/news/${id}`, `DELETE` , null , headers())
            .then(res => {
                dispatch(onRemoveNews(id))
                console.log(res)
            })
    }

    return (
        <div style={S.page}>
            {/* Header */}
            <div style={S.pageHeader}>
                <div>
                    <h1 style={S.pageTitle}>Yangiliklar</h1>
                    <p style={S.pageSub}>{newsList.length} ta yangilik</p>
                </div>
                <div style={{display: "flex", gap: 12, alignItems: "center"}}>
                    <input
                        type="text"
                        placeholder="Qidirish..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={S.searchInput}
                    />
                    <button style={S.createBtn} onClick={() => setShowCreate(true)}>
                        + Yangilik Qo'shish
                    </button>
                </div>
            </div>
            {/* Table */}
            <div style={S.tableWrap}>
                <table style={S.table}>
                    <thead>
                    <tr style={S.thead}>
                        <th style={S.th}>#</th>
                        <th style={S.th}>Rasm</th>
                        <th style={S.th}>Sarlavha</th>
                        <th style={S.th}>Tavsif</th>
                        <th style={S.th}>Sana</th>
                        <th style={S.th}>Amal</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? <DefaultPageLoader/> :

                    filtered.map((row, i) => {
                        return (
                            <tr
                                key={row.id}
                                style={{...S.tr, backgroundColor: i % 2 === 0 ? "#fff" : "#f9fafb", cursor: "pointer"}}
                                onClick={() => setDetail(row)}
                            >
                                <td style={S.td}>{i + 1}</td>
                                <td style={S.td}>
                                    <img
                                        src={row.image}
                                        alt=""
                                        style={{
                                            width: 56,
                                            height: 40,
                                            borderRadius: 6,
                                            objectFit: "cover",
                                            display: "block"
                                        }}
                                    />
                                </td>
                                <td style={{...S.td, fontWeight: 600, color: "#111827", maxWidth: 200}}>
                                    <span style={S.clamp1}>{row.title}</span>
                                </td>
                                <td style={{...S.td, maxWidth: 260}}>
                                    <span style={S.clamp2}>{row.content}</span>
                                </td>
                                <td style={{...S.td, whiteSpace: "nowrap", color: "#6b7280"}}>{row.date}</td>

                                <td style={S.td} onClick={(e) => e.stopPropagation()}>
                                    <div style={{display: "flex", gap: 8}}>
                                        <button
                                            style={S.editBtn}
                                            onClick={() => setEditItem(row)}
                                            title="Tahrirlash"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            style={S.deleteBtn}
                                            onClick={() => handleDelete(row.id)}
                                            title="O'chirish"
                                        >
                                            🗑
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
                {filtered.length === 0 && (
                    <div style={S.empty}>Hech qanday yangilik topilmadi</div>
                )}
            </div>

            {/* Modals */}
            {showCreate && (
                <CreateModal onClose={() => setShowCreate(false)} onSave={handleSave}/>
            )}
            {editItem && (
                <CreateModal onClose={() => setEditItem(null)} onSave={handleSave} editItem={editItem}/>
            )}
            {detail && (
                <DetailModal item={detail} onClose={() => setDetail(null)} onDelete={handleDelete}/>
            )}
        </div>
    );
};

/* ─────────────────────────────────────────────
   STYLES
───────────────────────────────────────────── */
const S = {
    page: {
        fontFamily: "'Segoe UI', sans-serif",
        padding: 32,
        backgroundColor: "#f3f4f6",
    },
    pageHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24,
        flexWrap: "wrap",
        gap: 16,
    },
    pageTitle: {fontSize: 26, fontWeight: 700, color: "#111827", margin: 0},
    pageSub: {fontSize: 13, color: "#6b7280", margin: "4px 0 0 0"},
    searchInput: {
        padding: "10px 16px",
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        fontSize: 14,
        backgroundColor: "#fff",
        outline: "none",
        width: 220,
    },
    createBtn: {
        padding: "10px 20px",
        backgroundColor: "#1e293b",
        color: "#fff",
        border: "none",
        borderRadius: 8,
        fontSize: 14,
        fontWeight: 600,
        cursor: "pointer",
        whiteSpace: "nowrap",
    },
    tableWrap: {
        backgroundColor: "#fff",
        borderRadius: 12,
        boxShadow: "0 1px 3px rgba(0,0,0,0.09)",
        overflow: "auto",
        height: "calc(100vh - 22.5rem)",
    },
    table: {width: "100%", borderCollapse: "collapse", minWidth: 700},
    thead: {backgroundColor: "#1e293b"},
    th: {
        padding: "13px 16px",
        textAlign: "left",
        fontSize: 11,
        fontWeight: 600,
        color: "#94a3b8",
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        whiteSpace: "nowrap",
    },
    tr: {borderBottom: "1px solid #f1f5f9"},
    td: {padding: "12px 16px", fontSize: 13, color: "#374151", verticalAlign: "middle"},
    clamp1: {
        display: "-webkit-box",
        WebkitLineClamp: 1,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
    },
    clamp2: {
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
        fontSize: 12,
        color: "#6b7280",
        lineHeight: 1.5,
    },
    statusBadge: {
        padding: "4px 10px",
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 600,
        display: "inline-block",
    },
    editBtn: {
        background: "none",
        border: "1px solid #bfdbfe",
        borderRadius: 6,
        padding: "6px 10px",
        cursor: "pointer",
        fontSize: 14,
        color: "#3b82f6",
    },
    deleteBtn: {
        background: "none",
        border: "1px solid #fecaca",
        borderRadius: 6,
        padding: "6px 10px",
        cursor: "pointer",
        fontSize: 14,
        color: "#ef4444",
    },
    empty: {textAlign: "center", padding: 48, color: "#9ca3af", fontSize: 15},

    // Modal shared
    overlay: {
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15,23,42,0.6)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: 16,
    },
    modal: {
        backgroundColor: "#fff",
        borderRadius: 18,
        width: "100%",
        maxWidth: 780,
        boxShadow: "0 32px 80px rgba(0,0,0,0.25)",
        maxHeight: "92vh",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
    },
    modalHead: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 24px",
        borderBottom: "1px solid #f1f5f9",
        position: "sticky",
        top: 0,
        backgroundColor: "#fff",
        zIndex: 2,
        borderRadius: "18px 18px 0 0",
    },
    modalHeadLeft: {display: "flex", alignItems: "center", gap: 14},
    modalIcon: {
        width: 44,
        height: 44,
        backgroundColor: "#1e293b",
        borderRadius: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 22,
    },
    modalTitle: {fontSize: 20, fontWeight: 700, color: "#111827", margin: 0},
    modalSub: {fontSize: 13, color: "#6b7280", margin: "3px 0 0 0"},
    closeBtn: {
        background: "none",
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        width: 36,
        height: 36,
        cursor: "pointer",
        fontSize: 16,
        color: "#6b7280",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    modalBody: {padding: 24, flex: 1},
    modalFoot: {
        display: "flex",
        gap: 12,
        padding: "16px 24px",
        borderTop: "1px solid #f1f5f9",
        justifyContent: "flex-end",
        position: "sticky",
        bottom: 0,
        backgroundColor: "#fff",
        borderRadius: "0 0 18px 18px",
    },

    // Form
    twoCol: {display: "grid", gridTemplateColumns: "1fr 280px", gap: 24},
    leftCol: {display: "flex", flexDirection: "column", gap: 18},
    rightCol: {display: "flex", flexDirection: "column", gap: 10},
    field: {display: "flex", flexDirection: "column", gap: 6},
    label: {fontSize: 13, fontWeight: 600, color: "#374151"},
    req: {color: "#ef4444"},
    input: {
        padding: "10px 13px",
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        fontSize: 14,
        outline: "none",
        backgroundColor: "#fafafa",
        width: "100%",
        boxSizing: "border-box",
    },
    textarea: {
        padding: "11px 13px",
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        fontSize: 14,
        outline: "none",
        resize: "vertical",
        fontFamily: "'Segoe UI', sans-serif",
        backgroundColor: "#fafafa",
        lineHeight: 1.7,
        width: "100%",
        boxSizing: "border-box",
    },
    errInput: {borderColor: "#ef4444", backgroundColor: "#fff5f5"},
    errMsg: {fontSize: 12, color: "#ef4444"},
    hint: {fontSize: 11, color: "#9ca3af", alignSelf: "flex-end"},

    // Drop zone
    dropZone: {
        border: "2px dashed #e5e7eb",
        borderRadius: 10,
        cursor: "pointer",
        overflow: "hidden",
        minHeight: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "border-color 0.2s",
    },
    dropFilled: {border: "2px solid #e5e7eb"},
    dropInner: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        padding: 20,
    },
    dropText: {fontSize: 13, fontWeight: 600, color: "#374151", margin: 0},
    dropHint: {fontSize: 12, color: "#9ca3af", margin: 0},
    dropBadge: {
        fontSize: 11,
        color: "#9ca3af",
        backgroundColor: "#f3f4f6",
        padding: "3px 10px",
        borderRadius: 20,
        marginTop: 4,
    },
    previewWrap: {position: "relative", width: "100%", height: 200},
    previewImg: {width: "100%", height: "100%", objectFit: "cover", display: "block"},
    previewHover: {
        position: "absolute",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    fileRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "7px 10px",
        backgroundColor: "#f8fafc",
        borderRadius: 7,
        border: "1px solid #e5e7eb",
    },
    fileName: {fontSize: 11, color: "#6b7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"},
    removeBtn: {background: "none", border: "none", color: "#9ca3af", cursor: "pointer", fontSize: 13},

    cancelBtn: {
        padding: "10px 20px",
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        backgroundColor: "#fff",
        fontSize: 14,
        fontWeight: 600,
        color: "#6b7280",
        cursor: "pointer",
    },
    saveBtn: {
        padding: "10px 24px",
        border: "none",
        borderRadius: 8,
        backgroundColor: "#1e293b",
        color: "#fff",
        fontSize: 14,
        fontWeight: 700,
        cursor: "pointer",
    },
};

