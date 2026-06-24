import React, { memo, useEffect, useState } from 'react';
import { EditableCard } from "shared/ui/editableCard";
import cls from "./studentProfileInfo.module.sass";
import defaultUserImg from "shared/assets/images/user_image.png";
import visa from "shared/assets/images/visa.svg"
import classNames from "classnames";
import { Button } from "shared/ui/button";

import { API_URL, API_URL_DOC, headers, useHttp } from "../../../../../shared/api/base";
import { useNavigate, useParams } from "react-router";
import { Modal } from "shared/ui/modal/index.js";
import { Input } from "shared/ui/input/index.js";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { getUserDataUsername } from "pages/profilePage/model/selector/studentProfileSelector.js";
import { onChangeUserUsername } from "pages/profilePage/model/slice/studentProfileSlice.js";

const getGradeInfo = (grade) => {
    switch (grade) {
        case 'A*': return { icon: 'fa-solid fa-star', color: '#fbbf24' };
        case 'A': return { icon: 'fa-solid fa-medal', color: '#93c5fd' }; // Changed to lighter blue for better contrast on green background if needed, or leave #3b82f6 for quarters
        case 'B': return { icon: 'fa-solid fa-thumbs-up', color: '#86efac' }; // Light green
        case 'C': return { icon: 'fa-solid fa-check-circle', color: '#6ee7b7' }; // Teal
        case 'D': return { icon: 'fa-solid fa-handshake', color: '#fcd34d' }; // Yellow
        case 'E': return { icon: 'fa-solid fa-flag', color: '#fdba74' }; // Orange
        case 'F': return { icon: 'fa-solid fa-triangle-exclamation', color: '#fca5a5' }; // Red-light
        case 'G': return { icon: 'fa-solid fa-exclamation-circle', color: '#f87171' }; // Red
        case 'U':
        case 'Ungraded': return { icon: 'fa-solid fa-circle-xmark', color: '#ef4444' };
        default: return { icon: 'fa-solid fa-award', color: '#e2e8f0' };
    }
};

// Sertifikat yuklab olish va ko'rish komponenti
const CertificateDownload = memo(({ studentId }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);
    const [modalActive, setModalActive] = useState(false);
    const [downloading, setDownloading] = useState(false);

    const handleView = async () => {
        if (data) {
            setModalActive(true);
            return;
        }
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}terms/certificate-data/${studentId}/`, {
                headers: headers(),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err?.detail || "Ma'lumot olishda xatolik");
            }

            const resData = await res.json();
            setData(resData);
            setModalActive(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async () => {
        if (!data?.certificate_url) return;
        setDownloading(true);
        try {
            const pdfRes = await fetch(data.certificate_url, {
                headers: headers(),
            });

            if (!pdfRes.ok) throw new Error("PDF yuklab olishda xatolik");

            const blob = await pdfRes.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `certificate_${studentId}_${data.academic_year || '2025-2026'}.pdf`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            alert(err.message);
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "4px" }}>
            <Button
                onClick={handleView}
                disabled={loading}
                title="Sertifikatni ko'rish"
                type={"simple"}
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 16px",
                    background: loading ? "#94a3b8" : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    cursor: loading ? "not-allowed" : "pointer",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    boxShadow: loading ? "none" : "0 2px 8px rgba(99,102,241,0.35)",
                    transition: "opacity 0.2s",
                }}
            >
                <i
                    className={loading ? "fa-solid fa-spinner fa-spin" : "fa-solid fa-certificate"}
                    style={{ fontSize: "1rem" }}
                />
                {loading ? "Yuklanmoqda..." : "Sertifikatni ko'rish"}
            </Button>

            {error && (
                <span style={{ fontSize: "0.75rem", color: "#ef4444" }}>
                    <i className="fa-solid fa-circle-exclamation" style={{ marginRight: "4px" }} />
                    {error}
                </span>
            )}

            <Modal active={modalActive} setActive={setModalActive}>
                {data && (
                    <div style={{ padding: "10px", width: "100%", maxWidth: "600px", minWidth: "300px" }}>
                        <div style={{ textAlign: "center", marginBottom: "20px" }}>
                            <h2 style={{ fontSize: "2rem", color: "#333", marginBottom: "5px" }}>Sertifikat Ma'lumotlari</h2>
                            <p style={{ fontSize: "1.3rem", color: "#666" }}>{data.academic_year} o'quv yili</p>
                        </div>

                        <div style={{ background: "#f8fafc", padding: "15px", borderRadius: "10px", marginBottom: "20px", border: "1px solid #e2e8f0" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                                <span style={{ fontWeight: "bold", color: "#475569" }}>O'quvchi:</span>
                                <span style={{ color: "#1e293b", fontWeight: "600", textAlign: "right" }}>{data.student?.name} {data.student?.surname}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ fontWeight: "bold", color: "#475569" }}>Daraja:</span>
                                <span style={{ color: "#1e293b", fontWeight: "600", textAlign: "right" }}>{data.student?.level}</span>
                            </div>
                        </div>

                        <div style={{ marginBottom: "20px" }}>
                            <h3 style={{ fontSize: "1.2rem", color: "#333", marginBottom: "10px", borderBottom: "2px solid #e2e8f0", paddingBottom: "5px" }}>Choraklar natijalari</h3>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: "10px" }}>
                                {data.quarters?.map((q, index) => {
                                    const gradeInfo = getGradeInfo(q.quarter_grade);
                                    return (
                                        <div key={index} style={{ background: q.subject_count > 0 ? "#eff6ff" : "#f1f5f9", padding: "10px", borderRadius: "8px", border: `1px solid ${q.subject_count > 0 ? "#bfdbfe" : "#e2e8f0"}`, textAlign: "center" }}>
                                            <div style={{ fontWeight: "bold", color: "#1e40af", marginBottom: "5px" }}>{q.quarter}-chorak</div>
                                            <div style={{ fontSize: "1.2rem", fontWeight: "700", color: q.quarter_grade ? (gradeInfo.color === '#e2e8f0' ? '#94a3b8' : gradeInfo.color) : "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                                                {q.quarter_grade && <i className={gradeInfo.icon} style={{ fontSize: "1rem", color: gradeInfo.color === '#e2e8f0' ? '#94a3b8' : gradeInfo.color }} />}
                                                {q.quarter_grade || "-"}
                                            </div>
                                            {q.quarter_avg && <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "4px" }}>{q.quarter_avg}</div>}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div style={{ background: "linear-gradient(135deg, #10b981, #059669)", color: "white", padding: "15px", borderRadius: "10px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)", flexWrap: "wrap", gap: "10px" }}>
                            <div>
                                <div style={{ fontSize: "0.9rem", opacity: 0.9 }}>Yakuniy Natija</div>
                                <div style={{ fontSize: "1.5rem", fontWeight: "bold", display: "flex", alignItems: "center", gap: "8px" }}>
                                    <i className={getGradeInfo(data.final_grade).icon} style={{ color: getGradeInfo(data.final_grade).color, textShadow: "0 1px 2px rgba(0,0,0,0.2)" }} />
                                    {data.final_grade || "-"}
                                </div>
                                <div style={{ fontSize: "0.85rem", opacity: 0.9 }}>{data.grade_description || ""}</div>
                            </div>
                            <div style={{ textAlign: "right" }}>
                                <div style={{ fontSize: "0.9rem", opacity: 0.9 }}>Umumiy ball</div>
                                <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{data.final_score || "-"}</div>
                            </div>
                        </div>

                        <button
                            onClick={handleDownload}
                            disabled={downloading}
                            style={{
                                width: "100%",
                                padding: "12px",
                                background: downloading ? "#94a3b8" : "#4f46e5",
                                color: "white",
                                border: "none",
                                borderRadius: "8px",
                                fontSize: "1rem",
                                fontWeight: "bold",
                                cursor: downloading ? "not-allowed" : "pointer",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: "8px",
                                transition: "background 0.2s"
                            }}
                        >
                            <i className={downloading ? "fa-solid fa-spinner fa-spin" : "fa-solid fa-download"} />
                            {downloading ? "Yuklanmoqda..." : "PDF formatida yuklab olish"}
                        </button>
                    </div>
                )}
            </Modal>
        </div>
    );
});

export const StudentProfileInfo = memo(({
                                            setActive,
                                            data,
                                            active,
                                            setActiveModal,
                                            content,
                                            contract,
                                            month,
                                            charity,
                                            currentTab,
                                            setCurrentTab,
                                        }) => {
    const number = Number(content?.debt)
const {id} = useParams()
    // const id = data?.id
    console.log(id)
    const formattedNumber = number?.toLocaleString();
    const navigate = useNavigate()
    const [activeChangePassword, setActiveChangePassword] = useState(false)
    const [activeChangeUsername, setActiveChangeUsername] = useState(false)

    const { register, setValue, handleSubmit } = useForm()
    const userDataUsername = useSelector(getUserDataUsername)


    useEffect(() => {
        setValue("username", userDataUsername)
    }, [])
    const { request } = useHttp()
    const [activeErr, setActiveErr] = useState("")

    const onChangePassword = (data) => {
        console.log(data)
        request(`${API_URL}Users/users/update/${id}/`, "PATCH", JSON.stringify(data), headers())
            .then(res => {
                console.log(data)
            })
    }

    const dispatch = useDispatch()
    const onChangeUsername = (data) => {

        request(`${API_URL}Users/users/update/${id}/`, "PATCH", JSON.stringify(data), headers())
            .then(res => {
                dispatch(onChangeUserUsername(res.username))
                setActiveChangeUsername(false)
                setActiveErr(false)

            })
            .catch(err => {
                setActiveErr(true)
            })
    }


    const role = localStorage.getItem("job")

    return (
        <EditableCard
            onClick={() => {
                setActiveModal("changeInfo")
            }}
            extraClass={cls.info}
            title={<i className="fas fa-edit" />}
        >
            <div className={cls.info__div}>
                <div className={cls.info__div__avatar}>
                    <img
                        onClick={() => setActiveModal("changeImage")}
                        className={cls.info__div__avatar__image}
                        src={data?.profile_img ?? defaultUserImg}
                        alt=""
                    />
                    <div className={cls.info__div__avatar__box}>
                        <div className={cls.info__div__avatar__box__name}>
                            <h1 className={cls.fullName}>
                                {data?.name} {data?.surname} {data?.father_name}
                            </h1>
                            <div className={cls.userMainInfo}>
                                <span className={cls.username}>
                                    <span className={cls.username__inner}>@</span>
                                    {data?.username}
                                </span>
                                <span className={cls.faceId}>
                                    <i class="fa-regular fa-id-card" />
                                    {data?.face_id ?? "Face Id topilmadi"}
                                </span>
                            </div>
                        </div>

                        <div className={cls.info__div__avatar__box__panel}>
                            <Button
                                extraClass={classNames(cls.info__div__avatar__box__panel__stBtn, {
                                    [cls.active]: currentTab === "info"
                                })}
                                onClick={() => setCurrentTab("info")}
                            >
                                Ma'lumotlar
                            </Button>

                            <Button
                                extraClass={classNames(cls.info__div__avatar__box__panel__btn, {
                                    [cls.active]: currentTab === "contract"
                                })}
                                onClick={() => setCurrentTab("contract")}
                            >
                                Shartnoma
                            </Button>

                            <Button
                                extraClass={classNames(cls.info__div__avatar__box__panel__switch, {
                                    [cls.active]: currentTab === "timetable"
                                })}
                                onClick={() => setCurrentTab("timetable")}
                            >
                                Dars jadvalini ko'rish
                            </Button>
                            <Button
                                onClick={() => setCurrentTab("quarter")}
                                extraClass={cls.info__div__avatar__box__panel__quarter}
                            >
                                Chorakni ko'rish
                            </Button>

                                {id && (


                                        <CertificateDownload studentId={id} />

                                )}


                        </div>
                        <div className={cls.info__div__avatar__box__source}>
                            <div className={cls.info__div__avatar__box__source__each}>
                                <span className={cls.info__div__avatar__box__source__each__iconBox}>

                                    <i style={{ textShadow: "0 0 0 #fff", fontSize: "2rem", color: "transparent" }}
                                       className="fa-solid fa-phone"></i>
                                </span>
                                <div className={cls.info__div__avatar__box__source__each__info}>
                                    <h2>Tel raqami</h2>
                                    <h1>{data?.phone}</h1>
                                </div>


                            </div>
                            <div className={cls.info__div__avatar__box__source__each}>
                                <span style={{ background: "#2563EA" }}
                                      className={cls.info__div__avatar__box__source__each__iconBox}>
                                    <i style={{ color: "#fff", fontSize: "2rem" }}
                                       className="fa-solid fa-id-card"></i>
                                </span>
                                <div className={cls.info__div__avatar__box__source__each__info}>
                                    <h2>Yoshi</h2>
                                    <h1>{data?.age}</h1>
                                </div>
                            </div>
                            <div className={cls.info__div__avatar__box__source__each}>
                                <span style={{ background: "#A453F6" }}
                                      className={cls.info__div__avatar__box__source__each__iconBox}>
                                    <i style={{ color: "#fff", fontSize: "2rem" }}
                                       className="fa-solid fa-cake-candles"></i>
                                </span>
                                <div className={cls.info__div__avatar__box__source__each__info}>
                                    <h2>Tug'ilgan sanasi</h2>
                                    <h1>{data?.birth_date}</h1>
                                </div>

                            </div>
                            <div className={cls.info__div__avatar__box__source__each}>
                                <span style={{ background: "#3B82F6" }}
                                      className={cls.info__div__avatar__box__source__each__iconBox}>
                                    <i style={{ color: "#fff", fontSize: "2rem" }}
                                       className="fa-solid fa-calendar"></i>
                                </span>
                                <div className={cls.info__div__avatar__box__source__each__info}>
                                    <h2>Reg. sanasi</h2>
                                    <h1>{data?.registered_date}</h1>
                                </div>

                            </div>
                            {
                                charity && charity.charity_sum
                                    ? (
                                        <div className={cls.info__div__avatar__box__source__each}>
                                            <span style={{ background: "#F97316" }}
                                                  className={cls.info__div__avatar__box__source__each__iconBox}>
                                                <i style={{ color: "#fff", fontSize: "2rem" }}
                                                   className="fa-solid fa-handshake"></i>
                                            </span>
                                            <div className={cls.info__div__avatar__box__source__each__info}>
                                                <h2>Chegirma</h2>
                                                <h1>{Number(charity.charity_sum).toLocaleString()}</h1>
                                            </div>

                                        </div>
                                    )
                                    : null
                            }
                            {role === "advertising" ? null :

                                role === "spiritualist" ?  <div className={cls.info__div__avatar__box__source__payment}>
                                <span  title={"To'lov qilish"}
                                       className={cls.info__div__avatar__box__source__payment__clicker}></span>
                                        <h1 title={"To'lovlar ro'yxati"}
                                            className={cls.info__div__avatar__box__source__payment__text}>{formattedNumber} so'm</h1>
                                        <img draggable="false" className={cls.info__div__avatar__box__source__payment__img}
                                             src={visa} alt="" />
                                    </div> :

                                    <div className={cls.info__div__avatar__box__source__payment}>
                                <span onClick={() => setActive("balanceIn")} title={"To'lov qilish"}
                                      className={cls.info__div__avatar__box__source__payment__clicker}></span>
                                        <h1 title={"To'lovlar ro'yxati"} onClick={() => setActive("balance")}
                                            className={cls.info__div__avatar__box__source__payment__text}>{formattedNumber} so'm</h1>
                                        <img draggable="false" className={cls.info__div__avatar__box__source__payment__img}
                                             src={visa} alt="" />
                                    </div>}

                            {/* ─── Sertifikat yuklab olish ─── */}

                        </div>
                    </div>
                </div>


                <Modal active={activeChangeUsername} setActive={setActiveChangeUsername}>
                    <h2>Change username</h2>


                    <div style={{ marginTop: "20px" }}>
                        {activeErr ? <h2 style={{ color: "red", marginTop: "5px" }}>Username mavjud</h2> : ""}
                        <Input register={register} name={"username"} />
                        <Button onClick={handleSubmit(onChangeUsername)} extraClass={cls.info__addInfo}>Click</Button>
                    </div>


                </Modal>


                <Modal active={activeChangePassword} setActive={setActiveChangePassword}>
                    <h2>Change password</h2>

                    <div style={{ marginTop: "20px" }}>
                        <Input register={register} name={"password"} type={"password"} />

                        <Button onClick={handleSubmit(onChangePassword)} extraClass={cls.info__addInfo}>Click</Button>
                    </div>


                </Modal>

            </div>

        </EditableCard >
    );
});