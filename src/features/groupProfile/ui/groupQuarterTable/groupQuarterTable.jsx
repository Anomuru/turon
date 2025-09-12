import {Table} from "shared/ui/table/index.js";
import {useNavigate} from "react-router";


export const GroupQuarterTable = ({data}) => {

    const navigate = useNavigate()
    return (
       <Table>
           <thead>
           <tr>
               <th>No</th>
               <th>Ism Familyasi</th>

              {data && data[0]?.assignments.map(item => <th>Test nomi - {item?.test_name}</th>)}
               <th> Umumiy  Ball %</th>
           </tr>
           </thead>

           <tbody>
           {
               data?.map((item , i) => (
                   <tr onClick={() => navigate(`../students/profile/${item.id}`)}>
                       <td>{i + 1}</td>
                       <td>{item?.first_name} {item?.last_name}</td>
                       {item?.assignments.map(item => (<td>{item?.subject_name} - {item?.calculated_result}</td>))}

                       <td>{item?.average_result}</td>
                   </tr>
               ))
           }
           </tbody>

       </Table>
    );
};

