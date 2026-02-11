
import {Input} from "shared/ui/input";
import {Form} from "shared/ui/form";
import {Button} from "shared/ui/button";
import cls from "../../creates.module.sass"
import {useForm} from "react-hook-form";
import {useDispatch} from "react-redux";
import {postEducationThunk} from "../../model/createThunk/education";
import {Modal} from "../../../../shared/ui/modal";
import {getEducationThunk} from "../../../editCreates/model/thunk/educationThunk";

export const EducationCreate = ({active , setActive}) => {



    const {register , handleSubmit,setValue} = useForm()

    const dispatch = useDispatch()

    const onClick = (data) => {
        dispatch(postEducationThunk(data))
        dispatch(getEducationThunk())
        setValue("name" , "")
        setActive(!active)

    }
    return (
        <Modal active={active} setActive={setActive}>
            <div className={cls.formMain}>
                <div className={cls.formBox}>
                    <h1 className={cls.formTitle}>Education </h1>
                    <Form onSubmit={handleSubmit(onClick)} extraClassname={cls.form} typeSubmit={""}>
                        <Input name={"name"} register={register} title={"Name"}/>
                        <Button children={"create"}/>
                    </Form>
                </div>
            </div>
        </Modal>
    );
};