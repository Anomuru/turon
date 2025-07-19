import cls from "./schoolCurricular.module.sass"
import {useState} from "react";
import classNames from "classnames";


import editIcon from "shared/assets/icons/PencilLine.svg"
import addIcon from "shared/assets/icons/PlusCircle.svg"

const item = [
    {name: "curricular", label: "Curricular",},
    {name: "coCurriculum", label: "Co-curriculum"},
    {name: "dissCurricular", label: "Extra Curricular"},
]
export const SchoolHomeCurricular = ({
                                         data,
                                         setActive,
                                         setDeleteId,
                                         setActiveEdit,
                                         setValue,
                                         setActiveExtraCurricular,
                                         extraCurricularData,
                                         setActiveExtraCurricularEdit,
                                         setDeleteIdExtra,
                                         job

                                     }) => {


    const [active, setActiveItem] = useState(item[0].name)


    const switchTable = () => {
        switch (active) {

            case "curricular" :
                return <Curricular job={job} setValue={setValue} data={data} setActiveEdit={setActiveEdit}
                                   setDeleteId={setDeleteId}/>
            case "dissCurricular" :
                return <DissCurricular job={job} setValue={setValue} setDeleteIdExtra={setDeleteIdExtra}
                                       extraCurricularData={extraCurricularData}
                                       setActiveExtraCurricularEdit={setActiveExtraCurricularEdit}/>

        }
    }


    return (
        <div className={cls.main}>


            <div className={cls.main__header}>
                {item.map((item, i) => (
                    <div className={classNames(cls.main__header_title, {
                        [cls.active]: active === item.name
                    })} onClick={() => item.name !== "coCurriculum" && setActiveItem(item.name)}>
                        {item.label}
                    </div>
                ))}


                {active === "curricular" ?
                    job && <div onClick={() => setActive(true)} className={cls.main__header_add}>
                        <img src={addIcon} alt=""/>
                    </div> : job &&
                    <div onClick={() => setActiveExtraCurricular(true)} className={cls.main__header_add}>
                        <img src={addIcon} alt=""/>
                    </div>
                }
            </div>


            {switchTable()}

        </div>
    );
};


export const Curricular = ({data, setDeleteId, setActiveEdit, setValue, job}) => {

    const renderData = () => {
        return data?.map(item => (
            <div className={`${cls.curricular__wrapper_box} ${cls.curricular__mobile_box}`}>

                {job && <div onClick={() => {

                    setValue("name", item.name)

                    setValue("description", item.description)
                    // setValue("date" , item.date)
                    setDeleteId(item)
                    setActiveEdit(true)
                }}
                             className={cls.curricular__wrapper_edit}

                >
                    <img src={editIcon} alt=""/>
                </div>}

                <div className={cls.curricular__wrapper_box_title}>
                    {item.class}
                    <span>
                        {item.name}
                    </span>
                </div>
                <div className={cls.curricular__wrapper_box_img}>
                    <img className={cls.curricular__mobile_box_img} src={item.images?.map(item => item?.image)} alt=""/>
                </div>

                <div className={cls.curricular__wrapper_box_descr}>
                    {item.description}
                </div>
            </div>
        ))
    }


    const render = renderData()


    return (
        <div className={cls.curricular}>

            <div className={cls.curricular__title}>
                Curricular
            </div>


            <div className={`${cls.curricular__wrapper} ${cls.curricular__mobile}`}>

                {render}
            </div>

        </div>
    )
}


export const DissCurricular = ({
                                   extraCurricularData,
                                   setActiveExtraCurricularEdit,
                                   setDeleteIdExtra,
                                   setValue,
                                   job
                               }) => {


    const renderData = () => {
        return extraCurricularData.map(item => (
            <div className={cls.curricular__extraBox}>

                {job && <div onClick={() => {
                    setValue("name", item.name)
                    setValue("description", item.description)
                    setDeleteIdExtra(item)
                    setActiveExtraCurricularEdit(true)
                }}
                             className={cls.curricular__wrapper_edit}

                >
                    <img src={editIcon} alt=""/>
                </div>}
                <div className={cls.curricular__extraBox_img}>
                    <img src={item?.images?.map(item => item?.image)} alt=""/>
                </div>


                <div className={cls.curricular__extraBox_title}>
                    <div className={cls.curricular__extraBox_descr}>
                        {item.description}
                    </div>
                    <div className={cls.curricular__extraBox_box}>
                        <i className="fas fa-chevron-down"/>
                    </div>


                    {item.name}
                </div>


            </div>
        ))
    }


    const render = renderData()

    return (
        <div className={cls.curricular}>

            <div className={cls.curricular__title}>
                Extra Curricular
            </div>


            <div className={cls.curricular__wrapper}>
                {render}

            </div>

        </div>
    )
}