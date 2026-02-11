import {Button} from "shared/ui/button";
import cls from "../categoryHeader.module.sass"
export const CategoryHeader = ({setActiveModal , activeModal}) => {
    return (
        <div className={cls.categoryHeader} >
            <h2>Qo'shimcha kategoriyalar</h2>
            <Button onClick={() => setActiveModal(!activeModal)} type={"editPlus"}>
                <i className={"fa fa-plus"}/>
            </Button>
        </div>
    );
};

