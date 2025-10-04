import {getUserBranchId} from "entities/profile/userProfile/index.js";
import {onAddAlertOptions} from "features/alert/model/slice/alertSlice.js";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {API_URL, headers, useHttp} from "shared/api/base.js";
import {getEmployer} from "../../../../../entities/accounting/model/thunk/otchotAccountingThunk";
import {getEmployerSalary} from "../../../../../entities/accounting/model/selector/otchotAccountingSelector";
import cls from "../otchot.module.sass";
import {Select} from "../../../../../shared/ui/select";
import {EmpSalaryTable} from "../../../../../entities/accounting";
import {DefaultPageLoader} from "shared/ui/defaultLoader/index.js";

export const EmpSalary = ({formatSalary}) => {
    const {request} = useHttp();
    const dispatch = useDispatch();

    const branch = useSelector(getUserBranchId);
    const employerSalary = useSelector(getEmployerSalary);

    const [month, setMonths] = useState(null);
    const [year, setYear] = useState(null);
    const [currentData, setCurrentData] = useState([]);

    // Hozirgi yil va oy
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const [loading ,setLoading] = useState(false)

    useEffect(() => {
        if (branch) {
            dispatch(getEmployer(branch));
        }
    }, [branch]);

    // Default qilib shu yil va shu oy set qilish
    useEffect(() => {

        if (employerSalary?.dates?.length > 0) {
            const foundYear = employerSalary.dates.find(item => item.year === currentYear);
            if (foundYear) {
                setYear(currentYear);

                const foundMonth = foundYear.months.find(m => +m === currentMonth);
                if (foundMonth) {
                    setMonths(currentMonth);
                } else {
                    setMonths(foundYear.months[0]);
                }
            } else {
                setYear(employerSalary.dates[0].year);
                setMonths(employerSalary.dates[0].months[0]);
            }
        }
    }, [employerSalary]);

    useEffect(() => {
        if (year && month && branch) {
            setLoading(true)

            request(
                `${API_URL}Encashment/employer_salary/?branch=${branch}`,
                "POST",
                JSON.stringify({year, month}),
                headers()
            )
                .then(res => {
                    setCurrentData(res);
                    setLoading(false)

                })
                .catch(() => {
                    dispatch(
                        onAddAlertOptions({
                            status: "error",
                            type: true,
                            msg: "Serverda hatolik"
                        })
                    );
                });
        }
    }, [branch, year, month]);

    return (
        <div>
            <div className={cls.paymentType} style={{justifyContent: "normal"}}>
                <Select
                    defaultValue={year}
                    extraClass={cls.select}
                    options={employerSalary?.dates?.map(item => item.year)}
                    onChangeOption={setYear}
                />
                {year ? (
                    <Select
                        defaultValue={month}
                        extraClass={cls.select}
                        options={
                            employerSalary?.dates?.find(item => item.year === +year)?.months
                        }
                        onChangeOption={setMonths}
                    />
                ) : null}
            </div>

            { loading === true ? <DefaultPageLoader/> : <EmpSalaryTable formatSalary={formatSalary} employerSalary={currentData}/> }
        </div>
    );
};
