// import cls from "./groupQuarterShow.module.sass";
// import { DynamicModuleLoader } from "shared/lib/components/DynamicModuleLoader/DynamicModuleLoader.jsx";
// import { Select } from "shared/ui/select/index.js";
// import { groupQuarterReducer } from "features/groupProfile/model/showQuarter/groupQuarterSlice.jsx";
// import { useDispatch, useSelector } from "react-redux";
// import {
//     getGroupAcademicYear, getGroupQuarterData,
//     getGroupQuarterDataLoading,
//     getGroupTerm
// } from "features/groupProfile/model/showQuarter/groupQuarterSelector.jsx";
// import { DefaultPageLoader } from "shared/ui/defaultLoader/index.js";
// import { useEffect, useState, useMemo } from "react";
// import {
//     fetchAcademicData,
//     fetchAcademicTerm,
//     fetchAcademicYear
// } from "features/groupProfile/model/showQuarter/groupQuarterThunk.jsx";
// import { useParams } from "react-router";
// import { API_URL, useHttp } from "shared/api/base.js";
// import { Dashboard } from "./Dashboard.jsx";
// import { Statistics } from "./Statistics.jsx";
// import { SubjectDetail } from "./SubjectDetail.jsx";
// import { getSubjectsSummary } from "./performanceUtils.js";
//
// const reducers = {
//     groupQuarterShowSlice: groupQuarterReducer
// }
//
// export const GroupQuarterShow = () => {
//     const quarter = useSelector(getGroupTerm);
//     const academicYear = useSelector(getGroupAcademicYear);
//     const loading = useSelector(getGroupQuarterDataLoading);
//     const data = useSelector(getGroupQuarterData);
//
//     const [selectAcademicYear, setSelectAcademicYear] = useState(null);
//     const [selectQuarter, setSelectQuarter] = useState(null);
//     const [subject, setSubject] = useState();
//     const [subjectSelect, setSubjectSelect] = useState();
//
//     // View state: 'dashboard' | 'detail' | 'statistics'
//     const [view, setView] = useState('dashboard');
//     const [selectedSubjectName, setSelectedSubjectName] = useState(null);
//
//     const dispatch = useDispatch();
//     const { id } = useParams();
//     const { request } = useHttp();
//
//     useEffect(() => {
//         request(`${API_URL}terms/group-subjects/${id}/`)
//             .then(res => {
//                 setSubject(res)
//             })
//             .catch(err => {
//                 console.log(err)
//             })
//     }, [])
//
//     useEffect(() => {
//         if (subject){
//             setSubjectSelect("all")
//         }
//     } , [subject])
//
//
//     useEffect(() => {
//         dispatch(fetchAcademicYear())
//     }, [])
//
//     useEffect(() => {
//         if (academicYear) {
//             setSelectAcademicYear(academicYear[0]?.academic_year)
//         }
//     }, [academicYear])
//     //
//     useEffect(() => {
//
//             dispatch(fetchAcademicTerm(selectAcademicYear))
//
//
//     }, [selectAcademicYear])
//     //
//     //
//     useEffect(() => {
//         if (quarter) {
//             setSelectQuarter(quarter[0]?.id)
//         }
//     }, [quarter])
//     //
//     useEffect(() => {
//         if (selectQuarter && id) {
//             dispatch(fetchAcademicData({
//                 termId: selectQuarter,
//                 academicYear: selectAcademicYear,
//                 groupId: id,
//                 subject: "all"
//             }))
//         }
//     }, [selectQuarter, selectAcademicYear ])
//
//
//     // Derived data
//     const subjectsForDashboard = useMemo(() => getSubjectsSummary(data), [data]);
//
//     const handleSelectSubject = (sub) => {
//         setSelectedSubjectName(sub.name);
//         setView('detail');
//     };
//
//     const handleShowStats = () => {
//         setView('statistics');
//     };
//
//     const handleBack = () => {
//         setView('dashboard');
//         setSelectedSubjectName(null);
//     };
//
//     if (loading) return <DefaultPageLoader />;
//     console.log(quarter)
//     return (
//         <DynamicModuleLoader reducers={reducers}>
//             <div className={cls.quarter}>
//                 <div className={cls.quarter__select}>
//                     <Select defaultValue={selectAcademicYear} onChangeOption={setSelectAcademicYear}
//                             options={academicYear}/>
//
//                     <Select defaultValue={selectQuarter} onChangeOption={setSelectQuarter} options={quarter}/>
//
//                 </div>
//
//                 <div className={cls.viewContainer}>
//                     {view === 'dashboard' && (
//                         <Dashboard
//                             subjects={subjectsForDashboard}
//                             onSelect={handleSelectSubject}
//                             onShowStats={handleShowStats}
//                         />
//                     )}
//
//                     {view === 'detail' && (
//                         <SubjectDetail
//                             subjectName={selectedSubjectName}
//                             data={data}
//                             onBack={handleBack}
//                         />
//                     )}
//
//                     {view === 'statistics' && (
//                         <Statistics
//                             data={data}
//                             onBack={handleBack}
//                         />
//                     )}
//                 </div>
//             </div>
//         </DynamicModuleLoader>
//     );
// };
//
import cls from "./groupQuarterShow.module.sass"
import {GroupQuarterTable} from "features/groupProfile/index.js";
import {DynamicModuleLoader} from "shared/lib/components/DynamicModuleLoader/DynamicModuleLoader.jsx";

import {Select} from "shared/ui/select/index.js";
import {groupQuarterReducer} from "features/groupProfile/model/showQuarter/groupQuarterSlice.jsx";
import {useDispatch, useSelector} from "react-redux";
import {
    getGroupAcademicYear, getGroupQuarterData,
    getGroupQuarterDataLoading,
    getGroupTerm
} from "features/groupProfile/model/showQuarter/groupQuarterSelector.jsx";
import {DefaultPageLoader} from "shared/ui/defaultLoader/index.js";
import {useEffect, useMemo, useState} from "react";
import {
    fetchAcademicData,
    fetchAcademicTerm,
    fetchAcademicYear
} from "features/groupProfile/model/showQuarter/groupQuarterThunk.jsx";
import {useParams} from "react-router";
import {API_URL, useHttp} from "shared/api/base.js";
import {getSubjectsSummary} from "pages/groupsPage/ui/groupQuarterShow/performanceUtils.js";
import {Dashboard} from "pages/groupsPage/ui/groupQuarterShow/Dashboard.jsx";
import {SubjectDetail} from "pages/groupsPage/ui/groupQuarterShow/SubjectDetail.jsx";
import { Statistics } from "./Statistics.jsx";


const reducers = {
    groupQuarterShowSlice: groupQuarterReducer
}

export const GroupQuarterShow = () => {

    const quarter = useSelector(getGroupTerm)
    const academicYear = useSelector(getGroupAcademicYear)
    const loading = useSelector(getGroupQuarterDataLoading)
    const data = useSelector(getGroupQuarterData)
    const [selectAcademicYear, setSelectAcademicYear] = useState(null)
    const [selectQuarter, setSelectQuarter] = useState(null)
    const dispatch = useDispatch()
    const {id} = useParams()
    const [view, setView] = useState('dashboard');
    const [selectedSubjectName, setSelectedSubjectName] = useState(null);

    const [subject, setSubject] = useState()
    const [subjectSelect, setSubjectSelect] = useState()
    const {request} = useHttp()
    useEffect(() => {
        request(`${API_URL}terms/group-subjects/${id}/`)
            .then(res => {
                setSubject(res)
            })
            .catch(err => {
                console.log(err)
            })
    }, [])

    useEffect(() => {
        if (subject){
            setSubjectSelect("all")
        }
    } , [subject])


    useEffect(() => {
        dispatch(fetchAcademicYear())
    }, [])

    useEffect(() => {
        if (academicYear) {
            setSelectAcademicYear(academicYear[0]?.academic_year)
        }
    }, [academicYear])

    useEffect(() => {
        if (selectAcademicYear) {
            dispatch(fetchAcademicTerm(selectAcademicYear))
        }

    }, [selectAcademicYear])


    useEffect(() => {
        if (academicYear && quarter) {
            setSelectQuarter(quarter[0]?.id)
        }
    }, [academicYear && quarter])

    useEffect(() => {
        if (selectQuarter && id && subjectSelect) {
            dispatch(fetchAcademicData({termId: selectQuarter, academicYear, groupId: id , subject:subjectSelect  }))
        }
    }, [selectQuarter, selectAcademicYear , subjectSelect])
    const subjectsForDashboard = useMemo(() => getSubjectsSummary(data), [data]);

    console.log(getSubjectsSummary(data))
    const handleSelectSubject = (sub) => {
        setSelectedSubjectName(sub.name);
        setView('detail');
    };

    const handleShowStats = () => {
        setView('statistics');
    };

    const handleBack = () => {
        setView('dashboard');
        setSelectedSubjectName(null);
    };

    return (
        <DynamicModuleLoader reducers={reducers}>

            <div className={cls.quarter}>

                <div className={cls.quarter__select}>
                    <Select defaultValue={selectAcademicYear} onChangeOption={setSelectAcademicYear}
                            options={academicYear}/>

                    <Select defaultValue={selectQuarter} onChangeOption={setSelectQuarter} options={quarter}/>
                    {/*<Select defaultValue={subjectSelect} onChangeOption={setSubjectSelect} options={subject && [{name: "Hammasi" , id: "all"}  ,...subject ]}/>*/}
                </div>

                {/*<div className={cls.quarter__table}>*/}
                {/*    {loading ? <DefaultPageLoader/> :*/}
                {/*        <GroupQuarterTable selectedSubject={subjectSelect} data={data}/>}*/}
                {/*</div>*/}
                <div className={cls.viewContainer}>
                    {view === 'dashboard' && (
                        <Dashboard
                            subjects={subjectsForDashboard}
                            onSelect={handleSelectSubject}
                            onShowStats={handleShowStats}
                        />
                    )}

                    {view === 'detail' && (
                        <SubjectDetail
                            subjectName={selectedSubjectName}
                            data={data}
                            onBack={handleBack}
                        />
                    )}

                    {view === 'statistics' && (
                        <Statistics
                            data={data}
                            onBack={handleBack}
                        />
                    )}
                </div>

            </div>
        </DynamicModuleLoader>
    );
};