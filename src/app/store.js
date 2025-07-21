import React from "react"
import {configureStore} from "@reduxjs/toolkit";

// import {flowsProfileSlice} from "entities/flowsProfile";
// import {groupProfileSlice} from "entities/profile/groupProfile";
// import {searchSlice} from "features/searchInput";
// import {registerUser} from "pages/registerPage";
// import {loginSlice} from "pages/loginPage";
// import {filteredTeachersSlice} from "features/filters/teacherFilter";
// import {filteredStudentsSlice} from "features/filters/studentsFilter";
// import {filteredEmployeesSlice} from "features/filters/employeesFilter";
// import {filteredGroupsSlice} from "features/filters/groupsFilter";
// import {filteredRoomsSlice} from "features/filters/roomsFilter";
// import {deletedGroupsSlice, groupAttendance, groupsSlice} from "entities/groups";

// const flowsProfileSlice = React.lazy(() => import("entities/flowsProfile").then(m => ({ default: m.flowsProfileSlice })));
// const groupProfileSlice = React.lazy(() => import("entities/profile/groupProfile").then(m => ({ default: m.groupProfileSlice })));
// const searchSlice = React.lazy(() => import("features/searchInput").then(m => ({ default: m.searchSlice })));
// const registerUser = React.lazy(() => import("pages/registerPage").then(m => ({ default: m.registerUser })));
// const loginSlice = React.lazy(() => import("pages/loginPage").then(m => ({ default: m.loginSlice })));
// const filteredTeachersSlice = React.lazy(() => import("features/filters/teacherFilter").then(m => ({ default: m.filteredTeachersSlice })));
// const filteredStudentsSlice = React.lazy(() => import("features/filters/studentsFilter").then(m => ({ default: m.filteredStudentsSlice })));
// const filteredEmployeesSlice = React.lazy(() => import("features/filters/employeesFilter").then(m => ({ default: m.filteredEmployeesSlice })));
// const filteredGroupsSlice = React.lazy(() => import("features/filters/groupsFilter").then(m => ({ default: m.filteredGroupsSlice })));
// const filteredRoomsSlice = React.lazy(() => import("features/filters/roomsFilter").then(m => ({ default: m.filteredRoomsSlice })));
// const deletedGroupsSlice = React.lazy(() => import("entities/groups").then(m => ({ default: m.deletedGroupsSlice })));
// const groupAttendance = React.lazy(() => import("entities/groups").then(m => ({ default: m.groupAttendance })));
// const groupsSlice = React.lazy(() => import("entities/groups").then(m => ({ default: m.groupsSlice })));

async function loadSlices() {
    const { flowsProfileSlice } = await import("entities/flowsProfile");
    const { groupProfileSlice } = await import("entities/profile/groupProfile");
    const { searchSlice } = await import("features/searchInput");
    const { registerUser } = await import("pages/registerPage");
    const { loginSlice } = await import("pages/loginPage");

    const { filteredTeachersSlice } = await import("features/filters/teacherFilter");
    const { filteredStudentsSlice } = await import("features/filters/studentsFilter");
    const { filteredEmployeesSlice } = await import("features/filters/employeesFilter");
    const { filteredGroupsSlice } = await import("features/filters/groupsFilter");
    const { filteredRoomsSlice } = await import("features/filters/roomsFilter");

    const {
        deletedGroupsSlice,
        groupAttendance,
        groupsSlice
    } = await import("entities/groups");
    const { studentProfilePayment, studentProfileBooks, studentProfileRating } = await import("entities/profile/studentProfile");
    const { roomsAddSlice } = await import("pages/roomsPage");
    const { timeTableListSlice } = await import("pages/timeTableListPage");
    const { teachers } = await import("entities/teachers");
    const { newStudents } = await import("../entities/students");
    const { employerCategorySlice, employers } = await import("../entities/employer");
    const { roomsSlice } = await import("../entities/rooms");
    const { roomssSlice } = await import("../features/roomsEditModal");
    const { capital } = await import("../entities/capital");
    const { roomDeleteSlice } = await import("features/roomDeleteModal/model");
    const { roomsImageAddSlice } = await import("features/roomImageAddModal/model");

    const { groupAttendanceSlice, studentProfile, teacherProfileData } = await import("pages/profilePage");
    const { userProfileSlice } = await import("entities/profile/userProfile");
    const { flowsSlice } = await import("entities/flows");
    const { teacherParseSlice } = await import("entities/teachers");
    const { employerParseSlice } = await import("../entities/profile/employerProfile");
    const { vacancySlice } = await import("../features/vacancyModals/vacancyPageAdd");
    const { vacancyPageParseSlice } = await import("../features/vacancyModals/vacancyPageAdd");
    const { vacancyWorkPageSlice } = await import("../features/vacancyModals/vacancyWorkPage/model");
    const { vacancyWorkerPermissionSlice } = await import("../features/vacancyModals/vacancyWorkerPermission");
    const { roomImageSlice } = await import("features/roomImagePareModal");
    const {
        accountingSlice,
        capitalSlice,
        employerSlice,
        otchotAccountingSlice,
        overHeadSlice,
        studentSlice,
        teacher
    } = await import("entities/accounting");


    const { teacherSalarySlice } = await import("entities/teacherSalary");
    const { employerSalarySlice } = await import("entities/employerSalary");
    const { giveEmployerSalarySlice } = await import("pages/giveSalaryPage");
    const { giveEmployerSalarySlices } = await import("features/giveEmployerSalary");
    const { giveTeacherSalarySlices } = await import("features/giveSalary/giveSalary");
    const { teacherSalaryDeleteSlice } = await import("features/salaryEdits");
    const { employerSalaryDeleteSlice } = await import("features/salaryEdits");

    const { calendarSlice } = await import("pages/calendarPage");
    const { vacancyWorkerSoucre, userSetPermissionSlice } = await import("entities/vacancy/ui/vacancyWorkerList");
    const { vacancyWorkerSlice } = await import("features/vacancyWorkerList");

    const { studentPaymentSlice } = await import("features/studentPayment");
    const { schoolTeacherDaySlice } = await import("features/teacherModals");
    const { inkasatsiyaSlice } = await import("entities/inkasatsiya");
    const { timeTableTuronSlice } = await import("pages/timeTable");

    const { alertSlice } = await import("features/alert");
    const { classSlice } = await import("entities/class");
    const { locationsSlice } = await import("features/locations");
    const { branchSwitcherSlice } = await import("features/branchSwitcher");
    const { multiPageSlice } = await import("widgets/multiPage");
    const { studiyngStudentDelSlice } = await import("features/studiyngStudentDelModal");
    const { oftenUsedSlice } = await import("entities/oftenUsed");
    const { rgbSlice } = await import("entities/rgbData");

    const { accountingFilterSlice } = await import("features/filters/accountingFilter");
    const { flowFilterSlice } = await import("features/filters/flowFilter");

    const { taskManagerSlice } = await import("features/taskManager");
    const { filteredLeadsListSlice } = await import("entities/filteredLeadsList");


    return {
        flowsProfileSlice,
        groupProfileSlice,
        searchSlice,
        registerUser,
        loginSlice,
        filteredTeachersSlice,
        filteredStudentsSlice,
        filteredEmployeesSlice,
        filteredGroupsSlice,
        filteredRoomsSlice,
        deletedGroupsSlice,
        groupAttendance,
        groupsSlice,
        studentProfilePayment,
        studentProfileBooks,
        studentProfileRating,
        roomsAddSlice,
        timeTableListSlice,
        teachers,
        newStudents,
        employerCategorySlice,
        employers,
        roomsSlice,
        roomssSlice,
        capital,
        roomDeleteSlice,
        roomsImageAddSlice,
        groupAttendanceSlice,
        studentProfile,
        teacherProfileData,
        userProfileSlice,
        flowsSlice,
        teacherParseSlice,
        employerParseSlice,
        vacancySlice,
        vacancyPageParseSlice,
        vacancyWorkPageSlice,
        vacancyWorkerPermissionSlice,
        roomImageSlice,
        accountingSlice,
        capitalSlice,
        employerSlice,
        otchotAccountingSlice,
        overHeadSlice,
        studentSlice,
        teacher,
        teacherSalarySlice,
        employerSalarySlice,
        giveEmployerSalarySlice,
        giveEmployerSalarySlices,
        giveTeacherSalarySlices,
        teacherSalaryDeleteSlice,
        employerSalaryDeleteSlice,
        calendarSlice,
        vacancyWorkerSoucre,
        userSetPermissionSlice,
        vacancyWorkerSlice,
        studentPaymentSlice,
        schoolTeacherDaySlice,
        inkasatsiyaSlice,
        timeTableTuronSlice,
        alertSlice,
        classSlice,
        locationsSlice,
        branchSwitcherSlice,
        multiPageSlice,
        studiyngStudentDelSlice,
        oftenUsedSlice,
        rgbSlice,
        accountingFilterSlice,
        flowFilterSlice,
        taskManagerSlice,
        filteredLeadsListSlice,
    };
}


// import {user} from "entities/user";

// import {studentProfilePayment} from "entities/profile/studentProfile";
// import {studentProfileBooks} from "entities/profile/studentProfile";
// import {studentProfileRating} from "entities/profile/studentProfile";
// import {roomsAddSlice} from "pages/roomsPage";
// import {timeTableListSlice} from "pages/timeTableListPage";
// import {teachers} from "entities/teachers"
// import {newStudents} from "../entities/students";
// import {employerCategorySlice, employers} from "../entities/employer";
// import {roomsSlice} from "../entities/rooms";
// import {roomssSlice} from "../features/roomsEditModal";
// import {capital} from "../entities/capital";
// import {roomDeleteSlice} from "features/roomDeleteModal/model";
// import {roomsImageAddSlice} from "features/roomImageAddModal/model";
// import {
//     groupAttendanceSlice,
//     studentProfile,
//     teacherProfileData
// } from "pages/profilePage";
// import {userProfileSlice} from "entities/profile/userProfile"
// import {flowsSlice} from "entities/flows";
// import {teacherParseSlice} from "entities/teachers";
// import {employerParseSlice} from "../entities/profile/employerProfile";
// import {vacancySlice} from "../features/vacancyModals/vacancyPageAdd";
// import {vacancyPageParseSlice} from "../features/vacancyModals/vacancyPageAdd";
// import {vacancyWorkPageSlice} from "../features/vacancyModals/vacancyWorkPage/model";
// import {vacancyWorkerPermissionSlice} from "../features/vacancyModals/vacancyWorkerPermission";
// import {roomImageSlice} from "features/roomImagePareModal";
// import {timeTableSchool} from "pages/timeTable"
// import {
//     accountingSlice,
//     capitalSlice,
//     employerSlice, otchotAccountingSlice,
//     overHeadSlice,
//     studentSlice,
//     teacher
// } from "entities/accounting";
// import {
//     getBranchSlice, getEducation,
// } from "entities/editCreates";
// import {teacherSalarySlice} from "entities/teacherSalary";
// import {employerSalarySlice} from "entities/employerSalary";
// import {giveEmployerSalarySlice} from "pages/giveSalaryPage";
// import {giveEmployerSalarySlices} from "features/giveEmployerSalary";
// import {giveTeacherSalarySlices} from "features/giveSalary/giveSalary";
// import {teacherSalaryDeleteSlice} from "features/salaryEdits";
// import {employerSalaryDeleteSlice} from "features/salaryEdits";
// import {calendarSlice} from "pages/calendarPage";
// import {vacancyWorkerSoucre, userSetPermissionSlice} from "entities/vacancy/ui/vacancyWorkerList";
// import {vacancyWorkerSlice} from "features/vacancyWorkerList";
// import {studentPaymentSlice} from "features/studentPayment";
// import {schoolTeacherDaySlice} from "features/teacherModals";
// import {inkasatsiyaSlice} from "entities/inkasatsiya";
// import {timeTableTuronSlice} from "pages/timeTable"
// import {alertSlice} from "features/alert"
// import {classSlice} from "entities/class";
// import {locationsSlice} from "features/locations"
// import {themeSwitcherSlice} from "features/themeSwitcher"
// import {branchSwitcherSlice} from "features/branchSwitcher"
// import {multiPageSlice} from "widgets/multiPage"
// import {studiyngStudentDelSlice} from "features/studiyngStudentDelModal";
// import {oftenUsedSlice} from "entities/oftenUsed";
// import {rgbSlice} from "entities/rgbData";
// import {accountingFilterSlice} from "features/filters/accountingFilter";
// import {flowFilterSlice} from "features/filters/flowFilter";
//
// import {taskManagerSlice} from "features/taskManager";
// import {filteredLeadsListSlice} from "entities/filteredLeadsList";

const stringMiddleware = () => (next) => (action) => {
    if (typeof action === 'string') {
        return next({
            type: action
        })
    }
    return next(action)
}


export const store = configureStore({

    reducer: loadSlices,
    // reducer: {
    //     searchSlice,
    //     registerUser,
    //     loginSlice,
    //     filteredTeachersSlice,
    //     filteredStudentsSlice,
    //     filteredEmployeesSlice,
    //     filteredGroupsSlice,
    //     filteredRoomsSlice,
    //     groupsSlice,
    //     deletedGroupsSlice,
    //     groupProfileSlice,
    //     flowsProfileSlice,
    //     groupAttendance,

        // accountingFilterSlice,
        //
        // studentProfilePayment,
        // studentProfileBooks,
        // studentProfileRating,
        //
        // // user,
        // newStudents,
        // employers,
        // teachers,
        // studentProfile,
        // timeTableListSlice,
        // roomsAddSlice,
        // roomsSlice,
        // roomssSlice,
        // // roomsEditModalSlice,
        // roomDeleteSlice,
        // roomsImageAddSlice,
        // roomImageSlice,
        // flowsSlice,
        // teacherProfileData,
        // teacherParseSlice,
        // capital,
        // employerParseSlice,
        // vacancySlice,
        // vacancyPageParseSlice,
        // vacancyWorkPageSlice,
        // accountingSlice,
        // postBranch,
        // getBranchSlice,
        // // timeTableSchool,
        // userProfileSlice,
        // vacancyWorkerPermissionSlice,
        // teacherSalarySlice,
        // employerSalarySlice,
        // giveEmployerSalarySlice,
        // giveEmployerSalarySlices,
        // calendarSlice,
        // postEducation,
        // getEducation,
        // timeTableTuronSlice,
        // studentSlice,
        // employerSlice,
        // teacher,
        // giveTeacherSalarySlices,
        // teacherSalaryDeleteSlice,
        // employerSalaryDeleteSlice,
        // vacancyWorkerSoucre,
        // userSetPermissionSlice,
        // vacancyWorkerSlice,
        // studentPaymentSlice,
        // overHeadSlice,
        // capitalSlice,
        // inkasatsiyaSlice,
        // alertSlice,
        // schoolTeacherDaySlice,
        // locationsSlice,
        // themeSwitcherSlice,
        // branchSwitcherSlice,
        // multiPageSlice,
        // classSlice,
        // employerCategorySlice,
        // // teacherGroupSlice,
        // studiyngStudentDelSlice,
        // groupAttendanceSlice,
        // otchotAccountingSlice,
        // oftenUsedSlice,
        // rgbSlice,
        // flowFilterSlice,
        // taskManagerSlice,
        // filteredLeadsListSlice
    // },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(
            stringMiddleware
        ),
    devTools: process.env.NODE_ENV !== "production",
})

