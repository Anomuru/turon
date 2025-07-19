import React, {useState} from 'react';
import {Outlet} from "react-router";

import {SchoolHomeHeader} from "entities/schoolHome";
import {HomeContext} from "shared/lib/context/homeContext";


const LayoutWebsite = () => {

    const [sectionTop, setSectionTop] = useState({
        aboutUs: null,
        principalsSpotlight: null,
        studentProfile: null,
        teachingStaff: null,
        curricular: null,
        co_curricular: null,
        extra_curricular: null,
        academic_calendar: null,
        our_students: null,
        academic_champions: null,
        student_clubs: null,
        student_council: null,
    })

    return (
        <HomeContext.Provider value={{sectionTop, setSectionTop}}>
            <div style={{width: "100%", position: "relative"}}>
                <SchoolHomeHeader/>
                <Outlet/>
            </div>
        </HomeContext.Provider>
    );
};

export default LayoutWebsite;