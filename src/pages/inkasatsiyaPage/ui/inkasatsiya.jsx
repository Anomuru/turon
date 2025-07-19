import {AccountingFilter, AccountingHeader} from "entities/accounting";
import {useDispatch, useSelector} from "react-redux";
import {Routes, Route, useNavigate} from "react-router";
import {getCapitalInfo, getCapitalTypes, getInsideCategory} from "entities/capital";
import {useCallback, useEffect, useState} from "react";
import {getPaymentType} from "entities/capital/model/thunk/capitalThunk";
import {onChangeAccountingPage} from "entities/accounting/model/slice/accountingSlice";
import {useParams} from "react-router-dom";
import {inkasatsiyaThunk} from "entities/inkasatsiya/model/inkasatsiyaThunk";
import {Student} from "entities/inkasatsiya/ui/students/student";
import {getInkasatsiya} from "entities/inkasatsiya/model/inkasatsiyaSelector";
import {Overhead} from "entities/inkasatsiya/ui/overhead/overhead";
import {Capital} from "entities/inkasatsiya/ui/capital/capital";
import {Teacher} from "entities/inkasatsiya/ui/teacher/teacher";
import {Employer} from "entities/inkasatsiya/ui/employer/employer";
import cls from "./inkasatsiya.module.module.sass"
import {getBranch} from "../../../features/branchSwitcher";

const filter = [
    {name: 'studentsPayments', label: "student payment"},
    // {name: 'studentsDiscounts', label: "student discount"},
    {name: 'teachersSalary', label: "teacher salary"},
    // {name: 'debtStudents', label: "debt student"},
    {name: 'employeesSalary', label: "employer salary"},
    {name: 'overhead', label: "overhead"},
    // {name: 'bookPayment', label: "book payment"},
    {name: 'capital', label: "capital"},
]

export const Inkasatsiya = () => {
    const dispatch = useDispatch()
    const paymentType = useSelector(getCapitalTypes)
    const [activeMenu, setActiveMenu] = useState(filter[0].name)
    const navigate = useNavigate()
    let {locationId} = useParams()
    const [to, setTo] = useState([])
    const [ot, setOt] = useState([])
    const student = useSelector(getInkasatsiya)
    const [radio, setSelectedRadio] = useState([])


    const branchId = useSelector(getBranch)

    useEffect(() => {

        if (to.length && ot.length && radio > 0) {
            const res = {
                do: to,
                ot: ot,
                payment_type: radio,
                branch: branchId.id
            }
            dispatch(inkasatsiyaThunk({res, branchId: branchId.id}))
        }

        dispatch(getPaymentType())

    }, [to, ot, radio, branchId])
    const formatSalary = (salary) => {
        return Number(salary).toLocaleString();
    };

    const totalMoney = () => {
        switch (activeMenu) {
            case "studentsPayments" :
                return (
                    <h2>o'quvchilarning umimiy to'lovi
                        : {student?.students?.student_total_payment ? formatSalary(student?.students?.student_total_payment) : 0} </h2>
                )
            case "teachersSalary" :
                return (
                    <h2>O'qituvchilarning umumiy to'lovi
                        : {student?.teachers?.teacher_total_salary ? formatSalary(student?.teachers?.teacher_total_salary) : 0} </h2>
                )
            case "employeesSalary" :
                return (
                    <h2>Ishchilarning umumiy to'lovi
                        : {student?.workers?.worker_total_salary ? formatSalary(student?.workers?.worker_total_salary) : 0} </h2>
                )
            case "overhead" :
                return (
                    <h2>overheadning umumiy to'lovi
                        : {student?.overheads?.total_overhead_payment ? formatSalary(student?.overheads?.total_overhead_payment) : 0} </h2>
                )
            case "capital" :
                return <h2>capitalning umumiy to'lovi
                    : {student?.capitals?.total_capital ? formatSalary(student?.capitals?.total_capital) : 0}</h2>
        }

    }

    const setPage = useCallback((value) => {

        dispatch(onChangeAccountingPage({value: value}))
        navigate(`./${value}`)
    }, [navigate])




    return (
        <div style={{display: "flex", flexDirection: "column", gap: "2rem", padding: "2rem"}}>

            {student.overall ? <div className={cls.overalMain}>Umumiy : {formatSalary(student.overall)}</div> : null}
            <div className={cls.overal}>
                {totalMoney()}
                <div className={cls.inkasatsiya}>
                    <AccountingHeader activeMenu={activeMenu} paymentType={paymentType} to={to} setTo={setTo} ot={ot}
                                      setOt={setOt} setSelectedRadio={setSelectedRadio} radio={radio}/>
                </div>

            </div>


            <AccountingFilter activeMenu={activeMenu} setActive={setActiveMenu} setPage={setPage} filter={filter}/>
            <Routes>
                <Route path={"teachersSalary"}
                       element={<Teacher formatSalary={formatSalary} extraClass={cls.table} teacher={student}
                                         path={"teachersSalary"} locationId={locationId}/>}/>
                {/*<Route path={"studentsDiscounts"}*/}
                {/*       element={<StudentsDiscount path={"studentsDiscounts"} locationId={locationId}/>}/>*/}
                <Route path={"employeesSalary"}
                       element={<Employer formatSalary={formatSalary} extraClass={cls.table} path={"employeesSalary"}
                                          workers={student} locationId={locationId}/>}/>
                {/*<Route path={"debtStudents"} element={<DebtStudents path={"debtStudents"} locationId={locationId}/>}/>*/}
                <Route path={"overhead"}
                       element={<Overhead formatSalary={formatSalary} extraClass={cls.table} overhead={student}
                                          path={"overhead"} locationId={locationId}/>}/>
                <Route path={"studentsPayments"}
                       element={<Student formatSalary={formatSalary} extraClass={cls.table} students={student}
                                         locationId={locationId}/>}/>
                {/*<Route path={"bookPayment"} element={<AccountingBooks path={"bookPayment"} locationId={locationId}/>}/>*/}
                <Route path={"capital"}
                       element={<Capital formatSalary={formatSalary} extraClass={cls.table} capital={student}
                                         path={"capital"} locationId={locationId}/>}/>
                {/*<Route path={"debtStudents"} element={<DebtStudents/>}/>*/}
            </Routes>

        </div>
    );
};


