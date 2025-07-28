import {memo} from 'react';

import {Modal} from "shared/ui/modal";
import {Form} from "shared/ui/form";
import {Input} from "shared/ui/input";
import {Button} from "shared/ui/button";

import cls from "./studentProfileChangeInfo.module.sass";
import {Select} from "shared/ui/select";

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
                        placeholder={"Ism"}
                        name={"name"}
                        register={register}
                        value={currentData?.user?.name}
                        required
                    />
                    <Input
                        placeholder={"Familiya"}
                        name={"surname"}
                        register={register}
                        value={currentData?.user?.surname}
                        required
                    />
                    <Input
                        placeholder={"Otasinig ismi"}
                        name={"father_name"}
                        register={register}
                        value={currentData?.user?.father_name}
                        required
                    />
                    <Input
                        placeholder={"Telefon raqami"}
                        name={"phone"}
                        register={register}
                        value={currentData?.user?.phone}
                        required
                    />
                    <Input
                        placeholder={"Yoshi"}
                        name={"age"}
                        register={register}
                        value={currentData?.user?.age}
                        required
                        type={"number"}
                    />
                    <Input
                        placeholder={"Tug'ilgan sana"}
                        name={"birth_date"}
                        register={register}
                        value={currentData?.user?.birth_date}
                        required
                        type={"date"}
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
                        placeholder={"region"}
                        name={"region"}
                        register={register}
                        value={currentData?.region}
                        required
                    />

                    <Input
                        placeholder={"Ota-ona fio"}
                        name={"parents_fullname"}
                        register={register}
                        value={currentData?.parents_fullname}
                        required
                    />
                    <Input
                        placeholder={"kelgan maktabi"}
                        name={"old_school"}
                        register={register}
                        value={currentData?.old_school}
                        required
                    />
                    <Input
                        placeholder={"region"}
                        name={"parent_region"}
                        register={register}
                        value={currentData?.parent_region}
                        required
                    />
                    <Input
                        placeholder={"xudud"}
                        name={"district"}
                        register={register}
                        value={currentData?.district}
                        required
                    />
                    <div className={cls.seria}>
                        <Input
                            placeholder={"seriya"}
                            name={"parent_seria"}
                            register={register}
                            value={currentData?.parent_seria}
                            required
                        />
                        <Input
                            placeholder={"seriya raqami"}
                            name={"parent_seria_num"}
                            register={register}
                            value={currentData?.parent_seria_num}
                            required
                            type={"number"}
                        />
                    </div>
                    <Input
                        placeholder={"Tug'ilgan sana ota-ona"}
                        name={"born_date"}
                        register={register}
                        value={currentData?.born_date}
                        required
                        type={"date"}
                    />
                    <div className={cls.seria}>
                        <Input
                            placeholder={"metirka seriya"}
                            name={"student_seria"}
                            register={register}
                            value={currentData?.student_seria}
                            required
                        />
                        <Input
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
