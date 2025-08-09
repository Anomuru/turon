import {getUserBranchId} from "entities/profile/userProfile/index.js";
import {onAddAlertOptions} from "features/alert/model/slice/alertSlice.js";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {API_URL, headers, useHttp} from "shared/api/base.js";
import {getEmployer} from "../../../../../entities/accounting/model/thunk/otchotAccountingThunk";
import {getBranch} from "../../../../../features/branchSwitcher";
import {getEmployerSalary} from "../../../../../entities/accounting/model/selector/otchotAccountingSelector";
import cls from "../otchot.module.sass";
import {Select} from "../../../../../shared/ui/select";
import {EmpSalaryTable, TeacherTable} from "../../../../../entities/accounting";

export const EmpSalary = ({formatSalary}) => {

    const {request} = useHttp()
    const dispatch = useDispatch()

    const branch = useSelector(getUserBranchId)
    const employerSalary = useSelector(getEmployerSalary)

    const [month, setMonths] = useState(null)
    const [year, setYear] = useState(null)
    const [currentData, setCurrentData] = useState([])

    useEffect(() => {
        if (branch)
            dispatch(getEmployer(branch))
    }, [branch])

    useEffect(() => {
        if (year && month && branch)
        request(`${API_URL}Encashment/employer_salary/?branch=${branch}`, "POST", JSON.stringify({
            year: year,
            month: month
        }), headers())
            .then(res => {
                setCurrentData(res)
            })
            .catch(err => {
                dispatch(onAddAlertOptions({
                    status: "error",
                    type: true,
                    msg: "Serverda hatolik"
                }))
            })
    }, [branch, year, month])


    return (
        <div>
            <div>
                <div className={cls.paymentType} style={{justifyContent: "normal"}}>
                    <Select
                        defaultValue={employerSalary && employerSalary?.dates?.map(item => item.year)[0]}
                        extraClass={cls.select}
                        options={employerSalary?.dates?.map(item => item.year)}
                        onChangeOption={setYear}
                    />
                    {
                        year ?
                            <Select
                                defaultValue={employerSalary && employerSalary?.dates?.filter(item => item.year === +year)[0].months[0]}
                                extraClass={cls.select}
                                options={employerSalary?.dates?.filter(item => item.year === +year)[0].months}
                                onChangeOption={setMonths}
                            />
                            : null
                    }

                </div>
                <EmpSalaryTable formatSalary={formatSalary} employerSalary={currentData}/>
            </div>
        </div>
    );
};

