import {Modal} from "shared/ui/modal";
import {Form} from "shared/ui/form";
import {Input} from "shared/ui/input";
import {Radio} from "shared/ui/radio";
import {Select} from "../../../../../shared/ui/select";
import cls from "./accountingCapitalCosts.module.sass"


export const CapitalModal = ({
                                 setActive,
                                 activeModal,
                                 radio,
                                 monthDay,
                                 month,
                                 day,
                                 setDay,
                                 setMonth,
                                 register,
                                 handleSubmit,
                                 onAdd,
                                 setRadio,
                                 radioSelect,

                             }) => {

    return (
        <Modal setActive={setActive} active={activeModal}>
            <div className={cls.modal}>
                <Form onSubmit={handleSubmit(onAdd)}>
                    <Input register={register} name={"added_date"} type={"date"}/>
                    <Input register={register} name={"name"}/>
                    <Input register={register} name={"price"} type={"number"}/>
                    <div style={{display: "flex", gap: "2rem", justifyContent: 'center'}}>
                        {radio.map(item => (
                            <Radio
                                onChange={() => setRadio({
                                    name: item.name,
                                    id: item.id
                                })}
                                children={item.name}
                                checked={radioSelect?.name === item.name}
                                value={radioSelect === item.name}

                            />
                        ))}
                    </div>


                    <Select title={"Oy"} options={monthDay} onChangeOption={setMonth}/>
                    <Select title={"sana"} options={monthDay.filter(item => item?.value === month)[0]?.days}
                            onChangeOption={setDay}/>
                </Form>
            </div>
        </Modal>
    );
};

