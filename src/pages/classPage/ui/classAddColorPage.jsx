import {ClassColorAddFilter} from "entities/class";
import {useState} from "react";
import {API_URL, headers, useHttp} from "shared/api/base";
import {useForm} from "react-hook-form";
import {useDispatch} from "react-redux";
import {updateColor} from "../../../entities/class/model/thunk/classThunk";
import {onAddAlertOptions} from "../../../features/alert/model/slice/alertSlice";
import {onDelete} from "../../../entities/class/model/slice/classSlice";
import { ClassColorEdit} from "../../../features/classModals/ui";

export const ClassAddColorPage = ({color, setEdit, edit}) => {

    const {register, handleSubmit, setValue} = useForm()
    const [changeName, setChangeName] = useState(false)
    const dispatch = useDispatch()
    const [activeColor, setActiveColor] = useState(false)
    const {request} = useHttp()
    const [colorChange, setColorChange] = useState("")


    const changeColor = (data) => {
        const id = edit.id

        const res = {
            value: colorChange ? colorChange : edit.value,
            ...data
        }
        dispatch(updateColor({id, res}))
        setValue("name", "")
        setChangeName(!changeName)
        dispatch(onAddAlertOptions({
            msg: "rang muvaffaqiyatli o'zgartirildi",
            status: true,
            type: "success"
        }))


    }

    const deleteColor = () => {
        const id = edit.id
        request(`${API_URL}Class/class_colors-delete/${id}/`, "DELETE", null, headers())
            .then(res => {

                dispatch(onDelete({id: id}))
                setChangeName(!changeName)
                setActiveColor(false)
                dispatch(onAddAlertOptions({
                    msg: res.msg,
                    status: true,
                    type: "success"
                }))
            })
            .catch(err => {
                console.log(err)
            })
    }
    return (
        <>
            <ClassColorAddFilter
                color={color}
                edit={edit}
                setEdit={setEdit}
                changeName={changeName}
                setChangeName={setChangeName}
                setValue={setValue}
            />




            <ClassColorEdit
                setActive={setActiveColor}
                active={activeColor}
                edit={edit}
                changeName={changeName}
                setChangeName={setChangeName}
                changeColor={changeColor}
                handleSubmit={handleSubmit}
                register={register}
                colorChange={colorChange}
                setColorChange={setColorChange}
                deleteColor={deleteColor}
            />
        </>
    );
};

