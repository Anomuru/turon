import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { API_URL, headers, headersImg, useHttp } from "shared/api/base.js";
import { getUserProfileData } from "entities/profile/userProfile/index.js";
import { MiniLoader } from "shared/ui/miniLoader/index.js";
import cls from "./lessonPlanPage.module.sass";
import classNames from "classnames";

const STATUS_LABELS = {
    pending: "Tekshirilmoqda",
    done: "Bajarildi",
    error: "Xatolik",
};

const STATUS_ICONS = {
    pending: "fas fa-clock",
    done: "fas fa-check-circle",
    error: "fas fa-times-circle",
};

const getCurrentTerm = () => {
    const month = new Date().getMonth() + 1;
    if (month >= 9 && month <= 10) return 1;
    if (month >= 11 && month <= 12) return 2;
    if (month >= 1 && month <= 3) return 3;
    return 4;
};

export const LessonPlanPage = () => {
    const { request } = useHttp();
    const user = useSelector(getUserProfileData);

    const [plans, setPlans] = useState([]);
    const [loadingList, setLoadingList] = useState(false);

    const [academicYears, setAcademicYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState("");
    const [terms, setTerms] = useState([]);
    const [selectedTermId, setSelectedTermId] = useState("");
    const [flows, setFlows] = useState([])
    const [groups, setGroups] = useState([])
    const [selectedGroup, setSelectedGroup] = useState("")
    const [selectedFlow, setSelectedFLow] = useState("")
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState("");
    const [uploadSuccess, setUploadSuccess] = useState("");

    const [expandedId, setExpandedId] = useState(null);

    const fileInputRef = useRef(null);
    const teacherId = user?.teacher?.id;

    useEffect(() => {
        request(`${API_URL}terms/education-years/`, "GET", null, headers())
            .then(res => {
                setAcademicYears(res);
                if (res.length > 0) setSelectedYear(res[0].academic_year);
            });
    }, []);

    useEffect(() => {
        if (!selectedYear) return;
        request(`${API_URL}terms/list-term/${selectedYear}/`, "GET", null, headers())
            .then(res => {
                setTerms(res);
                const current = getCurrentTerm();
                const match = res.find(t => t.quarter === current);
                setSelectedTermId(match ? match.id : res[0]?.id ?? "");
            });
    }, [selectedYear]);

    useEffect(() => {
        request(`${API_URL}Mobile/teachers/terms/my-classes/`, "GET", null, headers())
            .then(res => {
                setFlows(res.flows)
                setGroups(res.groups)
            })
            .catch(err => {
                console.error(err);
            });
    }, []);

    console.log(groups)
    useEffect(() => {
        if (!teacherId) return;
        fetchPlans();
    }, [teacherId]);

    const fetchPlans = () => {
        setLoadingList(true);
        request(
            `${API_URL}Lesson_plan/file/?teacher_id=${teacherId}`,
            "GET",
            null,
            headers()
        )
            .then(res => setPlans(Array.isArray(res) ? res : []))
            .finally(() => setLoadingList(false));
    };

    const ALLOWED_EXTENSIONS = [".pdf", ".docx", ".txt", ".xlsx"];

    const onFileChange = (e) => {
        const selected = e.target.files[0];
        if (!selected) return;

        const ext = "." + selected.name.split(".").pop().toLowerCase();
        if (!ALLOWED_EXTENSIONS.includes(ext)) {
            setUploadError(`"${ext}" formatdagi fayllar qabul qilinmaydi. Faqat: .pdf, .docx, .txt, .xlsx`);
            setFile(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
        }

        setUploadError("");
        setFile(selected);
    };


    const onUpload = () => {
        if (!file) {
            setUploadError("Fayl tanlanmagan");
            return;
        }
        if (!selectedTermId) {
            setUploadError("Chorak tanlanmagan");
            return;
        }
        if (!teacherId) {
            setUploadError("O'qituvchi ma'lumotlari topilmadi");
            return;
        }

        setUploadError("");
        setUploadSuccess("");
        setUploading(true);

        const formData = new FormData();
        formData.append("teacher_id", teacherId);
        formData.append("term_id", selectedTermId);
        formData.append("group_id", selectedGroup)
        formData.append("flow_id", selectedFlow)
        formData.append("file", file);

        request(
            `${API_URL}Lesson_plan/file/upload/`,
            "POST",
            formData,
            headersImg()
        )
            .then(() => {
                setUploadSuccess("Fayl muvaffaqiyatli yuklandi. AI tekshiruvi boshlandi.");
                setFile(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
                fetchPlans();
            })
            .catch(() => setUploadError("Yuklashda xatolik yuz berdi"))
            .finally(() => setUploading(false));
    };

    const toggleExpand = (id) => {
        setExpandedId(prev => prev === id ? null : id);
    };

    return (
        <div className={cls.page}>
            <div className={cls.page__header}>
                <div className={cls.page__headerIcon}>
                    <i className="fas fa-file-alt" />
                </div>
                <div className={cls.page__headerText}>
                    <h1>Dars Rejasi</h1>
                    <p>AI yordamida dars rejangizni tekshiring</p>
                </div>
            </div>

            <div className={cls.upload}>
                <div className={cls.upload__title}>
                    <i className="fas fa-upload" />
                    <span>Yangi dars rejasi yuklash</span>
                </div>

                <div className={cls.upload__row}>
                    <div className={cls.upload__field}>
                        <label className={cls.upload__label}>O'quv yili</label>
                        <select
                            className={cls.upload__select}
                            value={selectedYear}
                            onChange={e => setSelectedYear(e.target.value)}
                        >
                            {academicYears.map(y => (
                                <option key={y.academic_year} value={y.academic_year}>
                                    {y.academic_year}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={cls.upload__field}>
                        <label className={cls.upload__label}>Chorak</label>
                        <select
                            className={cls.upload__select}
                            value={selectedTermId}
                            onChange={e => setSelectedTermId(e.target.value)}
                        >
                            {terms.map(t => (
                                <option key={t.id} value={t.id}>
                                    {t.quarter}-chorak
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className={cls.upload__field}>
                        <label className={cls.upload__label}>Guruhlar</label>
                        <select
                            className={cls.upload__select}
                            value={selectedGroup}
                            onChange={e => setSelectedGroup(e.target.value)}
                        >
                            <option value="">Default</option>
                            {groups.map(t => (
                                <option key={t.id} value={t.id}>
                                    {t.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className={cls.upload__field}>
                        <label className={cls.upload__label}>Flowlar</label>
                        <select
                            className={cls.upload__select}
                            value={selectedFlow}
                            onChange={e => setSelectedFLow(e.target.value)}
                        >
                            <option value="">Default</option>
                            {flows.map(t => (
                                <option key={t.id} value={t.id}>
                                    {t.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={cls.upload__field}>
                        <label className={cls.upload__label}>Fayl (.pdf, .docx, .txt, .xlsx)</label>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,.docx,.txt,.xlsx"
                            className={cls.upload__fileInput}
                            onChange={onFileChange}
                        />
                    </div>
                </div>

                {file && (
                    <div className={cls.upload__chosen}>
                        <i className="fas fa-paperclip" />
                        <span>{file.name}</span>
                    </div>
                )}

                {uploadError && (
                    <div className={cls.upload__error}>
                        <i className="fas fa-exclamation-circle" />
                        {uploadError}
                    </div>
                )}

                {uploadSuccess && (
                    <div className={cls.upload__success}>
                        <i className="fas fa-check-circle" />
                        {uploadSuccess}
                    </div>
                )}

                <button
                    className={cls.upload__btn}
                    onClick={onUpload}
                    disabled={uploading}
                >
                    {uploading ? (
                        <>
                            <i className="fas fa-spinner fa-spin" />
                            Yuklanmoqda...
                        </>
                    ) : (
                        <>
                            <i className="fas fa-cloud-upload-alt" />
                            Yuborish
                        </>
                    )}
                </button>
            </div>

            <div className={cls.list}>
                <div className={cls.list__title}>
                    <i className="fas fa-history" />
                    <span>Yuborilgan rejalar</span>
                    <button
                        className={cls.list__refresh}
                        onClick={fetchPlans}
                        disabled={loadingList}
                        title="Yangilash"
                    >
                        <i className={`fas fa-rotate-right ${loadingList ? cls.spinning : ""}`} />
                    </button>
                </div>

                {loadingList && <MiniLoader />}

                {!loadingList && plans.length === 0 && (
                    <div className={cls.empty}>
                        <i className="fas fa-folder-open" />
                        <p>Hech qanday reja topilmadi</p>
                    </div>
                )}

                <div className={cls.list__items}>
                    {plans.map(plan => (
                        <div key={plan.id} className={cls.item}>
                            <div
                                className={cls.item__header}
                                onClick={() => toggleExpand(plan.id)}
                            >
                                <div className={classNames(
                                    cls.item__statusIcon,
                                    cls[`item__statusIcon--${plan.status}`]
                                )}>
                                    <i className={STATUS_ICONS[plan.status] ?? "fas fa-circle"} />
                                </div>

                                <div className={cls.item__info}>
                                    <div className={cls.item__meta}>
                                        <span className={cls.item__term}>
                                            <i className="fas fa-calendar-alt" />
                                            {plan.term?.quarter}-chorak · {plan.term?.academic_year}
                                        </span>
                                        <span className={classNames(
                                            cls.item__status,
                                            cls[`item__status--${plan.status}`]
                                        )}>
                                            {STATUS_LABELS[plan.status] ?? plan.status}
                                        </span>
                                    </div>

                                    {plan.score != null && (
                                        <div className={cls.item__score}>
                                            <span className={cls.item__scoreLabel}>Ball:</span>
                                            <span className={cls.item__scoreValue}>{plan.score}</span>
                                            <div className={cls.item__scoreBar}>
                                                <div
                                                    className={cls.item__scoreBarFill}
                                                    style={{ width: `${plan.score}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div className={cls.item__date}>
                                        <i className="fas fa-clock" />
                                        {new Date(plan.uploaded_at).toLocaleString("uz-UZ")}
                                    </div>
                                </div>

                                <i className={classNames(
                                    "fas",
                                    expandedId === plan.id ? "fa-chevron-up" : "fa-chevron-down",
                                    cls.item__arrow
                                )} />
                            </div>

                            {expandedId === plan.id && (
                                <div className={cls.item__detail}>
                                    {plan.feedback && (
                                        <div className={cls.item__feedback}>
                                            <div className={cls.item__feedbackLabel}>
                                                <i className="fas fa-comment-alt" />
                                                AI xulosasi
                                            </div>
                                            <p className={cls.item__feedbackText}>{plan.feedback}</p>
                                        </div>
                                    )}
                                    {plan.file && (
                                        <a
                                            href={`https://school.gennis.uz${plan.file}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className={cls.item__fileLink}
                                        >
                                            <i className="fas fa-file-pdf" />
                                            Faylni ko'rish
                                        </a>
                                    )}
                                    {plan.reviewed_at && (
                                        <div className={cls.item__reviewedAt}>
                                            <i className="fas fa-check" />
                                            Tekshirildi: {new Date(plan.reviewed_at).toLocaleString("uz-UZ")}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
