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
import {useEffect, useState} from "react";
import {
    fetchAcademicData,
    fetchAcademicTerm,
    fetchAcademicYear
} from "features/groupProfile/model/showQuarter/groupQuarterThunk.jsx";
import {useParams} from "react-router";


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

    useEffect(() => {
        dispatch(fetchAcademicYear())
    }, [])

    useEffect(() => {
        if (academicYear) {
            setSelectAcademicYear(academicYear[0]?.academic_year)
        }
    }, [academicYear])

    useEffect(() => {
        if (selectAcademicYear){
            dispatch(fetchAcademicTerm(selectAcademicYear))
        }

    }, [selectAcademicYear])


    useEffect(() => {
        if (academicYear && quarter) {
            setSelectQuarter(quarter[0]?.id)
        }
    }, [academicYear && quarter])

    useEffect(() => {
        if (selectQuarter && id){
            dispatch(fetchAcademicData({termId: selectQuarter , academicYear , groupId: id}))
        }
    } , [selectQuarter , selectAcademicYear])



    return (
        <DynamicModuleLoader reducers={reducers}>

            <div className={cls.quarter}>

                <div className={cls.quarter__select}>
                    <Select defaultValue={selectAcademicYear} onChangeOption={setSelectAcademicYear}
                            options={academicYear}/>

                    <Select defaultValue={selectQuarter} onChangeOption={setSelectQuarter} options={quarter}/>
                </div>

                <div className={cls.quarter__table}>
                    {loading ? <DefaultPageLoader/> :
                        <GroupQuarterTable data={data}/>}
                </div>

            </div>
        </DynamicModuleLoader>
    );
};

