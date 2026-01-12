import { ROLES } from "shared/const/roles";

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
        roles: [ROLES.admin, ROLES.director, ROLES.programmer],
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
        roles: [ROLES.admin, ROLES.director, ROLES.programmer],
    },
    {
        to: "adminTaskManager",
        name: "Operator Tasks",
        icon: "fa-tasks",
        roles: [ROLES.admin]
        // roles: true
    },
    {
        to: "todoist",
        name: "Todoist",
        icon: "fa-circle-check",
        roles: [ROLES.admin, ROLES.teacher, ROLES.accountant, ROLES.methodist, ROLES.director, ROLES.muxarir, ROLES.operator, ROLES.programmer, ROLES.smm, ROLES.teacher, ROLES.zavxos],
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
        roles: [ROLES.director, ROLES.admin],

    },
    {
        to: "students",
        name: "O'quvchilar",
        icon: "fa-user-graduate",
        roles: [ROLES.admin, ROLES.director, ROLES.programmer, ROLES.zavuch],
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
        roles: [ROLES.admin, ROLES.director, ROLES.programmer],
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
        roles: [ROLES.admin, ROLES.director, ROLES.programmer],
        branches: true

    },
    {
        to: "groups",
        name: "Sinflar",
        icon: "fa-users",
        roles: [ROLES.admin, ROLES.director, ROLES.programmer, ROLES.teacher, ROLES.zavuch],
        branches: true

    },
    {
        to: "vacancyPage",
        name: "Vakansiyalar",
        icon: "fa-tasks", // Bu element director uchun filtrlanadi
        roles: [ROLES.director, ROLES.programmer],
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
        roles: [ROLES.admin, ROLES.director, ROLES.programmer, ROLES.zavuch],
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

        roles: [ROLES.admin, ROLES.director, ROLES.programmer, ROLES.accountant],
        branches: true

    },
    {
        to: "accounting/studentsPayments",
        name: "Buxgalteriya ",
        icon: "fa-calculator",
        roles: [ROLES.admin, ROLES.director, ROLES.programmer],
        branches: true,
        multi: true

    },
    {
        to: "quarterMaster",
        name: "Zavxoz profile",
        icon: "fa-toolbox",
        roles: [ROLES.admin, ROLES.director, ROLES.programmer, ROLES.zavxos],
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

    {
        to: "../../",
        name: "Web-Sayt",
        roles: [ROLES.smm]
    },


];
