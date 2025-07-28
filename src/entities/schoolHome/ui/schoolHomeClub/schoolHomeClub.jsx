import React, {useContext, useEffect, useRef} from 'react';
import cls from "../schoolHomeClub/schoolHomeClub.module.sass";
import clubFirstImg from 'shared/assets/images/club_1.svg'
import clubSecondImg from 'shared/assets/images/club_2.svg'
import {HomeContext} from "../../../../shared/lib/context/homeContext";

export const SchoolHomeClub = () => {
    const {setSectionTop} = useContext(HomeContext)

    const sectionRef = useRef()

    useEffect(() => {
        setSectionTop(cur => ({...cur, student_clubs: sectionRef?.current?.offsetTop}))
    }, [setSectionTop])

    return (
        <div ref={sectionRef} className={cls.club}>
            <div className={cls.club__title}>
                <h1>School club</h1>
                <div className={cls.club__locations}>
                    <span>Chirchiq</span>
                    <span>Chirchiq</span>
                    <span>Chirchiq</span>
                </div>
            </div>
            <div className={cls.club__container}>
                <div className={cls.club__container__cardBox}>
                    <img src={clubFirstImg} alt=""/>
                    <div className={cls.club__container__cardBox__contextBox}>
                        <h1>Graphis design (3RD & 4TH GRADE</h1>
                        <p>chool councils are policy-level advisory bodies to the Principal, Superintendent, and local
                            board of education. They may advise and make recommendations on any matter related to school
                            improvement and student achievement. The purpose of school councils is to “bring communities
                            and schools closer together in a spirit of cooperation to solve difficult education
                            problems, improve academic achievement, provide support for teachers and administrators, and
                            bring parents into the school-based decision-making process.improve academic achievement,
                            provide support for teachers and administrators, and bring parents into the school-based
                            decision-making process.</p>
                    </div>
                </div>
                <div className={cls.club__container__cardBox}>
                    <img src={clubSecondImg} alt=""/>
                    <div className={cls.club__container__cardBox__contextBox}>
                        <h1>Web design (3RD & 4TH GRADE</h1>
                        <p>chool councils are policy-level advisory bodies to the Principal, Superintendent, and local
                            board of education. They may advise and make recommendations on any matter related to school
                            improvement and student achievement. The purpose of school councils is to “bring communities
                            and schools closer together in a spirit of cooperation to solve difficult education
                            problems, improve academic achievement, provide support for teachers and administrators, and
                            bring parents into the school-based decision-making process.improve academic achievement,
                            provide support for teachers and administrators, and bring parents into the school-based
                            decision-making process.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
