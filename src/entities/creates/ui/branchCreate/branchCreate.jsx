import {Input} from "shared/ui/input";
import {Form} from "shared/ui/form";
import {Button} from "shared/ui/button";
import cls from "../../creates.module.sass"

import {useDispatch, useSelector} from "react-redux";

import {useForm} from "react-hook-form";
import {createBranchThunk, getLocationThunk} from "../../model/createThunk/createBranchThunk";
import {Select} from "../../../../shared/ui/select";
import {getLocation} from "../../../editCreates";
import {useEffect, useState} from "react";
import {getLoading} from "../../../editCreates/model/selector/locationSelector";
import {DefaultLoader, DefaultPageLoader} from "../../../../shared/ui/defaultLoader";
import {Modal} from "../../../../shared/ui/modal";
import {getBranchThunk} from "../../../editCreates";
import {onAddAlertOptions} from "../../../../features/alert/model/slice/alertSlice";




export const BranchCreate = ({active , setActive , loading}) => {
    const {register, handleSubmit, setValue} = useForm()

    const [select, setSelected] = useState([])
    const dispatch = useDispatch()

    const getLocationId = useSelector(getLocation)



    useEffect(() => {
        dispatch(getLocationThunk())
    }, [])
    //
    //
    const onClick = (data) => {
        const res = {
            ...data,
            location: select
        }
        dispatch(onAddAlertOptions({
            status: true,
            type: 'success',
            msg: "maʼlumotlari muvaffaqiyatli qushildi."
        }))
        dispatch(createBranchThunk(res))
        dispatch(getBranchThunk())
        setValue("name", "")
        setValue("number", "")
        setValue("location_text", "")
        setValue("code", "")
        setValue("phone_number", "")
        // setValue("number" , "")
        setActive(!active)
    }

    return loading ? <DefaultPageLoader/> :  (
        <Modal setActive={setActive} active={active}>
            <div className={cls.formMain}>
                <div className={cls.formBox}>
                    <h1 className={cls.formTitle}>Branches</h1>
                    <Form onSubmit={handleSubmit(onClick)} extraClassname={cls.form} typeSubmit={""}>
                        <Select options={getLocationId} title={"System_id"} onChangeOption={setSelected}/>
                        <Input register={register} name={"name"} placeholder={"Name"}/>
                        <Input register={register} name={"number"} placeholder={"Number"}/>
                        <Input register={register} name={"location_text"} placeholder={"Location"}/>
                        <Input register={register} name={"code"} type={"number"} placeholder={"Code"}/>
                        <Input register={register} name={"phone_number"} type={"number"} placeholder={"Phone Number"}/>
                        <Button children={"create"}/>
                    </Form>
                </div>
            </div>
        </Modal>
    );
};



