import cls from "./taskManager.module.sass"
import {TaskManagerLeft, TaskManagerRight} from "features/taskManager";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {fetchBranch, fetchTaskManager} from "features/taskManager/modal/taskManagerThunk";
import {formatDate} from "shared/ui/formDate/formDate";
import {getBranch} from "features/branchSwitcher";
import {Link, NavLink, useMatch} from "react-router-dom";
import {Outlet, Route, Routes, useLocation, useNavigate, useParams} from "react-router";
import {Leads} from "pages/taskManager/ui/leads/Leads";
import {AnimatePresence, motion} from "framer-motion";
import {LeadProfile} from "features/leadProfile";


export const TaskManager = () => {

    const dispatch = useDispatch()
    const {id} = useSelector(getBranch)

    const [selectedDate, setSelectedDate] = useState(new Date())

    const [taskType , setTaskType] = useState('progress')
    const formatted = formatDate(selectedDate)

    useEffect(() => {
        dispatch(fetchTaskManager({date: formatted , taskType: taskType, branch: id}))
        dispatch(fetchBranch())
    }, [formatted , taskType])


    return (
        <div className={cls.container}>
            <div className={cls.box}>
                <div className={cls.box__header}>
                    <h1 className={cls.box__header_title}>
                        My Projects
                    </h1>
                </div>

                <div className={cls.box__sides}>
                    <TaskManagerLeft setTaskType={setTaskType} taskType={taskType} formatted={formatted}/>
                    <TaskManagerRight selectedDate={selectedDate} setSelectedDate={setSelectedDate}/>
                </div>
            </div>
        </div>
    );
};

//
// const links = [
//     "Leads", "Tasks", "Statistics"
// ]
//
// export const TaskManager = () => {
//
//
//     const location = useLocation()
//     const state = location.state
//
//
//
//     const match = useMatch("/platform/taskManager/lead/:id");
//
//
//     return (
//         <div className={cls.taskManager}>
//
//             <div className={cls.header}>
//
//                 <div className={cls.links}>
//                     {
//                         links.map((item, index) => {
//                             return (
//                                 <NavLink
//                                     to={item.toLowerCase()}
//                                     className={({isActive}) => (isActive ? `${cls.links__item} ${cls.links__item_active}` : cls.links__item)}
//                                 >
//                                     {item}
//                                 </NavLink>
//                             )
//                         })
//                     }
//                 </div>
//
//             </div>
//
//

//             <div className={cls.wrapper}>
//                 <Routes location={state?.backgroundLocation || location}>
//                     <Route element={<TaskManagerLayout />}>
//                         <Route path={"leads"} element={<Leads/>}/>
//                     </Route>
//                 </Routes>
//                 <AnimatePresence>
//                     {match && state?.backgroundLocation && (
//                         <LeadProfile id={match.params.id} key={match.params.id} />
//                     )}
//                 </AnimatePresence>
//             </div>
//         </div>
//     );
// };
//
//
// const TaskManagerLayout = () => {
//     return (
//         <>
//             <Outlet/>
//         </>
//     )
// }
