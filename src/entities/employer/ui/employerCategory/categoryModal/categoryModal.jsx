import {Modal} from "shared/ui/modal";
import {Form} from "shared/ui/form";
import {Input} from "shared/ui/input";
import {Button} from "shared/ui/button";
import cls from "../category.module.sass"

export const CategoryModal = ({register, handleSubmit, onClick, activeCategory, setActiveCategory}) => {
    return (
        <div>
            <Modal active={activeCategory} setActive={setActiveCategory}>
                <div className={cls.categoryModal}>
                    <h2>Ma’lumot qo’shish</h2>

                    <Form typeSubmit={""} onSubmit={handleSubmit(onClick)}>
                        <Input register={register} name={"name"} required/>
                        <Input register={register} name={"salary"} type={"number"} required/>
                        <div style={{display: "flex", justifyContent: "center"}}>
                            {/*<Button type={"danger"}>O'chirish <i className={"fa fa-trash"}/></Button>*/}
                            <Button type={"simple"}>Qo'shish</Button>
                        </div>
                    </Form>
                </div>
            </Modal>
        </div>
    );
};

export const CategoryEditModal = ({register, handleSubmit, onClick, activeCategory, setActiveCategory, deleteBtn}) => {
    return (
        <div>
            <Modal active={activeCategory} setActive={setActiveCategory}>
                <div className={cls.categoryModal}>
                    <h2>Ma’lumot qo’shish</h2>

                    <Form typeSubmit={""}>
                        <Input register={register} name={"name"} required/>
                        <Input register={register} name={"salary"} type={"number"} required/>
                        <div style={{display: "flex", justifyContent: "space-between"}}>
                            <Button onClick={handleSubmit(deleteBtn)} type={"danger"}>O'chirish <i
                                className={"fa fa-trash"}/></Button>
                            <Button onClick={handleSubmit(onClick)} type={"simple"}>Tastiqlash</Button>
                        </div>
                    </Form>
                </div>
            </Modal>
        </div>
    );
};

