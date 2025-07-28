import {Modal} from "shared/ui/modal";
import {Form} from "shared/ui/form";
import {Input} from "shared/ui/input";
import {Select} from "shared/ui/select";
import cls from "./homeNewForm.module.sass"
import reqImg from "shared/assets/images/request.png"
import {HomeBtnUi} from "shared/ui/homeBtnUi/homeBtnUi";
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";

export const HomeNewForm = ({activeForm, setActiveForm}) => {

    const [formStep, setFormStep] = useState(false)

    useEffect(() => {
        setFormStep(false)
    }, [activeForm])

    const {handleSubmit, register , reset,} = useForm()

    const onClick = (data) => {


        setActiveForm(false)
        reset()
    }


    return (
        <Modal typeIcon active={activeForm} setActive={setActiveForm}>
            <Form extraClassname={cls.form} typeSubmit>
                <div className={cls.form__inputs}>
                    <h2 className={cls.form__title}>Ro’yxatdan o’tish</h2>
                    {!formStep ? <>
                        <Input register={register} name={"username"} extraClassName={cls.form__input} placeholder={"User name"}/>
                        <Input register={register} name={"name"} extraClassName={cls.form__input} placeholder={"Ism"}/>
                        <Input register={register} name={"surname"} extraClassName={cls.form__input} placeholder={"Familiya"}/>
                        <Input register={register} name={"father_name"} extraClassName={cls.form__input} placeholder={"Otasining ismi"}/>
                        <div className={cls.form__numbers}>
                            <Input register={register} name={"seria"}  extraClassName={cls.form__numbers_input} placeholder={"Seriya"}/>
                            <Input register={register} name={"seria_number"} type={"number"} extraClassName={cls.form__numbers_input} placeholder={"Metrka raqami"}/>
                        </div>
                        <Select/>
                        <Select/>
                        <Select/>
                        <HomeBtnUi onClick={handleSubmit(() => setFormStep(true))} type={"formBtn"}
                                   children={"Keyingisi"}/>


                    </> : <>
                        <Input register={register} name={"date"} extraClassName={cls.form__input}  type={"date"}/>
                        <Select/>
                        <Select/>

                        <Input register={register} name={"phone"} type={"number"} extraClassName={cls.form__input} placeholder={"Telefon raqam"}/>
                        <Input register={register} name={"parent_phone"} type={"number"} placeholder={"Ota - ona raqami"} extraClassName={cls.form__input}/>
                        <Input register={register} name={"parent_name"} placeholder={"Ota - ona Ism Familiyasi"} extraClassName={cls.form__input}/>
                        <div className={cls.form__numbers}>
                            <Input register={register} name={"parent_seria"} extraClassName={cls.form__numbers_input} placeholder={"Ota-ona Passport Seriya"}/>
                            <Input register={register} name={"parent_seria_number"} type={"number"} extraClassName={cls.form__numbers_input} placeholder={"Seriya raqami"}/>
                        </div>
                        <Select/>

                        <HomeBtnUi onClick={handleSubmit(onClick)} type={"formBtn"}
                                   children={"Yuborish"}/>
                    </>}
                </div>
                <div className={cls.form__img}>
                    <img src={reqImg} alt=""/>
                </div>
            </Form>
        </Modal>
    );
};

