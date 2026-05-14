import cls from "./teacherStatistics.module.sass";
import {DefaultPageLoader} from "shared/ui/defaultLoader/index.js";

const formatSum = (sum) => {
    return sum?.toString()?.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ")
}

export const TeacherStatistics = ({data, loading}) => {

    if (loading === true) {
        return <DefaultPageLoader/>
    }

    if (!data || !data.results || data.results.length === 0) {
        return (
            <div className={cls.empty}>
                <p>Ma'lumot topilmadi</p>
            </div>
        )
    }

    return (
        <div className={cls.container}>
            <div className={cls.header}>
                <h2>O'qituvchilar statistikasi</h2>
                <p>Jami: {data.count} ta o'qituvchi</p>
            </div>

            <div className={cls.tableWrapper}>
                <table className={cls.table}>
                    <thead>
                        <tr>
                            <th>Reyting</th>
                            <th>O'qituvchi</th>
                            <th>Filial</th>
                            <th>Observation</th>
                            <th>Dars rejasi</th>
                            <th>Mission</th>
                            <th>Umumiy ball</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.results.map((teacher, index) => (
                            <tr key={teacher.teacher_id} className={cls.row}>
                                <td className={cls.rank}>
                                    <div className={cls.rankBadge}>
                                        {teacher.rank}
                                    </div>
                                </td>
                                <td className={cls.teacherName}>
                                    {teacher.teacher_name}
                                </td>
                                <td>{teacher.branch.name}</td>
                                <td>
                                    <div className={cls.statCell}>
                                        <span className={cls.count}>{teacher.observation_count}</span>
                                        <span className={cls.avg}>O'rtacha: {teacher.observation_avg.toFixed(2)}</span>
                                    </div>
                                </td>
                                <td>
                                    <div className={cls.statCell}>
                                        <span className={cls.count}>{teacher.lesson_plan_count}</span>
                                        <span className={cls.avg}>O'rtacha: {teacher.lesson_plan_avg_ball.toFixed(2)}</span>
                                    </div>
                                </td>
                                <td>
                                    <div className={cls.statCell}>
                                        <span className={cls.count}>{teacher.mission_completed}/{teacher.mission_total}</span>
                                        <span className={cls.avg}>Ball: {teacher.mission_avg_score.toFixed(2)}</span>
                                        {teacher.mission_delay_days > 0 && (
                                            <span className={cls.delay}>Kechikish: {teacher.mission_delay_days} kun</span>
                                        )}
                                    </div>
                                </td>
                                <td>
                                    <div className={cls.totalAvg}>
                                        <strong>{teacher.total_avg.toFixed(2)}</strong>
                                    </div>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
