import classNames from "classnames";
import {getUserBranchId} from "entities/profile/userProfile/index.js";
import {MiniLoader} from "shared/ui/miniLoader/index.js";
import {Select} from "shared/ui/select";
import cls from "../otchot.module.sass"
import {useEffect, useState} from "react";
import {getClassesLoading, PaymentTable} from "../../../../../entities/accounting";
import {useDispatch, useSelector} from "react-redux";
import {getClasses} from "../../../../../entities/accounting/model/selector/otchotAccountingSelector";
import {getStudentPayment} from "../../../../../entities/accounting/model/thunk/otchotAccountingThunk";
import {API_URL, headers, useHttp} from "../../../../../shared/api/base";
import {useForm} from "react-hook-form";
import {onAddAlertOptions} from "../../../../../features/alert/model/slice/alertSlice";
import {DefaultPageLoader} from "shared/ui/defaultLoader/index.js";
import {getSelectedLocations} from "features/locations/index.js";

export const StudentPayment = ({formatSalary}) => {
    const {request} = useHttp();
    const dispatch = useDispatch();
    const {register} = useForm();

    const classes = useSelector(getClasses);
    const classesLoading = useSelector(getClassesLoading);
    const branchID = useSelector(getUserBranchId);
    const selectedBranch = useSelector(getSelectedLocations);
    const branchForFilter = selectedBranch?.id ?? branchID;
    const [month, setMonths] = useState(null);
    const [year, setYear] = useState(null);
    const [res, setRes] = useState(null);

    // Hozirgi yil va oy
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const [loading, setLoading] = useState(false)

    // Branch bo‘yicha payment olish
    useEffect(() => {
        if (branchForFilter) {
            dispatch(getStudentPayment(branchForFilter));
        }
    }, [branchForFilter]);

    // Default qilib shu yil va shu oyni set qilish
    useEffect(() => {
        if (classes?.dates?.length > 0) {
            // shu yilni tekshiramiz
            const foundYear = classes.dates.find(item => item.year === currentYear);
            if (foundYear) {
                setYear(currentYear);

                // agar shu yilda shu oy bo‘lsa
                const foundMonth = foundYear.months.find(m => +m === currentMonth);
                if (foundMonth) {
                    setMonths(currentMonth);
                } else {
                    // agar shu oy bo‘lmasa birinchi oy
                    setMonths(foundYear.months[0]);
                }
            } else {
                // agar shu yil bo‘lmasa massivdagi birinchi yil
                setYear(classes.dates[0].year);
                setMonths(classes.dates[0].months[0]);
            }
        }
    }, [classes]);

    // Serverdan filterlangan malumot olish
    useEffect(() => {
        if (branchForFilter && year && month) {


            setLoading(true)
            request(
                `${API_URL}Encashment/student_payments/?branch=${branchForFilter}`,
                "POST",
                JSON.stringify({year, month}),
                headers()
            )
                .then(res => {
                    setLoading(false)

                    setRes(res);
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
    }, [year, month, branchForFilter]);

    return (
        <div>
            <div className={cls.paymentType}>
                <div
                    className={classNames(cls.paymentType__select, {
                        [cls.active]: classesLoading
                    })}
                    style={{display: "flex", gap: "2rem"}}
                >
                    {classesLoading ? (
                        <MiniLoader/>
                    ) : (
                        <>
                            <Select
                                defaultValue={year}
                                register={register}
                                extraClass={cls.select}
                                name={"year"}
                                options={classes?.dates?.map(item => item?.year)}
                                onChangeOption={setYear}
                            />

                            {year ? (
                                <Select
                                    defaultValue={month}
                                    register={register}
                                    name={"month"}
                                    extraClass={cls.select}
                                    options={
                                        classes?.dates?.find(item => item.year === +year)?.months
                                    }
                                    onChangeOption={setMonths}
                                />
                            ) : null}
                        </>
                    )}
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
            {loading === true ? <DefaultPageLoader/> :
                <PaymentTable
                    format={formatSalary}
                    extraClass={cls.tableHeader}
                    extraClassTable={cls.table}
                    classes={res ? res : classes}
                />}
        </div>
    );
};
