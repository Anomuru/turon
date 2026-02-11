import {Contract} from "entities/contract";
import cls from "./contractPage.module.sass"

export const ContractPage = () => {
    return (
        <div className={cls.formMain}>
            <Contract/>
        </div>
    );
};

