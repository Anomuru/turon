import {LessonPlanDailyReport} from "entities/lessonPlanDailyReport/index.js";
import {lessonPlanDailyReportReducer} from "entities/lessonPlanDailyReport/model/lessonPlanDailyReportSlice.js";
import {DynamicModuleLoader} from "shared/lib/components/DynamicModuleLoader/DynamicModuleLoader.jsx";
import {useDispatch, useSelector} from "react-redux";
import {getLessonPlanDailyReport, getLessonPlanDailyReportLoading} from "entities/lessonPlanDailyReport/model/lessonPlanDailyReportSelector.js";
import {Input} from "shared/ui/input/index.js";
import cls from "./lessonPlanDailyReportPage.module.sass";
import {useEffect, useState} from "react";
import {fetchLessonPlanDailyReport} from "entities/lessonPlanDailyReport/model/lessonPlanDailyReportThunk.js";
import {getCurrentBranch} from "entities/oftenUsed/model/oftenUsedSelector.js";

const reducers = {
    lessonPlanDailyReportSlice: lessonPlanDailyReportReducer,
};

export const LessonPlanDailyReportPage = () => {
    const dispatch = useDispatch();
    const data = useSelector(getLessonPlanDailyReport);
    const loading = useSelector(getLessonPlanDailyReportLoading);

    const today = new Date().toISOString().slice(0, 10);
    const [selectedDate, setSelectedDate] = useState(today);

    const branchId = localStorage.getItem("branchId");
    const ROLE = localStorage.getItem("job");
    const currentBranch = useSelector(getCurrentBranch);
    const branchForFilter = ROLE === "director" ? currentBranch : branchId;

    useEffect(() => {
        if (selectedDate && branchForFilter) {
            dispatch(fetchLessonPlanDailyReport({
                branch_id: branchForFilter,
                date: selectedDate
            }));
        }
    }, [selectedDate, branchForFilter, dispatch]);

    return (
        <DynamicModuleLoader reducers={reducers}>
            <div className={cls.page}>
                <div className={cls.header}>
                    <div className={cls.titleSection}>
                        <h1 className={cls.title}>Kunlik Dars Rejasi Hisoboti</h1>
                        <p className={cls.subtitle}>O'qituvchilarning kunlik darslari va lesson plan holati</p>
                    </div>
                    <div className={cls.dateFilter}>
                        <label className={cls.dateLabel}>Sana:</label>
                        <Input
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            extraClassName={cls.dateInput}
                            type="date"
                        />
                    </div>
                </div>
                <div className={cls.content}>
                    <LessonPlanDailyReport data={data} loading={loading}/>
                </div>
            </div>
        </DynamicModuleLoader>
    );
};
