import {ROLES} from "shared/const/roles";

export const menuConfig = [
    // {
    //     to: "home",
    //     name: "Bosh Sahifa",
    //     icon: "fa-home",
    //     system: ["center","school"],
    //     roles: true
    // },
    {
        to: "register",
        name: "Registratsiya",
        icon: "fa-edit",
        system: ["center","school"],
        roles: true
    },
    {
        to: "taskManager",
        name: "Task Manager",
        icon: "fa-tasks",
        system: ["center","school"],
        roles: [ROLES.operator ],
    },
    {
        to: "adminTaskManager",
        name: "Task Manager",
        icon: "fa-tasks",
        system: ["center","school"],
        roles: [ROLES.admin]
    },
    {
        to: "calendar",
        name: "Kalendar",
        icon: "fas fa-calendar-times",
        system: ["school"],
        roles: [ROLES.director,ROLES.admin],

    },
    {
        to: "students",
        name: "O'quvchilar",
        icon: "fa-user-graduate",
        system: ["center","school"],
        roles: [ROLES.admin,ROLES.director,ROLES.programmer],
        branches: true
    },
    {
        to: "groups",
        name: "Guruhlar",
        icon: "fa-users",
        system: ["center"],
        roles: [ROLES.admin,ROLES.director,ROLES.programmer],
        branches: true


    },
    {
        to: "groups",
        name: "Sinflar",
        icon: "fa-users",
        system: ["school"],
        roles: [ROLES.admin,ROLES.director,ROLES.programmer],
        branches: true

    },
    {
        to: "teacher",
        name: "O'qituvchilar",
        icon: "fa-user-tie",
        system: ["center","school"],
        roles: [ROLES.admin,ROLES.director,ROLES.programmer],
        branches: true

    },
    {
        to: "vacancyPage",
        name: "Vakansiyalar",
        icon: "fa-tasks", // Bu element director uchun filtrlanadi
        system: ["center","school"],
        roles: [ROLES.director,ROLES.programmer],
        branches: true
    },
    {
        to: "timeList",
        name: "Time List",
        icon: "fa-clock",
        system: ["center","school"],

        roles: [ROLES.admin,ROLES.director,ROLES.programmer],
        branches: true

    },
    {
        to: "time",
        name: "Time Table",
        icon: "fa-clock",
        system: ["center","school"],
        roles: [ROLES.admin,ROLES.director,ROLES.programmer],
        branches: true
    },
    {
        to: "employer",
        name: "Employers",
        icon: "fa-user-graduate",
        system: ["center","school"],

        roles: [ROLES.admin,ROLES.director,ROLES.programmer],
        branches: true

    },
    {
        to: "flows",
        name: "Flows",
        icon: "fa-user-graduate",
        system: ["school"],

        roles: [ROLES.admin,ROLES.director,ROLES.programmer],
        branches: true

    },
    {
        to: "class",
        name: "Class",
        icon: "fa-user-graduate",
        system: ["school"],

        roles: [ROLES.admin,ROLES.director,ROLES.programmer],
        branches: true
    },
    {
        to: "contract",
        name: "Contract",
        icon: "fa-file-contract",
        system: ["center","school"],

        roles: [ROLES.admin,ROLES.director,ROLES.programmer]

    },
    {
        to: "capital",
        name: "Capital",
        icon: "fa-book",
        system: ["center","school"],

        roles: [ROLES.admin,ROLES.director,ROLES.programmer,ROLES.accountant],
        branches: true

    },
    {
        to: "accounting",
        name: "Buxgalteriya ",
        icon: "fa-calculator",
        system: ["center","school"],
        roles: [ROLES.admin,ROLES.director,ROLES.programmer],
        branches: true,
        multi: true

    },
    {
        to: "rooms",
        name: "Honalar",
        icon: "fa-door-closed",
        system: ["center","school"],
        roles: [ROLES.admin,ROLES.director,ROLES.programmer],
        branches: true

    },

    {
        to: "../../",
        name: "Web-Sayt",
        system: ["center","school"],
        roles: [ROLES.smm]
    },

    {
        to: "adminTaskManager",
        name: "Task Manager",
        icon: "fa-tasks",
        system: ["center","school"],
        roles: [ROLES.admin]
    }

];
