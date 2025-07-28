import cls from "./accountingHeader.module.sass"
import {Input} from "shared/ui/input";
import {Radio} from "shared/ui/radio";
import {useDispatch} from "react-redux";


export const AccountingHeader = ({paymentType, setSelectedRadio, ot, to, setOt, setTo, radio, onChange}) => {
    const dispatch = useDispatch()


    return (
        <div className={cls.accounting}>
            <div className={cls.accounting__header}>
                <Input type={"date"} name={"ot"} onChange={(e) => setOt(e.target.value)} value={ot?.ot}/>
                <Input type={"date"} name={"do"} onChange={(e) => setTo(e.target.value)} value={to?.to}/>
            </div>
            <div className={cls.accounting__payment}>
                {paymentType.map(item => (
                    <Radio children={item.name} checked={radio === item.id} onChange={() => setSelectedRadio(item.id)}/>
                ))}
            </div>
        </div>
    );
};

