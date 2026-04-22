import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { API_URL, headers, useHttp } from "shared/api/base.js";
import { getUserProfileData } from "entities/profile/userProfile/index.js";
import { MiniLoader } from "shared/ui/miniLoader/index.js";
import cls from "./teacherObservationPage.module.sass";
import classNames from "classnames";

export const TeacherObservationPage = () => {
    const { request } = useHttp();
    const navigate = useNavigate();
    const user = useSelector(getUserProfileData);

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const branchId = user?.branch?.id;
        const teacherId = user?.teacher?.id;

        if (!branchId || !teacherId) return;

        setLoading(true);
        request(
            `${API_URL}Observation/schedule/?branch_id=${branchId}&teacher_id=${teacherId}`,
            "GET",
            null,
            headers()
        )
            .then(res => setData(res))
            .finally(() => setLoading(false));
    }, [user]);

    return (
        <div className={cls.page}>
            <div className={cls.page__header}>
                <div className={cls.page__headerIcon}>
                    <i className="fas fa-eye" />
                </div>
                <div className={cls.page__headerText}>
                    <h1>Observation Schedule</h1>
                    <p>
                        {data ? `Cycle ${data.cycle_id} · Week ${data.current_week}` : "Kuzatuv jadvali"}
                    </p>
                </div>
            </div>

            {loading && <MiniLoader />}

            <div className={cls.page__content}>
                {!loading && data && (
                    <div className={cls.weeks}>
                        {data.weeks.map(week => (
                            <div
                                key={week.week}
                                className={classNames(cls.week, { [cls.current]: week.is_current })}
                            >
                                <div className={cls.week__header}>
                                    <div className={cls.week__title}>
                                        <span className={cls.week__num}>Week {week.week}</span>
                                        <span className={cls.week__date}>{week.week_start}</span>
                                    </div>
                                    {week.is_current && (
                                        <span className={cls.week__badge}>
                                            <i className="fas fa-circle-dot" />
                                            Joriy hafta
                                        </span>
                                    )}
                                </div>

                                <div className={cls.week__body}>
                                    {week.entries.length === 0 ? (
                                        <div className={cls.empty}>
                                            <i className="fas fa-calendar-xmark" />
                                            <p>Bu haftada kuzatuvlar yo'q</p>
                                        </div>
                                    ) : (
                                        week.entries.map(entry => (
                                            <div
                                                key={entry.id}
                                                className={cls.entry}
                                                onClick={() => navigate(`../time/observe/${entry.time_table?.id}`)}
                                            >
                                                <div className={classNames(cls.entry__status, entry.is_completed ? cls.done : cls.pending)}>
                                                    <i className={entry.is_completed ? "fas fa-check" : "fas fa-clock"} />
                                                </div>
                                                <div className={cls.entry__info}>
                                                    <span className={cls.entry__subject}>
                                                        {entry.time_table?.name}
                                                    </span>
                                                    <div className={cls.entry__meta}>
                                                        <span className={cls.entry__metaItem}>
                                                            <i className="fas fa-user-tie" />
                                                            Observer: {entry.observer?.name} {entry.observer?.surname}
                                                        </span>
                                                        <span className={cls.entry__metaItem}>
                                                            <i className="fas fa-chalkboard-teacher" />
                                                            Teacher: {entry.observed_teacher?.name} {entry.observed_teacher?.surname}
                                                        </span>
                                                    </div>
                                                </div>
                                                <i className={`fas fa-chevron-right ${cls.entry__arrow}`} />
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {!loading && !data && (
                <div className={cls.empty}>
                    <i className="fas fa-calendar-xmark" />
                    <p>Ma'lumot topilmadi</p>
                </div>
            )}
        </div>
    );
};
