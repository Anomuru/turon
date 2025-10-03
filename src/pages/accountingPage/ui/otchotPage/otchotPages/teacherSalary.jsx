import {getUserBranchId} from "entities/profile/userProfile";
import {onAddAlertOptions} from "features/alert/model/slice/alertSlice.js";
import {useForm} from "react-hook-form";
import {API_URL, headers, useHttp} from "shared/api/base.js";
import cls from "../otchot.module.sass";
import {Select} from "../../../../../shared/ui/select";
import {TeacherTable} from "../../../../../entities/accounting";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getTeacherSalary} from "../../../../../entities/accounting/model/thunk/otchotAccountingThunk";
import {getSalary} from "../../../../../entities/accounting/model/selector/otchotAccountingSelector";
import {DefaultPageLoader} from "shared/ui/defaultLoader/index.js";

export const TeacherSalary = ({formatSalary}) => {
    const {register} = useForm();
    const dispatch = useDispatch();
    const {request} = useHttp();

    const branchId = useSelector(getUserBranchId);
    const teacherSalary = useSelector(getSalary);

    const [currentData, setCurrentData] = useState([]);
    const [month, setMonths] = useState(null);
    const [year, setYear] = useState(null);

    // Hozirgi yil va oy
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const [loading ,setLoading] = useState(false)

    useEffect(() => {
        if (branchId) {
            dispatch(getTeacherSalary(branchId));
        }
    }, [branchId]);

    // Default qilib shu yil va oy set qilish
    useEffect(() => {
        if (teacherSalary?.dates?.length > 0) {
            const foundYear = teacherSalary.dates.find(item => item.year === currentYear);
            if (foundYear) {
                setYear(currentYear);

                const foundMonth = foundYear.months.find(m => +m === currentMonth);
                if (foundMonth) {
                    setMonths(currentMonth);
                } else {
                    setMonths(foundYear.months[0]);
                }
            } else {
                setYear(teacherSalary.dates[0].year);
                setMonths(teacherSalary.dates[0].months[0]);
            }
        }
    }, [teacherSalary]);

    useEffect(() => {
        if (month && year && branchId) {
            setLoading(true)
            request(
                `${API_URL}Encashment/teacher_salary/?branch=${branchId}`,
                "POST",
                JSON.stringify({year, month}),
                headers()
            )
                .then(res => {
                    setLoading(false)

                    setCurrentData(res);
                })
                .catch(() => {
                    dispatch(onAddAlertOptions({
                        status: "error",
                        type: true,
                        msg: "Serverda hatolik"
                    }));
                });
        }
    }, [month, year, branchId]);

    return (
        <div>
            <div className={cls.paymentType} style={{justifyContent: "normal"}}>
                <Select
                    defaultValue={year}
                    extraClass={cls.select}
                    options={teacherSalary?.dates?.map(item => item?.year)}
                    onChangeOption={setYear}
                    register={register}
                    name={"year"}
                />
                {year ? (
                    <Select
                        defaultValue={month}
                        extraClass={cls.select}
                        options={
                            teacherSalary?.dates?.find(item => item.year === +year)?.months
                        }
                        onChangeOption={setMonths}
                        name={"month"}
                        register={register}
                    />
                ) : null}
            </div>

            {loading === true ? <DefaultPageLoader/> :  <TeacherTable formatSalary={formatSalary} teacherSalary={currentData}/> }
        </div>
    );
};
