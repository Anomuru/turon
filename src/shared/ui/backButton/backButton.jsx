import React from 'react';
import {Button} from "shared/ui/button";
import cls from "./backButton.module.sass";
import classNames from "classnames";
import {useNavigate} from "react-router";

const BackButton = ({onClick,to = -1,className}) => {




    const navigate = useNavigate()



    return (
        <Button
            onClick={ () => onClick ? onClick() : navigate(to)}
            extraClass={classNames(cls.backButton,className)}
            type={"simple-add"}
        >
            <i className="fas fa-arrow-left-long"/>
            Orqaga
        </Button>

    );
};

export default BackButton;