import {Modal} from "../../../../shared/ui/modal";
import {Form} from "../../../../shared/ui/form";
import cls from "../../../../entities/class/ui/classTable/classTable.module.sass";
import {Input} from "../../../../shared/ui/input";
import {useForm} from "react-hook-form";

export const ClassHeaderAdd = ({
                                   setAddClass,
                                   addClass,
                                   createClass,
                               }) => {

    const {register, handleSubmit, setValue} = useForm()

    return (

        <Modal active={addClass} setActive={setAddClass}>
            <h2>Sinf turi yaratish </h2>
            <div>
                <Form extraClassname={cls.extraClassForm} onSubmit={handleSubmit(createClass)}>
                    <Input placeholder={"sinf nomi"} name={"name"} register={register}/>
                </Form>
            </div>
        </Modal>
    );
};

