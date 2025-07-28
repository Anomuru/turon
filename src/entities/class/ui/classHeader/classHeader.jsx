import {HexColorPicker} from "react-colorful";

import cls from "./classHeader.module.sass"

import {useState} from "react";

import {Button} from "shared/ui/button";
import {useForm} from "react-hook-form";

import {ClassSwitch} from "../../../../pages/classPage/ui/switch/switch";
import {API_URL, headers, useHttp} from "../../../../shared/api/base";
import {useDispatch} from "react-redux";
import {createClassType, createColor, updateClassType} from "../../model/thunk/classThunk";

import {onAddAlertOptions} from "../../../../features/alert/model/slice/alertSlice";
import {onDeleteTypes} from "../../model/slice/classSlice";
import {
    ClassColorAdd,

    ClassHeaderAdd,
    ClassHeaderEdit,

} from "../../../../features/classModals/ui";


export const ClassHeader = ({
                                setActiveSwitch,
                                activeSwitch,
                                setActiveEdit,
                                activeEdit,
                                edit,
                                setEdit,
                                activeMenu,
                                setActiveMenu
                            }) => {
    const [color, setColor] = useState("#ffffff")

    const {request} = useHttp()

    const dispatch = useDispatch()
    // const [changeName, setChangeName] = useState(false)


    const [addClass, setAddClass] = useState(false)

    const [active, setActive] = useState(false)
    const [createColorModal, setCreateColor] = useState(false)
    const {register, handleSubmit, setValue} = useForm()

    const editClassName = (data) => {
        const {id} = edit
        setActiveEdit(!activeEdit)


        dispatch(updateClassType({id, data}))

    }

    const createClass = (data) => {
        dispatch(createClassType(data))
        setAddClass(!addClass)


    }

    const onDelete = () => {
        const id = edit.id
        request(`${API_URL}Class/class_types/${id}`, "DELETE", null, headers())
            .then(res => {
                dispatch(onDeleteTypes({id: id}))
                dispatch(onAddAlertOptions({
                    type: "success",
                    status: true,
                    msg: res.msg
                }))
                setActiveEdit(!activeEdit)
            })
            .catch(err => {
                console.log(err)
            })
    }
    const addColor = (data) => {
        const res = {
            value: color,
            ...data
        }
        setCreateColor(!createColorModal)

        dispatch(createColor(res))

    }
    return (
        <div className={cls.header}>
            <div className={cls.header__btn}>
                <div onClick={() => setActive(!active)} className={cls.header__changeColor}>
                    <ClassSwitch onSwitch={() => setActiveSwitch(!activeSwitch)} isActive={activeSwitch}/>

                </div>
                {activeSwitch ?
                    <div style={{display: "flex"}}>
                        <Button
                            onClick={() => {
                                setAddClass(!addClass)
                                setEdit(!edit)
                                setValue("name", "sardor")
                            }}
                            type={"editPlus"}>
                            <i className="fa fa-plus"/>
                        </Button>


                        <Button
                            onClick={() => {
                                setActiveEdit(!activeEdit)
                                setValue("name" , edit.name)

                            }}
                            type={"editPlus"}> <i
                            className="fa fa-pen"/></Button>
                    </div> :
                    <div style={{display: "flex"}}>
                        <Button
                            onClick={() => {
                                setCreateColor(!createColorModal)
                                setValue("name" , edit.name)
                            }}
                            type={"editPlus"}>
                            <i className="fa fa-plus"/>
                        </Button>


                        {/*<Button*/}
                        {/*    onClick={() => setChangeName(!changeName)}*/}
                        {/*    type={"editPlus"}> <i className="fa fa-pen"/>*/}
                        {/*</Button>*/}


                    </div>}
            </div>


            <ClassColorAdd
                color={color}
                setColor={setColor}
                createColor={createColorModal}
                setCreateColor={setCreateColor}
                addColor={addColor}
            />
            <ClassHeaderAdd
                createClass={createClass}
                addClass={addClass}
                setAddClass={setAddClass}
            />
            <ClassHeaderEdit
                edit={edit}
                onClick={editClassName}
                activeEdit={activeEdit}
                setActiveEdit={setActiveEdit}
                onDelete={onDelete}
            />



        </div>
    )
}