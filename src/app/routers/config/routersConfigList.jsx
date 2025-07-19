import React from "react";

import {

    getRouteStudents,
    getRouteTimePage,
    getRouteTeacher,
    getRouteGroups,
    getVacancyPage,
    getRouteRooms,
    getClass,
    getFlow,
    getContract,
    getCapital,
    getEmployerPage,
    getAccounting,
    getRouteCalendar,
    getRouteMain,
    getRouteRegister,

} from "shared/const/routers";
import {lazyPage} from "shared/lib/lazyPage/lazyPage.js";





const StudentsPage = lazyPage(() => import("pages/studentsPage"), "StudentsPage");



const GroupsPage = lazyPage(() => import("pages/groupsPage"), "GroupsPage");
const Rooms = lazyPage(() => import("pages/roomsPage"), "Rooms");
const TeachersPage = lazyPage(() => import("pages/teacherPage"), "TeachersPage");
const VacancyPage = lazyPage(() => import("pages/vacancyPage"), "VacancyPage");
const TimeTableListPage = lazyPage(() => import("pages/timeTableListPage"), "TimeTableListPage");
const EmployerPage = lazyPage(() => import("pages/employeesPage"), "EmployerPage");
const FlowsPage = lazyPage(() => import("pages/flowsPage"), "FlowsPage");
const ContractPage = lazyPage(() => import("pages/contractPage"), "ContractPage");
const CapitalPage = lazyPage(() => import("pages/capitalPage"), "CapitalPage");
const AccountingPageMainIndex = lazyPage(() => import("pages/accountingPage"), "AccountingPageMainIndex");
const CalendarPage = lazyPage(() => import("pages/calendarPage"), "CalendarPage");
const TimeTableTuronPage = lazyPage(() => import("pages/timeTable"), "TimeTableTuronPage");
const ClassMain = lazyPage(() => import("pages/classPage/ui/classMain"), "ClassMain");

export const routersConfigList = [
    {
        name: "Bosh Sahifa",
        path: getRouteMain(),
        // element: <HomePage/>,
        element: null,
    },
    {
        name: "O'quvchilar",
        path: getRouteStudents(),
        element: <StudentsPage/>
    },
    {
        name: "Kalendar",
        path: getRouteCalendar(),
        element: <CalendarPage/>
    },
    {
        name: "Gruppalar",
        path: getRouteGroups(":id"),
        element: <GroupsPage/>
    },
    {
        name: "O'qituvchilar",
        path: getRouteTeacher(":id"),
        element: <TeachersPage/>
    },
    {
        name: "Time Table",
        path: getRouteTimePage(":idBranch"),
        element: <TimeTableListPage/>,
    },
    {
        name: "Vakansiyalar",
        path: getVacancyPage(":idBranch"),
        element: <VacancyPage/>,
    },
    {

        name: "Employers",
        icon: "fa-user-graduate",
        roles: [],
        path: getEmployerPage(":idBranch"),
        element: <EmployerPage/>,
    },
    {
        name: "Flows",
        path: getFlow(":id"),
        element: <FlowsPage/>,
    },
    {
        name: "Class",
        path: getClass(":id"),
        element: <ClassMain/>,
    },
    {
        path: getContract(":id"),
        name: "Contract",
        // icon: "fa fa-book",
        element: <ContractPage/>
    },
    {
        path: getCapital(":id"),
        name: "capital",
        element: <CapitalPage/>
    },

    {
        name: "Honalar",
        path: getRouteRooms(":id"),
        element: <Rooms/>,
    },

    {
        path: "calendar",
        element: <CalendarPage/>,
    },
    {
        name: "Time Table",
        path: "time/*",
        element: <TimeTableTuronPage/>,
    },

    {
        to: "/login",
        name: "Capital Category",
        icon: "fa-coins",
        roles: []
    },
    {
        to: "/login",
        name: "Centre info",
        icon: "fa-info",
        roles: []
    },
    {
        to: "/login",
        name: "Kitoblar",
        icon: "fa-book",
        roles: []
    },
    {
        name: "accounting",
        path: getAccounting(":id"),
        element: <AccountingPageMainIndex/>,
        isMultiPage: true
    },
    // {
    //     name: "capital category profile",
    //     path: getCapitalCategoryProfile(":id"),
    //     element: <CategoryProfile/>
    // },

    // {
    //     name: "Registratsiya",
    //     path: getRouteRegister(),
    //     element: <Register/>,
    // },

]