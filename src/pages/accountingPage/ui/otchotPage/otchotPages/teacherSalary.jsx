import {getUserBranchId} from "entities/profile/userProfile";
import {onAddAlertOptions} from "features/alert/model/slice/alertSlice.js";
import {useForm} from "react-hook-form";
import {API_URL, headers, useHttp} from "shared/api/base.js";
import cls from "../otchot.module.sass";
import {Select} from "../../../../../shared/ui/select";
import {PaymentTable, TeacherTable} from "../../../../../entities/accounting";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getTeacherSalary} from "../../../../../entities/accounting/model/thunk/otchotAccountingThunk";
import {getBranch} from "../../../../../features/branchSwitcher";
import {getSalary} from "../../../../../entities/accounting/model/selector/otchotAccountingSelector";

export const TeacherSalary = ({formatSalary}) => {

    const {register, handleSubmit} = useForm()
    const dispatch = useDispatch()
    const {request} = useHttp()

    const branchId = useSelector(getUserBranchId)
    const teacherSalary = useSelector(getSalary)

    const [currentData, setCurrentData] = useState([])
    const [month, setMonths] = useState(null)
    const [year, setYear] = useState(null)

    useEffect(() => {
        if (branchId)
            dispatch(getTeacherSalary(branchId))
    }, [branchId])

    useEffect(() => {
        if (month && year && branchId) {
            request(`${API_URL}Encashment/teacher_salary/?branch=${branchId}`, "POST", JSON.stringify({
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
        }
    }, [month, year, branchId])


    return (
        <div>
            <div>
                <div className={cls.paymentType} style={{justifyContent: "normal"}}>
                    <Select
                        defaultValue={teacherSalary && teacherSalary?.dates?.map(item => item?.year)[0]}
                        extraClass={cls.select}
                        options={teacherSalary?.dates?.map(item => item?.year)}
                        onChangeOption={setYear}
                        register={register}
                        name={"year"}
                    />
                    {
                        year ?
                            <Select
                                defaultValue={teacherSalary && teacherSalary.dates.filter(item => item.year === +year)[0]?.months[0]}
                                extraClass={cls.select}
                                options={teacherSalary.dates.filter(item => item.year === +year)[0]?.months}
                                onChangeOption={setMonths}
                                name={"month"}
                                register={register}
                            />
                            : null
                    }

                </div>
                <TeacherTable formatSalary={formatSalary} teacherSalary={currentData}/>
            </div>
        </div>
    );
};

