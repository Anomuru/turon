import {Modal} from "../../../../shared/ui/modal";
import {Form} from "../../../../shared/ui/form";
import cls from "../../../../entities/class/ui/classTable/classTable.module.sass";
import {Input} from "../../../../shared/ui/input";
import {HexColorPicker} from "react-colorful";
import {useForm} from "react-hook-form";

export const ClassColorAdd = ({
                                  createColor,
                                  setCreateColor,
                                  addColor,

                                  color,
                                  setColor,
                              }) => {

    const {register, handleSubmit} = useForm()

    return (
        <Modal active={createColor} setActive={setCreateColor}>
            <h2>Rang qo'shish</h2>
            <div>
                <Form extraClassname={cls.extraClassForm} onSubmit={handleSubmit(addColor)}>
                    <Input name={"name"} register={register}/>
                    <div className={cls.changeColorItem}>

                        <div className={cls.color}>
                            <h2>Tanlangan rang : </h2>
                            <div style={{fontSize: "2rem"}}>{color}</div>
                            {/*<div className={cls.modalBox} style={{background: color}}></div>*/}
                        </div>
                        <HexColorPicker style={{width: "30rem", height: "15rem"}} color={color}
                                        onChange={setColor}/>


                    </div>
                </Form>
            </div>
        </Modal>
    );
};

