import {useNavigate} from "react-router";
import {useTheme} from "shared/lib/hooks/useTheme";
import cls from "./studentsHeader.module.sass";
import {Link} from "react-router-dom";
import {Button} from "shared/ui/button";

import {Radio} from "shared/ui/radio";
import React, {useCallback, useState} from "react";

import {API_URL, useHttp} from "../../../../shared/api/base";
import {useSelector} from "react-redux";
import {getBranch} from "../../../../features/branchSwitcher";
import {getSystem} from "../../../../features/themeSwitcher";

export const StudentsHeader = ({onChange, selectedRadio, peoples, setActive, onClick}) => {


    const {theme} = useTheme()
    const branchID = useSelector(getBranch)

    // const onClick = () => {
    //     request(`${API_URL}Students/export-students/?branch=1&format=json` , "GET")
    // }
    const navigate = useNavigate()

    const renderCreateBtn = useCallback(() => {
        // console.log("render header renderCreateBtn")
        return theme === "app_school_theme"
            ?
            <>
                <Button
                    type={"filter"}
                    extraClass={cls.extraCutClass}
                    onClick={() => onClick("create")}
                >
                    Create Class
                </Button>
            </>
            :
            <Link to={":id/createGroup"}>
                <Button
                    type={"filter"}
                    extraClass={cls.extraCutClass}
                >
                    Create group
                </Button>
            </Link>
    }, [theme])

    return (
        <div className={cls.mainContainer}>
            <div className={cls.mainContainer_buttonPanelBox}>
                <div className={cls.mainContainer_buttonPanelBox_leftCreateButton}>
                    {renderCreateBtn()}
                    {
                        theme === "app_school_theme" ? <Button
                            onClick={() => onClick("add")}
                            type={"filter"}
                            extraClass={cls.noneBackground}
                        >
                            Add class
                        </Button> : null
                    }
                    {/*<Link to={"./RGBData/12"}>*/}
                    <Button
                        onClick={() => navigate("RGBData")}
                        type={"filter"}
                    >
                        RB-Baza
                    </Button>
                    {/*</Link>*/}


                </div>
                {/*{branches.length >= 1 ? <Select options={branches} onChangeOption={() => setSelected}*/}
                {/*                                defaultValue={branches[0].name}/> : null}*/}
            </div>
            <div className={cls.mainContainer_filterPanelBox}>
                <Button
                    status={"filter"}
                    extraClass={cls.extraCutClassFilter}
                    onClick={() => setActive("filter")}
                    type={"filter"}
                >
                    Filter
                </Button>
                <a style={{color: "white"}}
                   href={`${API_URL}Students/export-students/?branch=${branchID.id}&format=json`}>
                    <Button type={"simple"}>

                        Exel

                    </Button>
                </a>
                <div className={cls.mainContainer_filterPanelBox_rightFilterRadioGroupBox}>
                    {peoples.map((item, id) => (
                        <Radio
                            key={id}
                            onChange={() => onChange(item.name)}
                            checked={selectedRadio === item.name}
                            extraClasses={selectedRadio === item.name ? cls.activeFilter : null}
                        >
                            {item.label}
                        </Radio>
                    ))}
                </div>
            </div>
        </div>
    )
}