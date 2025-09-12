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
import {Modal} from "shared/ui/modal/index.js";

export const StudentsHeader = ({onChange, selectedRadio, peoples, setActive, onClick , setActiveClass , totalCount , loadingStudents}) => {



    const branchID = useSelector(getBranch)


    const [activeModal , setActiveModal] = useState(false)

    // const onClick = () => {
    //     request(`${API_URL}Students/export-students/?branch=1&format=json` , "GET")
    // }
    const navigate = useNavigate()


    return (
        <div className={cls.mainContainer}>
            <div className={cls.mainContainer_buttonPanelBox}>
                <div className={cls.mainContainer_buttonPanelBox_leftCreateButton}>
                    <Button onClick={() => setActiveModal(true)}>Class Items</Button>

                    <Button
                        status={"filter"}
                        extraClass={cls.extraCutClassFilter}
                        onClick={() => setActive("filter")}
                        type={"filter"}
                    >
                        Filter
                    </Button>
                    <Button
                        onClick={() => navigate("RGBData")}
                        type={"filter"}
                    >
                        RB-Baza
                    </Button>
                    <Button
                        onClick={() => navigate("attendance")}
                        type={"filter"}
                    >
                        Davomat
                    </Button>

                    <a style={{color: "white"}}
                       href={`${API_URL}Students/export-students/?branch=${branchID?.id}&format=json`}>
                        <Button type={"simple"}>
                            Exel
                        </Button>
                    </a>
                    {/*</Link>*/}


                </div>
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
                {/*{branches.length >= 1 ? <Select options={branches} onChangeOption={() => setSelected}*/}
                {/*                                defaultValue={branches[0].name}/> : null}*/}
            </div>

            <h2 style={{marginTop: "30px" , textAlign: "end"}}>{loadingStudents ? "Loading..." : `Umumiy soni : ${totalCount}`}</h2>

            <Modal active={activeModal} setActive={setActiveModal}>

                {/*<h2>Class Settings</h2>*/}
               <div style={{padding: "2rem"}}>
                   <div style={{display: "flex"}}>
                       <Button
                           type={"filter"}
                           extraClass={cls.extraCutClass}
                           onClick={() => onClick("create")}
                       >
                           Create Class
                       </Button>
                       <Button
                           onClick={() => onClick("add")}
                           type={"filter"}
                           extraClass={cls.noneBackground}
                       >
                           Add class
                       </Button>
                   </div>
                    <Button
                       status={"filter"}
                       onClick={() => setActiveClass(true)}
                       type={"filter"}
                   >
                       Sinfga raqamini o'zgartirish
                   </Button>
               </div>
            </Modal>
        </div>
    )
}