import {memo, useCallback, useState} from 'react';

import {amountService, amountTypes} from "entities/profile/studentProfile";
import {Modal} from "shared/ui/modal";
import {Form} from "shared/ui/form";
import {Input} from "shared/ui/input";
import {Radio} from "shared/ui/radio";

import cls from "./classProfileSalaryModal.module.sass";
import money from "shared/assets/images/Money.png";
import creditCard from "shared/assets/images/CreditCard.png";
import bank from "shared/assets/images/Bank.png";

const listPretcent = [-1, 34.8, 70.4]

export const ClassProfileSalaryModal = memo((props) => {

    const {
        active,
        setActive,
        register,
        onSubmit
    } = props


    const [activeService, setActiveService] = useState(amountService[0])
    const [activePaymentType, setActivePaymentType] = useState(0)


    const renderAmountServiceTypes = useCallback(() => {
        return amountService.map(item =>
            <div className={cls.salaryModal__inner}>
                <Radio
                    extraClasses={cls.salaryModal__radio}
                    onChange={setActiveService}
                    value={item}
                    checked={item === activeService}
                />
                <p>{item}</p>
            </div>
        )
    }, [activeService])

    const renderAmountService = renderAmountServiceTypes()

    return (
        <Modal
            active={active}
            setActive={setActive}
            extraClass={cls.wrapper}
        >
            <div className={cls.salaryModal}>
                <h1 className={cls.salaryModal__title}>Oylik berish: </h1>
                <div className={cls.items}>
                    <div className={cls.items__inner}>
                        <img src={money} alt=""/>
                        <p>12 000 000</p>
                    </div>
                    <div className={cls.items__inner}>
                        <img src={creditCard} alt=""/>
                        <p>11 000 000</p>
                    </div>
                    <div className={cls.items__inner}>
                        <img src={bank} alt=""/>
                        <p>11 000 000</p>
                    </div>
                </div>
                <div className={cls.salaryModal__items}>
                    {renderAmountService}
                </div>
                <div className={cls.salaryModal__form}>
                    <h1>{activeService}</h1>
                    <div className={cls.formItems}>
                        {
                            amountTypes.map((item, index) =>
                                <div
                                    className={cls.formItems__container}
                                    onClick={() => setActivePaymentType(index)}
                                >
                                    <p>{item.name}</p>
                                    <img src={item.image} alt=""/>
                                </div>
                            )
                        }
                        <div
                            className={cls.formItems__active}
                            style={{left: `${listPretcent[activePaymentType]}%`}}
                        />
                    </div>
                    <Form onSubmit={onSubmit}>
                        <div className={cls.salaryModal__formInner}>
                            <p>{activeService} miqdori</p>
                            <Input
                                register={register}
                                name={"amount"}
                                placeholder={"Summa"}
                                type={"number"}
                            />
                        </div>
                        <div className={cls.salaryModal__formInner}>
                            <p>Sabab</p>
                            <Input
                                register={register}
                                name={"reason"}
                                placeholder={"Sabab"}
                            />
                        </div>
                    </Form>
                </div>
            </div>
        </Modal>
    )
})
