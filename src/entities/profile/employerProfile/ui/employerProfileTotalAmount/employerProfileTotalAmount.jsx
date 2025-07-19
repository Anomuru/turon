import {memo, useCallback, useContext, useState} from 'react';
import {useForm} from "react-hook-form";
import classNames from "classnames";
import {EditableCard} from "shared/ui/editableCard";
import {Input} from "shared/ui/input";
import {Radio} from "shared/ui/radio";
import {Select} from "shared/ui/select";
import {Form} from "shared/ui/form";
import {amountTypes, amountService} from "entities/profile/studentProfile";
import {useDispatch, useSelector} from "react-redux";
import {giveEmployerSalaryThunk} from "features/giveEmployerSalary";
import {addSalary} from "features/giveEmployerSalary/model/giveEmployerSalarySlice";
import cls from "./employerProfileTotalAmount.module.sass";

import {fetchEmployerSalaryThunk, getSalaryInsideSource} from "pages/giveSalaryPage";
import {onAddAlertOptions} from "features/alert/model/slice/alertSlice";
import {getBranch} from "features/branchSwitcher";

const listPretcent = [-1, 34.8, 70.4]

export const EmployerProfileTotalAmount = memo(({active, setActive, salary_id, user_id, permission_id}) => {

    const {register, handleSubmit} = useForm()
    const [activeService, setActiveService] = useState(amountService[0])
    const [activePaymentType, setActivePaymentType] = useState(0)
    const [salary, setSalary] = useState(null);


    const branch = useSelector(getBranch)

    const [payment, setPayment] = useState(1)
    const [comment, setComment] = useState('')
    const dispatch = useDispatch()
    const userData = useSelector(getSalaryInsideSource)

    const handleAddSalary = async (data) => {
        const newSalary = {
            salary: Number(salary),
            comment: comment,
            deleted: false,
            user_salary: salary_id,
            permission: permission_id,
            payment_types: payment,
            user: user_id,
            branch: branch.id,
            ...data
        };


        try {
            const action = await dispatch(giveEmployerSalaryThunk(newSalary));
            if (giveEmployerSalaryThunk.fulfilled.match(action)) {
                dispatch(addSalary(action.payload));
                dispatch(onAddAlertOptions({
                    type: "success",
                    status: true,
                    msg: "Oylik muvofaqqiyatli to'landi"
                }))
            } else {
                console.error("Thunk failed with error: ", action.payload);
                dispatch(onAddAlertOptions({
                    type: "error",
                    status: true,
                    msg: "Internet yoki serverda xatolik qayta urinib ko'ring"
                }))
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
        dispatch(fetchEmployerSalaryThunk(salary_id))
        setActive(!active)

    }

    const renderAmountServiceTypes = useCallback(() => {
        return amountService.map(item =>
            <div className={cls.items__inner}>
                <Radio
                    extraClasses={cls.items__radio}
                    onChange={() => setActiveService(item)}
                    value={item}
                    checked={item === activeService}
                />
                <p>{item}</p>
            </div>
        )
    }, [activeService])

    const renderAmountService = renderAmountServiceTypes()

    return (
        <EditableCard
            extraClass={classNames(cls.amount, {
                [cls.active]: active === "balanceIn"
            })}
            titleType={""}
            onClick={() => setActive("balance")}
        >
            {/*<div className={cls.amount__header}>*/}
            {/*    <div className={cls.items}>*/}
            {/*        <div className={cls.items__inner}>*/}
            {/*            <img src={money} alt=""/>*/}
            {/*            <p>12 000 000</p>*/}
            {/*        </div>*/}
            {/*        <div className={cls.items__inner}>*/}
            {/*            <img src={creditCard} alt=""/>*/}
            {/*            <p>11 000 000</p>*/}
            {/*        </div>*/}
            {/*        <div className={cls.items__inner}>*/}
            {/*            <img src={bank} alt=""/>*/}
            {/*            <p>11 000 000</p>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}
            <div className={cls.amount__content}>
                {/*<div className={cls.items}>*/}
                {/*    {renderAmountService}*/}
                {/*</div>*/}
                <div className={cls.form}>
                    <h1>{activeService}</h1>
                    {
                        activeService === "To'lov"
                            ?
                            <>
                                <div className={cls.items}>
                                    {amountTypes.map((item, index) =>
                                        <div
                                            className={cls.items__inner}
                                            onClick={() => {
                                                setActivePaymentType(index);
                                                setPayment(index + 1); // Bu yerda index + 1 deb qo'yish orqali tanlangan payment_types'ni to'g'ri qiymatga o'rnatish
                                            }}
                                        >
                                            <p>{item.name}</p>
                                            <img src={item.image} alt=""/>
                                        </div>
                                    )}
                                    <div
                                        className={cls.items__active}
                                        style={{left: `${listPretcent[activePaymentType]}%`}}
                                    />
                                </div>
                                <Form onSubmit={handleSubmit(handleAddSalary)}>
                                    <div className={cls.form__inner}>
                                        <Input
                                            title={"To'lov miqdori"}
                                            {...register("amount")}
                                            placeholder={"Summa"}
                                            type={"number"}
                                            defaultValue={salary}
                                            onChange={(e) => setSalary(e.target.value)}
                                            required
                                        />
                                        <Input
                                            title={"Sababi"}
                                            {...register("comment")}
                                            placeholder={"Sababi"}
                                            type={"text"}
                                            name={"comment"}
                                            register={register}
                                            defaultValue={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                        />
                                        <Input
                                            title={"Kuni"}
                                            register={register}
                                            name={"date"}
                                            placeholder={"Kuni"}
                                            type={"date"}
                                            // defaultValue={comment}
                                            // onChange={(e) => setComment(e.target.value)}
                                        />

                                    </div>
                                </Form>
                            </>
                            :
                            activeService === "Xayriya"
                                ?
                                <Form onSubmit={handleSubmit(handleAddSalary)}>
                                    <div className={cls.form__container}>
                                        <Select
                                            extraClass={cls.form__select}
                                        />
                                        <div className={cls.form__inner}>
                                            <p>{activeService} miqdori</p>
                                            <Input
                                                {...register("amount")}
                                                placeholder={"Summa"}
                                                type={"number"}
                                            />
                                        </div>
                                    </div>
                                </Form>
                                :
                                <Form>
                                    <div className={cls.form__inner}>
                                        <p>{activeService} miqdori</p>
                                        <Input
                                            {...register("amount")}
                                            placeholder={"Summa"}
                                            type={"number"}
                                        />
                                    </div>
                                </Form>
                    }
                </div>
            </div>
        </EditableCard>
    )
})
