import React from 'react';
import cls from "./leadTasks.module.sass";
import pen from "shared/assets/icons/edit_icon.svg";
import {Button} from "shared/ui/button";

export const LeadTasks = () => {
    return (
        <div className={cls.tasks}>
            <div className={cls.tasks__wrapper}>
                <div className={cls.task}>
                    <div className={cls.task__header}>
                        <h1>Tel qilish kerak</h1>
                        <div className={cls.change}>
                            <img src={pen} alt=""/>
                        </div>
                    </div>
                    <div className={cls.comment}>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. At illum necessitatibus obcaecati quae quibusdam, quis rem! Aliquid amet atque, ea et ex, illo inventore laudantium necessitatibus odio provident reiciendis tempora.
                    </div>
                    <div className={cls.task__footer}>
                        <Button type={"danger"}>Delete</Button>
                        <Button status={"checked"} type={"success"}>Complete</Button>
                    </div>
                </div>
            </div>

            <div className={cls.tasks__form}>
                <form action="">
                    <input defaultValue={"Telefon qilish kerak"} type="text" className={cls.title}/>
                    <input type="datetime-local" className={cls.date}/>
                    <textarea placeholder={"comment"} className={cls.comment} name="" id="" cols="30" rows="10"></textarea>
                    <hr/>
                    <Button>Save</Button>
                </form>
            </div>
        </div>
    );
};

