import { DailyReportPage } from "pages/dailyReportPage/index.js";
import { ParentsPage } from "pages/parentsPage/ui/parentsPage.jsx";
import { TeacherAttendanceView } from "pages/teacherAttendanceView/index.js";
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
    getQuarterMaster, getCvSubmissons, getHomeMessage, getHomeNews, getCapitalCategoryProfile, getCapitalInside,
    getDashboard, getTeacherObservation, getObservationDetail, getLessonPlan,
    getEducationQuality, getEducationQualityDetails,
    getObservationShowPage,
    getTeacherStatistics,
    getLessonPlanDailyReport,
    getLessonPlanDetail, getSchoolMenu, getTeacherItem, getLeadFromSteam,

} from "shared/const/routers";
import { lazyPage } from "shared/lib/lazyPage/lazyPage.js";
import Register from "pages/registerPage/index.js";
import { CvSubmissions } from "pages/cvSubmissions/index.js";
import { HomeMessages } from "pages/homeMessages/index.js";
import { NewsPage } from "pages/newsPage/newsPage.jsx";
import {SchoolItem} from "pages/shortMenuData/schoolItem/schoolItem.jsx";
import {ShortTeacherData} from "pages/shortMenuData/teacher/shortTeacherData.jsx";
import SteamLead from "pages/steamLead/steamLead.jsx";


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
const Settings = lazyPage(() => import("pages/settings"), "Settings");
const StatisticsPage = lazyPage(() => import("pages/statisticsPage"), "StatisticsPage");
const QuarterMaster = lazyPage(() => import("pages/quarterMasterPage"), "QuarterMasterPage");
const RatingForTeachersPage = lazyPage(() => import("pages/ratingForTeachersPage"), "RatingForTeachersPage");
const SurveyResultsPage = lazyPage(() => import("pages/surveyResultsPage"), "SurveyResultsPage");
const ContributionsPage = lazyPage(() => import("pages/contributionsPage"), "ContributionsPage");
const TeachersDevelopmentPage = lazyPage(() => import("pages/teachersDevelopmentPage"), "TeachersDevelopmentPage");
const CapitalInside = lazyPage(() => import("pages/capitalPage"), "CapitalInside");
const DirectorDashboardPage = lazyPage(() => import("pages/directorDashboardPage"), "DirectorDashboardPage");
const TeacherObservationPage = lazyPage(() => import("pages/teacherObservationPage"), "TeacherObservationPage");
const ObservationDetailPage = lazyPage(() => import("pages/observationDetailPage"), "ObservationDetailPage");
const LessonPlanPage = lazyPage(() => import("pages/lessonPlanPage"), "LessonPlanPage");
const FinanceDashboardPage = lazyPage(() => import("pages/financeDashboardPage"), "FinanceDashboardPage");
const EducationQualityPage = lazyPage(() => import("pages/educationQualityPage"), "EducationQualityPage");
const EducationQualityDetails = lazyPage(() => import("pages/educationQualityPage"), "EducationQualityDetails");
const ObservationShowPage = lazyPage(() => import("pages/observationShowPage"), "ObservationShowPage");
const TeacherStatisticsPage = lazyPage(() => import("pages/teacherStatisticsPage"), "TeacherStatisticsPage");
const LessonPlanDailyReportPage = lazyPage(() => import("pages/lessonPlanDailyReportPage"), "LessonPlanDailyReportPage");
const LessonPlanDetailPage = lazyPage(() => import("pages/lessonPlanDetailPage"), "LessonPlanDetailPage");

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
        element: <StudentsPage />
    },
    {
        path: getObservationShowPage(),
        element: <ObservationShowPage />
    },
    {
        name: "Kalendar",
        path: getRouteCalendar(),
        element: <CalendarPage />
    },
    {
        name: "Gruppalar",
        path: getRouteGroups(":id"),
        element: <GroupsPage />
    },
    {
        path: getTeacherItem(":id"),
        element: <ShortTeacherData/>
    },
    {
        name: "O'qituvchilar",
        path: getRouteTeacher(":id"),
        element: <TeachersPage />
    },
    {
        name: "Time Table",
        path: getRouteTimePage(":idBranch"),
        element: <TimeTableListPage />,
    },
    {
        name: "Vakansiyalar",
        path: getVacancyPage(":idBranch"),
        element: <VacancyPage />,
    },
    {
        name: "Vakansiyalar",
        path: getLeadFromSteam(":idBranch"),
        element: <SteamLead />,
    },
    {

        name: "Employers",
        icon: "fa-user-graduate",
        roles: [],
        path: getEmployerPage(":idBranch"),
        element: <EmployerPage />,
    },
    {
        name: "Flows",
        path: getFlow(":id"),
        element: <FlowsPage />,
    },
    {
        name: "Class",
        path: getClass(":id"),
        element: <ClassMain />,
    },
    {
        path: getContract(":id"),
        name: "Contract",
        // icon: "fa fa-book",
        element: <ContractPage />
    },
    {
        path: getSchoolMenu(""),
        element: <SchoolItem/>
    },
    {
        path: getCapital(":id"),
        name: "capital",
        element: <CapitalPage />
    },

    {
        name: "Honalar",
        path: getRouteRooms(":id"),
        element: <Rooms />,
    },
    {
        name: "Zavxoz",
        path: getQuarterMaster(),
        element: <QuarterMaster />
    },

    {
        path: "calendar",
        element: <CalendarPage />,
    },
    // {
    //     name: "Time Table",
    //     path: "time/*",
    //     element: <TimeTableTuronPage/>,
    // },

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

    // {
    //     name: "capital category profile",
    //     path: getCapitalCategoryProfile(":id"),
    //     element: <CategoryProfile/>
    // },

    {
        name: "Registratsiya",
        path: getRouteRegister(),
        element: <Register />,
    },
    {
        name: "settings",
        path: `settings/*`,
        element: <Settings />,
    },
    {
        name: "Statistics",
        path: `Statistics/`,
        element: <StatisticsPage />,
    },
    {
        name: "rating",
        path: "rating",
        element: <RatingForTeachersPage />
    },
    {
        name: "parents",
        path: `parents/`,
        element: <ParentsPage />,
    },
    {
        name: "teacherAttendanceView",
        path: `teacherAttendance/:id`,
        element: <TeacherAttendanceView />,
    },
    {
        name: "daily report",
        path: "dailyReport",
        element: <DailyReportPage />
    },
    {
        path: getCvSubmissons(":id"),
        element: <CvSubmissions />
    },
    {
        path: getHomeMessage(":id"),
        element: <HomeMessages />
    },
    {
        path: getHomeNews(":id"),
        element: <NewsPage />
    },
    {
        name: "So'rovnoma natijalari",
        path: "surveyResults",
        element: <SurveyResultsPage />
    },
    {
        name: "O'qituvchini baholash",
        path: "teacherRating",
        element: <ContributionsPage />
    },
    {
        name: "O'qituvchini rivojlantirish",
        path: "development",
        element: <TeachersDevelopmentPage/>
    },
    {
        to: "capitalBox",
        name: "capitalInside",
        path: getCapitalInside(":id"),
        element: <CapitalInside/>

    },
    {
        to: "dashboard",
        name: "dashboard",
        path: getDashboard(),
        element: <DirectorDashboardPage/>
    },
    {
        name: "Teacher Observation",
        path: getTeacherObservation(),
        element: <TeacherObservationPage/>
    },
    {
        name: "Observation Detail",
        path: getObservationDetail(":observationId"),
        element: <ObservationDetailPage/>
    },
    {
        name: "Dars Rejasi",
        path: getLessonPlan(),
        element: <LessonPlanPage/>
    },
    {
        name: "Moliyaviy Dashboard",
        path: "financeDashboard",
        element: <FinanceDashboardPage/>
    },
    {
        name: "Ta'lim Sifati",
        path: getEducationQuality(),
        element: <EducationQualityPage/>
    },
    {
        name: "Ta'lim Sifati - Batafsil",
        path: getEducationQualityDetails(),
        element: <EducationQualityDetails/>
    },
    {
        name: "O'qituvchilar Statistikasi",
        path: getTeacherStatistics(),
        element: <TeacherStatisticsPage/>
    },
    {
        name: "Kunlik Dars Rejasi Hisoboti",
        path: getLessonPlanDailyReport(),
        element: <LessonPlanDailyReportPage/>
    },
    {
        name: "Dars Rejasi Tafsilotlari",
        path: getLessonPlanDetail(":teacherId"),
        element: <LessonPlanDetailPage/>
    }

]