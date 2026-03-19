import {Button} from "shared/ui/button";
import cls from "./capitalOutsideHeader.module.sass"

export const CapitalOutsideHeader = ({caunt, active, setActiveModal, isCanAdd}) => {
    return (
        <div className={cls.header}>
            <div className={cls.header__top}>
                {/*<RequirePermission permission={isCanAdd}>*/}
                    <Button
                        onClick={() => setActiveModal(!active)}
                        children={<i className={"fa fa-plus"}/>} type={"editPlus"}
                    />
                {/*</RequirePermission>*/}
            </div>

            <div className={cls.header__info}>
                <h1 className={cls.header__title}>Capital</h1>
                <span className={cls.header__count}>
                    Jami (Down cost):
                    <strong>{caunt}</strong>
                </span>
            </div>
        </div>
    );
};
