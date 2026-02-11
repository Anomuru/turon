import {Modal} from "../../../../shared/ui/modal";
import cls from "../../../../entities/class/ui/classTable/classTable.module.sass";
import {Form} from "../../../../shared/ui/form";
import {Input} from "../../../../shared/ui/input";
import {Button} from "../../../../shared/ui/button";
import {useForm} from "react-hook-form";

export const ClassHeaderEdit = ({
                                    activeEdit,
                                    setActiveEdit,
                                    onClick,
                                    edit,
                                    onDelete,
                                }) => {

    const {register, handleSubmit, setValue} = useForm()

    return (
        <Modal active={activeEdit} setActive={setActiveEdit}>

            <div className={cls.modalHeader}> {edit?.name} <span>ni o'zgartirish</span></div>
            <div>
                <Form typeSubmit={""} extraClassname={cls.extraClassForm}>
                    <Input name={"name"} register={register}/>
                    <div className={cls.modalBtn}>
                        <Button onClick={handleSubmit(onClick)}>
                            Tastiqlash
                        </Button>
                        <Button onClick={handleSubmit(onDelete)} type={"danger"}>
                            O'chirish
                            <i className={"fa fa-trash"}/>
                        </Button>
                    </div>
                </Form>
            </div>
        </Modal>
    );
};

