import { memo } from 'react';

import { Modal } from "shared/ui/modal";
import { Form } from "shared/ui/form";
import { Input } from "shared/ui/input";
import { Button } from "shared/ui/button";

import cls from "./studentProfileChangeInfo.module.sass";
import { Select } from "shared/ui/select";

export const StudentProfileChangeInfo = memo((props) => {

    const {
        setActive,
        active,
        onSubmit,
        register,
        currentData,
        languages,
        classes,
        setSelectedClass,
        setSelectedLang
    } = props


    return (
        <Modal
            setActive={setActive}
            active={active}
        >
            <div className={cls.changeInfo}>
                <h1>Malumotni o'zgartirish</h1>
                <Form onSubmit={onSubmit}>
                    <Input
                        //
                        title={"Username"}
                        placeholder={"Username"}
                        name={"username"}
                        register={register}
                        value={currentData?.user?.username}
                        required
                    />
                    <Input
                        title={"Ism"}
                        placeholder={"Ism"}
                        name={"name"}
                        register={register}
                        value={currentData?.user?.name}
                        required
                    />
                    <Input
                        title={"Familiya"}
                        placeholder={"Familiya"}
                        name={"surname"}
                        register={register}
                        value={currentData?.user?.surname}
                        required
                    />
                    <Input
                        title={"Otasinig ismi"}
                        placeholder={"Otasinig ismi"}
                        name={"father_name"}
                        register={register}
                        value={currentData?.user?.father_name}
                        required
                    />
                    <Input
                        title={"Telefon raqami"}
                        placeholder={"Telefon raqami"}
                        name={"phone"}
                        register={register}
                        value={currentData?.user?.phone}
                        required
                    />
                    <Input
                        title={"Ota-onasining telefon raqami"}
                        placeholder={"Ota-onasining telefon raqami"}
                        name={"parents_number"}
                        register={register}
                        value={currentData?.parents_number}
                        required
                    />
                    <Input
                        title={"Yoshi"}
                        placeholder={"Yoshi"}
                        name={"age"}
                        register={register}
                        value={currentData?.user?.age}
                        required
                        type={"number"}
                    />
                    <Input
                        title={"Tug'ilgan sana"}
                        placeholder={"Tug'ilgan sana"}
                        name={"birth_date"}
                        register={register}
                        value={currentData?.user?.birth_date}
                        required
                        type={"date"}
                    />
                    <Input
                        title={"Face ID"}
                        placeholder={"Face ID"}
                        name={"face_id"}
                        register={register}
                        value={currentData?.face_id}
                        required
                        type={"number"}
                    />
                    <Select
                        title={"Sinf"}
                        options={classes}
                        onChangeOption={setSelectedClass}
                        defaultValue={currentData?.class_number?.id}
                    />

                    <Select
                        title={"Til"}
                        options={languages}
                        onChangeOption={setSelectedLang}
                        defaultValue={currentData?.user?.language?.id}
                    />

                    <Input
                        title={"Region"}
                        placeholder={"region"}
                        name={"region"}
                        register={register}
                        value={currentData?.region}
                        required
                    />




                    <Input
                        title={"Tug'ilgan sana ota-ona"}
                        placeholder={"Tug'ilgan sana ota-ona"}
                        name={"born_date"}
                        register={register}
                        value={currentData?.born_date}
                        required
                        type={"date"}
                    />
                    <div className={cls.seria}>
                        <Input
                            title={"metirka seriya"}
                            placeholder={"metirka seriya"}
                            name={"student_seria"}
                            register={register}
                            value={currentData?.student_seria}
                            required
                        />
                        <Input
                            title={"metirka raqami"}
                            placeholder={"metirka raqami"}
                            name={"student_seria_num"}
                            register={register}
                            value={currentData?.student_seria_num}
                            required
                            type={"number"}
                        />
                    </div>
                </Form>
            </div>
        </Modal>
    )
})
