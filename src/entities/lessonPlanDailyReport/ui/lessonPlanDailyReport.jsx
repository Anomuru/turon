import cls from "./lessonPlanDailyReport.module.sass";
import {DefaultPageLoader} from "shared/ui/defaultLoader/index.js";

const getStatusBadge = (status) => {
    const statusConfig = {
        no_plan: { text: "To'ldirilmagan", color: "#ef4444" },
        pending: { text: "Kutilmoqda", color: "#f59e0b" },
        evaluated: { text: "Baholangan", color: "#10b981" }
    };
    return statusConfig[status] || statusConfig.no_plan;
};

export const LessonPlanDailyReport = ({data, loading}) => {

    if (loading === true) {
        return <DefaultPageLoader/>
    }

    if (!data || data.length === 0) {
        return (
            <div className={cls.empty}>
                <p>Ma'lumot topilmadi</p>
            </div>
        )
    }

    return (
        <div className={cls.container}>
            {data.map((teacher) => (
                <div key={teacher.id} className={cls.teacherCard}>
                    <div className={cls.teacherHeader}>
                        <div className={cls.teacherInfo}>
                            <h3 className={cls.teacherName}>{teacher.full_name}</h3>
                            <p className={cls.teacherPhone}>{teacher.phone}</p>
                        </div>
                        <div className={cls.lessonCount}>
                            <span className={cls.countBadge}>
                                {teacher.lessons.length} ta dars
                            </span>
                        </div>
                    </div>

                    {teacher.lessons.length > 0 ? (
                        <div className={cls.lessonsTable}>
                            <table className={cls.table}>
                                <thead>
                                    <tr>
                                        <th>Guruh</th>
                                        <th>Fan</th>
                                        <th>Vaqt</th>
                                        <th>Holat</th>
                                        <th>AI Ball</th>
                                        <th>AI Xulosa</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {teacher.lessons.map((lesson) => {
                                        const statusInfo = getStatusBadge(lesson.status);
                                        return (
                                            <tr key={lesson.timetable_id}>
                                                <td className={cls.groupName}>{lesson.group.name}</td>
                                                <td>{lesson.subject.name}</td>
                                                <td className={cls.time}>
                                                    {lesson.hours.start} - {lesson.hours.end}
                                                </td>
                                                <td>
                                                    <span
                                                        className={cls.statusBadge}
                                                        style={{ backgroundColor: statusInfo.color }}
                                                    >
                                                        {statusInfo.text}
                                                    </span>
                                                </td>
                                                <td className={cls.score}>
                                                    {lesson.ai_score !== null ? (
                                                        <span className={cls.scoreBadge}>
                                                            {lesson.ai_score}/10
                                                        </span>
                                                    ) : (
                                                        <span className={cls.noScore}>—</span>
                                                    )}
                                                </td>
                                                <td className={cls.conclusion}>
                                                    {lesson.ai_conclusion || "—"}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className={cls.noLessons}>
                            <p>Bugun darslar yo'q</p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}
