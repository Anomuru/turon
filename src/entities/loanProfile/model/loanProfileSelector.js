export const getLoanProfile = (state) => state.loanProfileReducer?.loanProfile || null;
export const getLoanProfileLoading = (state) => state.loanProfileReducer?.loading || false;
export const getLoanProfileError = (state) => state.loanProfileReducer?.error || false;

export const getLoanProfileUpdating = (state) => state.loanProfileReducer?.updating || false;
export const getLoanProfileUpdateError = (state) => state.loanProfileReducer?.updateError || false;

export const getLoanProfileRepaying = (state) => state.loanProfileReducer?.repaying || false;
export const getLoanProfileRepayError = (state) => state.loanProfileReducer?.repayError || false;

export const getLoanProfileCancelling = (state) => state.loanProfileReducer?.cancelling || false;
export const getLoanProfileCancelError = (state) => state.loanProfileReducer?.cancelError || false;
