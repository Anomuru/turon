import cls from "./capitalInsideProduct.module.sass"
import {Button} from "shared/ui/button";
import {memo} from "react";
import {API_URL_IMG} from "shared/api/base";
import def from "shared/assets/images/defaultImg.svg"
import {useNavigate} from "react-router";

export const CapitalInsideProduct = memo(({capitalData, addModal, setAddModal}) => {

    const navigation = useNavigate()

    // const

    const capitalDataRender = () => {
        return capitalData?.map((item, i) => (
            <div onClick={() => navigation(`categoryProfile/${item.id}`)} className={cls.box}>
                <img src={def} alt=""/>
                <div className={cls.box_item}>
                    <h2>Nomi : {item?.name}</h2>
                    <ul>
                        <li>Raqami : {item?.id_number}</li>
                        <li>Narxi : {item?.price}</li>
                        <li>Muddati : {item?.term} yil</li>
                        <li>Sana : {item?.date}</li>
                        <li>To'lov turi : {item?.payment_type?.name}</li>
                    </ul>
                </div>
            </div>
        ))
    }

    const render = capitalDataRender()


    return (
        <div className={cls.product}>

            <div className={cls.product__header}>
                <div className={cls.product__header_title}>
                    Kategoriya mahsulotlari:
                </div>

                <div className={cls.product__header_right}>
                    <span>
                        Jami (Down Cost): {capitalData?.length}
                    </span>
                    <div>
                        <Button type={"danger"} children={"O’chirilganlar"}/>
                        <Button onClick={() => setAddModal(!addModal)} extraClass={cls.btn} type={"editPlus"}
                                children={<i className={"fa fa-plus"}/>}/>

                    </div>
                </div>
            </div>
            <div className={cls.product__wrapper}>

                {render}

            </div>
        </div>
    );
})

