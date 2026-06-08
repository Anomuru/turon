import cls from "./SchoolItem.module.sass"
import {Radio} from "shared/ui/radio/index.js";
import React, {useState} from "react";
import {CalendarPage} from "pages/calendarPage/index.js";
import {StudentsPage} from "pages/studentsPage/index.js";
import {TeachersPage} from "pages/teacherPage/index.js";
import {ParentList} from "entities/parents/index.js";
import {GroupsPage} from "pages/groupsPage/index.js";
import {VacancyList} from "entities/vacancy/ui/vacancyList/index.js";
import {TimeTableTuronPage} from "pages/timeTable/index.js";
export const SchoolItem = () => {

    const [radio , setRadio] = useState("Students")

    const renderPage = () => {
        switch (radio){
            case "Students" :
                return <StudentsPage/>
            case "Employers" :
                return <TeachersPage/>
            case "Parents" :
                return <ParentList/>
            case "Sinflar" :
                return <GroupsPage/>
            case "Vakansiyalar" :
                return <VacancyList/>
            case "Time Table" :
                return <TimeTableTuronPage/>
            case "Calendar" :
                return <CalendarPage/>
        }
    }
    return (
        <>
            <div className={cls.header}>
                {["Students" , "Employers" , "Parents" , "Vakansiyalar" , "Time Table" , "Calendar"].map(item => (
                    <Radio
                        onChange={setRadio}
                        children={item}
                        value={item}
                        checked={item === radio}
                    />

                ))}


            </div>
            {renderPage()}
        </>
    );
};

