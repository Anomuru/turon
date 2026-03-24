import {memo} from "react";

import cls from "./capitalInsideHeader.module.sass"
import classNames from "classnames";


export const CapitalInsideHeader = memo(({activeMenu, setActiveMenu, categoryMenu}) => {

    const renderTypes = () => {

          return categoryMenu.map(item => (
                <button key={item.name} type="button" onClick={() => setActiveMenu(item.name)} className={classNames(cls.itemName, {
                    [cls.active]: activeMenu === item.name
                })}>
                    {item.label}
                </button>
            ))

    }


    const render = renderTypes()

    return (
        <div className={cls.capitalHeader}>
            <div className={cls.capitalWrapper}>
                {render}

            </div>

        </div>
    );
})