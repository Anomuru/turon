import cls from "./schoolHomeLastestNew.module.sass"


import editIcon from "shared/assets/icons/edittTuron.svg"
import addIcon from "shared/assets/icons/PlusCircle.svg"
import {useSelector} from "react-redux";
import {getHomePageType} from "../../model/selector/getHomePageSelector";


export const SchoolHomeLatestNew = ({data, setValue, setEdit, add, setAdd, setDeleteId, job}) => {




    const renderData = () => {
        return data?.map(item => (
            <div className={cls.main__box}>
                <div className={cls.main__box_img}>

                    {job && <div onClick={() => {
                        setEdit(true)
                        setValue("name", item.name)
                        setValue("description", item.description)
                        setValue("date", item.date)
                        setDeleteId(item)
                    }}
                                 className={cls.main__edit}
                    >
                        <img src={editIcon} alt=""/>
                    </div>}
                    <img src={item?.images.map(item => item.image)} alt=""/>
                </div>

                <div className={cls.main__box_main}>
                    <div className={cls.main__box_date}>
                        {item.date}
                    </div>

                    <div className={cls.main__box_title}>

                        {item?.name}
                    </div>
                    <div className={cls.main__box_descr}>

                        {item?.description}
                    </div>
                </div>
            </div>
        ))
    }
    const render = renderData()

    return (
        <div className={cls.main}>
            <div className={cls.main__header}>
                <div className={cls.main__title}>
                    Latest news
                </div>


                {job && <div className={cls.main__add} onClick={() => setAdd(!add)}>
                    <img src={addIcon} alt=""/>
                </div>}
            </div>
            <div className={cls.main__wrapper}>
                {render}
            </div>

        </div>
    );
};



