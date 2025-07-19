import {memo} from "react";

import cls from "./capitalInsideHeader.module.sass"
import classNames from "classnames";


export const CapitalInsideHeader = memo(({activeMenu, setActiveMenu, categoryMenu}) => {

    const renderTypes = () => {

          return categoryMenu.map(item => (
                <h2 key={item.name} onClick={() => setActiveMenu(item.name)} className={classNames(cls.itemName, {
                    [cls.active]: activeMenu === item.name
                })}>
                    {item.label}

                </h2>
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