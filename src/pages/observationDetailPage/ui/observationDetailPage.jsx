import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL, headers, useHttp } from "shared/api/base.js";
import { MiniLoader } from "shared/ui/miniLoader/index.js";
import cls from "./observationDetailPage.module.sass";
import {useLocation} from "react-router";

export const ObservationDetailPage = () => {
    const { observationId } = useParams();
    const navigate = useNavigate();
    const { request } = useHttp();
    const location = useLocation();

    const [allData, setAllData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!location.state?.observeIds) return;

        setLoading(true);
        request(
            `${API_URL}Observation/observations/full/list/`,
            "POST",
            JSON.stringify({ observation_ids: location.state.observeIds }),
            headers()
        )
            .then(res => {
                if (res && res.length > 0) {
                    setAllData(res);
                }
            })
            .finally(() => setLoading(false));
    }, [location.state?.observeIds]);

    const getScoreColor = (score) => {
        if (score === null || score === "") return "#9ca3af";
        const numScore = typeof score === "number" ? score : parseFloat(score);
        if (numScore >= 4) return "#10b981";
        if (numScore >= 3) return "#3b82f6";
        if (numScore >= 2) return "#f59e0b";
        return "#ef4444";
    };

    if (loading) {
        return (
            <div className={cls.page}>
                <MiniLoader />
            </div>
        );
    }

    if (!allData || allData.length === 0) {
        return (
            <div className={cls.page}>
                <div className={cls.empty}>
                    <i className="fas fa-exclamation-circle" />
                    <p>Kuzatuv ma'lumoti topilmadi</p>
                </div>
            </div>
        );
    }

    return (
        <div className={cls.page}>
            <div className={cls.header}>
                <button className={cls.backBtn} onClick={() => navigate(-1)}>
                    <i className="fas fa-arrow-left" />
                    Orqaga
                </button>
                <div className={cls.headerInfo}>
                    <h1>Kuzatuv Tafsilotlari</h1>
                    <p>{allData.length} ta kuzatuv</p>
                </div>
            </div>

            <div className={cls.observersGrid} style={{ gridTemplateColumns: `repeat(${allData.length}, 1fr)` }}>
                {allData.map((data, observerIndex) => (
                    <div key={observerIndex} className={cls.observerPanel}>
                        <div className={cls.observerHeader}>
                            <div className={cls.observerIcon}>
                                <i className="fas fa-user-tie" />
                            </div>
                            <div className={cls.observerInfo}>
                                <span className={cls.observerLabel}>Kuzatuvchi</span>
                                <span className={cls.observerName}>
                                    {data.observer?.name} {data.observer?.surname}
                                </span>
                            </div>
                            <div
                                className={cls.observerScore}
                                style={{ backgroundColor: getScoreColor(data.average) }}
                            >
                                {data.average !== null ? data.average.toFixed(1) : "—"}
                            </div>
                        </div>

                        <div className={cls.sections}>
                            {data.info && data.info.length > 0 ? (
                                data.info.map((section, index) => {
                                    const selectedValue = section.values.find(v => v.value !== "" && v.value !== null);

                                    return (
                                        <div key={index} className={cls.section}>
                                            <div className={cls.sectionHeader}>
                                                <h3>{section.title}</h3>
                                            </div>

                                            <div className={cls.sectionBody}>
                                                <div className={cls.options}>
                                                    {section.values && section.values.map((val, idx) => {
                                                        const isSelected = val.value !== "" && val.value !== null;
                                                        return (
                                                            <div
                                                                key={idx}
                                                                className={`${cls.option} ${isSelected ? cls.selected : ""}`}
                                                            >
                                                                <div className={cls.optionContent}>
                                                                    <span className={cls.optionName}>{val.name}</span>
                                                                    {isSelected && (
                                                                        <div className={cls.optionBadge} style={{ backgroundColor: getScoreColor(val.value) }}>
                                                                            <i className="fas fa-check" />
                                                                            <span>{val.value}</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                                {section.comment && (
                                                    <div className={cls.comment}>
                                                        <div className={cls.commentIcon}>
                                                            <i className="fas fa-comment" />
                                                        </div>
                                                        <p className={cls.commentText}>{section.comment}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className={cls.empty}>
                                    <i className="fas fa-inbox" />
                                    <p>Ma'lumot yo'q</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

