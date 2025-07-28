import cls from "./schoolHomeContactUs.module.sass"
import backImg from "shared/assets/images/turonBack.svg"
import {Button} from "../../../../shared/ui/button";
import {Form} from "../../../../shared/ui/form";
import {Input} from "../../../../shared/ui/input";
import {Textarea} from "../../../../shared/ui/textArea";
import React from "react";


export const SchoolHomeContactUs = ({job, setActiveEditItem, setActive, data, setValue}) => {

    const render = () => {
        return data.map(item => (
            <div className={cls.box}>
                <img src={item.img} alt=""/>
                <h3>{item.title}</h3>
            </div>
        ))
    }
    const myStyle = {
        backgroundImage: `url(${backImg})`
    }


    return (
        <>
            <div style={myStyle} className={cls.school}>
                <div className={cls.title}>
                    Contact us
                </div>
                <div className={cls.mainFormBox}>
                    <div className={cls.descr}>

                        We are here to assist you! If you have any questions, need more information, or would like to
                        get in
                        touch with us, please don’t hesitate to reach out. Our team is ready to help.
                        You can contact us via phone, email, or by filling out the form on our website. We look forward
                        to
                        hearing from you
                    </div>
                    <div className={cls.mainRightBox}>

                        <h1>Send message</h1>
                        <Form  extraClassname={cls.form}>
                            <Input extraClassName={cls.inputMsg} placeholder={"Full name"}/>
                            <hr/>
                            <Input extraClassName={cls.inputMsg} type={"number"} placeholder={"Phone"}/>
                            <hr/>
                            <Textarea extraClassName={cls.inputMsg} placeholder={"Type your message"}/>
                            <hr/>
                            {/*<Button children="Yuborish" extraClass={cls.submitBtn}/>*/}
                        </Form>

                    </div>
                </div>
            </div>

        </>
    );
};

