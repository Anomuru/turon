import React from "react";
import {RgbDataPage} from "pages/rgbDataPage";
import {
    getRouteUserProfile,
    getVacancyWorkPage,
    getRouteRegister,
    getProfile,
    getTeacherSalaryInsideSource,
    getContract,
    getCapitalInside,
    getTeacherProfile,
    getRoomsProfilePage,
    getEmployerProfile,
    getBranch,
    getLocations,
    getRouteCreateGroup,
    getEmployerSalaryInsideSource,
    getEmployerSalary,
    getTeacherSalary,
    getInkasatsiya,
    getGroupHistory,
    getRouteStudentAttendance,
    getRouteClassProfile,
    getOtchot,
    getRouteRGBData,
    getRouteTaskManager,
    getRouteFilteredLeads,
    getAccounting,
    getGroupQuarter, getGroupQuarterShow, getGroupObserve
} from "shared/const/routers";
import {lazyPage} from "shared/lib/lazyPage/lazyPage.js";
import {TimeTableTuronPage} from "pages/timeTable/index.js";
import {AccountingPageMainIndex} from "pages/accountingPage/index.js";
const AccountingPageNew = lazyPage(() => import("pages/accountingPage2.0") , "AccountingPageNew");
// import {GroupQuarterShow} from "pages/groupsPage/index.js";


const StudentAttendancePage = lazyPage(() => import("pages/studentAttendancePage"), "StudentAttendancePage")
const ClassProfilePage = lazyPage(() => import("pages/School"), "ClassProfilePage");
// const StudentProfilePage = lazyPage(() => import("pages/profilePage" , "StudentProfilePage"));
const GroupCreatePage = lazyPage(() => import("pages/groupsPage"), "GroupCreatePage");
const StudentProfilePage = lazyPage(() => import("pages/profilePage"), "StudentProfilePage");
const GroupAttendance = lazyPage(() => import("pages/groupsPage"), "GroupAttendance");
const GroupQuarterShow = lazyPage(() => import("pages/groupsPage"), "GroupQuarterShow");

const ProfileTeacherPage = lazyPage(() => import("pages/profilePage"), "ProfileTeacherPage");
const UserProfilePage = lazyPage(() => import("pages/profilePage"), "UserProfilePage");
const ProfileEmployerPage = lazyPage(() => import("pages/profilePage"), "ProfileEmployerPage");
const GroupProfilePage = lazyPage(() => import("pages/profilePage"), "GroupProfilePage");

const VacancyWorkPage = lazyPage(() => import("pages/vacancyWorkPage"), "VacancyWorkPage");

const RoomsProfilePage = lazyPage(() => import("pages/roomsProiflePage"), "RoomsProfilePage");

const ContractPage = lazyPage(() => import("pages/contractPage"), "ContractPage");

const CapitalInside = lazyPage(() => import("pages/capitalPage"), "CapitalInside");
const CapitalPage = lazyPage(() => import("pages/capitalPage"), "CapitalPage");

const TeacherSalaryPage = lazyPage(() => import("pages/teacherSalaryPage"), "TeacherSalaryPage");
const EmployerSalaryPage = lazyPage(() => import("pages/employerSalaryPage"), "EmployerSalaryPage");

const GiveSalaryPage = lazyPage(() => import("pages/giveSalaryPage"), "GiveSalaryPage");
const GiveTeacherSalaryPage = lazyPage(() => import("pages/giveSalaryPage"), "GiveTeacherSalaryPage");


const Inkasatsiya = lazyPage(() => import("pages/inkasatsiyaPage"), "Inkasatsiya");

const StudentProfileGroupsHistory = lazyPage(() => import("entities/profile/studentProfile"), "StudentProfileGroupsHistory");

const AccountingOtchotPage = lazyPage(() => import("pages/accountingPage"), "AccountingOtchotPage");

const TaskManager = lazyPage(() => import("pages/taskManager/ui/taskManager"), "TaskManager");

const AdminTaskManager = lazyPage(() => import("pages/adminTaskManager"), "AdminTaskManager");


const FilteredLeadsPage = lazyPage(() => import("pages/filteredLeadsPage"), "FilteredLeadsPage");
const GroupProfileQuarter = lazyPage(() => import("features/groupProfile"), "GroupProfileQuarter");

// const GroupProfileQuarter = lazyPage(() => import("features/groupProfile/ui/groupProfileQuarter"))
const GroupObservePage = lazyPage(() => import("pages/groupsPage/ui/groupObserve/groupObserve.jsx"), "GroupObservePage");

export const routersConfigProfile = [
    {
        to: "profile",
        name: "Student Profile",
        path: getProfile(":id"),
        element: <StudentProfilePage/>,
    },
    {
        name: "Task Manager",
        path: getRouteTaskManager(":id"),
        element: <TaskManager/>,
    },
    {
        name: "Task Manager Filtered",
        path: getRouteFilteredLeads(),
        element: <FilteredLeadsPage/>,
    },
    {
        to: "capitalBox",
        name: "capitalInside",
        path: getCapitalInside(":id"),
        element: <CapitalInside/>

    },
    {
        to: 'vacancyPage/vacancyWorkPage',
        path: getVacancyWorkPage(":id"),
        element: <VacancyWorkPage/>,
    },


    {
        path: getContract(":id"),
        name: "Contract",
        // icon: "fa fa-book",
        element: <ContractPage/>
    },
    {
        name: "Time Table",
        path: "time/*",
        element: <TimeTableTuronPage/>,
    },

    {
        path: getRouteUserProfile(":id"),
        element: <UserProfilePage/>,
    },
    {
        path: getRouteCreateGroup(),
        element: <GroupCreatePage/>,
    },
    {
        path: "groups/groupInfo/:id",
        element: <GroupProfilePage/>,
    },
    {
        path: "groups/groupInfo/:id/attendance",
        element: <GroupAttendance/>,
    },
    {
        path: getRouteClassProfile(":id"),
        element: <ClassProfilePage/>
    },


    {
        name: "Rooms Profile",
        path: getRoomsProfilePage(":id"),
        element: <RoomsProfilePage/>,
        roles: [],
    },
    {
        to: "teacher/teacherProfile",
        name: "Teacher Profile",
        path: getTeacherProfile(":id"),
        element: <ProfileTeacherPage/>,
        roles: [],
    },
    {
        to: "employer/employerProfile",
        name: "Employer Page",
        path: getEmployerProfile(":id"),
        element: <ProfileEmployerPage/>,
        roles: [],
    },
    {
        name: "Teacher Salary",
        path: getTeacherSalary(":id"),
        element: <TeacherSalaryPage/>
    },
    {
        name: "Employer Salary",
        path: getEmployerSalary(":id"),
        element: <EmployerSalaryPage/>
    },
    {
        name: "Give salary",
        path: getEmployerSalaryInsideSource(":id", ":permission"),
        element: <GiveSalaryPage/>
    },
    {
        name: "Give salary",
        path: getTeacherSalaryInsideSource(":id"),
        element: <GiveTeacherSalaryPage/>
    },



    {
        name: "inkasatsiya",
        path: getInkasatsiya(":idBranch"),
        element: <Inkasatsiya/>
    },

    {
        name: "otchot",
        path: getOtchot(),
        element: <AccountingOtchotPage/>
    },
    {
        name: "History",
        path: getGroupHistory(":id"),
        element: <StudentProfileGroupsHistory/>
    },
    {
        name: "rgbData",
        path: getRouteRGBData(),
        element: <RgbDataPage/>
    },
    {
        name: "attendance",
        path: getRouteStudentAttendance(),
        element: <StudentAttendancePage/>
    },


    {
        name: "AdminTaskManager",
        path: "adminTaskManager",
        element: <AdminTaskManager/>
    },
    {
        name: "accounting",
        path: getAccounting(":id"),
        element: <AccountingPageNew/>,
        // element: <AccountingPageMainIndex/>,
        isMultiPage: true
    },
    {
        name: "GroupProfileQuarter",
        path: getGroupQuarter(":id"),
        element: <GroupProfileQuarter/>,
    },
    {
        // name: "GroupProfileQuarterShow",
        path: getGroupQuarterShow(":id"),
        element: <GroupQuarterShow/>,
    },
    {
        name: "GroupObserve",
        path: getGroupObserve(":id"),
        element: <GroupObservePage/>
    },


    // {
    //     name: "capital category profile",
    //     path: getCapitalCategoryProfile(":id"),
    //     element: <CategoryProfile/>
    // },

]