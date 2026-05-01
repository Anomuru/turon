export const getLoans = (state) => state.loansReducer?.loans || [];
export const getLoansLoading = (state) => state.loansReducer?.loading || false;
export const getLoansError = (state) => state.loansReducer?.error || false;

export const getCurrentLoan = (state) => state.loansReducer?.currentLoan || null;
export const getCurrentLoanLoading = (state) => state.loansReducer?.loadingLoan || false;
export const getCurrentLoanError = (state) => state.loansReducer?.errorLoan || false;
