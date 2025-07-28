import cls from "../category.module.sass"
import {useState} from "react";
import {CategoryEditModal} from "../categoryModal/categoryModal";
import {useForm} from "react-hook-form";
import {API_URL, headers, useHttp} from "../../../../../shared/api/base";
import {changeName, deleteEmployerCategory, updateCategory} from "../../../model/slice/employerCategory";
import {useDispatch} from "react-redux";
import {onAddAlertOptions} from "../../../../../features/alert/model/slice/alertSlice";

export const EmployerCategoryLists = ({salaryTypes, setEdit, edit,}) => {
    const [activeCategory, setActiveCategory] = useState(false)
    const dispatch = useDispatch()
    const {request} = useHttp()
    const {register, handleSubmit, setValue} = useForm()
    const upDateSalaryType = (data) => {
        const id = edit.id

        const res = {
            id: id,
            ...data
        }
        request(`${API_URL}Teachers/salary-types/${id}/`, "PATCH", JSON.stringify(res), headers())
            .then(res => {
                dispatch(onAddAlertOptions({
                    status: true,
                    type: "success",
                    msg: res.msg
                }))
                dispatch(changeName(res))
                setActiveCategory(!activeCategory)

                setValue("name", "")
                setValue("salary", "")
            })
            .catch(err => {
                console.log(err)
            })
    }
    const deleteCategory = () => {
        const id = edit.id
        request(`${API_URL}Teachers/salary-types/${id}/`, "DELETE", null, headers())
            .then(res => {
                console.log(res)
                dispatch(deleteEmployerCategory({id: id}))
                dispatch(onAddAlertOptions({
                    status: true,
                    type: "success",
                    msg: res.msg
                }))
                setActiveCategory(!activeCategory)
                setValue("name", "")
                setValue("salary", "")
            })
            .catch(err => {
                console.log(err)
            })
    }
    return (
        <div className={cls.box_Main}>
            {salaryTypes?.map(item => (
                <div className={cls.box} onClick={() => {
                    setEdit({id: item.id, name: item.name})
                    setActiveCategory(!activeCategory)
                    setValue("name", item.name)
                    setValue("salary", item.salary)
                }
                }>
                    <p>Nomi : {item.name}</p>
                    <span>Oyligi : {item.salary}</span>
                </div>
            ))}

            <CategoryEditModal deleteBtn={deleteCategory} onClick={upDateSalaryType} activeCategory={activeCategory}
                               setActiveCategory={setActiveCategory} register={register}
                               handleSubmit={handleSubmit}/>
        </div>


    );
};

