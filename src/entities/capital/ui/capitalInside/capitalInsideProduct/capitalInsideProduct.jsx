import cls from "./capitalInsideProduct.module.sass"
import {Button} from "shared/ui/button";
import {memo, useMemo} from "react";
import def from "shared/assets/images/defaultImg.svg"
import {useNavigate} from "react-router";

export const CapitalInsideProduct = memo(({capitalData, addModal, setAddModal}) => {

    const navigation = useNavigate()

    const totalPrice = useMemo(() => {
        if (!capitalData || capitalData.length === 0) return 0;
        return capitalData.reduce((sum, item) => sum + (Number(item?.price) || 0), 0);
    }, [capitalData]);

    // const

    const capitalDataRender = () => {
        if (!capitalData || capitalData.length === 0) {
            return (
                <div className={cls.empty}>
                    <i className="fa fa-inbox"/> Ma'lumot topilmadi
                </div>
            );
        }

        return capitalData?.map((item) => (
            <div key={item.id} onClick={() => navigation(`profile/${item.id}`)} className={cls.box}>
                <img style={{width: "35rem"}} src={item.img ? item.img : def} alt=""/>
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

            <div className={cls.summaryBanner}>
                <div className={cls.summaryCard}>
                    <div className={cls.summaryCard__icon}>
                        <i className="fa fa-box-open"/>
                    </div>
                    <div className={cls.summaryCard__info}>
                        <span className={cls.summaryCard__label}>Jami mahsulotlar</span>
                        <span className={cls.summaryCard__value}>{capitalData?.length || 0}</span>
                    </div>
                </div>

                <div className={`${cls.summaryCard} ${cls.summaryCard_price}`}>
                    <div className={cls.summaryCard__icon}>
                        <i className="fa fa-wallet"/>
                    </div>
                    <div className={cls.summaryCard__info}>
                        <span className={cls.summaryCard__label}>Umumiy narx</span>
                        <span className={cls.summaryCard__value}>
                            {totalPrice.toLocaleString()} <small>so'm</small>
                        </span>
                    </div>
                </div>
            </div>

            <div className={cls.product__header}>
                <div className={cls.product__header_title}>
                    Kategoriya mahsulotlari:
                </div>

                <div className={cls.product__header_right}>
                    <Button onClick={() => setAddModal(!addModal)} extraClass={cls.btn} type={"editPlus"}
                            children={<i className={"fa fa-plus"}/>}/>
                </div>
            </div>

            <div className={cls.product__wrapper}>
                {render}
            </div>
        </div>
    );
})

