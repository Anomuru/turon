import cls from "./shortTeacher.module.sass"
import React, {useState} from "react";
import {Radio} from "shared/ui/radio/index.js";
import {TeacherStatisticsPage} from "pages/teacherStatisticsPage/index.js";
import {DirectorDashboardPage} from "pages/directorDashboardPage/index.js";
import {RatingForTeachersPage} from "pages/ratingForTeachersPage/index.js";
import {TeachersDevelopmentPage} from "pages/teachersDevelopmentPage/index.js";
import {ContributionsPage} from "pages/contributionsPage/index.js";
import {SurveyResultsPage} from "pages/surveyResultsPage/index.js";
export const ShortTeacherData = () => {

    const [teacherItem , setTeacherItem] = useState("O'qituvchilar statistikasi")


    const renderPage = () => {
        switch (teacherItem){
            case "O'qituvchilar statistikasi" :
                return <TeacherStatisticsPage/>
            case "O'qituvchilar reytingi" :
                return <RatingForTeachersPage/>
            case "O'qituvchilarning malakasini oshirish" :
                return <TeachersDevelopmentPage/>
            case "O'qituvchilarni baholash" :
                return <ContributionsPage/>
            case "O'qituvchilar so'rovnomasi" :
                return <SurveyResultsPage/>
        }
    }

    return (
       <>
           <div className={cls.header}>
               {["O'qituvchilar statistikasi" , "O'qituvchilar reytingi" , "O'qituvchilarning malakasini oshirish" , "O'qituvchilarni baholash" , "O'qituvchilar so'rovnomasi"].map(item => (
                   <Radio
                       onChange={setTeacherItem}
                       children={item}
                       value={item}
                       checked={item === teacherItem}
                   />
               ))}
           </div>
           {renderPage()}
       </>
    );
};

