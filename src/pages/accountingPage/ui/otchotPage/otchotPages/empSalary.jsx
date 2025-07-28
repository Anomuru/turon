import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {getEmployer} from "../../../../../entities/accounting/model/thunk/otchotAccountingThunk";
import {getBranch} from "../../../../../features/branchSwitcher";
import {getEmployerSalary} from "../../../../../entities/accounting/model/selector/otchotAccountingSelector";
import cls from "../otchot.module.sass";
import {Select} from "../../../../../shared/ui/select";
import {EmpSalaryTable, TeacherTable} from "../../../../../entities/accounting";

export const EmpSalary = ({formatSalary}) => {
    const dispatch = useDispatch()
    const branch = useSelector(getBranch)

    const employerSalary = useSelector(getEmployerSalary)


    const branchId = branch.id
    useEffect(() => {
        dispatch(getEmployer(branchId))
    }, [])
    const [month, setMonths] = useState(null)

    const [year, setYear] = useState(null)

    return (
        <div>
            <div>
                <div className={cls.paymentType}>
                    <Select extraClass={cls.select} options={employerSalary.dates?.map(item => item.year)}
                            onChangeOption={setYear}/>
                    {
                        year ?
                            <Select
                                extraClass={cls.select}
                                options={employerSalary.dates.filter(item => item.year === +year)[0].months}
                                onChangeOption={setMonths}/>
                            : null
                    }

                </div>
                <EmpSalaryTable formatSalary={formatSalary} employerSalary={employerSalary}/>
            </div>
        </div>
    );
};

