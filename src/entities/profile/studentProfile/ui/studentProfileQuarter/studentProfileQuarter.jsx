import {Select} from "shared/ui/select/index.js";
import cls from "./studentProfileQuarter.module.sass"
import {Table} from "shared/ui/table/index.js";
import {DynamicModuleLoader} from "shared/lib/components/DynamicModuleLoader/DynamicModuleLoader.jsx";
import {studentQuarterShowReducer} from "entities/profile/studentProfile/model/slice/studentProfileQuarterSlice.js";
import {useDispatch, useSelector} from "react-redux";

import {useEffect, useState} from "react";
import {useParams} from "react-router";

import {
    getStudentAcademicYear, getStudentQuarterData, getStudentQuarterDataLoading,
    getStudentTerm
} from "entities/profile/studentProfile/model/selectors/studentProfileQuarterSelector.js";
import {
    fetchAcademicData,
    fetchAcademicTerm,
    fetchAcademicYear
} from "entities/profile/studentProfile/model/thunk/studentProfileQuarterThunk.js";
import {DefaultPageLoader} from "shared/ui/defaultLoader/index.js";

const reducers ={
    studentQuarterShowSlice : studentQuarterShowReducer
}

export const StudentProfileQuarter = () => {

    const quarter = useSelector(getStudentTerm)
    const academicYear = useSelector(getStudentAcademicYear)
    const loading = useSelector(getStudentQuarterDataLoading)
    const data = useSelector(getStudentQuarterData)
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

    console.log(data)

    return (
        <DynamicModuleLoader reducers={reducers}>
            <div className={cls.quarter}>

                <div className={cls.quarter__select}>
                    <Select defaultValue={selectAcademicYear} onChangeOption={setSelectAcademicYear}
                            options={academicYear}/>

                    <Select defaultValue={selectQuarter} onChangeOption={setSelectQuarter} options={quarter}/>
                </div>


                <h2>
                    Umumiy natija : {data?.total_result}
                </h2>
                <h2>O'rtanatija : {data?.average_result}</h2>

                {loading ? <DefaultPageLoader/> :
                <Table>
                    <thead>
                    <tr>
                        <th>No</th>
                        <th>Fan nomi</th>
                        <th>Test nomi</th>
                        <th>Ball </th>
                    </tr>
                    </thead>
                    <tbody>
                    { data &&
                        data?.assignments?.map((item , i) => (
                            <tr>

                                <td>{i + 1}</td>
                                <td>{item.subject_name}</td>
                                <td>{item.test_name}</td>
                                <td>{item.calculated_result}</td>

                            </tr>
                        ))
                    }
                    </tbody>

                </Table> }

            </div>
        </DynamicModuleLoader>
    );
};

