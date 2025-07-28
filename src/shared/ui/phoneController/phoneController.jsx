import React from 'react';
import PhoneInput from "react-phone-input-2";
import {Controller} from "react-hook-form";
import classNames from "classnames";

import cls from "./phoneController.module.sass"
export const PhoneController = ({name  , control , rules , onChange , onChangeState , canChange , extraClass , typeClass   }) => {
    return (
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field }) => (
                <PhoneInput
                    inputClass={classNames(cls.label__input, extraClass , {
                        [cls.form] : typeClass === "form"
                    })}
                    specialLabel={''}
                    country={'uz'}
                    value={field.value}
                    onChange={(value) => {
                        if (canChange) {
                            field.onChange(value);
                            if (onChange) onChange(value);
                            if (onChangeState) onChangeState(value);
                        }
                    }}
                />
            )}
        />
    );
};

