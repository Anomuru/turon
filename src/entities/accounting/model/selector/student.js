

export const getStudentPaymentes = (state) =>
    state.studentSlice?.studentsData
export const getStudentPaymentsCount = (state) =>
    state.studentSlice?.studentsCount

export const getLoadingStudent = (state) =>
    state.studentSlice?.loading


export const getDeletedStudent = (state) =>
    state.studentSlice?.deletedStudentsPayment
export const getDeletedStudentCount = (state) =>
    state.studentSlice?.deletedStudentsPaymentCount