import {createPortal} from 'react-dom';
import classNames from 'classnames';
import React, {memo} from 'react';
import {useTheme} from "../../lib/hooks/useTheme";
import cls from "./modal.module.sass";
import close from "shared/assets/icons/cross.svg";

export const Modal = memo(({children, active, setActive, extraClass, type = "simple", typeIcon}) => {

    const {theme} = useTheme()

    const onClick = (target) => {
        if (target && typeof target.className === 'string') {
            if (target.className.includes('outClose') || target.className.includes('innerClose')) {
                setActive(false);
            }
        }
    };

    if (active) {

        if (type === "simple") {
            return (
                createPortal(
                    <div
                        className={classNames(cls.modal, "outClose", [theme])}
                        onClick={(e) => onClick(e.target)}
                    >
                        <div className={classNames(cls.modal__inner, extraClass)}>
                            {!typeIcon ?
                                <img
                                    className={classNames(cls.modal__close, "innerClose")}
                                    onClick={(e) => onClick(e.target)}
                                    src={close}
                                    alt=""
                                />
                                : null
                            }
                            {children}
                        </div>
                    </div>
                    ,
                    document.body
                )
            );
        }


        return (
            createPortal(
                <div
                    className={classNames(cls.modal, "outClose", [theme])}
                    onClick={(e) => onClick(e.target)}
                >
                    {children}
                </div>,
                document.body
            )
        );
    }
    return null;
})