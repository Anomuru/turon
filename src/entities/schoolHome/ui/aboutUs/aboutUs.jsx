import cls from "./aboutUs.module.sass"


import turonAbout from "shared/assets/images/logoturon1 2.svg"
import turonAbout2 from "shared/assets/images/about4.svg"
import turonAbout3 from "shared/assets/images/about5.svg"
import footerImg from "shared/assets/images/mahmudAka.svg"


import coreValue from "shared/assets/images/about12.svg"
import coreValue2 from "shared/assets/images/corevalue.svg"
import coreValue3 from "shared/assets/images/corevalue2.svg"
import coreValue4 from "shared/assets/images/corevalue4svg.svg"
import coreValue6 from "shared/assets/images/corevalue5svg.svg"
import coreValue7 from "shared/assets/images/corevalue7.svg"
import coreValue8 from "shared/assets/images/corevalue8.svg"
import coreValue9 from "shared/assets/images/corevalue10.svg"
import {getSchoolLeaderShip} from "../../model/selector/schoolLeaderShipSelector";
import {useSelector} from "react-redux";
import {useContext, useEffect, useRef} from "react";
import {HomeContext} from "../../../../shared/lib/context/homeContext";


const data = [
    {
        name: "Inclusivity",
        label: "- We foster an environment where every individual is respected and valued for their unique contributions.",
        img: coreValue
    },
    {
        name: "Resilience",
        label: "- We teach our students to overcome challenges with perseverance and grit.",
        img: coreValue2
    },
    {
        name: "Integrity",
        label: " - We act with honesty, transparency, and fairness in all endeavors.",
        img: coreValue3
    },
    {
        name: "Innovation",
        label: "- We encourage creativity and forward-thinking to solve challenges and seize opportunities.",
        img: coreValue4
    },
    {
        name: "Excellence",
        label: "- We pursue excellence through dedication, persistence, and continuous improvement.",
        img: coreValue6
    },
    {
        name: "Well-being",
        label: "- We nurture the mental, emotional, and physical health of our students and staff.",
        img: coreValue7
    },
    {
        name: "Lifelong Learning",
        label: "- We cultivate a love for learning that extends beyond the classroom and throughout life.",
        img: coreValue8
    },
    {
        name: "Collaboration",
        label: "- We promote teamwork and mutual support to achieve shared goals.",
        img: coreValue9
    },
]


const location = [
    "chirchiq",
    "sergeli",
    "Xo’jakent"
]
export const AboutUs = () => {
    return (
        <div className={cls.aboutMain}>
            <AboutMain/>
            <CoreValues/>
            <SchoolLeadershipTeam/>
            <AboutFooter/>
        </div>
    );
};


export const AboutMain = () => {
    const {setSectionTop} = useContext(HomeContext)

    const sectionRef = useRef()

    useEffect(() => {
        setSectionTop(cur => ({...cur, aboutUs: sectionRef?.current?.offsetTop}))
    }, [setSectionTop])

    return (
        <div ref={sectionRef} className={cls.about}>


            <div className={cls.about__wrapper}>
                <div className={`${cls.about__box} ${cls.about__box_last}`}>
                    <div className={cls.about__info}>
                        <div className={cls.about__title}>
                            About us
                        </div>


                        <div className={cls.about__descr}>
                            Turon International School is a premier educational institution offering a globally
                            recognized
                            curriculum with a strong focus on STEM (Science, Technology, Engineering, and Mathematics)
                            education. Our programs are designed to nurture innovation, critical thinking, and academic
                            excellence, preparing students for success in a rapidly changing world. We prioritize
                            student
                            well-being through a supportive and inclusive environment, ensuring their emotional, mental,
                            and
                            physical development alongside academic growth. Turon International School is committed to
                            fostering future-ready learners and global citizens.
                        </div>
                    </div>
                    <div className={cls.about__logo} >
                        <img src={turonAbout} alt=""/>
                    </div>
                </div>
                <div className={cls.about__box}>
                    <div className={cls.about__box_img}>
                        <img src={turonAbout2}  alt=""/>
                    </div>

                    <div className={cls.about__info}>
                        <div className={cls.about__title}>
                            Our vision
                        </div>


                        <div className={cls.about__descr}>
                            Our vision at Turon International School is to be a pioneering institution in Uzbekistan,
                            renowned for excellence in STEM and IT education. We aim to foster a community of innovative
                            thinkers and global leaders, equipped with the knowledge and skills to shape the future. Our
                            commitment is to provide an inspiring and technologically advanced learning environment
                            where students are empowered to discover their passions, pursue excellence, and make
                            meaningful contributions to the world.
                        </div>
                    </div>
                </div>
                <div className={`${cls.about__box} ${cls.about__box_last}`}>


                    <div className={cls.about__info}>
                        <div className={cls.about__title}>
                            MISSION
                        </div>


                        <div className={cls.about__descr}>
                            The mission of Turon International School is to provide an exceptional education in science,
                            technology, engineering, and mathematics, integrated with information technology, to
                            students in Uzbekistan. We are dedicated to nurturing critical thinking, creativity, and a
                            love for learning in our students. Our approach combines rigorous academic standards with
                            practical, hands-on experience, ensuring our students are prepared for higher education and
                            careers in a rapidly evolving global landscape. We commit to cultivating a diverse and
                            inclusive community that respects individual differences and fosters collaboration,
                            innovation, and ethical responsibility.
                        </div>
                    </div>

                    <div className={cls.about__box_img}>
                        <img src={turonAbout3}  alt=""/>
                    </div>

                </div>


            </div>

        </div>
    )
}


export const CoreValues = () => {
    const {setSectionTop} = useContext(HomeContext)

    const sectionRef = useRef()

    useEffect(() => {
        setSectionTop(cur => ({...cur, principalsSpotlight: sectionRef?.current?.offsetTop}))
    }, [setSectionTop])

    return (
        <div ref={sectionRef} className={cls.coreValue}>
            <div className={cls.coreValue__title}>
                Core Values
            </div>


            <div className={cls.coreValue__wrapper}>

                {data.map(item => (
                    <div className={cls.coreValue__box}>
                        <div className={cls.coreValue__img}>
                            <img src={item.img} alt=""/>
                        </div>


                        <div className={cls.coreValue__box_descr}>
                            <h2>{item.name}</h2>
                            <span>{item.label}</span>
                        </div>
                    </div>
                ))}


            </div>


        </div>
    )
}


export const SchoolLeadershipTeam = () => {
    const {setSectionTop} = useContext(HomeContext)

    const sectionRef = useRef()

    useEffect(() => {
        setSectionTop(cur => ({...cur, studentProfile: sectionRef?.current?.offsetTop}))
    }, [setSectionTop])

    const leaderShip = useSelector(getSchoolLeaderShip)

    const renderDate = () => {
        return leaderShip.map(item => (
            <div className={cls.leaderShip__wrapper_box}>
                <img src={item.img} alt=""/>

                <div className={cls.leaderShip__wrapper_box_info}>
                    <div className={cls.leaderShip__wrapper_box_info_name}>
                        {item.name}
                    </div>
                    <div className={cls.leaderShip__wrapper_box_info_job}>
                        {item.job}
                    </div>
                    <div className={cls.leaderShip__wrapper_box_info_descr}>
                        {item.descr}
                    </div>
                </div>

            </div>
        ))
    }


    const locationRender = () => {
        return location.map(item => (
            <div className={cls.leaderShip__subHeader_location_box}>
                {item}
            </div>
        ))
    }

    const render = renderDate()

    return (
        <div ref={sectionRef} className={cls.leaderShip}>
            <div className={cls.leaderShip__header}>
                <div className={cls.leaderShip__header_span}>
                    OUR TEAM
                </div>
                <div className={cls.leaderShip__header_title}>
                    Teaching staff
                </div>
                <div className={cls.leaderShip__header_descr}>
                    Our teaching staff are dedicated professionals committed to supporting every student. They strive to
                    create an inclusive and inspiring learning environment that nurtures innovation, creativity, and
                    leadership. By fostering critical thinking and encouraging intellectual curiosity, they aim to
                    empower students to become future leaders in their chosen fields, equipped with the skills and
                    confidence to excel in a dynamic world
                </div>
            </div>

            <div className={cls.leaderShip__wrapper}>
                <div className={cls.leaderShip__subHeader}>
                    <div className={cls.leaderShip__subHeader_title}>

                        Teaching staff
                    </div>
                    <div className={cls.leaderShip__subHeader_location}>
                        {locationRender()}
                    </div>
                </div>
                {render}
            </div>

        </div>
    );
};


export const AboutFooter = () => {
    const {setSectionTop} = useContext(HomeContext)

    const sectionRef = useRef()

    useEffect(() => {
        setSectionTop(cur => ({...cur, teachingStaff: sectionRef?.current?.offsetTop}))
    }, [setSectionTop])

    return (
        <div ref={sectionRef} className={cls.footer}>

            <img src={footerImg} alt=""/>


            <div className={cls.footer__wrapper}>
                <div className={cls.footer__wrapper_title}>
                    Meet Our Founder: Sal Khan
                </div>
                <div className={cls.footer__wrapper_descr}>
                    In 2012, when writing The One World Schoolhouse, I outlined how modern education developed and how
                    Khan Academy came to be. But, most importantly, the book outlines a vision for the future of both
                    in-person and online education given the tools we have and the need for many more people to
                    participate in the knowledge economy. Two years later, I founded Khan Lab School to test and refine
                    these ideas in an actual school setting. Today, our school has grown to encompass a Lower School
                    (K-5th), a Middle School (6th-8th) and an Upper School (9th-12th) that collectively serve over 280
                    students.
                </div>

                <div className={cls.footer__wrapper_list}>
                    <div className={cls.footer__wrapper_list_title}>
                        From our founding, the core ideas of the school have been:
                    </div>
                    <ul>


                        <li> • The personalization of pace with high expectations</li>
                        <li> • Opportunities for students to learn from one another</li>
                        <li> • Giving students the opportunity and tools to fill in their knowledge gaps and improve their
                            achievement
                        </li>
                        <li> • Learning that is not bound by time or space, and</li>
                        <li> • Blurring the arbitrary boundaries between elementary school, middle school, high school and
                            college
                        </li>
                    </ul>
                </div>
                <div className={cls.footer__wrapper_descr}>
                    We believe in focusing on what really matters for students’ lives (i.e., no busy work!). This
                    enables content knowledge, skill development, applied learning opportunities and collaboration to
                    reinforce each other rather than be in competition with each other. We value focusing on fewer
                    authentic student-driven applied experiences over many artificial, cookie cutter ones. We believe
                    that students can be extremely competitive in the broader world without having to be competitive
                    with their peers. Most importantly, we believe that student agency, mindfulness and resilience are
                    the most important skills in a world with too many stressed young people lacking a sense of purpose.
                </div>

                <div className={cls.footer__wrapper_descr}>
                    At Khan Lab School, all of our decisions are made through the lens of what is best for our students.
                    We tackle tough questions without ego, are results oriented, and have high expectations for our
                    school and our students.
                </div>

                <div className={cls.footer__wrapper_descr}>
                    Thanks for your interest in Khan Lab School. We look forward to getting to know you through our
                    application process.
                </div>


            </div>

        </div>
    );
}