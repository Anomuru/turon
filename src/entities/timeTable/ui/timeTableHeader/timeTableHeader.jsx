import {memo} from 'react';
import classNames from "classnames";

import {Button} from "shared/ui/button";
import {Select} from "shared/ui/select";
// import {Radio} from "shared/ui/radio";
// import {studentsType} from "../../model/consts";

import cls from "./timeTableHeader.module.sass";

export const TimeTableHeader = memo((props) => {

    const {
        isCreate,
        setIsCreate,
        setIsFilter,
        setStatus
    } = props

    // const [activeStudentType, setActiveStudentType] = useState("")

    return (
        <div className={cls.header}>
            <div className={cls.header__container}>
                <Button
                    onClick={() => {
                        setIsCreate(!isCreate)
                        setStatus(false)
                    }}
                    type={isCreate ? "simple" : "simple-add"}
                    extraClass={classNames(cls.inner__btn, isCreate ? "" : cls.active)}
                >
                    Create Time
                </Button>
                {/*<Select title={"Branch"}/>*/}
            </div>
            {/*<div className={cls.header__container}>*/}
            {/*    <Button*/}
            {/*        onClick={() => setIsFilter(true)}*/}
            {/*        type={"filter"}*/}
            {/*        status={"filter"}*/}
            {/*    >*/}
            {/*        Filter*/}
            {/*    </Button>*/}
                {/*<div className={cls.inner}>*/}
                {/*    {*/}
                {/*        studentsType.map(item =>*/}
                {/*            <Radio*/}
                {/*                value={item}*/}
                {/*                onChange={setActiveStudentType}*/}
                {/*                checked={item === activeStudentType}*/}
                {/*            >*/}
                {/*                {item}*/}
                {/*            </Radio>*/}
                {/*        )*/}
                {/*    }*/}
                {/*</div>*/}
            {/*</div>*/}
        </div>
    )
})
