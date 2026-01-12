import {ParentsProfileChildInfo, ParentsProfileInfo} from "entities/parents/index.js";
import {onAddAlertOptions} from "features/alert/model/slice/alertSlice.js";
import {Pagination} from "features/pagination/index.js";
import {getChildren, getUserLoading} from "features/parentsProfile/model/parentsProfileSelector.js";
import {onAddParentChild} from "features/parentsProfile/model/parentsProfileSlice.js";
import {fetchParentInfo, fetchParentsAvailableStudents} from "features/parentsProfile/model/parentsProfileThunk.js";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router";
import {API_URL, headers, useHttp} from "shared/api/base.js";
import {Button} from "shared/ui/button/index.js";
import {DefaultPageLoader} from "shared/ui/defaultLoader/index.js";
import {Input} from "shared/ui/input/index.js";
import {MiniLoader} from "shared/ui/miniLoader/index.js";
import {Modal} from "shared/ui/modal/index.js";
import {SearchInput} from "shared/ui/searchInput/index.js";
import {Table} from "shared/ui/table/index.js";
import cls from "./parentsProfile.module.sass"

export const ParentsProfile = () => {

    const [activeAdd, setActiveAdd] = useState(false)
    const [selectedIds, setSelectedIds] = useState([]);

    const parentsChild = useSelector(getChildren)
    const studentLoading = useSelector(getUserLoading)
    const pageSize = 10
    const [currentPage, setCurrentPage] = useState(1);
    const [search , setSearch] = useState("")

    const [loading , setLoading] = useState(false)

    const {request} = useHttp()
    const {id} = useParams()
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(fetchParentInfo(id))
    }, [])
    useEffect(() => {
        dispatch(fetchParentsAvailableStudents({id , pageSize , currentPage , search}))

    }, [activeAdd , currentPage , search])

    const handleSelect = (id) => {
        setSelectedIds(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        );
    };


    const onAddChild = () => {
        const res = {student_ids: selectedIds}
        setLoading(true)
        request(`${API_URL}parents/${id}/add_students/`, "POST", JSON.stringify(res), headers())
            .then(res => {
                console.log(res)
                dispatch(onAddParentChild(res.children))
                setActiveAdd(false)
                setSelectedIds([])
                dispatch(onAddAlertOptions({
                    type: "success",
                    status: true,
                    msg: "Muvofaqqiyatli o'chirildi"
                }))
                setLoading(false)

            })
    }


    return (
        <>
            <div className={cls.parents}>
                <ParentsProfileInfo/>
                <ParentsProfileChildInfo setActiveAdd={setActiveAdd}/>
            </div>

            <Modal typeIcon={true} extraClass={cls.modal} setActive={setActiveAdd} active={activeAdd}>
                <div className={cls.modal__header}>
                    <h1>Qo'shish</h1>
                    <SearchInput extraClass={cls.modal__search} setSearch={setSearch} search={search} />
                </div>

                <div className={cls.modal__table}>
                    {studentLoading ? <DefaultPageLoader status={true}/> :
                        <Table>
                            <thead>
                            <tr>
                                <th>No</th>
                                <th>Ism Familiya</th>
                                <th>Yosh</th>
                                <th>Numer</th>
                                <th/>
                            </tr>
                            </thead>

                            <tbody>
                            {parentsChild?.results?.length && parentsChild?.results?.map((item, i) => (
                                <tr key={item.id}>
                                    <td>{i + 1}</td>
                                    <td>{item.name} {item.surname}</td>
                                    <td>{item.age}</td>
                                    <td>{item.phone}</td>
                                    <td>
                                        <Input
                                            type="checkbox"
                                            checked={selectedIds?.includes(item?.id)}
                                            onChange={() => handleSelect(item?.id)}
                                        />
                                    </td>
                                </tr>
                            ))}
                            </tbody>

                        </Table>}
                </div>

                <div style={{display: "flex"}}>
                    <Pagination
                        setCurrentPage={setCurrentPage}
                        currentPage={currentPage}
                        pageSize={pageSize}
                        onPageChange={page => {
                            setCurrentPage(page)
                        }}
                        // type={"custom"}
                        totalCount={parentsChild?.count}

                    />
                    {loading  ? <MiniLoader custom={true}/> :  <Button onClick={onAddChild} extraClass={cls.modal__btn}>
                        Qo'shish
                    </Button>}
                </div>
            </Modal>
        </>
    );
};
