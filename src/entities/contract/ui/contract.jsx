import {Form} from "shared/ui/form";
import {Input} from "../../../shared/ui/input";
import cls from "./contract.module.sass"
import {useForm} from "react-hook-form";
export const Contract = () => {

    const {register , handleSubmit ,setValue} = useForm()


    const onClickForm = (data) => {
        setValue("name" , "")
        setValue("campusName" , "")
        setValue("code" , "")
        setValue("director" , "")
        setValue("locationType" , "")
        setValue("district" , "")
        setValue("bankSheet" , "")
        setValue("inn" , "")
        setValue("mfo" , "")
        setValue("number" , "")
    }
    return (
        <div className={cls.form}>

            <Form extraClassname={cls.btn} onSubmit={handleSubmit(onClickForm)}>
                <Input register={register} name={"name"} title={"Name"}/>
                <Input register={register} name={"campusName"}  title={"Campus name"}/>
                <Input register={register} name={"code"} title={"Code"}/>
                <Input register={register} name={"director"} title={"Director"}/>
                <Input register={register} name={"locationType"} title={"Location type"}/>
                <Input register={register} name={"district"} title={"District"}/>
                <Input register={register} name={"bankSheet"} title={"Bank sheet"}/>
                <Input register={register} name={"inn"} title={"INN"}/>
                <Input register={register} name={"bank"} title={"Bank"}/>
                <Input register={register} name={"mfo"} title={"MFO"}/>
                <Input register={register} name={"number"} title={"Tel"} type={"number"}/>

            </Form>

        </div>
    );
};

