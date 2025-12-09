import {Button} from "../../../../shared/ui/button/index.js";
import {Input} from "../../../../shared/ui/input/index.js";
import cls from "./parentProfileInfo.module.sass"
import profilePic from "shared/assets/images/user_image.png"

export const ParentsProfileInfo = () => {
    return (
        <div className={cls.info}>


            <img src={profilePic} className={cls.info__img} alt=""/>
            <Input title={"Username"}/>
            <Input title={"Familiya"}/>
            <Input title={"Ism"}/>
            <Input title={"Tel raqam"}/>
            <Input title={"Tug'ilgan kuni"}/>
            <Input title={"Manzil"}/>
            {/*<Button>O'zgartirish</Button>*/}


        </div>
    );
};

