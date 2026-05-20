import {useParams, useNavigate} from "react-router";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getTeacherLessonPlans, getTeacherLessonPlansLoading} from "entities/teacherLessonPlans/model/teacherLessonPlansSelector.js";
import {fetchTeacherLessonPlans} from "entities/teacherLessonPlans/model/teacherLessonPlansThunk.js";
import {teacherLessonPlansReducer} from "entities/teacherLessonPlans/model/teacherLessonPlansSlice.js";
import {DynamicModuleLoader} from "shared/lib/components/DynamicModuleLoader/DynamicModuleLoader.jsx";
import {DefaultPageLoader} from "shared/ui/defaultLoader/index.js";
import cls from "./lessonPlanDetailPage.module.sass";

const reducers = {
    teacherLessonPlansSlice: teacherLessonPlansReducer,
};

export const LessonPlanDetailPage = () => {
    const {teacherId} = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const lessonPlans = useSelector(getTeacherLessonPlans);
    const loading = useSelector(getTeacherLessonPlansLoading);

    const today = new Date().toISOString().slice(0, 10);
    const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10);

    const [dateFrom, setDateFrom] = useState(firstDayOfMonth);
    const [dateTo, setDateTo] = useState(today);
    const [expandedId, setExpandedId] = useState(null);

    useEffect(() => {
        if (teacherId && dateFrom && dateTo) {
            dispatch(fetchTeacherLessonPlans({
                teacher_id: teacherId,
                start_date: dateFrom,
                end_date: dateTo
            }));
        }
    }, [teacherId, dateFrom, dateTo, dispatch]);

    const toggleExpand = (id) => {
        setExpandedId(prev => prev === id ? null : id);
    };

    if (loading) {
        return (
            <DynamicModuleLoader reducers={reducers}>
                <DefaultPageLoader/>
            </DynamicModuleLoader>
        );
    }

    return (
        <DynamicModuleLoader reducers={reducers}>
            <div className={cls.page}>
                <div className={cls.header}>
                    <div className={cls.headerTop}>
                        <button className={cls.backBtn} onClick={() => navigate(-1)}>
                            <i className="fas fa-arrow-left"/>
                            Ortga
                        </button>
                        <h1>Dars rejasi tafsilotlari</h1>
                    </div>
                    <div className={cls.dateFilters}>
                        <div className={cls.inputGroup}>
                            <label>Boshlanish sanasi:</label>
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                className={cls.dateInput}
                            />
                        </div>
                        <div className={cls.inputGroup}>
                            <label>Tugash sanasi:</label>
                            <input
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                className={cls.dateInput}
                            />
                        </div>
                    </div>
                </div>

                {(!lessonPlans || lessonPlans.length === 0) ? (
                    <div className={cls.empty}>
                        <p>Dars rejasi topilmadi</p>
                    </div>
                ) : (
                    <div className={cls.plansList}>
                        {lessonPlans.map((lessonPlan) => (
                            <div
                                key={lessonPlan.id}
                                className={cls.planCard}
                            >
                                <div
                                    className={cls.planCardHeader}
                                    onClick={() => toggleExpand(lessonPlan.id)}
                                >
                                    <div className={cls.planCardInfo}>
                                        <div className={cls.planCardDate}>
                                            <i className="fas fa-calendar-alt"/>
                                            {lessonPlan.date}
                                        </div>
                                        <div className={cls.planCardTeacher}>
                                            <i className="fas fa-user"/>
                                            {lessonPlan.teacher?.name} {lessonPlan.teacher?.surname}
                                        </div>
                                        {lessonPlan.group && (
                                            <div className={cls.planCardGroup}>
                                                <i className="fas fa-users"/>
                                                {lessonPlan.group?.name}
                                            </div>
                                        )}
                                        {lessonPlan.class_time_table && (
                                            <div className={cls.planCardSubject}>
                                                <i className="fas fa-book"/>
                                                {lessonPlan.class_time_table.subject?.name}
                                            </div>
                                        )}
                                    </div>
                                    <div className={cls.planCardRight}>
                                        {lessonPlan.ball != null && (
                                            <div className={cls.ballBadge}>
                                                {lessonPlan.ball}
                                            </div>
                                        )}
                                        <i className={`fas ${expandedId === lessonPlan.id ? 'fa-chevron-up' : 'fa-chevron-down'} ${cls.arrow}`}/>
                                    </div>
                                </div>

                                {expandedId === lessonPlan.id && (
                                    <div className={cls.planCardBody}>
                                        <div className={cls.info}>
                                            {lessonPlan.class_time_table && (
                                                <>
                                                    <p><strong>Xona:</strong> {lessonPlan.class_time_table.room?.name}</p>
                                                    <p><strong>Vaqt:</strong> {lessonPlan.class_time_table.hours?.start_time} - {lessonPlan.class_time_table.hours?.end_time}</p>
                                                </>
                                            )}
                                        </div>

                                        <div className={cls.content}>
                                            {lessonPlan.objective && (
                                                <div className={cls.section}>
                                                    <h3>Maqsad</h3>
                                                    <p>{lessonPlan.objective}</p>
                                                </div>
                                            )}
                                            {lessonPlan.main_lesson && (
                                                <div className={cls.section}>
                                                    <h3>Asosiy dars</h3>
                                                    <p>{lessonPlan.main_lesson}</p>
                                                </div>
                                            )}
                                            {lessonPlan.homework && (
                                                <div className={cls.section}>
                                                    <h3>Uy vazifasi</h3>
                                                    <p>{lessonPlan.homework}</p>
                                                </div>
                                            )}
                                            {lessonPlan.assessment && (
                                                <div className={cls.section}>
                                                    <h3>Baholash</h3>
                                                    <p>{lessonPlan.assessment}</p>
                                                </div>
                                            )}
                                            {lessonPlan.activities && (
                                                <div className={cls.section}>
                                                    <h3>Faoliyatlar</h3>
                                                    <p>{lessonPlan.activities}</p>
                                                </div>
                                            )}
                                            {lessonPlan.resources && (
                                                <div className={cls.section}>
                                                    <h3>Resurslar</h3>
                                                    <p>{lessonPlan.resources}</p>
                                                </div>
                                            )}
                                            {lessonPlan.conclusion && (
                                                <div className={cls.section}>
                                                    <h3>Xulosa</h3>
                                                    <p>{lessonPlan.conclusion}</p>
                                                </div>
                                            )}
                                        </div>

                                        {lessonPlan.students && lessonPlan.students.length > 0 && (
                                            <div className={cls.students}>
                                                <h2>O'quvchilar baholari</h2>
                                                <div className={cls.studentsList}>
                                                    {lessonPlan.students.map((item, index) => (
                                                        <div key={index} className={cls.studentCard}>
                                                            <div className={cls.studentName}>
                                                                {item.student?.name} {item.student?.surname}
                                                            </div>
                                                            <div className={cls.studentComment}>
                                                                {item.comment}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DynamicModuleLoader>
    );
};
