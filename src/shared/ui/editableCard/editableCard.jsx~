import {memo} from 'react';
import classNames from "classnames";

import cls from "./editableCard.module.sass";
import beetwean from "shared/assets/images/in.png";
import cross from "shared/assets/icons/cross.svg";

export const EditableCard = memo(({extraClass, children, title, titleType = true, onClick}) => {
    return (
        <div className={classNames(cls.editableCard, extraClass)}>
            {
                title || titleType ? <div
                    className={classNames(cls.editableCard__edit, {
                        [cls.cross]: titleType==="cross"
                    })}
                    onClick={onClick}
                >
                    {titleType==="cross" ? <img src={cross} alt=""/> : title ?? <img src={beetwean} alt=""/>}
                </div> : null
            }
            {children}
        </div>
    );
})