import { ROLES } from "shared/const/roles";
import React from "react";

export const menuConfig = [
    // {
    //     to: "home",
    //     name: "Bosh Sahifa",
    //     icon: "fa-home",
    //     roles: true
    // },
    {
        to: "dashboard",
        name: "Dashboard",
        icon: "fa-home",
        roles: [ROLES.director, ROLES.main_director]
    },
    {
        to: "register",
        name: "Registratsiya",
        icon: "fa-edit",
        roles: [ROLES.admin, ROLES.director, ROLES.main_director, ROLES.programmer],
    },
    {
        to: "taskManager",
        name: "Task Manager",
        icon: "fa-tasks",
        roles: [ROLES.operator],
    },
    {
        to: "statistics",
        name: "Statistika",
        icon: "fa-chart-line",
        roles: [ROLES.director, ROLES.main_director, ROLES.programmer],
    },
    {
        to: "rating",
        name: "Reyting ko'rsatkichlari",
        icon: "fa-users",
        roles: [ROLES.director, ROLES.main_director, ROLES.programmer]
    },
    {
        to: "development",
        name: "O'qituvchilarni rivojlantirish",
        icon: "fa-chalkboard-teacher",
        roles: [ROLES.director, ROLES.main_director]
    },
    {
        to: "surveyResults",
        name: "So'rovnoma natijalari",
        icon: "fa-list",
        roles: [ROLES.admin, ROLES.programmer, ROLES.director, ROLES.main_director]
    },
    {
        to: "teacherRating",
        name: "O'qituvchini baholash",
        icon: "fa-star",
        roles: [ROLES.director, ROLES.main_director, ROLES.programmer]
    },
    {
        to: "adminTaskManager",
        name: "Operator Tasks",
        icon: "fa-tasks",
        roles: [ROLES.admin]
        // roles: true
    },
    {
        to: "cvShow",
        name: "CV Submissions ",
        icon: "fa-file",
        roles: [ROLES.director, ROLES.main_director, ROLES.smm]
        // roles: true
    },
    {
        to: "messages",
        name: "Xabarlar",
        icon: "fa-message",
        roles: [ROLES.director, ROLES.main_director, ROLES.smm]
        // roles: true
    },

    {
        to: "news",
        name: "Yangiliklar",
        icon: "fa-brands fa-neos",
        roles: [ROLES.director, ROLES.main_director, ROLES.smm]
        // roles: true
    },


    {
        to: "party",
        name: "Partiyalar",
        icon: "fa-solid fa-group-arrows-rotate",
        roles: [ROLES.director, ROLES.main_director, ROLES.advertising]
        // roles: true
    },

    {
        to: "teacherObservation",
        name: "Observation",
        icon: "fa-eye",
        roles: [ROLES.teacher]
    },
    {
        to: "todoist",
        name: "Todoist",
        icon: "fa-circle-check",
        roles: [ROLES.teacher, ROLES.accountant, ROLES.methodist, ROLES.director, ROLES.main_director, ROLES.muxarir, ROLES.operator, ROLES.programmer, ROLES.smm, ROLES.teacher, ROLES.zavxos],
        // roles: true
    },
    // {
    //     to: "adminTaskManager",
    //     name: "Task Manager",
    //     icon: "fa-tasks",
    //     roles: [ROLES.admin]
    // },
    {
        to: "calendar",
        name: "Kalendar",
        icon: "fas fa-calendar-times",
        roles: [ROLES.director, ROLES.main_director, ROLES.spiritualist, ROLES.advertising],

    },
    {
        to: "students",
        name: "O'quvchilar",
        icon: "fa-user-graduate",
        roles: [ROLES.admin, ROLES.director, ROLES.main_director, ROLES.programmer, ROLES.zavuch, ROLES.spiritualist, ROLES.advertising],
        branches: true
    },
    // {
    //     to: "groups",
    //     name: "Guruhlar",
    //     icon: "fa-users",
    //     roles: [ROLES.admin,ROLES.director,ROLES.programmer],
    //     branches: true
    //
    //
    // },

    {
        to: "teacher",
        name: "O'qituvchilar",
        icon: "fa-user-tie",
        roles: [ROLES.director, ROLES.main_director, ROLES.programmer, ROLES.spiritualist, ROLES.admin],
        branches: true

    },
    // {
    //     to: "teacherAttendance/",
    //     name: "O'qituvchilar Davomit",
    //     icon: "c",
    //     roles: [ROLES.admin, ROLES.director, ROLES.programmer],
    //     branches: true
    //
    // },
    {
        to: "parents/",
        name: "Ota-onalar",
        icon: "fa-users",
        roles: [ROLES.director, ROLES.main_director, ROLES.programmer],
        branches: true

    },
    {
        to: "groups",
        name: "Sinflar",
        icon: "fa-users",
        roles: [ROLES.admin, ROLES.director, ROLES.main_director, ROLES.programmer, ROLES.teacher, ROLES.zavuch, ROLES.spiritualist],
        branches: true

    },
    {
        to: "vacancyPage",
        name: "Vakansiyalar",
        icon: "fa-tasks", // Bu element director uchun filtrlanadi
        roles: [ROLES.director, ROLES.main_director, ROLES.programmer],
        branches: true
    },
    // {
    //     to: "timeList",
    //     name: "Time List",
    //     icon: "fa-clock",
    //
    //     roles: [ROLES.admin,ROLES.director,ROLES.programmer],
    //     branches: true
    //
    // },
    {
        to: "time",
        name: "Time Table",
        icon: "fa-clock",
        roles: [ROLES.admin, ROLES.director, ROLES.main_director, ROLES.programmer, ROLES.zavuch, ROLES.spiritualist],
        branches: true
    },
    // {
    //     to: "employer",
    //     name: "Employers",
    //     icon: "fa-user-graduate",
    //
    //     roles: [ROLES.admin,ROLES.director,ROLES.programmer],
    //     branches: true
    //
    // },
    // {
    //     to: "flows",
    //     name: "Flows",
    //     icon: "fa-user-graduate",
    //
    //     roles: [ROLES.admin,ROLES.director,ROLES.programmer],
    //     branches: true
    //
    // },
    // {
    //     to: "class",
    //     name: "Class",
    //     icon: "fa-user-graduate",
    //
    //     roles: [ROLES.admin,ROLES.director,ROLES.programmer ],
    //     branches: true
    // },
    // {
    //     to: "contract",
    //     name: "Contract",
    //     icon: "fa-file-contract",
    //
    //     roles: [ROLES.admin,ROLES.director,ROLES.programmer]
    //
    // },
    {
        to: "capital",
        name: "Capital",
        icon: "fa-book",

        roles: [ROLES.admin, ROLES.director, ROLES.main_director, ROLES.programmer, ROLES.accountant],
        branches: true

    },
    {
        to: "accounting/studentsPayments",
        name: "Buxgalteriya ",
        icon: "fa-calculator",
        roles: [ROLES.admin, ROLES.director, ROLES.main_director, ROLES.programmer],
        branches: true,
        multi: true

    },
    {
        to: "questionnaire",
        name: "So’rovnoma",
        icon: "fa-calculator",
        roles: [ ROLES.director, ROLES.main_director, ROLES.advertising],
        branches: true,
        multi: true

    },
    {
        to: "quarterMaster",
        name: "Zavxoz profile",
        icon: "fa-toolbox",
        roles: [ROLES.director, ROLES.main_director, ROLES.programmer, ROLES.zavxos],
        branches: true

    },
    // {
    //     to: "rooms",
    //     name: "Honalar",
    //     icon: "fa-door-closed",
    //     roles: [ROLES.admin,ROLES.director,ROLES.programmer],
    //     branches: true
    //
    // },

    // {
    //     to: "../../",
    //     name: "Web-Sayt",
    //     roles: [ROLES.smm]
    // },


];
