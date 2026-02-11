// import React, {memo, useEffect, useRef, useState} from "react";
// import {useSelector} from "react-redux";
// import classNames from "classnames";
// import {createPortal} from "react-dom";
// import {Swiper, SwiperSlide} from "swiper/react";
// import {Mousewheel} from "swiper/modules";
// import "swiper/css";
// import "swiper/css/pagination";

// import {
//     getTimeTableTuronForShow,
//     getTimeTableTuronLoading
// } from "pages/timeTable/model/selectors/timeTableTuronSelectors";
// import {EditableCard} from "shared/ui/editableCard";
// import {MiniLoader} from "shared/ui/miniLoader";

// import cls from "./teacherProfileTimeTable.module.sass";
// import location from "shared/assets/logo/location.svg";
// import roomImage from "shared/assets/logo/room.svg";

// export const TeacherProfileTimeTable = memo(() => {

    // const data = useSelector(getTimeTableTuronForShow);
    // const loading = useSelector(getTimeTableTuronLoading);
//     const containerRef = useRef(null);
//     const [mounted, setMounted] = useState(false);

//     useEffect(() => {
//         if (containerRef.current) setMounted(true);
//     }, [loading]);


//     const renderLessons = (data, isSlide = false) => {
//         return data.map(item => {
//             return (
//                 <div
//                     key={item.id}
//                     className={classNames(cls.lesson__inner, {
//                         [cls.isFlow]: item?.is_flow,
//                         [cls.isSlide]: isSlide,
//                     })}
//                 >
//                     <div className={cls.header}>
//                         <img
//                             className={cls.header__image}
//                             src={location}
//                             alt=""
//                         />
//                         <span className={cls.header__title}>
//                             Xona: {item?.room?.name}
//                         </span>
//                     </div>
//                     <div className={cls.header}>
//                         <img
//                             className={cls.header__image2}
//                             src={roomImage}
//                             alt=""
//                         />
//                         <span className={cls.header__title}>
//                             {item?.is_flow ? "Flow:" : "Class:"}:{" "}
//                             {item?.group?.name}
//                         </span>
//                     </div>
//                 </div>
//             )
//         })
//     }

//     return (
//         <EditableCard extraClass={cls.timetable} titleType={false}>
//             {
//                 loading
//                     ? <MiniLoader/>
//                     :
//                     <div className={cls.newTimeTable}>
//                         <div className={cls.wrapper}>
//                             <div
//                                 ref={containerRef }
//                                 id={"mainTimeTableContainer"}
//                                 className={cls.wrapper__header}
//                             >
//                                 <div className={cls.timeTitle}>
//                                     <h1 className={cls.timeTitle__inner}>Time</h1>
//                                 </div>
//                             </div>
//                             <div className={cls.wrapper__container}>
//                                 <div className={cls.newTimeTable__time}>
//                                     {data?.hours_list?.map((item) => (
//                                         <div key={item.id} className={cls.hour}>
//                                             <h1 className={cls.hour__inner}>
//                                                 <span className={cls.title}>{item?.start_time}</span> —{" "}
//                                                 <span className={cls.title}>{item?.end_time}</span>
//                                             </h1>
//                                         </div>
//                                     ))}
//                                 </div>

//                                 {data?.time_tables?.map((item) => (
//                                     <div key={item.id} className={cls.newTimeTable__weekDay}>
//                                         {mounted &&
//                                             createPortal(
//                                                 <div className={cls.weekTitle}>
//                                                     <h2 className={cls.weekTitle__subTitle}>
//                                                         {item?.weekday}
//                                                     </h2>
//                                                     <h1 className={cls.weekTitle__title}>
//                                                         {item?.date?.slice(8, 10)}
//                                                     </h1>
//                                                 </div>,
//                                                 containerRef.current
//                                             )}

//                                         {data?.hours_list?.map((hour) => {
//                                             const lessonsForHour = item?.rooms?.flatMap((room) =>
//                                                 room.lessons
//                                                     .filter((l) => l?.hours === hour?.id && l?.id)
//                                                     .map((lesson) => ({...lesson, room}))
//                                             );

//                                             if (!lessonsForHour || lessonsForHour.length === 0) {
//                                                 return (
//                                                     <div
//                                                         key={hour.id}
//                                                         className={classNames(cls.lesson, cls.empty)}
//                                                     >
//                                                         <h1 className={cls.empty__title}></h1>
//                                                     </div>
//                                                 );
//                                             }

//                                             if (lessonsForHour.length > 1) {
//                                                 return (
//                                                     <LessonSwiper
//                                                         hour={hour.id}
//                                                         lesson={lessonsForHour}
//                                                         renderLessons={renderLessons}
//                                                     />
//                                                 )
//                                             }


//                                             return (
//                                                 <div key={hour.id} className={cls.lesson}>
//                                                     {renderLessons(lessonsForHour)}
//                                                 </div>
//                                             );
//                                         })}
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>
//             }
//         </EditableCard>
//     );
// });

// const LessonSwiper = ({hour, lesson, renderLessons}) => {

//     const [currentSlide, setCurrentSlide] = useState(1)

//     const handleSlideChange = (swiper) => {
//         setCurrentSlide(swiper.activeIndex + 1)
//     }

//     return (
//         <Swiper
//             key={hour}
//             className={classNames(cls.lesson, cls.customSwiper)}
//             direction="vertical"
            // spaceBetween={20}
            // slidesPerView={1}
//             mousewheel={true}
//             modules={[Mousewheel]}
//             onSlideChange={handleSlideChange}
//         >
//             {lesson.map((item) => (
//                 <SwiperSlide
//                     key={item.id}
//                     className={cls.lesson__slide}
//                 >
//                     {renderLessons([item], true)}
//                 </SwiperSlide>
//             ))}
//             <span className={cls.customSwiper__slide}>{currentSlide} / {lesson.length}</span>
//         </Swiper>
//     )
// }

import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { Swiper, SwiperSlide } from "swiper/react"
import { useSelector } from "react-redux"
import { Pagination, Mousewheel } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"
import styles from "./teacherProfileTimeTable.module.sass"
import {
    getTimeTableTuronForShow,
    getTimeTableTuronLoading
} from "pages/timeTable/model/selectors/timeTableTuronSelectors"
import classNames from "classnames"

const Loader = () => (
  <div className={styles.loaderContainer}>
    <div className={styles.loader}></div>
  </div>
)

export const TeacherProfileTimeTable = () => {

    const data = useSelector(getTimeTableTuronForShow);
    const loading = useSelector(getTimeTableTuronLoading);
  const [mounted, setMounted] = useState(false)
  const headerRef = useRef(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (loading) {
    return <Loader />
  }

  if (!data || !data.time_tables || !data.hours_list) {
    return <div className={styles.error}>No data available</div>
  }

  const { time_tables, hours_list } = data
    console.log(data, "timetable data")

  // Get lessons for a specific hour and date
  const getLessonsForCell = (hourId, date) => {
    const dayData = time_tables.find((tt) => tt.date === date)
    if (!dayData || !dayData.rooms) return []

    const lessons = []
    dayData.rooms.forEach((room) => {
      if (room.lessons) {
        room.lessons.forEach((lesson) => {
          // Only include lessons that have an id field
          if (lesson.id && lesson.hours === hourId) {
            lessons.push({...lesson, roomName: room?.name})
          }
        })
      }
    })
    return lessons
  }

  const renderLessonCard = (lesson, index, total) => (
    <div key={lesson.id} className={styles.lessonCard}>
      <div className={styles.lessonContent}>
        <div className={styles.groupName}>{lesson.teacher?.name || "N/A"} {lesson.teacher?.surname || "N/A"}</div>
        <div className={styles.subjectName}>{lesson.subject?.name || "N/A"}</div>
        <div className={styles.roomName}>Room: {lesson?.roomName || "N/A"}</div>
      </div>
      <div className={classNames(styles.lessonCard__bg, {[styles.flow]: lesson?.is_flow})}>{lesson?.is_flow ? "Flow" : "Class"}</div>
      {/* {total > 1 && (
        <div className={styles.slideCounter}>
          {index + 1} / {total}
        </div>
      )} */}
    </div>
  )

  const renderCell = (hourId, date) => {
    const lessons = getLessonsForCell(hourId, date)

    

    if (lessons.length === 0) {
      return <div className={styles.emptyCell}></div>
    }

    if (lessons.length === 1) {
      return renderLessonCard(lessons[0], 0, 1)
    }

    // Multiple lessons - use Swiper
    return (
      <Swiper
        direction="vertical"
        pagination={{
          clickable: true,
        }}
        mousewheel={true}
        spaceBetween={20}
        slidesPerView={1}
        modules={[Pagination, Mousewheel]}
        className={styles.swiperContainer}
      >
        {lessons.map((lesson, index) => (
          <SwiperSlide key={lesson.id}>{renderLessonCard(lesson, index, lessons.length)}</SwiperSlide>
        ))}
      </Swiper>
    )
  }

  const DayHeaders = () => (
    <div className={styles.headerRow}>
      <div className={styles.timeHeaderCell}></div>
      {time_tables.map((day) => (
        <div key={day.date} className={styles.dayHeader}>
          <div className={styles.weekday}>{day.weekday}</div>
          <div className={styles.date}>{day.date}</div>
        </div>
      ))}
    </div>
  )

  return (
    <div className={styles.timeTableWrapper}>
      {mounted && headerRef.current && createPortal(<DayHeaders />, headerRef.current)}

      <div ref={headerRef} className={styles.headerPortal}></div>

      <div className={styles.timeTable}>
        <div className={styles.timeColumn}>
          {hours_list.map((hour) => (
            <div key={hour.id} className={styles.timeCell}>
              <div className={styles.startTime}>{hour.start_time}</div>
              <div className={styles.endTime}>{hour.end_time}</div>
            </div>
          ))}
        </div>

        <div className={styles.scheduleGrid}>
          {hours_list.map((hour) => (
            <div key={hour.id} className={styles.scheduleRow}>
              {time_tables.map((day) => (
                <div key={`${hour.id}-${day.date}`} className={styles.scheduleCell}>
                  {renderCell(hour.id, day.date)}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}




