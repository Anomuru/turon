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
    getSystem,
    getLocations,
    getRouteCreateGroup,
    getEmployerSalaryInsideSource,
    getEmployerSalary,
    getTeacherSalary, getInkasatsiya,
    getGroupHistory,
    getRouteClassProfile, getOtchot, getRouteRGBData, getRouteTaskManager, getRouteFilteredLeads
} from "shared/const/routers";
import {lazyPage} from "shared/lib/lazyPage/lazyPage.js";


const ClassProfilePage = lazyPage(() => import("pages/School"), "ClassProfilePage");

const GroupCreatePage = lazyPage(() => import("pages/groupsPage"), "GroupCreatePage");
const GroupAttendance = lazyPage(() => import("pages/groupsPage"), "GroupAttendance");

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

const Branch = lazyPage(() => import("entities/editCreates"), "Branch");
const Education = lazyPage(() => import("entities/editCreates"), "Education");
const Location = lazyPage(() => import("entities/editCreates"), "Location");
const System = lazyPage(() => import("entities/editCreates"), "System");

const Inkasatsiya = lazyPage(() => import("pages/inkasatsiyaPage"), "Inkasatsiya");

const StudentProfileGroupsHistory = lazyPage(() => import("entities/profile/studentProfile"), "StudentProfileGroupsHistory");

const AccountingOtchotPage = lazyPage(() => import("pages/accountingPage"), "AccountingOtchotPage");

const TaskManager = lazyPage(() => import("pages/taskManager/ui/taskManager"), "TaskManager");

const AdminTaskManager = lazyPage(() => import("pages/adminTaskManager"), "AdminTaskManager");

const FilteredLeadsPage = React.lazy(() => import("pages/filteredLeadsPage/ui/FilteredLeadsPage"));

const StudentProfilePage = lazyPage(() => import("pages/profilePage")); // ⬅️ this is default export


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
        name: "location",
        path: getLocations(":id"),
        element: <Location/>
    },
    {
        name: "branch",
        path: getBranch(":idBranch"),
        element: <Branch/>
    },
    {
        name: "system",
        path: getSystem(":id"),
        element: <System/>
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
        name: "AdminTaskManager",
        path: "adminTaskManager",
        element: <AdminTaskManager/>
    }


    // {
    //     name: "capital category profile",
    //     path: getCapitalCategoryProfile(":id"),
    //     element: <CategoryProfile/>
    // },

]