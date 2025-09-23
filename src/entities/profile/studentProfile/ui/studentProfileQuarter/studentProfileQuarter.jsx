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
import {API_URL, useHttp} from "shared/api/base.js";

const reducers = {
    studentQuarterShowSlice: studentQuarterShowReducer
}

export const StudentProfileQuarter = ({group_id}) => {

    const quarter = useSelector(getStudentTerm)
    const academicYear = useSelector(getStudentAcademicYear)
    const loading = useSelector(getStudentQuarterDataLoading)
    const data = useSelector(getStudentQuarterData)
    const [selectAcademicYear, setSelectAcademicYear] = useState(null)
    const [selectQuarter, setSelectQuarter] = useState(null)
    const dispatch = useDispatch()
    const {id} = useParams()
    const [subject, setSubject] = useState()
    const [subjectSelect, setSubjectSelect] = useState()
    const {request} = useHttp()
    useEffect(() => {
        if (group_id[0].id) {
            request(`${API_URL}terms/group-subjects/${group_id[0]?.id}/`)
                .then(res => {
                    setSubject(res)
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }, [])

    useEffect(() => {
        if (subject) {
            setSubjectSelect(subject[0]?.id)
        }
    }, [subject])
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
        if (selectQuarter && id) {
            dispatch(fetchAcademicData({termId: selectQuarter, academicYear, groupId: id, subject: subjectSelect}))
        }
    }, [selectQuarter, selectAcademicYear  , subjectSelect])

    const allTests = [];

    if (data) {
        data?.subjects?.forEach(subject => {
            subject?.assignments?.forEach(assignment => {
                if (!allTests.includes(assignment.test_name)) {
                    allTests.push(assignment.test_name);
                }
            });
        });
    }

    return (
        <DynamicModuleLoader reducers={reducers}>
            <div className={cls.quarter}>

                <div className={cls.quarter__select}>
                    <Select defaultValue={selectAcademicYear} onChangeOption={setSelectAcademicYear}
                            options={academicYear}/>

                    <Select defaultValue={selectQuarter} onChangeOption={setSelectQuarter} options={quarter}/>
                    <Select defaultValue={subjectSelect} onChangeOption={setSubjectSelect}
                            options={subject && [...subject, {name: "Hammasi", id: "all"}]}/>
                </div>


                <h2>Umumiy natija: {data?.total_result}</h2>
                {/*<h2>O'rtanatija: {data?.average_result}</h2>*/}

                {loading ? <DefaultPageLoader/> :
                    <Table>
                        <thead>
                        <tr>
                            <th>No</th>
                            <th>Fan nomi</th>
                            {allTests.map(test => (
                                <th key={test}>Test nomi-{test}</th>
                            ))}
                            <th>Ball</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data && data?.subjects?.map((subject, index) => (
                            <tr key={subject?.subject_name}>
                                <td>{index + 1}</td>
                                <td>{subject?.subject_name}</td>
                                {allTests?.map(testName => {
                                    const assignment = subject?.assignments?.find(a => a.test_name === testName);
                                    return <td key={testName}>{assignment ? assignment?.calculated_result : "-"}</td>;
                                })}
                                <td>{subject?.average_result}</td>
                            </tr>
                        ))}
                        </tbody>

                    </Table>}

            </div>
        </DynamicModuleLoader>
    );
};

