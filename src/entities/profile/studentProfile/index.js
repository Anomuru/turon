export {StudentProfileInfo} from "./ui/studentProfileInfo/studentProfileInfo";
export {StudentProfileTeachers} from "./ui/studentProfileTeachers/studentProfileTeachers";
export {StudentProfileRating} from "./ui/studentProfileRating/studentProfileRating";
export {StudentProfileReward} from "./ui/studentProfileReward/studentProfileReward";
export {StudentProfileSubjects} from "./ui/studentProfileSubjects/studentProfileSubjects";
export {StudentProfileAttendance} from "./ui/studentProfileAttendance/studentProfileAttendance";
export {StudentProfileTotalAmount} from "./ui/studentProfileTotalAmount/studentProfileTotalAmount";
export {StudentProfileAmountPath} from "./ui/studentProfileAmountPath/studentProfileAmountPath";
export {StudentProfileTotalRating} from "./ui/studentProfileTotalRating/studentProfileTotalRating";
export {StudentProfileGroupsHistory} from "./ui/studentProfileGroupsHistory/studentProfileGroupsHistory";
export {StudentProfileTotalAttendance} from "./ui/studentProfileTotalAttendance/studentProfileTotalAttendance";
export {StudentProfileChangeInfo} from "./ui/studentProfileChangeInfo/studentProfileChangeInfo";
export {StudentProfileContract} from "./ui/studentProfileContract/studentProfileContract"
export {StudentProfileAttendanceAll} from "./ui/studentProfileAttendanceAll/studentAttendanceAll";

export {amountService, amountTypes} from "./model/consts/amountConsts";

export {default as studentProfilePayment} from "./model/slice/paymentSlice";
export {getPaymentData} from "./model/selectors/paymentSelector";

export {default as studentProfileBooks} from "./model/slice/booksSlice";
export {getBooksData} from "./model/selectors/booksSelector";

export {default as studentProfileRating} from "./model/slice/ratingSlice";
export {getRatingData} from "./model/selectors/ratingSelector";
export {fetch} from "./model/slice/ratingSlice";