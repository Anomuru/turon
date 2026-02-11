import classNames from "classnames";
import cls from "./homeBtnUi.module.sass"
export const HomeBtnUi = ({children , onClick , extraClass , icon , type}) => {
    return (
        <button onClick={onClick} className={classNames(cls.button , extraClass , {
            [cls.disabled] : type === "disabled",
            [cls.submit] : type === "submit",
            [cls.request] : type === "request",
            [cls.formBtn] : type === "formBtn",
            [cls.contact] : type === "contact",
            [cls.download] : type === "download",
            [cls.downloadWhite] : type === "downloadWhite",

        })}>
            {children} {icon}
        </button>
    );
};

