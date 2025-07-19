import React, {useEffect, useState} from 'react';
import classNames from "classnames";

import cls from "./radio.module.sass"


export const Radio = ({name, id, value, onChange, checked, children, disabled , extraClasses}) => {

    const [active, setActive] = useState(false)
    useEffect(() => {
        setActive(checked)
    }, [checked])

    return (
        <label htmlFor={id} className={classNames(cls.radioLabel , extraClasses)}>
            <input
                disabled={disabled}
                className={cls.radioInput}
                type="radio"
                name={name}
                id={id}
                value={value}
                onChange={(e) => {
                    onChange(value)
                    setActive(e.target.checked)
                }}
                checked={checked}
            />
            <div className={cls.wrapper}>
				<span className={classNames(cls.customRadio, {
                    [cls.active]: active
                })}/>
            </div>
            <span className={cls.text}>
				{children}
			</span>
        </label>
    );
};