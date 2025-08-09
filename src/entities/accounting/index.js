export {AccountingHeader} from "./ui/accountingHeader/accountingHeader"
export {AccountingFilter} from "./ui/accountingFilter/accountingFilter"

export {AccountingAdditionalCosts} from "./ui/acauntingTables/accountingTableAdditionalCosts/accountingAdditionalCosts"
export {AccountingCapitalCosts} from "./ui/acauntingTables/accountingTableCapitalCosts/accountingCapitalCosts"
export {AccountingBooks} from "./ui/acauntingTables/accountingTableBooks/accountingBooks"

export {DeletedStudentPayment} from "./ui/acauntingTables/accountingTableStudent/deletedStudentPayment"
export {StudentsPayments} from "./ui/acauntingTables/accountingTableStudent/studentsPayments"
export {DebtStudents} from "./ui/acauntingTables/accountingTableDebStudents/DebtStudents"
export {StudentsDiscount} from "./ui/acauntingTables/accountingTableStudentDiscount/StudentsDiscount"
export {EmployeeSalary} from "./ui/acauntingTables/accountingTableWorkerSalary/EmployeeSalary"
export {TeachersSalary} from "./ui/acauntingTables/accountingTableTeacherSalary/TeachersSalary"

export {getAccountingSelect, getStudentsData} from "./model/selector/accountingSelector"
export {getEmployerSalary, getEmployerLoading, getDeletedEmployer} from "./model/selector/employerSalary"
export {getStudentPaymentes, getLoadingStudent, getDeletedStudent} from "./model/selector/student"
export {getOverHeadType, getOverHeadLoading} from "./model/selector/additionalCosts"
export {
    getTeachersLoading,
    getTeacherSalaryData,
    getDeletedTeachersSalaryData
} from "./model/selector/teacher";
export {
    getClasses,
    getClassesLoading,
    getSalary,
    getAllSelector
} from "./model/selector/otchotAccountingSelector"

export {TeacherTable} from "./ui/accountingOtchot/teacherTable"
export {EmpSalaryTable} from "./ui/accountingOtchot/empSalaryTable"
export {PaymentTable} from "./ui/accountingOtchot/paymentTable"

export {default as accountingSlice, accountingReducer} from "./model/slice/accountingSlice"
export {default as studentSlice, studentReducer} from "./model/slice/studetntSlice"
export {default as employerSlice, employerReducer} from "./model/slice/employerSalary"
export {default as teacher, teacherReducer} from "./model/slice/teacher"
export {default as overHeadSlice, overHeadReducer} from "./model/slice/additionalCosts"
export {default as capitalSlice, capitalListReducer} from "./model/slice/capital"
export {default as otchotAccountingSlice, accountingOtchotReducer} from "./model/slice/otchotAccountingSlice"

export {overHeadDeletedList} from "./model/thunk/additionalCosts";
export {capitalDeletedListThunk} from "./model/thunk/capital";
export {getDeletedEmpSalary} from "./model/thunk/employerSalary";
export {getDeletedPayment} from "./model/thunk/student";
export {getDeletedTeacherSalary} from "./model/thunk/teacherSalarythunk";
