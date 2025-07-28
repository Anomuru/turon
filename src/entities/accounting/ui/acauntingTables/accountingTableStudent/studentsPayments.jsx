import {Table} from "shared/ui/table";
import {Button} from "shared/ui/button";
import {Modal} from "../../../../../shared/ui/modal";
import React, {useMemo, useState} from "react";
import cls from "../accountingTableWorkerSalary/empSalary.module.sass";
import {Select} from "../../../../../shared/ui/select";
import {Pagination} from "../../../../../features/pagination";
import {useSelector} from "react-redux";
import {getSearchValue} from "../../../../../features/searchInput";
import {useNavigate} from "react-router";


export const StudentsPayments = ({
                                     studentData,
                                     changingData,
                                     setChangingData,
                                     onDelete,
                                     deleted,
                                     activeDelete,
                                     setActiveDelete,
                                     formatSalary
                                 }) => {

    const search = useSelector(getSearchValue)
    let PageSize = useMemo(() => 50, [])
    const [currentTableData, setCurrentTableData] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const searchedUsers = useMemo(() => {
        const filteredHeroes = studentData?.slice()
        setCurrentPage(1)


        if (!search) return filteredHeroes

        return filteredHeroes.filter(item =>
            item?.student_name?.toLowerCase().includes(search.toLowerCase())
        )
    }, [studentData, setCurrentPage, search])

    const navigation = useNavigate();

    const onDeleteModal = (data) => {
        setActiveDelete(true)
    }

    console.log(currentTableData, "currentTableData")

    const renderStudents = () => {
        return currentTableData.map((item, i) => (
            <tr>
                <td>{i + 1}</td>
                <td onClick={() => navigation(`../../students/profile/${item.id}`)}>{item?.student_name} {item?.student_surname}</td>
                <td>{formatSalary(item.payment_sum)}</td>
                <td>{item.date}</td>
                <td>
                    <div style={{
                        border: "1px solid",
                        width: "fit-content",
                        padding: "5px 10px",
                        borderRadius: "15px",
                        textTransform: "capitalize",
                        cursor: "pointer"
                    }}>{item?.payment_type_name}</div>
                </td>
                <td>
                    <div>
                        <Button
                            onClick={() => {
                                onDeleteModal({
                                    id: item.id,
                                    name: item?.student_name,
                                    surname: item?.student_surname
                                })
                                setChangingData({
                                    id: item.id,
                                    name: item?.student_name,
                                    surname: item?.student_surname
                                })
                            }
                            }
                            type={"delete"}
                            children={<i className={"fa fa-times"} style={{color: "white"}}/>}
                        />
                    </div>
                </td>
            </tr>
        ))
    }
    return (
        <>
            <div className={cls.empSalary}>

                <Table>
                    <thead>
                    <tr>
                        <th>No</th>
                        <th>Ism Familiya</th>
                        <th>To'lov</th>
                        <th>Sana</th>
                        <th>To'lov turi</th>
                        <th>Ochirich</th>
                    </tr>
                    </thead>
                    <tbody>
                    {renderStudents()}
                    {/*{deleted ? renderDeletedStudents() : renderStudents()}*/}
                    </tbody>
                </Table>
                {/*<Modal active={changePayment} setActive={setChangePayment}>*/}
                {/*    <h2>To'lov turini uzgartirish</h2>*/}
                {/*    <div className={cls.changeType}>*/}
                {/*        <Select title={changingData.payment_types} options={getCapitalType}*/}
                {/*                onChangeOption={(value) => onChange(value)}/>*/}
                {/*        /!*<Button onClick={onChange}>Tastiqlash</Button>*!/*/}
                {/*    </div>*/}
                {/*</Modal>*/}


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

// onDelete(item.id)