import {CategoryModal, EmployerCategoryHeader, EmployerCategoryLists} from "entities/employer";
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {API_URL, headers, useHttp} from "shared/api/base";
import {useDispatch, useSelector} from "react-redux";
import {getEmployerCategoryData} from "entities/employer/model/selector/employerCategory";
import {getEmployerCategory} from "entities/employer/model/slice/employerCategoryThunk";
import {updateCategory} from "entities/employer/model/slice/employerCategory";
import {getBranch} from "../../../../features/branchSwitcher";


export const EmployerCategoryPage = ({extraClass}) => {
    const [activeCategory, setActiveCategory] = useState(false)
    const {register, handleSubmit, setValue} = useForm()


    const branch = useSelector(getBranch)
    const employerCategory = useSelector(getEmployerCategoryData)
    const dispatch = useDispatch()
    const [edit, setEdit] = useState({})
    const {request} = useHttp()

    const branchId = branch.id


    useEffect(() => {
        dispatch(getEmployerCategory(branchId))
    }, [])
    const createEmpCategory = (data) => {

        const res = {
            ...data,
            branch: branchId
        }

        request(`${API_URL}Teachers/salary-types/?branch=${branchId}`, "POST", JSON.stringify(res), headers())
            .then(res => {
                setActiveCategory(!activeCategory)
                dispatch(updateCategory(res))
                setValue("name", "")
                setValue("salary", "")
            })
            .catch(err => {
                console.log(err)
            })
    }




    return (
        <div className={extraClass}>
            <EmployerCategoryHeader activeCategory={activeCategory} setActiveCategory={setActiveCategory}/>
            <EmployerCategoryLists setEdit={setEdit} salaryTypes={employerCategory} edit={edit}/>
            <CategoryModal onClick={createEmpCategory} register={register} handleSubmit={handleSubmit}
                           activeCategory={activeCategory} setActiveCategory={setActiveCategory}/>
        </div>
    );
};

