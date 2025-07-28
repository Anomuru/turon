import {ROLES} from "shared/const/roles";

export const menuConfig = [
    // {
    //     to: "home",
    //     name: "Bosh Sahifa",
    //     icon: "fa-home",
    //     roles: true
    // },
    {
        to: "register",
        name: "Registratsiya",
        icon: "fa-edit",
        roles: true
    },
    {
        to: "taskManager",
        name: "Task Manager",
        icon: "fa-tasks",
        roles: [ROLES.operator ],
    },
    {
        to: "adminTaskManager",
        name: "Task Manager",
        icon: "fa-tasks",
        roles: [ROLES.admin]
    },
    {
        to: "calendar",
        name: "Kalendar",
        icon: "fas fa-calendar-times",
        roles: [ROLES.director,ROLES.admin],

    },
    {
        to: "students",
        name: "O'quvchilar",
        icon: "fa-user-graduate",
        roles: [ROLES.admin,ROLES.director,ROLES.programmer],
        branches: true
    },
    {
        to: "groups",
        name: "Guruhlar",
        icon: "fa-users",
        roles: [ROLES.admin,ROLES.director,ROLES.programmer],
        branches: true


    },
    {
        to: "groups",
        name: "Sinflar",
        icon: "fa-users",
        roles: [ROLES.admin,ROLES.director,ROLES.programmer],
        branches: true

    },
    {
        to: "teacher",
        name: "O'qituvchilar",
        icon: "fa-user-tie",
        roles: [ROLES.admin,ROLES.director,ROLES.programmer],
        branches: true

    },
    {
        to: "vacancyPage",
        name: "Vakansiyalar",
        icon: "fa-tasks", // Bu element director uchun filtrlanadi
        roles: [ROLES.director,ROLES.programmer],
        branches: true
    },
    {
        to: "timeList",
        name: "Time List",
        icon: "fa-clock",

        roles: [ROLES.admin,ROLES.director,ROLES.programmer],
        branches: true

    },
    {
        to: "time",
        name: "Time Table",
        icon: "fa-clock",
        roles: [ROLES.admin,ROLES.director,ROLES.programmer],
        branches: true
    },
    {
        to: "employer",
        name: "Employers",
        icon: "fa-user-graduate",

        roles: [ROLES.admin,ROLES.director,ROLES.programmer],
        branches: true

    },
    {
        to: "flows",
        name: "Flows",
        icon: "fa-user-graduate",

        roles: [ROLES.admin,ROLES.director,ROLES.programmer],
        branches: true

    },
    {
        to: "class",
        name: "Class",
        icon: "fa-user-graduate",

        roles: [ROLES.admin,ROLES.director,ROLES.programmer],
        branches: true
    },
    {
        to: "contract",
        name: "Contract",
        icon: "fa-file-contract",

        roles: [ROLES.admin,ROLES.director,ROLES.programmer]

    },
    {
        to: "capital",
        name: "Capital",
        icon: "fa-book",

        roles: [ROLES.admin,ROLES.director,ROLES.programmer,ROLES.accountant],
        branches: true

    },
    {
        to: "accounting",
        name: "Buxgalteriya ",
        icon: "fa-calculator",
        roles: [ROLES.admin,ROLES.director,ROLES.programmer],
        branches: true,
        multi: true

    },
    {
        to: "rooms",
        name: "Honalar",
        icon: "fa-door-closed",
        roles: [ROLES.admin,ROLES.director,ROLES.programmer],
        branches: true

    },

    {
        to: "../../",
        name: "Web-Sayt",
        roles: [ROLES.smm]
    },

    {
        to: "adminTaskManager",
        name: "Task Manager",
        icon: "fa-tasks",
        roles: [ROLES.admin]
    }

];
