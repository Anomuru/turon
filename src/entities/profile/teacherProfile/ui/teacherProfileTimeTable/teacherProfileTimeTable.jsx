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


// import { useState, useEffect, useRef, useMemo } from "react"
// import { createPortal } from "react-dom"
// import { Swiper, SwiperSlide } from "swiper/react"
// import { useSelector } from "react-redux"
// import { Pagination, Mousewheel } from "swiper/modules"
// import { motion, AnimatePresence } from "framer-motion"
// import { MapPin, Clock, Users, Zap } from "lucide-react"
// import "swiper/css"
// import "swiper/css/pagination"
// import styles from "./teacherProfileTimeTable.module.sass"
// import {
//   getTimeTableTuronForShow,
//   getTimeTableTuronLoading,
// } from "pages/timeTable/model/selectors/timeTableTuronSelectors"
// import classNames from "classnames"
//
// // ─── Constants ──────────────────────────────────────────────────────────────
// const BREAK_IDS = new Set([92, 122, 128])
// const BREAK_NAMES = { 92: "Breakfast", 122: "Lunch", 128: "Rest" }
//
// const SUBJECT_PALETTES = [
//   { accent: "#6366f1", bg: "rgba(99,102,241,0.08)", light: "#ede9fe" },
//   { accent: "#10b981", bg: "rgba(16,185,129,0.08)", light: "#d1fae5" },
//   { accent: "#f59e0b", bg: "rgba(245,158,11,0.08)",  light: "#fef3c7" },
//   { accent: "#8b5cf6", bg: "rgba(139,92,246,0.08)",  light: "#ede9fe" },
//   { accent: "#ec4899", bg: "rgba(236,72,153,0.08)",  light: "#fce7f3" },
//   { accent: "#14b8a6", bg: "rgba(20,184,166,0.08)",  light: "#ccfbf1" },
//   { accent: "#f97316", bg: "rgba(249,115,22,0.08)",  light: "#ffedd5" },
// ]
// const paletteMap = {}
// let paletteIdx = 0
// function getPalette(subjectId) {
//   if (!paletteMap[subjectId]) {
//     paletteMap[subjectId] = SUBJECT_PALETTES[paletteIdx % SUBJECT_PALETTES.length]
//     paletteIdx++
//   }
//   return paletteMap[subjectId]
// }
//
// function initials(name = "", surname = "") {
//   return `${name[0] ?? ""}${surname[0] ?? ""}`.toUpperCase() || "?"
// }
//
// function getToday() {
//   return new Date().toISOString().slice(0, 10)
// }
//
// // ─── Skeleton ───────────────────────────────────────────────────────────────
// const Skeleton = () => (
//     <div className={styles.skeletonWrap}>
//       <div className={styles.skeletonHeader}>
//         {[...Array(7)].map((_, i) => (
//             <div key={i} className={styles.skeletonDay} />
//         ))}
//       </div>
//       {[...Array(6)].map((_, r) => (
//           <div key={r} className={styles.skeletonRow}>
//             <div className={styles.skeletonTime} />
//             {[...Array(7)].map((_, c) => (
//                 <div key={c} className={classNames(styles.skeletonCell, { [styles.skeletonFilled]: Math.random() > 0.7 })} />
//             ))}
//           </div>
//       ))}
//     </div>
// )
//
// // ─── Lesson Card ─────────────────────────────────────────────────────────────
// const LessonCard = ({ lesson, index, isCurrentLesson }) => {
//   const palette = getPalette(lesson.subject?.id)
//   const teacher = `${lesson.teacher?.name ?? ""} ${lesson.teacher?.surname ?? ""}`.trim()
//   const ini = initials(lesson.teacher?.name, lesson.teacher?.surname)
//
//   return (
//       <motion.div
//           className={classNames(styles.lessonCard, { [styles.currentLesson]: isCurrentLesson })}
//           style={{ "--accent": palette.accent, "--accent-bg": palette.bg, "--accent-light": palette.light }}
//           initial={{ opacity: 0, y: 6 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: index * 0.04, duration: 0.25 }}
//           whileHover={{ y: -2, transition: { duration: 0.15 } }}
//       >
//         <div className={styles.cardAccentBar} />
//         <div className={styles.cardTop}>
//           <div className={styles.subjectChip}>
//             {lesson.subject?.name || "—"}
//           </div>
//           <div className={styles.avatar} style={{ background: palette.light, color: palette.accent }}>
//             {ini}
//           </div>
//         </div>
//         <div className={styles.teacherName}>{teacher || "—"}</div>
//         <div className={styles.cardBottom}>
//         <span className={styles.roomPill}>
//           <MapPin size={9} />
//           {lesson.roomName || "—"}
//         </span>
//           <span className={classNames(styles.typePill, lesson.is_flow ? styles.flowPill : styles.classPill)}>
//           {lesson.is_flow ? <><Zap size={9} /> Flow</> : <><Users size={9} /> Class</>}
//         </span>
//         </div>
//         {isCurrentLesson && <div className={styles.liveIndicator}><span />Live</div>}
//       </motion.div>
//   )
// }
//
// // ─── Main Component ──────────────────────────────────────────────────────────
// export const TeacherProfileTimeTable = () => {
//   const data = useSelector(getTimeTableTuronForShow)
//   const loading = useSelector(getTimeTableTuronLoading)
//   const [mounted, setMounted] = useState(false)
//   const [currentTime, setCurrentTime] = useState(new Date())
//   const headerRef = useRef(null)
//   const today = getToday()
//
//   useEffect(() => { setMounted(true) }, [])
//   useEffect(() => {
//     const t = setInterval(() => setCurrentTime(new Date()), 60000)
//     return () => clearInterval(t)
//   }, [])
//
//   // Build lesson lookup
//   const lessonMap = useMemo(() => {
//     if (!data?.time_tables) return {}
//     const map = {}
//     data.time_tables.forEach(day => {
//       map[day.date] = {}
//       ;(day.rooms || []).forEach(room => {
//         ;(room.lessons || []).forEach(lesson => {
//           if (lesson.id && lesson.status) {
//             if (!map[day.date][lesson.hours]) map[day.date][lesson.hours] = []
//             map[day.date][lesson.hours].push({ ...lesson, roomName: room.name })
//           }
//         })
//       })
//     })
//     return map
//   }, [data])
//
//   const getCurrentHourId = () => {
//     if (!data?.hours_list) return null
//     const now = currentTime
//     const hhmm = `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`
//     return data.hours_list.find(h => hhmm >= h.start_time && hhmm < h.end_time)?.id ?? null
//   }
//
//   if (loading) return <Skeleton />
//   if (!data?.time_tables || !data?.hours_list)
//     return (
//         <div className={styles.emptyState}>
//           <Clock size={40} />
//           <p>No schedule available</p>
//         </div>
//     )
//
//   const { time_tables, hours_list } = data
//   const currentHourId = getCurrentHourId()
//
//   const DayHeaders = () => (
//       <div className={styles.headerRow}>
//         <div className={styles.timeHeaderCell} />
//         {time_tables.map((day) => {
//           const isToday = day.date === today
//           const [, m, d] = day.date.split("-")
//           return (
//               <div key={day.date} className={classNames(styles.dayHeader, { [styles.todayHeader]: isToday })}>
//                 <span className={styles.weekdayLabel}>{day.weekday}</span>
//                 <span className={classNames(styles.dateChip, { [styles.todayChip]: isToday })}>
//               {parseInt(d)}/{parseInt(m)}
//             </span>
//                 {isToday && <span className={styles.todayDot} />}
//               </div>
//           )
//         })}
//       </div>
//   )
//
//   return (
//       <div className={styles.wrapper}>
//         {mounted && headerRef.current && createPortal(<DayHeaders />, headerRef.current)}
//         <div ref={headerRef} className={styles.headerPortal} />
//
//         <div className={styles.tableBody}>
//           {/* Time column */}
//           <div className={styles.timeColumn}>
//             {hours_list.map((hour) => {
//               const isBreak = BREAK_IDS.has(hour.id)
//               const isCurrent = hour.id === currentHourId
//               return (
//                   <div key={hour.id} className={classNames(styles.timeCell, {
//                     [styles.timeCellBreak]: isBreak,
//                     [styles.timeCellCurrent]: isCurrent,
//                   })}>
//                     {isBreak ? (
//                         <span className={styles.breakLabel}>{BREAK_NAMES[hour.id]}</span>
//                     ) : (
//                         <>
//                           <span className={styles.timeStart}>{hour.start_time}</span>
//                           <span className={styles.timeEnd}>{hour.end_time}</span>
//                         </>
//                     )}
//                     {isCurrent && <div className={styles.currentTimeLine} />}
//                   </div>
//               )
//             })}
//           </div>
//
//           {/* Schedule grid */}
//           <div className={styles.scheduleGrid}>
//             {hours_list.map((hour) => {
//               const isBreak = BREAK_IDS.has(hour.id)
//               const isCurrent = hour.id === currentHourId
//               return (
//                   <div key={hour.id} className={classNames(styles.scheduleRow, {
//                     [styles.scheduleRowBreak]: isBreak,
//                     [styles.scheduleRowCurrent]: isCurrent,
//                   })}>
//                     {time_tables.map((day) => {
//                       const isToday = day.date === today
//                       const lessons = lessonMap[day.date]?.[hour.id] ?? []
//
//                       return (
//                           <div key={`${hour.id}-${day.date}`} className={classNames(styles.scheduleCell, {
//                             [styles.scheduleCellToday]: isToday,
//                             [styles.scheduleCellBreak]: isBreak,
//                           })}>
//                             {lessons.length === 0 ? (
//                                 <div className={classNames(styles.emptyCell, { [styles.emptyCellBreak]: isBreak })} />
//                             ) : lessons.length === 1 ? (
//                                 <LessonCard lesson={lessons[0]} index={0} isCurrentLesson={isCurrent && isToday} />
//                             ) : (
//                                 <Swiper
//                                     direction="vertical"
//                                     pagination={{ clickable: true }}
//                                     mousewheel={true}
//                                     spaceBetween={0}
//                                     slidesPerView={1}
//                                     modules={[Pagination, Mousewheel]}
//                                     className={styles.swiperContainer}
//                                 >
//                                   {lessons.map((lesson, i) => (
//                                       <SwiperSlide key={lesson.id}>
//                                         <LessonCard lesson={lesson} index={i} isCurrentLesson={isCurrent && isToday} />
//                                       </SwiperSlide>
//                                   ))}
//                                 </Swiper>
//                             )}
//                           </div>
//                       )
//                     })}
//                   </div>
//               )
//             })}
//           </div>
//         </div>
//       </div>
//   )
// }

// import { useState, useEffect, useRef } from "react"
// import { createPortal } from "react-dom"
// import { Swiper, SwiperSlide } from "swiper/react"
// import { useSelector } from "react-redux"
// import { Pagination, Mousewheel } from "swiper/modules"
// import "swiper/css"
// import "swiper/css/pagination"
// import styles from "./teacherProfileTimeTable.module.sass"
// import {
//     getTimeTableTuronForShow,
//     getTimeTableTuronLoading
// } from "pages/timeTable/model/selectors/timeTableTuronSelectors"
// import classNames from "classnames"
//
// const Loader = () => (
//   <div className={styles.loaderContainer}>
//     <div className={styles.loader}></div>
//   </div>
// )
//
// export const TeacherProfileTimeTable = () => {
//
//     const data = useSelector(getTimeTableTuronForShow);
//     const loading = useSelector(getTimeTableTuronLoading);
//   const [mounted, setMounted] = useState(false)
//   const headerRef = useRef(null)
//
//   useEffect(() => {
//     setMounted(true)
//   }, [])
//
//   if (loading) {
//     return <Loader />
//   }
//
//   if (!data || !data.time_tables || !data.hours_list) {
//     return <div className={styles.error}>No data available</div>
//   }
//
//   const { time_tables, hours_list } = data
//     console.log(data, "timetable data")
//
//   // Get lessons for a specific hour and date
//   const getLessonsForCell = (hourId, date) => {
//     const dayData = time_tables.find((tt) => tt.date === date)
//     if (!dayData || !dayData.rooms) return []
//
//     const lessons = []
//     dayData.rooms.forEach((room) => {
//       if (room.lessons) {
//         room.lessons.forEach((lesson) => {
//           // Only include lessons that have an id field
//           if (lesson.id && lesson.hours === hourId) {
//             lessons.push({...lesson, roomName: room?.name})
//           }
//         })
//       }
//     })
//     return lessons
//   }
//
//   const renderLessonCard = (lesson, index, total) => (
//     <div key={lesson.id} className={styles.lessonCard}>
//       <div className={styles.lessonContent}>
//         <div className={styles.groupName}>{lesson.teacher?.name || "N/A"} {lesson.teacher?.surname || "N/A"}</div>
//         <div className={styles.subjectName}>{lesson.subject?.name || "N/A"}</div>
//         <div className={styles.roomName}>Room: {lesson?.roomName || "N/A"}</div>
//       </div>
//       <div className={classNames(styles.lessonCard__bg, {[styles.flow]: lesson?.is_flow})}>{lesson?.is_flow ? "Flow" : "Class"}</div>
//       {/* {total > 1 && (
//         <div className={styles.slideCounter}>
//           {index + 1} / {total}
//         </div>
//       )} */}
//     </div>
//   )
//
//   const renderCell = (hourId, date) => {
//     const lessons = getLessonsForCell(hourId, date)
//
//
//
//     if (lessons.length === 0) {
//       return <div className={styles.emptyCell}></div>
//     }
//
//     if (lessons.length === 1) {
//       return renderLessonCard(lessons[0], 0, 1)
//     }
//
//     // Multiple lessons - use Swiper
//     return (
//       <Swiper
//         direction="vertical"
//         pagination={{
//           clickable: true,
//         }}
//         mousewheel={true}
//         spaceBetween={20}
//         slidesPerView={1}
//         modules={[Pagination, Mousewheel]}
//         className={styles.swiperContainer}
//       >
//         {lessons.map((lesson, index) => (
//           <SwiperSlide key={lesson.id}>{renderLessonCard(lesson, index, lessons.length)}</SwiperSlide>
//         ))}
//       </Swiper>
//     )
//   }
//
//   const DayHeaders = () => (
//     <div className={styles.headerRow}>
//       <div className={styles.timeHeaderCell}></div>
//       {time_tables.map((day) => (
//         <div key={day.date} className={styles.dayHeader}>
//           <div className={styles.weekday}>{day.weekday}</div>
//           <div className={styles.date}>{day.date}</div>
//         </div>
//       ))}
//     </div>
//   )
//
//   return (
//     <div className={styles.timeTableWrapper}>
//       {mounted && headerRef.current && createPortal(<DayHeaders />, headerRef.current)}
//
//       <div ref={headerRef} className={styles.headerPortal}></div>
//
//       <div className={styles.timeTable}>
//         <div className={styles.timeColumn}>
//           {hours_list.map((hour) => (
//             <div key={hour.id} className={styles.timeCell}>
//               <div className={styles.startTime}>{hour.start_time}</div>
//               <div className={styles.endTime}>{hour.end_time}</div>
//             </div>
//           ))}
//         </div>
//
//         <div className={styles.scheduleGrid}>
//           {hours_list.map((hour) => (
//             <div key={hour.id} className={styles.scheduleRow}>
//               {time_tables.map((day) => (
//                 <div key={`${hour.id}-${day.date}`} className={styles.scheduleCell}>
//                   {renderCell(hour.id, day.date)}
//                 </div>
//               ))}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// }


import {useEffect, useMemo, useRef, useState} from "react"
import {createPortal} from "react-dom"
import {Swiper, SwiperSlide} from "swiper/react"
import {useSelector} from "react-redux"
import {Mousewheel, Pagination} from "swiper/modules"
import {motion} from "framer-motion"
import {Clock, MapPin, Users, Zap} from "lucide-react"
import "swiper/css"
import "swiper/css/pagination"
import styles from "./teacherProfileTimeTable.module.sass"
import {
    getTimeTableTuronForShow,
    getTimeTableTuronLoading,
} from "pages/timeTable/model/selectors/timeTableTuronSelectors"
import classNames from "classnames"

// ─── Subject color palettes ──────────────────────────────────────────────────
const PALETTES = [
    {accent: "#6366f1", bg: "rgba(99,102,241,0.08)", light: "#ede9fe"},
    {accent: "#10b981", bg: "rgba(16,185,129,0.08)", light: "#d1fae5"},
    {accent: "#f59e0b", bg: "rgba(245,158,11,0.08)", light: "#fef3c7"},
    {accent: "#8b5cf6", bg: "rgba(139,92,246,0.08)", light: "#ede9fe"},
    {accent: "#ec4899", bg: "rgba(236,72,153,0.08)", light: "#fce7f3"},
    {accent: "#14b8a6", bg: "rgba(20,184,166,0.08)", light: "#ccfbf1"},
    {accent: "#f97316", bg: "rgba(249,115,22,0.08)", light: "#ffedd5"},
]
const paletteMap = {}
let paletteIdx = 0

function getPalette(subjectId) {
    if (!paletteMap[subjectId]) {
        paletteMap[subjectId] = PALETTES[paletteIdx % PALETTES.length]
        paletteIdx++
    }
    return paletteMap[subjectId]
}

function initials(name = "", surname = "") {
    return `${name[0] ?? ""}${surname[0] ?? ""}`.toUpperCase() || "?"
}

function getToday() {
    return new Date().toISOString().slice(0, 10)
}

// ─── Skeleton ────────────────────────────────────────────────────────────────
const Skeleton = () => (
    <div className={styles.skeletonWrap}>
        <div className={styles.skeletonHeader}>
            {[...Array(7)].map((_, i) => <div key={i} className={styles.skeletonDay}/>)}
        </div>
        {[...Array(7)].map((_, r) => (
            <div key={r} className={styles.skeletonRow}>
                <div className={styles.skeletonTime}/>
                {[...Array(7)].map((_, c) => (
                    <div key={c}
                         className={classNames(styles.skeletonCell, {[styles.skeletonFilled]: (r + c) % 5 === 0})}/>
                ))}
            </div>
        ))}
    </div>
)

// ─── Lesson Card ─────────────────────────────────────────────────────────────
const LessonCard = ({lesson, index, isCurrentLesson}) => {
    const palette = getPalette(lesson.subject?.id)
    const teacher = `${lesson.teacher?.name ?? ""} ${lesson.teacher?.surname ?? ""}`.trim()
    const ini = initials(lesson.teacher?.name, lesson.teacher?.surname)

    return (
        <motion.div
            className={classNames(styles.lessonCard, {[styles.currentLesson]: isCurrentLesson})}
            style={{"--accent": palette.accent, "--accent-bg": palette.bg, "--accent-light": palette.light}}
            initial={{opacity: 0, y: 4}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: index * 0.03, duration: 0.2}}
            whileHover={{y: -2, transition: {duration: 0.15}}}
        >
            <div className={styles.cardAccentBar}/>

            <div className={styles.cardTop}>
                <span className={styles.subjectChip}>{lesson.subject?.name || "—"}</span>
                {/*<div className={styles.avatar} style={{ background: palette.light, color: palette.accent }}>*/}
                {/*  {ini}*/}
                {/*</div>*/}
                <span className={styles.roomPill}>
                    <MapPin size={9}/>
                    {lesson.roomName || "—"}
                </span>
            </div>

            <div style={{display: "flex", alignItems: "center", gap: 10}}>
                <div className={styles.teacherName}>{teacher || "—"}</div>

                <span className={classNames(styles.typePill, lesson.is_flow ? styles.flowPill : styles.classPill)}>
                 {lesson.is_flow ? <><Zap size={9}/>Flow</> : <><Users size={9}/>Class</>}
            </span>
            </div>

            {isCurrentLesson && (
                <div className={styles.liveDot}><span/><span className={styles.liveText}>Live</span></div>
            )}
        </motion.div>
    )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export const TeacherProfileTimeTable = () => {
    const data = useSelector(getTimeTableTuronForShow)
    const loading = useSelector(getTimeTableTuronLoading)
    const [mounted, setMounted] = useState(false)
    const [now, setNow] = useState(new Date())
    const headerRef = useRef(null)
    const today = getToday()

    useEffect(() => {
        setMounted(true)
    }, [])
    useEffect(() => {
        const t = setInterval(() => setNow(new Date()), 60_000)
        return () => clearInterval(t)
    }, [])

    const lessonMap = useMemo(() => {
        if (!data?.time_tables) return {}
        const map = {}
        data.time_tables.forEach(day => {
            map[day.date] = {}
            ;(day.rooms || []).forEach(room => {
                ;(room.lessons || []).forEach(lesson => {
                    if (lesson.id && lesson.status) {
                        if (!map[day.date][lesson.hours]) map[day.date][lesson.hours] = []
                        map[day.date][lesson.hours].push({...lesson, roomName: room.name})
                    }
                })
            })
        })
        return map
    }, [data])

    const currentHourId = useMemo(() => {
        if (!data?.hours_list) return null
        const hhmm = now.toTimeString().slice(0, 5)
        return data.hours_list.find(h => hhmm >= h.start_time && hhmm < h.end_time)?.id ?? null
    }, [data, now])

    if (loading) return <Skeleton/>
    if (!data?.time_tables || !data?.hours_list)
        return (
            <div className={styles.emptyState}>
                <Clock size={36}/>
                <p>No schedule available</p>
            </div>
        )

    const {time_tables, hours_list} = data

    const DayHeaders = () => (
        <div className={styles.headerRow}>
            <div className={styles.timeHeaderCell}/>
            {time_tables.map(day => {
                const isToday = day.date === today
                const [, m, d] = day.date.split("-")
                return (
                    <div key={day.date} className={classNames(styles.dayHeader, {[styles.todayHeader]: isToday})}>
                        <span className={styles.weekdayLabel}>{day.weekday}</span>
                        <span className={classNames(styles.dateNum, {[styles.todayNum]: isToday})}>
              {parseInt(d)}/{parseInt(m)}
            </span>
                        {isToday && <span className={styles.todayDot}/>}
                    </div>
                )
            })}
        </div>
    )

    return (
        <div className={styles.wrapper}>
            {mounted && headerRef.current && createPortal(<DayHeaders/>, headerRef.current)}
            <div ref={headerRef} className={styles.headerPortal}/>

            <div className={styles.tableBody}>
                {/* Time column */}
                <div className={styles.timeColumn}>
                    {hours_list.map(hour => (
                        <div key={hour.id} className={classNames(styles.timeCell, {
                            [styles.timeCellCurrent]: hour.id === currentHourId,
                        })}>
                            <span className={styles.timeStart}>{hour.start_time}</span>
                            <span className={styles.timeEnd}>{hour.end_time}</span>
                            {hour.id === currentHourId && <div className={styles.currentLine}/>}
                        </div>
                    ))}
                </div>

                {/* Grid */}
                <div className={styles.scheduleGrid}>
                    {hours_list.map(hour => {
                        const isCurrent = hour.id === currentHourId
                        return (
                            <div key={hour.id} className={classNames(styles.scheduleRow, {
                                [styles.scheduleRowCurrent]: isCurrent,
                            })}>
                                {time_tables.map(day => {
                                    const isToday = day.date === today
                                    const lessons = lessonMap[day.date]?.[hour.id] ?? []
                                    return (
                                        <div key={`${hour.id}-${day.date}`} className={classNames(styles.scheduleCell, {
                                            [styles.scheduleCellToday]: isToday,
                                        })}>
                                            {lessons.length === 0 ? (
                                                <div className={styles.emptyCell}/>
                                            ) : lessons.length === 1 ? (
                                                <LessonCard lesson={lessons[0]} index={0}
                                                            isCurrentLesson={isCurrent && isToday}/>
                                            ) : (
                                                <Swiper
                                                    direction="vertical"
                                                    pagination={{clickable: true}}
                                                    mousewheel={true}
                                                    slidesPerView={1}
                                                    modules={[Pagination, Mousewheel]}
                                                    className={styles.swiperContainer}
                                                >
                                                    {lessons.map((lesson, i) => (
                                                        <SwiperSlide key={lesson.id}>
                                                            <LessonCard lesson={lesson} index={i}
                                                                        isCurrentLesson={isCurrent && isToday}/>
                                                        </SwiperSlide>
                                                    ))}
                                                </Swiper>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}