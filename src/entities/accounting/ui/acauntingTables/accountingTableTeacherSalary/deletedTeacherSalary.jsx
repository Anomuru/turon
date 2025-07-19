import {Table} from "../../../../../shared/ui/table";
import React, {useMemo, useState} from "react";
import {Pagination} from "../../../../../features/pagination";
import {useSelector} from "react-redux";
import {getSearchValue} from "../../../../../features/searchInput";
import {DeletedTeachers} from "../../../../teachers";

export const DeletedTeacherSalary = ({deletedTeacher, setChangePayment, setChangingData}) => {
    const search = useSelector(getSearchValue)
    let PageSize = useMemo(() => 50, [])
    const [currentTableData, setCurrentTableData] = useState([])
    const [currentPage, setCurrentPage] = useState(1);

    const searchedUsers = useMemo(() => {
        const filteredHeroes = deletedTeacher?.slice()
        setCurrentPage(1)


        if (!search) return filteredHeroes

        return filteredHeroes.filter(item =>
            item.name?.toLowerCase().includes(search.toLowerCase())
        )
    }, [DeletedTeachers, setCurrentPage, search])
    const formatSalary = (salary) => {
        return Number(salary).toLocaleString();
    };


    const renderTeacherDeleted = () => {
        return currentTableData.map((item, index) => (
            <>

                <tbody>
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item?.teacher?.user?.name} {item?.teacher?.user?.surname}</td>
                    <td>{item?.salary}</td>
                    <td>{item?.comment}</td>
                    <td>{item?.date}</td>
                    {/*<td*/}
                    {/*    onClick={() => {*/}
                    {/*        setChangingData({*/}
                    {/*            id: item.id,*/}
                    {/*            payment: item.payment*/}
                    {/*        });*/}
                    {/*        setChangePayment(true);*/}
                    {/*    }}*/}
                    {/*>*/}
                    {/*    {item.payment.name}*/}
                    {/*</td>*/}
                    {/*<td>{index + 1}</td>*/}
                    {/*<td>{item.name} {item.surname}</td>*/}
                    {/*<td>{formatSalary(item.salary)}</td>*/}
                    {/*<td>{item.comment}</td>*/}
                    {/*<td>{item.date}</td>*/}
                    <td onClick={() => {
                        setChangingData({
                            id: item?.id,
                            // payment_types: item.payment_types?.name,
                            payment_types: item?.payment_types,
                            // userId: item.user.id,
                        })
                        // setChangePayment(!changePayment)
                    }}>
                        <div style={{
                            border: "1px solid",
                            width: "fit-content",
                            padding: "5px 10px",
                            borderRadius: "15px",
                            textTransform: "capitalize",
                            cursor: "pointer"
                        }}>{item?.payment?.name}</div>
                    </td>

                </tr>
                </tbody>
            </>
        ))
    }
    return (
        <>
            <div>
                <div style={{height: "calc(100vh - 43rem)", overflow: "auto"}}>

                    <Table>
                        <thead>
                        <tr>
                            <th>No</th>
                            <th>Ism Familiya</th>
                            <th>Oylik</th>
                            <th>Sabab</th>
                            <th>Sana</th>
                            <th>To'lov turi</th>
                        </tr>
                        </thead>
                        {renderTeacherDeleted()}
                    </Table>
                </div>
            </div>
            <Pagination
                setCurrentTableData={setCurrentTableData}
                users={searchedUsers}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                pageSize={PageSize}
                onPageChange={page => {
                    setCurrentPage(page)
                }}
                type={"custom"}
            />
        </>
    );
};

