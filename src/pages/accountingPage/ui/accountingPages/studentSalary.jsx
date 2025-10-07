import React, {useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import {onAddAlertOptions} from "features/alert/model/slice/alertSlice";
import {
    getLoadingStudent,
    StudentsPayments,
    getDeletedStudent,
    studentReducer,
    getStudentPaymentes,
    DeletedStudentPayment
} from "entities/accounting";
import {onDeleteStudents} from "entities/accounting/model/slice/studetntSlice";
import {getStudentPayment} from "entities/accounting/model/thunk/student";
import {getUserBranchId} from "entities/profile/userProfile/index.js";
import {DefaultPageLoader} from "shared/ui/defaultLoader";
import {API_URL, headers, useHttp} from "shared/api/base";
import {ConfirmModal} from "shared/ui/confirmModal";
import {DynamicModuleLoader} from "shared/lib/components/DynamicModuleLoader/DynamicModuleLoader";
import {getSearchValue} from "features/searchInput/index.js";
import {getSelectedLocations} from "features/locations/index.js";

const reducers = {
    studentSlice: studentReducer
}

export const StudentSalary = ({deleted, setDeleted}) => {

    const {request} = useHttp()
    const dispatch = useDispatch()

    const studentData = useSelector(getStudentPaymentes)
    const loading = useSelector(getLoadingStudent)
    const branchID = useSelector(getUserBranchId)
    const selectedBranch = useSelector(getSelectedLocations);
    const branchForFilter = selectedBranch?.id ?? branchID;
    const deletedStudentPayment = useSelector(getDeletedStudent)

    const [activeDelete, setActiveDelete] = useState(false)
    const [changingData, setChangingData] = useState({})
    const [currentPage, setCurrentPage] = useState(1);

    let PageSize = useMemo(() => 50, [])

    const search  = useSelector(getSearchValue)

    useEffect(() => {
        if (branchForFilter && currentPage)
            dispatch(getStudentPayment({
                branch: branchForFilter,
                limit: PageSize,
                offset: (currentPage - 1) * PageSize,
                search
            }))
    }, [branchForFilter, currentPage , search])


    const formatSalary = (payment_sum) => {
        return Number(payment_sum).toLocaleString();
    };
    const sum2 = deletedStudentPayment?.reduce((a, c) => a + parseFloat(c.payment_sum || 0), 0);
    const sum1 = studentData?.reduce((a, c) => a + parseFloat(c.payment_sum || 0), 0);

    const onDelete = () => {

        const {id} = changingData
        request(`${API_URL}Students/student_payment_delete/${id}/`, "DELETE", JSON.stringify({id}), headers())
            .then(res => {
                dispatch(onDeleteStudents({id: id}))
                setActiveDelete(false)
                dispatch(onAddAlertOptions({
                    status: true,
                    type: "success",
                    msg: res.msg
                }))
            })
            .catch(err => {
                console.log(err)
            })
    }

    return (
        <DynamicModuleLoader reducers={reducers}>
            <div style={{display: "flex", gap: "2rem", alignItems: "center", justifyContent: "space-between"}}>
                <div style={{display: "flex", gap: "2rem"}}>
                </div>
                <div
                    style={{
                        color: "rgb(34, 197, 94)",
                        fontSize: "2.2rem",
                        textAlign: "end",
                        marginBottom: "3rem"
                    }}
                >
                    Total : {formatSalary(deleted ? sum2 : sum1)}
                </div>
            </div>
            {deleted ?

                <DeletedStudentPayment
                    formatSalary={formatSalary}
                    deletedStudent={deletedStudentPayment}

                />

                : <StudentsPayments
                    PageSize={PageSize}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    formatSalary={formatSalary}
                    studentData={studentData}
                    setActiveDelete={setActiveDelete}
                    setChangingData={setChangingData}
                />

            }
            <ConfirmModal setActive={setActiveDelete} active={activeDelete} onClick={onDelete}
                          title={`Rostanham ${changingData.name} ni o'chirmoqchimisiz `} type={"danger"}/>
            {/*<YesNo activeDelete={activeDelete} setActiveDelete={setActiveDelete} onDelete={onDelete}*/}
            {/*       changingData={changingData}/>*/}
        </DynamicModuleLoader>
    );
};

