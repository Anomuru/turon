export { default as loansReducer } from "./model/loansSlice";
export { fetchLoans, fetchLoanById } from "./model/loansThunk";
export { clearCurrentLoan } from "./model/loansSlice";
export {
    getLoans,
    getLoansLoading,
    getLoansError,
    getCurrentLoan,
    getCurrentLoanLoading,
    getCurrentLoanError,
} from "./model/loansSelector";
