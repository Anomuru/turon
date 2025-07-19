import {Modal} from "shared/ui/modal";
import {Input} from "shared/ui/input";
import {Button} from "shared/ui/button";
import cls from "../location/locations.module.sass"
import {Form} from "../../../../shared/ui/form";
import {Select} from "../../../../shared/ui/select";
import {ConfirmModal} from "../../../../shared/ui/confirmModal";


export const ModalLocation = ({
                                  activeModal,
                                  setActive,
                                  register,
                                  handleSubmit,
                                  onChange,
                                  onDelete,
                                  setSelect,
                                  options,
                                  activeDel,
                                  setActiveDel


                              }) => {
    return (
        <div>
            <Modal setActive={setActive} active={activeModal}>
                <Button onClick={() => setActiveDel(!activeDel)} extraClass={cls.btn} type={`editPlus`}
                        children={<><i className={"fa fa-trash"}/></>}/>
                <Form onSubmit={handleSubmit(onChange)}>
                    <div style={{display: "flex", flexDirection: "column", gap: "2rem", padding: '3rem 2rem'}}>
                        <Input name={"name"} register={register} title={"Name"}/>
                        <Input title={"Number"} register={register} type={"number"} name={"number"}/>
                        {/*<Input title={"System_id"} register={register} name={"old_id"}/>*/}
                        <Select options={options} onChangeOption={setSelect}/>
                    </div>
                </Form>
            </Modal>
            <ConfirmModal setActive={setActiveDel} active={activeDel} onClick={onDelete}   type={"danger"}/>
        </div>
    );
};
export const ModalSystem = ({
                                activeModal,
                                setActive,
                                register,
                                handleSubmit,
                                onChange,
                                onDelete,
                                setActiveDel,
                                activeDel
                            }) => {
    return (
        <div>
            <Modal setActive={setActive} active={activeModal}>
                <Button onClick={() => setActiveDel(!activeDel)} extraClass={cls.btn} type={`editPlus`}><i
                    className={"fa fa-trash"}/></Button>
                <Form onSubmit={handleSubmit(onChange)}>
                    <div style={{display: "flex", flexDirection: "column", gap: "2rem", padding: '3rem 2rem'}}>
                        <Input name={"name"} register={register} title={"Name"}/>
                        <Input name={"number"} type={"Number"} register={register} title={"System_id"}/>
                    </div>
                </Form>
            </Modal>
            <ConfirmModal setActive={setActiveDel} active={activeDel} onClick={onDelete}   type={"danger"}/>
        </div>
    );
};
export const ModalBranch = ({
                                activeModal,
                                setActive,
                                register,
                                handleSubmit,
                                onChange,
                                onDelete,
                                options,
                                select,
                                setSelected,
                                setActiveDel,
                                activeDel
                            }) => {

    return (
        <div>
            <Modal setActive={setActive} active={activeModal}>
                <Button onClick={() => setActiveDel(!activeDel)} extraClass={cls.btn} type={`editPlus`}
                        children={<><i className={"fa fa-trash"}/></>}/>
                <Form onSubmit={handleSubmit(onChange)}>
                    <div style={{display: "flex", flexDirection: "column", gap: "2rem", padding: '3rem 2rem'}}>
                        <Input register={register} name={"name"} title={"Name"}/>
                        {/*<Input title={"Number"} register={register} name={"phone_number"}/>*/}
                        <Input title={"Number"} register={register} name={"number"} type={"number"}/>
                        <Input title={"Location"} register={register} name={"location_text"}/>
                        {/*<Select title={"System_id"} options={options} onChangeOption={setSelected}/>*/}
                    </div>
                </Form>
            </Modal>
            <ConfirmModal setActive={setActiveDel} active={activeDel} onClick={onDelete}   type={"danger"}/>
        </div>
    );
};


export const ModalEducation = ({activeModal, setActive, register, handleSubmit, onChange, onDelete , setActiveDel , activeDel}) => {
    return (
        <div>
            <Modal setActive={setActive} active={activeModal}>
                <Button onClick={() => setActiveDel(!activeDel)} extraClass={cls.btn} type={`editPlus`}
                        children={<><i className={"fa fa-trash"}/></>}/>
                <Form onSubmit={handleSubmit(onChange)}>
                    <div style={{display: "flex", flexDirection: "column", padding: '3rem 2rem'}}>
                        <Input title={"Name"} register={register} name={"name"}/>
                    </div>
                </Form>
            </Modal>
            <ConfirmModal setActive={setActiveDel} active={activeDel} onClick={onDelete}   type={"danger"}/>
            {/*<YesNo onDelete={onDelete} activeDelete={activeDel} setActiveDelete={setActiveDel}/>*/}
        </div>
    );
};

