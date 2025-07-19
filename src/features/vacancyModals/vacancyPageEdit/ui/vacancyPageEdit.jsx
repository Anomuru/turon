import React, {useState, useEffect} from 'react';
import {Modal} from "shared/ui/modal";
import {Input} from "shared/ui/input";
import {Select} from "shared/ui/select";
import {Button} from "shared/ui/button";
import cls from "./vacancyPageEdit.module.sass";
import {API_URL, headers, useHttp} from "shared/api/base";
import {useDispatch} from "react-redux";
import {fetchVacancyData} from "features/vacancyModals/vacancyPageAdd";
import {onAddAlertOptions} from "features/alert/model/slice/alertSlice";

export const VacancyPageEdit = React.memo(({modal, setModal, vacancy, onSave, systems}) => {
    const [selectedSubject, setSelectedSubject] = useState(vacancy?.group?.name || "");
    const [selectedType, setSelectedType] = useState(vacancy?.system_id?.id || "");


    useEffect(() => {
        if (vacancy) {
            setSelectedSubject(vacancy.group.name);
            setSelectedType(vacancy.system_id.id);
        }
    }, [vacancy]);


    const {request} = useHttp()
    const dispatch = useDispatch()

    const handleSave = () => {
        const updatedVacancy = {
            ...vacancy,
            name: selectedSubject,
            system_id: selectedType,
        };
        onSave(updatedVacancy);


        request(`${API_URL}Permissions/jobss/${vacancy.group.id}/`, "PUT", JSON.stringify(updatedVacancy), headers())
            .then(() => {
                dispatch(fetchVacancyData())
                dispatch(onAddAlertOptions({
                    status: true,
                    msg: `${selectedSubject} muvaffaqiyatli o'zgartirildi`,
                    type: "success"
                }))
                setModal(false)
            })


    };


    const onDelete = () => {
        request(`${API_URL}Permissions/jobs_delete/${vacancy.id}/`, "DELETE", null, headers())
            .then((res) => {
                dispatch(fetchVacancyData())
                dispatch(onAddAlertOptions({
                    status: true,
                    msg: res.msg,
                    type: "success"
                }))
            })
    }


    return (
        <Modal active={modal} setActive={setModal}>
            <div className={cls.filter}>
                <h1>Ma'lumotlarni o'zgartirish</h1>
                <div className={cls.filter__container}>
                    <Input
                        placeholder={"Kasb nomi"}
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                    />
                    <Select
                        // title={"Systemlar"}
                        options={systems}
                        onChangeOption={setSelectedType}
                        defaultValue={selectedType}
                    />


                    <div style={{display: "flex"}}>
                        <Button onClick={handleSave}>Change</Button>

                        {
                            vacancy?.status &&
                            <Button type={"danger"} onClick={onDelete}>Delete</Button>
                        }
                    </div>

                </div>
            </div>
        </Modal>
    );
});
