import React, { useState } from 'react';
import cls from "./input.module.sass";
import classNames from "classnames";

export const Input = React.memo(({
                                     type,
                                     defaultValue,
                                     value,
                                     register,
                                     title = "",
                                     required,
                                     pattern,
                                     name,
                                     subTitle = "",
                                     errors,
                                     placeholder,
                                     onChange,
                                     style,
                                     extraClassName,
                                     disabled,
                                     extraValues,
                                     checkboxTitle,
                                     checked,
                                     onBlur,
                                     titleColor,

                                 }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [silk, setSilk] = useState("");





    return register ? (
        <label style={style} className={cls.inputLabel} htmlFor={name}>
            {title || subTitle   ? (
                <div className={cls.info}>
                    {(title) && <span className={titleColor} >{title}</span>}
                    {subTitle && <span>{subTitle}</span>}
                </div>
            ) : null}
            <div className={cls.field}>
                <input
                    required={required}
                    disabled={disabled}
                    placeholder={placeholder}
                    id={name}
                    className={classNames(cls.input, extraClassName, {
                        [`${cls?.error}`]: errors?.[name]
                    })}
                    type={showPassword ? "text" : type}
                    {...register(name, {
                        pattern: pattern,
                        defaultValue: defaultValue,
                        value: value,
                        ...extraValues,
                    })}
                />

                {type === "password" && (
                    <div className={cls.eye} onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? (
                            <i className="fa-solid fa-eye" />
                        ) : (
                            <i className="fa-solid fa-eye-slash" />
                        )}
                    </div>
                )}
            </div>

            {
                errors ? <div className={cls.message}>
                    {errors?.[name] && (
                        <span className={cls.message__error}>
                        {errors[name].message}
                    </span>
                    )}
                </div> : null
            }

        </label>
    ) : (
        <label style={style} className={cls.inputLabel} htmlFor={name}>
            <div className={cls.info}>
                {title && <span>{title}</span>}
                {subTitle && <span>{subTitle}</span>}
            </div>
            <div className={cls.field}>
                <input
                    disabled={disabled}
                    id={name}
                    className={classNames(cls.input, extraClassName, {
                        [cls.error]: errors?.[name]
                    })}
                    defaultValue={defaultValue}
                    value={value}
                    type={showPassword ? "text" : type}
                    pattern={pattern}
                    required={required}
                    placeholder={placeholder}
                    onChange={onChange}
                    onBlur={onBlur}
                    checked={checked}
                    {...extraValues}
                />

                {type === "password" && (
                    <div className={cls.eye} onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? (
                            <i className="fas fa-eye"></i>
                        ) : (
                            <i className="fas fa-eye-slash"></i>
                        )}
                    </div>
                )}
                {type === "checkbox" && (
                    <div className={cls.field__checkbox}>
                        {checkboxTitle && <span>{checkboxTitle}</span>}
                    </div>
                )}
            </div>
        </label>
    );
});
