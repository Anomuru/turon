import {Table} from "shared/ui/table/index.js";
import {useNavigate} from "react-router";


export const GroupQuarterTable = ({data , selectedSubject}) => {

    const navigate = useNavigate()
    return (
       <Table>
           <thead>
           <tr>
               <th>No</th>
               <th>Ism Familyasi</th>

              {data && data[0]?.subjects?.map(item => item?.assignments?.map(item => <th>{item?.test_name}</th>))}
               <th> Umumiy  Ball %</th>
           </tr>
           </thead>

           <tbody>
           {
               data?.map((item , i) => (
                   <tr onClick={() => navigate(`../students/profile/${item.id}`)}>
                       <td>{i + 1}</td>
                       <td>{item?.first_name} {item?.last_name}</td>
                       {item.subjects.map(item => item?.assignments?.map(item => <td>{item.percentage}</td>))}

                       <td>{item?.subjects.map(itemSub => <td>{selectedSubject === "all " && itemSub.subject_name} {itemSub?.average_result} </td>)}</td>
                   </tr>
               ))
           }
           </tbody>

       </Table>
    );
};

