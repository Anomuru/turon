import {Table} from "shared/ui/table";
import cls from "./deletedGroups.module.sass";
import {DefaultPageLoader} from "shared/ui/defaultLoader/index.js";



export const DeletedGroups = ({currentTableData , loadingWithFilter}) => {





    return (
        <div className={cls.deletedGroups}>
            {loadingWithFilter ? <DefaultPageLoader/> : <div className={cls.table}>
                <Table extraClass={cls.table__head}>
                    <thead>
                    <tr>
                        <th>No</th>
                        <th>Guruh Nomi</th>
                        <th>Full name</th>
                        <th>Kurs Turi</th>
                        <th>Guruh narxi</th>

                    </tr>
                    </thead>
                    <tbody>
                    {currentTableData.map((item, i) => {
                        return (

                            <tr onClick={() => navigate(`groupInfo/${item?.id}`)}>
                                <td>{i + 1}</td>
                                <td>{item?.name}</td>
                                <td>{item?.teacher}</td>
                                <td>{item?.students?.length}</td>
                                <td>{item?.price ? item.price : "Sinfga hali narx belgilanmagan"}</td>
                                {/*<td>{`${item?.class_number?.number}-${item?.color?.name}`}</td>*/}

                                {/*<td>{item?.status ? <div><div/></div> : null }</td>*/}

                                {/*<td>{item?.status ?<div><div/></div> : <div className={cls.red}><div className={cls.red__inner}/></div> }</td>*/}




                            </tr>

                        )
                    })}
                    </tbody>
                </Table>
            </div>}


        </div>
    )
}
