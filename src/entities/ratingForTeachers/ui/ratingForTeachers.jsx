import React from 'react';
import cls from './ratingForTeachers.module.sass';
import { MiniLoader } from 'shared/ui/miniLoader/index.js';



const getScoreColor = (value, category) => {
    if (category === 'lesson_plan' || category === 'student_results') {
        const pct = parseFloat(value);
        if (pct >= 80) return cls.scoreGreen;
        if (pct >= 50) return cls.scoreYellow;
        return cls.scoreRed;
    }
    return '';
};

const TableHeaders = ({ category }) => {
    const base = (
        <tr>
            <th className={cls.thNum}>#</th>
            <th>O'qituvchi</th>
            {category === 'observation' && <th>Ball</th>}
            {(category === 'lesson_plan' || category === 'student_results') && (
                <>
                    <th>Jami</th>
                    <th>Bajarilgan</th>
                    <th>Foiz</th>
                </>
            )}
            {(category === 'satisfaction' || category === 'contribution' || category === 'professionalism') && (
                <>
                    <th>Soni</th>
                    <th>Ball</th>
                </>
            )}
            {
                (category === "pd") && (
                    <>
                        <th>Ma'ruzalar soni</th>
                        <th>Qatnashgan ma'ruzalar soni</th>
                        <th>Qatnashmagan ma'ruzalar soni</th>
                    </>
                )

            }
            {
                (category === "conduct" || category === "responsiveness" || category === "collaboration") && (
                    <>
                        <th>Namunali</th>
                        <th>Qoniqarli</th>
                        <th>Qoniqarsiz</th>
                        <th>Ball</th>

                    </>
                )
            }
        </tr>
    );
    return <thead>{base}</thead>;
};

const TableRow = ({ item, index, category }) => {


    return (
        <tr className={cls.tableRow}>
            <td>
                <span className={`${cls.rank} ${cls.rankNormal}`}>
                    {index + 1}
                </span>
            </td>
            <td className={cls.nameCell}>
                <div className={cls.avatar}>
                    {item.name?.[0]}{item.surname?.[0]}
                </div>
                <span>{item.name} {item.surname}</span>
            </td>

            {category === 'observation' && (
                <td>
                    <span className={cls.badge}>{item?.ball ?? '–'}</span>
                </td>
            )}
            {(category === 'lesson_plan' || category === 'student_results') && (
                <>
                    <td>{item?.total ?? '–'}</td>
                    <td>{item?.done ?? '–'}</td>
                    <td>
                        <span className={`${cls.badge} ${getScoreColor(`${item?.percent}`, category)}`}>
                            {item?.percent != null ? `${item.percent}%` : '–'}
                        </span>
                    </td>
                </>
            )}
            {(category === 'satisfaction' || category === 'contribution' || category === 'professionalism') && (
                <>
                    <td>{item?.count ?? '–'}</td>
                    <td>
                        <span className={cls.badge}>{item?.ball ?? '–'}</span>
                    </td>
                </>
            )}
            {
                (category === "pd") && (
                    <>
                        <td>{item?.speaker_pd_count}</td>
                        <td>{item?.attended_pd_count}</td>
                        <td>{item?.absent_pd_count}</td>
                    </>
                )
            }
            {
                (category === "conduct" || category === "responsiveness" || category === "collaboration") && (
                    <>
                        <td>{item?.good}</td>
                        <td>{item?.average}</td>
                        <td>{item?.bad}</td>
                        <td>{item?.rating}</td>
                    </>
                )
            }
        </tr>
    );
};

export const RatingTable = ({ data, loading, category }) => {
    if (loading) {
        return (
            <div className={cls.loaderWrap}>
                <MiniLoader />
                <p className={cls.loaderText}>Ma'lumotlar yuklanmoqda…</p>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className={cls.empty}>
                <span className={cls.emptyIcon}>📊</span>
                <p>Ma'lumot topilmadi</p>
                <small>Kategoriya va oy/yilni tanlang</small>
            </div>
        );
    }

    return (
        <div className={cls.tableWrap}>
            <table className={cls.table}>
                <TableHeaders category={category} />
                <tbody>
                    {data.map((item, index) => (
                        <TableRow key={item.id ?? index} item={item} index={index} category={category} />
                    ))}
                </tbody>
            </table>
        </div>
    );
};
