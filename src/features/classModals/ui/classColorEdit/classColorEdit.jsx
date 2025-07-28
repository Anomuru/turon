import {Modal} from "../../../../shared/ui/modal";
import {Form} from "../../../../shared/ui/form";
import cls from "../../../../entities/class/ui/classTable/classTable.module.sass";
import {Input} from "../../../../shared/ui/input";
import {HexColorPicker} from "react-colorful";
import {Button} from "../../../../shared/ui/button";
import {ConfirmModal} from "../../../../shared/ui/confirmModal";

export const ClassColorEdit = ({

                                   handleSubmit,
                                   register,
                                   setActive,
                                   active,
                                   changeName,
                                   setChangeName,
                                   changeColor,
                                   setColorChange,
                                   colorChange,
                                   deleteColor,
                                   edit
}) => {
    console.log(edit)
    return (
        <Modal active={changeName} setActive={setChangeName}>
            <h2>Rangni oz'gartirish yoki O'chirish</h2>
            <div>

                <Form extraClassname={cls.extraClassForm} typeSubmit={""}>
                    <Input name={"name"} register={register}/>
                    <div className={cls.changeColorItem}>

                        <div className={cls.color}>
                            <h2>Tanlangan rang :</h2>
                            <div style={{fontSize: "2rem"}}>{colorChange ? colorChange : edit?.value}</div>
                        </div>
                        <HexColorPicker style={{width: "30rem", height: "15rem"}} color={edit?.value}
                                        onChange={setColorChange}/>

                    </div>
                    <div style={{display: "flex", gap: "2rem"}}>
                        <Button onClick={handleSubmit(changeColor)}>Rangni o'zgartirish</Button>
                        {edit?.status ? <Button onClick={handleSubmit(() => setActive(!active))} type={"danger"}>Rangni
                            O'chirish</Button> : null}
                    </div>
                    <ConfirmModal setActive={setActive} active={active} onClick={handleSubmit(deleteColor)}
                                  type={"danger"}/>
                </Form>


            </div>
        </Modal>
    );
};

