import classNames from "classnames";
import {getUserBranchId} from "entities/profile/userProfile/index.js";
import {MiniLoader} from "shared/ui/miniLoader/index.js";
import {Select} from "shared/ui/select";
import cls from "../otchot.module.sass"
import {useCallback, useEffect, useState} from "react";
import {value} from "lodash/seq";
import {getClassesLoading, PaymentTable} from "../../../../../entities/accounting";
import {useDispatch, useSelector} from "react-redux";
import {getClasses} from "../../../../../entities/accounting/model/selector/otchotAccountingSelector";
import {getAll, getStudentPayment} from "../../../../../entities/accounting/model/thunk/otchotAccountingThunk";
import {getBranch} from "../../../../../features/branchSwitcher";
import {API_URL, headers, useHttp} from "../../../../../shared/api/base";
import {useForm} from "react-hook-form";
import {Form} from "../../../../../shared/ui/form";
import {onAddAlertOptions} from "../../../../../features/alert/model/slice/alertSlice";


export const StudentPayment = ({formatSalary}) => {

    const {request} = useHttp()
    const dispatch = useDispatch()
    const {register, handleSubmit} = useForm()

    const classes = useSelector(getClasses)
    const classesLoading = useSelector(getClassesLoading)
    const branchID = useSelector(getUserBranchId)

    const [month, setMonths] = useState(null)
    const [year, setYear] = useState(null)
    const [res, setRes] = useState(null)

    useEffect(() => {
        if (branchID)
            dispatch(getStudentPayment(branchID))
    }, [branchID])

    useEffect(() => {
        if (branchID && year && month) {
            // dispatch(getStudentPayment(branchID))
            // if (year && month) {
            request(`${API_URL}Encashment/student_payments/?branch=${branchID}`, "POST", JSON.stringify({
                year: year,
                month: month
            }), headers())
                .then(res => {
                    // dispatch(getStudentPayment(branchID))
                    setRes(res)
                })
                .catch(err => {
                    dispatch(onAddAlertOptions({
                        status: "error",
                        type: true,
                        msg: "Serverda hatolik"
                    }))
                })
            // }
        }
    }, [year, month, branchID])

    return (
        <div>
            <div className={cls.paymentType}>

                <div
                    className={classNames(cls.paymentType__select, {
                        [cls.active]: classesLoading
                    })}
                    style={{display: "flex", gap: "2rem"}}
                >
                    {
                        classesLoading
                            ? <MiniLoader/>
                            : <>
                                <Select
                                    defaultValue={classes && classes?.dates?.map(item => item?.year)[0]}
                                    register={register}
                                    extraClass={cls.select}
                                    name={"year"}
                                    options={classes?.dates?.map(item => item?.year)}
                                    onChangeOption={setYear}
                                />

                                {year ? <Select
                                    defaultValue={classes && classes?.dates?.filter(item => item.year === +year)[0]?.months[0]}
                                    register={register}
                                    name={"month"}
                                    extraClass={cls.select}
                                    options={classes?.dates?.filter(item => item.year === +year)[0]?.months}
                                    onChangeOption={setMonths}
                                /> : null}
                            </>
                    }
                </div>

                <div className={cls.otchot__main}>
                    <div className={cls.otchot}>
                        Umumiy qarz <br/> {formatSalary(res ? res?.total_debt : classes?.total_debt)}
                    </div>
                    <div className={cls.otchot}>
                        Qolgan qarz <br/> {formatSalary(res ? res?.reaming_debt : classes?.reaming_debt)}
                    </div>


                    <div className={cls.otchot}>
                        Chegirma 1-yillik <br/> {formatSalary(res ? res?.total_dis : classes?.total_dis)}
                    </div>

                    <div className={cls.otchot}>
                        Chegirma 1-martalik <br/> {formatSalary(res ? res?.total_discount : classes?.total_discount)}
                    </div>

                    <div className={cls.otchot}>
                        Umumiy to'lov <br/> {formatSalary(res ? res?.total_sum : classes?.total_sum)}
                    </div>
                </div>
            </div>

            <PaymentTable format={formatSalary} extraClass={cls.tableHeader} extraClassTable={cls.table}
                          classes={res ? res : classes}/>
        </div>
    );
};

