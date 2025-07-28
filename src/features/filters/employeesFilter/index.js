export {EmployeesFilter} from "./ui/employeesFilter";

export {
    default as filteredEmployeesSlice,
    fetchAgeTo,
    fetchAgeFrom,
    fetchAgeJobId,
    fetchLanguageId,
    fetchIsDelete
} from "./model/filterEmployeesSlice";

export {
    getAgeTo,
    getAgeFrom,
    getJobId,
    getLanguageId,
    getIsDelete
} from "./model/employeesFilterSelector";

