import {AccountingFilter, AccountingHeader} from "entities/accounting";
import {inkasatsiyaReducer} from "entities/inkasatsiya";
import {getUserBranchId} from "entities/profile/userProfile/index.js";
import {useDispatch, useSelector} from "react-redux";
import {Routes, Route, useNavigate} from "react-router";
import {capitalReducer, getCapitalInfo, getCapitalTypes, getInsideCategory} from "entities/capital";
import {useCallback, useEffect, useState} from "react";
import {getPaymentType} from "entities/capital/model/thunk/capitalThunk";
import {onChangeAccountingPage} from "entities/accounting/model/slice/accountingSlice";
import {useParams} from "react-router-dom";
import {inkasatsiyaThunk} from "entities/inkasatsiya/model/inkasatsiyaThunk";
import {Student} from "entities/inkasatsiya/ui/students/student";
import {getInkasatsiya, getInkasatsiyaLoading} from "entities/inkasatsiya/model/inkasatsiyaSelector";
import {Overhead} from "entities/inkasatsiya/ui/overhead/overhead";
import {Capital} from "entities/inkasatsiya/ui/capital/capital";
import {Teacher} from "entities/inkasatsiya/ui/teacher/teacher";
import {Employer} from "entities/inkasatsiya/ui/employer/employer";
import {BranchTransactions} from "entities/inkasatsiya/ui/branchTransactions/branchTransactions";
import {DynamicModuleLoader} from "shared/lib/components/DynamicModuleLoader/DynamicModuleLoader.jsx";
import cls from "./inkasatsiya.module.module.sass"
import {getBranch} from "../../../features/branchSwitcher";
import {CapitalSlice} from "entities/capital/model/slice/capitalSlice.js";
import {DefaultPageLoader} from "shared/ui/defaultLoader/index.js";
import {getSelectedLocations} from "features/locations/index.js";
import {Select} from "shared/ui/select";

const now = new Date();
const MONTHS = [
    {id: 1, name: "Yanvar"}, {id: 2, name: "Fevral"}, {id: 3, name: "Mart"},
    {id: 4, name: "Aprel"}, {id: 5, name: "May"}, {id: 6, name: "Iyun"},
    {id: 7, name: "Iyul"}, {id: 8, name: "Avgust"}, {id: 9, name: "Sentabr"},
    {id: 10, name: "Oktabr"}, {id: 11, name: "Noyabr"}, {id: 12, name: "Dekabr"},
];
const YEARS = Array.from({length: 5}, (_, i) => {
    const y = now.getFullYear() - 2 + i;
    return {id: y, name: String(y)};
});
const DIRECTION_OPTIONS = [
    {id: "all", name: "Hammasi"},
    {id: "give", name: "Berildi"},
    {id: "receive", name: "Olindi"},
];
const fmt = (n) => Number(n || 0).toLocaleString();

const filter = [
    {name: 'studentsPayments', label: "student payment"},
    // {name: 'studentsDiscounts', label: "student discount"},
    {name: 'teachersSalary', label: "teacher salary"},
    // {name: 'debtStudents', label: "debt student"},
    {name: 'employeesSalary', label: "employer salary"},
    {name: 'overhead', label: "overhead"},
    // {name: 'bookPayment', label: "book payment"},
    {name: 'capital', label: "capital"},
    {name: 'branchTransactions', label: "filial tranzaksiyalari"},
]

const reducers = {
    inkasatsiyaSlice: inkasatsiyaReducer,
    CapitalSlice: capitalReducer
}

export const Inkasatsiya = () => {
    const dispatch = useDispatch()
    const paymentType = useSelector(getCapitalTypes)
    const [activeMenu, setActiveMenu] = useState("studentsPayments")
    const navigate = useNavigate()
    let {locationId} = useParams()
    const [to, setTo] = useState([])
    const [ot, setOt] = useState([])
    const student = useSelector(getInkasatsiya)
    const [radio, setSelectedRadio] = useState([])

    const loading = useSelector(getInkasatsiyaLoading)

    const branchId = useSelector(getUserBranchId)
    const selectedBranch = useSelector(getSelectedLocations);
    const branchForFilter = selectedBranch?.id ?? branchId;

    useEffect(() => {

        if (to.length && ot.length && radio > 0) {
            const res = {
                do: to,
                ot: ot,
                payment_type: radio,
                branch: branchForFilter
            }
            dispatch(inkasatsiyaThunk({res, branchId: branchForFilter}))
        }

        dispatch(getPaymentType())

    }, [to, ot, radio, branchId])
    const formatSalary = (salary) => {
        return Number(salary).toLocaleString();
    };

    const totalMoney = () => {
        switch (activeMenu) {
            case "studentsPayments":
                return <h2>o'quvchilarning umimiy to'lovi: {student?.students?.student_total_payment ? formatSalary(student?.students?.student_total_payment) : 0}</h2>
            case "teachersSalary":
                return <h2>O'qituvchilarning umumiy to'lovi: {student?.teachers?.teacher_total_salary ? formatSalary(student?.teachers?.teacher_total_salary) : 0}</h2>
            case "employeesSalary":
                return <h2>Ishchilarning umumiy to'lovi: {student?.workers?.worker_total_salary ? formatSalary(student?.workers?.worker_total_salary) : 0}</h2>
            case "overhead":
                return <h2>overheadning umumiy to'lovi: {student?.overheads?.total_overhead_payment ? formatSalary(student?.overheads?.total_overhead_payment) : 0}</h2>
            case "capital":
                return <h2>capitalning umumiy to'lovi: {student?.capitals?.total_capital ? formatSalary(student?.capitals?.total_capital) : 0}</h2>
            case "branchTransactions":
                const given = student?.branch_transactions?.given?.total || 0;
                const received = student?.branch_transactions?.received?.total || 0;
                const net = student?.branch_transactions?.net || 0;
                return (
                    <div style={{display: "flex", gap: "1.2rem", flexWrap: "wrap"}}>
                        <div style={{
                            border: "1px solid #e5e7eb", borderRadius: 8,
                            padding: "1.2rem 1.8rem", display: "flex", flexDirection: "column", gap: "0.4rem",
                            boxShadow: "rgba(50,50,93,.15) 0 2px 5px -1px, rgba(0,0,0,.2) 0 1px 3px -1px",
                        }}>
                            <span style={{fontSize: "1.3rem", color: "#6b7280", fontWeight: 600}}>Berildi</span>
                            <span style={{fontSize: "1.8rem", fontWeight: 700, color: "#dc2626"}}>{formatSalary(given)} UZS</span>
                        </div>
                        <div style={{
                            border: "1px solid #e5e7eb", borderRadius: 8,
                            padding: "1.2rem 1.8rem", display: "flex", flexDirection: "column", gap: "0.4rem",
                            boxShadow: "rgba(50,50,93,.15) 0 2px 5px -1px, rgba(0,0,0,.2) 0 1px 3px -1px",
                        }}>
                            <span style={{fontSize: "1.3rem", color: "#6b7280", fontWeight: 600}}>Olindi</span>
                            <span style={{fontSize: "1.8rem", fontWeight: 700, color: "#16a34a"}}>{formatSalary(received)} UZS</span>
                        </div>
                        <div style={{
                            border: "1px solid #e5e7eb", borderRadius: 8,
                            padding: "1.2rem 1.8rem", display: "flex", flexDirection: "column", gap: "0.4rem",
                            boxShadow: "rgba(50,50,93,.15) 0 2px 5px -1px, rgba(0,0,0,.2) 0 1px 3px -1px",
                        }}>
                            <span style={{fontSize: "1.3rem", color: "#6b7280", fontWeight: 600}}>Saldo</span>
                            <span style={{fontSize: "1.8rem", fontWeight: 700, color: net >= 0 ? "#16a34a" : "#dc2626"}}>
                                {net >= 0 ? "+" : ""}{formatSalary(net)} UZS
                            </span>
                        </div>
                    </div>
                );
        }
    }

    const setPage = useCallback((value) => {

        dispatch(onChangeAccountingPage({value: value}))
        navigate(`./${value}`)
    }, [navigate])


    return (
        <DynamicModuleLoader reducers={reducers}>
            <div style={{display: "flex", flexDirection: "column", gap: "2rem", padding: "2rem"}}>

                {student?.overall ?
                    <div className={cls.overalMain}>Umumiy : {formatSalary(student?.overall)}</div> : null}
                <div className={cls.overal}>
                    {totalMoney()}
                    <div className={cls.inkasatsiya}>
                        <AccountingHeader activeMenu={activeMenu} paymentType={paymentType} to={to} setTo={setTo}
                                          ot={ot} setOt={setOt} setSelectedRadio={setSelectedRadio} radio={radio}/>
                    </div>
                </div>


                <AccountingFilter activeMenu={activeMenu} setActive={setActiveMenu} setPage={setPage} filter={filter}/>

                {loading === true ? <DefaultPageLoader/> :
                    <Routes>
                        <Route path={"teachersSalary"}
                               element={<Teacher formatSalary={formatSalary} extraClass={cls.table} teacher={student}
                                                 path={"teachersSalary"} locationId={locationId}/>}/>
                        {/*<Route path={"studentsDiscounts"}*/}
                        {/*       element={<StudentsDiscount path={"studentsDiscounts"} locationId={locationId}/>}/>*/}
                        <Route path={"employeesSalary"}
                               element={<Employer formatSalary={formatSalary} extraClass={cls.table}
                                                  path={"employeesSalary"}
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
                        <Route path={"branchTransactions"}
                               element={
                                   <BranchTransactions
                                       extraClass={cls.table}
                                       branchTransactionsData={student?.branch_transactions}
                                   />
                               }/>
                        {/*<Route path={"debtStudents"} element={<DebtStudents/>}/>*/}
                    </Routes>}

            </div>
        </DynamicModuleLoader>
    );
};


