import {TeacherStatistics} from "entities/teacherStatistics/index.js";
import {teacherStatisticsReducer} from "entities/teacherStatistics/model/teacherStatisticsSlice.js";
import {DynamicModuleLoader} from "shared/lib/components/DynamicModuleLoader/DynamicModuleLoader.jsx";
import {useDispatch, useSelector} from "react-redux";
import {getTeacherStatistics, getTeacherStatisticsLoading} from "entities/teacherStatistics/model/teacherStatisticsSelector.js";
import {Input} from "shared/ui/input/index.js";
import cls from "./teacherStatisticsPage.module.sass";
import {useEffect, useState} from "react";
import {fetchTeacherStatistics} from "entities/teacherStatistics/model/teacherStatisticsThunk.js";
import {getCurrentBranch} from "entities/oftenUsed/model/oftenUsedSelector.js";

const reducers = {
    teacherStatisticsSlice: teacherStatisticsReducer,
};

export const TeacherStatisticsPage = () => {
    const dispatch = useDispatch();
    const data = useSelector(getTeacherStatistics);
    const loading = useSelector(getTeacherStatisticsLoading);

    const today = new Date().toISOString().slice(0, 10);
    const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10);

    const [dateFrom, setDateFrom] = useState(firstDayOfMonth);
    const [dateTo, setDateTo] = useState(today);

    const branchId = localStorage.getItem("branchId");
    const ROLE = localStorage.getItem("job");
    const currentBranch = useSelector(getCurrentBranch);
    const branchForFilter = ROLE === "director" ? currentBranch : branchId;

    useEffect(() => {
        if (dateFrom && dateTo && branchForFilter) {
            dispatch(fetchTeacherStatistics({
                branch: branchForFilter,
                date_from: dateFrom,
                date_to: dateTo
            }));
        }
    }, [dateFrom, dateTo, branchForFilter, dispatch]);

    return (
        <DynamicModuleLoader reducers={reducers}>
            <div className={cls.page}>
                <div className={cls.filters}>
                    <h1 className={cls.title}>O'qituvchilar statistikasi</h1>
                    <div className={cls.dateFilters}>
                        <div className={cls.inputGroup}>
                            <label>Boshlanish sanasi:</label>
                            <Input
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                extraClassName={cls.dateInput}
                                type="date"
                            />
                        </div>
                        <div className={cls.inputGroup}>
                            <label>Tugash sanasi:</label>
                            <Input
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                extraClassName={cls.dateInput}
                                type="date"
                            />
                        </div>
                    </div>
                </div>
                <div className={cls.content}>
                    <TeacherStatistics data={data} loading={loading}/>
                </div>
            </div>
        </DynamicModuleLoader>
    );
};
