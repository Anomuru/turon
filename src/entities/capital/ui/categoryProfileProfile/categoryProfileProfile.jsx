import {useState, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router";
import cls from "./categoryProfileProfile.module.sass";
import {getCapitalCategoryInfo} from "../../model/selector/capitalSelector";
import {deleteCapitalItem, getCapitalCategory, updateCapitalItem} from "../../model/thunk/capitalThunk";
import def from "shared/assets/images/defaultImg.svg";
import {API_URL, headers, useHttp} from "shared/api/base.js";
import {useParams} from "react-router-dom";
import {onUpdateCapitalProfile} from "entities/capital/model/slice/capitalSlice.js";
import {ConfirmModal} from "shared/ui/confirmModal/index.js";

const StatCard = ({icon, label, value, sub, iconBg, iconColor}) => (
    <div className={cls.statCard}>
        <div className={cls.statIcon} style={{background: iconBg}}>
            <i className={icon} style={{color: iconColor}}/>
        </div>
        <div className={cls.statBody}>
            <span className={cls.statLabel}>{label}</span>
            <span className={cls.statValue}>{value}</span>
            {sub && <span className={cls.statSub}>{sub}</span>}
        </div>
    </div>
);

export const CategoryProfileProfile = () => {
    const dispatch = useDispatch();
    const datas = useSelector(getCapitalCategoryInfo);
    const loading = useSelector(state => state.CapitalSlice?.loading);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [active, setActive] = useState(false);
    const {id} = useParams()
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            dispatch(getCapitalCategory(id))
        }
    }, [id]);


    const [form, setForm] = useState({
        name: "",
        id_number: "",
        price: "",
        total_down_cost: "",
        term: "",
        curriculum_hours: "",
        img: null,
    });

    useEffect(() => {
        if (datas) {
            setForm({
                name: datas.name || "",
                id_number: datas.id_number || "",
                price: datas.price || "",
                total_down_cost: datas.total_down_cost || "",
                term: datas.term || "",
                curriculum_hours: datas.curriculum_hours || "",
                img: null,
            });
        }
    }, [datas]);

    const handleChange = (e) => {
        const {name, value, files} = e.target;
        if (name === "img") {
            setForm(prev => ({...prev, img: files[0]}));
        } else {
            setForm(prev => ({...prev, [name]: value}));
        }
    };

    const handleSave = async () => {
        setSaving(true);
        await dispatch(updateCapitalItem({id: datas.id, data: form}))
        await dispatch(getCapitalCategory(id))
        setSaving(false);
        setEditOpen(false);
        setActive(true);

    };

    const handleDelete = async () => {
        setDeleting(true);
        await dispatch(deleteCapitalItem(datas.id));
        setDeleting(false);
        setDeleteOpen(false);
        navigate(-1)

    };

    if (loading && !datas) {
        return <div className={cls.loader}>Ma'lumot yuklanmoqda...</div>;
    }

    if (!datas) {
        return <div className={cls.empty}><i className="fa fa-inbox"/> Ma'lumot topilmadi</div>;
    }

    return (
        <div className={cls.profile}>
            {/* ─── Hero Card ─── */}
            <div className={cls.hero}>
                <div className={cls.imageBlock}>
                    {datas.img
                        ? <img src={datas.img} alt={datas.name}/>
                        : <i className={`fa fa-box-open ${cls.iconPlaceholder}`}/>
                    }
                </div>

                <div className={cls.heroInfo}>
                    <div className={cls.titleRow}>
                        <span className={cls.title}>{datas.name}</span>
                        <span className={cls.idBadge}># {datas.id_number}</span>
                    </div>

                    <div className={cls.metaRow}>
                        {datas.category?.name && (
                            <span className={cls.metaChip}>
                                <i className="fa fa-tag"/>
                                {datas.category.name}
                            </span>
                        )}
                        {datas.payment_type?.name && (
                            <span className={cls.metaChip}>
                                <i className="fa fa-credit-card"/>
                                {datas.payment_type.name}
                            </span>
                        )}
                        {datas.date && (
                            <span className={cls.metaChip}>
                                <i className="fa fa-calendar"/>
                                {datas.date}
                            </span>
                        )}
                    </div>

                    <div className={cls.actionButtons}>
                        <button className={cls.btnEdit} onClick={() => setEditOpen(true)}>
                            <i className="fa fa-pen"/> Tahrirlash
                        </button>
                        <button className={cls.btnDelete} onClick={() => setDeleteOpen(true)} disabled={deleting}>
                            <i className="fa fa-trash"/> O'chirish
                        </button>
                    </div>
                </div>
            </div>

            {/* ─── Stats Grid ─── */}
            <div className={cls.statsGrid}>
                <StatCard
                    icon="fa fa-tag"
                    label="Narxi"
                    value={`${Number(datas.price).toLocaleString()} so'm`}
                    iconBg="#e0f2fe"
                    iconColor="#0ea5e9"
                />
                <StatCard
                    icon="fa fa-arrow-down"
                    label="Umumiy to'lov"
                    value={`${Number(datas.total_down_cost).toLocaleString()} so'm`}
                    iconBg="#fce7f3"
                    iconColor="#ec4899"
                />
                <StatCard
                    icon="fa fa-clock"
                    label="Muddati"
                    value={`${datas.term} oy`}
                    iconBg="#fef9c3"
                    iconColor="#eab308"
                />
                <StatCard
                    icon="fa fa-book-open"
                    label="O'quv soatlari"
                    value={`${datas.curriculum_hours} soat`}
                    iconBg="#ede9fe"
                    iconColor="#6366f1"
                />
            </div>

            {/* ─── Edit Modal ─── */}
            {editOpen && (
                <div className={cls.overlay} onClick={() => setEditOpen(false)}>
                    <div className={cls.modal} onClick={e => e.stopPropagation()}>
                        <div className={cls.modalHeader}>
                            <h2>Tahrirlash</h2>
                            <button className={cls.closeBtn} onClick={() => setEditOpen(false)}>
                                <i className="fa fa-times"/>
                            </button>
                        </div>

                        <div className={cls.formGrid}>
                            <div className={cls.formGroup}>
                                <label>Nomi</label>
                                <input name="name" value={form.name} onChange={handleChange} placeholder="Nomi"/>
                            </div>
                            <div className={cls.formGroup}>
                                <label>ID raqami</label>
                                <input name="id_number" value={form.id_number} onChange={handleChange}
                                       placeholder="ID raqami"/>
                            </div>
                            <div className={cls.formGroup}>
                                <label>Narxi (so'm)</label>
                                <input name="price" type="number" value={form.price} onChange={handleChange}
                                       placeholder="Narxi"/>
                            </div>
                            <div className={cls.formGroup}>
                                <label>Umumiy to'lov (so'm)</label>
                                <input name="total_down_cost" type="number" value={form.total_down_cost}
                                       onChange={handleChange} placeholder="Umumiy to'lov"/>
                            </div>
                            <div className={cls.formGroup}>
                                <label>Muddati (oy)</label>
                                <input name="term" type="number" value={form.term} onChange={handleChange}
                                       placeholder="Muddati"/>
                            </div>
                            <div className={cls.formGroup}>
                                <label>O'quv soatlari</label>
                                <input name="curriculum_hours" type="number" value={form.curriculum_hours}
                                       onChange={handleChange} placeholder="Soatlar"/>
                            </div>
                            <div className={`${cls.formGroup} ${cls.fullWidth}`}>
                                <label>Rasm</label>
                                <input name="img" type="file" accept="image/*" onChange={handleChange}/>
                            </div>
                        </div>

                        <div className={cls.modalActions}>
                            <button className={cls.btnCancel} onClick={() => setEditOpen(false)}>Bekor qilish</button>
                            <button className={cls.btnSave} onClick={handleSave} disabled={saving}>
                                {saving ? <><i className="fa fa-spinner fa-spin"/> Saqlanmoqda...</> : <><i
                                    className="fa fa-save"/> Saqlash</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ─── Delete Confirm Modal ─── */}
            {deleteOpen && (
                <div className={cls.overlay} onClick={() => setDeleteOpen(false)}>
                    <div className={cls.confirmModal} onClick={e => e.stopPropagation()}>
                        <div className={cls.confirmIcon}><i className="fa fa-triangle-exclamation"/></div>
                        <h3>O'chirishni tasdiqlang</h3>
                        <p>
                            <strong>{datas.name}</strong> ni o'chirishni xohlaysizmi?
                            Bu amalni qaytarib bo'lmaydi.
                        </p>
                        <div className={cls.confirmBtns}>
                            <button className={cls.btnCancel} onClick={() => setDeleteOpen(false)}>Bekor qilish</button>
                            <button className={cls.btnDelete} onClick={handleDelete} disabled={deleting}>
                                {deleting
                                    ? <><i className="fa fa-spinner fa-spin"/> O'chirilmoqda...</>
                                    : <><i className="fa fa-trash"/> Ha, o'chirish</>
                                }
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <ConfirmModal setActive={setActive} active={active} type={"success"} />
        </div>
    );
};
