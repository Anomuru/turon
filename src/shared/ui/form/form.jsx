import {memo} from 'react';
import classNames from "classnames";

import cls from "./form.module.sass"

export const Form = memo(({id, extraClassname, onSubmit, children, typeSubmit= "inside"}) => {
    return (
        <form
            id={id}
            className={classNames(cls.form, extraClassname)}
            onSubmit={onSubmit}
        >

            {children}

            {
                typeSubmit === "inside"
                    ?
                    <input value={"Tasdiqlash"} className={`${cls.submit} ${extraClassname}`} type="submit"/>
                    :
                    null
            }

        </form>
    );
})