import cls from "../otchot.module.sass";
import {Select} from "../../../../../shared/ui/select";
import {PaymentTable, TeacherTable} from "../../../../../entities/accounting";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getTeacherSalary} from "../../../../../entities/accounting/model/thunk/otchotAccountingThunk";
import {getBranch} from "../../../../../features/branchSwitcher";
import {getSalary} from "../../../../../entities/accounting/model/selector/otchotAccountingSelector";

export const TeacherSalary = ({formatSalary}) => {

    const dispatch = useDispatch()
    const branchId = useSelector(getBranch)

    const branchID = branchId.id

    const teacherSalary = useSelector(getSalary)
    useEffect(() => {
       dispatch(getTeacherSalary(branchID))
    }, [])

    const [month, setMonths] = useState(null)

    const [year, setYear] = useState(null)


    return (
        <div>
            <div>
                <div className={cls.paymentType}>
                    <Select extraClass={cls.select} options={teacherSalary?.dates?.map(item => item?.year)}
                            onChangeOption={setYear}/>
                    {
                        year ?
                            <Select
                                extraClass={cls.select}
                                options={teacherSalary.dates.filter(item => item.year === +year)[0]?.months}
                                onChangeOption={setMonths}/>
                            : null
                    }

                </div>
                <TeacherTable formatSalary={formatSalary} teacherSalary={teacherSalary}/>
            </div>
        </div>
    );
};

