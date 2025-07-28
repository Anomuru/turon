import {Input} from "shared/ui/input";
import {Form} from "shared/ui/form";
import {Button} from "shared/ui/button";
import cls from "../../creates.module.sass"
import {Select} from "shared/ui/select";
import {useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import {createLocationThunk} from "../../model/createThunk/locationThunk";

import {useCallback, useEffect, useState} from "react";
import {Modal} from "shared/ui/modal";


export const LocationCreate = ({active , setActive}) => {

    const {register, handleSubmit, setValue} = useForm()
    const [select, setSelect] = useState([])

    const dispatch = useDispatch()


    const onClick = (data) => {
        const res = {
            ...data,

        }
        dispatch(createLocationThunk(res))
        dispatch(getLocationThunk())
        setActive(!active)
        setValue("name", "")
        setValue("number", "")
    }


    return (
       <Modal setActive={setActive} active={active}>
           <div className={cls.formMain}>
               <div className={cls.formBox}>
                   <h1 className={cls.formTitle}>Location</h1>
                   <Form onSubmit={handleSubmit(onClick)} extraClassname={cls.form}>
                       <Input register={register} name={"name"} placeholder={"Name"}/>
                       <Input placeholder={"Number"} register={register} name={"number"}/>
                   </Form>
               </div>
           </div>
       </Modal>
    );
};