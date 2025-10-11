import cls from "./groupLessonPlan.module.sass"
import {Button} from "shared/ui/button";
import {useState} from "react";
import {Modal} from "shared/ui/modal";
import {Accordion} from "shared/ui/accardion/accardion.jsx";
import {Textarea} from "shared/ui/textArea";
import defaultImg from "shared/assets/images/user_image.png"
import {Input} from "shared/ui/input/index.js";
import {useForm} from "react-hook-form";
import {Select} from "shared/ui/select/index.js";
const student = [
    {id: 1, name: "Ali", surname: "Karimov", comment: "321321eqwe qwewqewehwqe jwqehwq ewqe wqe w e wq ewq"},
    {id: 10, name: "Ali", surname: "Karimov", comment: "321321eqwe qwewqewehwqe jwqehwq ewqe wqe w e wq ewq"},
    {id: 10, name: "Ali", surname: "Karimov", comment: "321321eqwe qwewqewehwqe jwqehwq ewqe wqe w e wq ewq"},
    {id: 10, name: "Ali", surname: "Karimov", comment: "321321eqwe qwewqewehwqe jwqehwq ewqe wqe w e wq ewq"},
    {id: 10, name: "Ali", surname: "Karimov", comment: "321321eqwe qwewqewehwqe jwqehwq ewqe wqe w e wq ewq"},
    {id: 10, name: "Ali", surname: "Karimov", comment: "321321eqwe qwewqewehwqe jwqehwq ewqe wqe w e wq ewq"},
    {id: 10, name: "Ali", surname: "Karimov", comment: "321321eqwe qwewqewehwqe jwqehwq ewqe wqe w e wq ewq"},
    {id: 2, name: "Vali", surname: "Saidov"},
    {id: 3, name: "Aziza", surname: "To‘xtayeva"},
    {id: 5, name: "Aziza", surname: "To‘xtayeva"},
    {id: 6, name: "Aziza", surname: "To‘xtayeva"},
    {id: 4, name: "Doston", surname: "Qo‘chqorov"},
];
export const GroupLessonPlan = () => {
    const [activeModal, setActiveModal] = useState(false);
    const [activeAccordion, setActiveAccordion] = useState(null);
    const {register , handleSubmit , } = useForm()


    const [students, setStudents] = useState(student)


    const handleAccordionToggle = (id) => {
        setActiveAccordion((prev) => (prev === id ? null : id));
    };

    const onChangeStudents = ( text, id) => {
        setStudents(st => st.map(item => {
            if (item.id === id) {
                return {
                    ...item,
                    comment: text
                }
            }
            return item
        }))
    }

    const onClick = (data) => {
        console.log(data)
    }

    return (
        <div className={cls.lessonPlan}>
            <div className={cls.lessonPlan__header}>
                <div className={cls.lessonPlan__header_info}>
                    <h1>Lesson Plan</h1>
                    <Button onClick={() => setActiveModal(true)}>Students</Button>
                </div>
                <div className={cls.lessonPlan__header_selects}>
                    <Select title={"Yil"} extraClass={cls.lessonPlan__header_selects_select}/>
                    <Select title={"Oy"} extraClass={cls.lessonPlan__header_selects_select}/>
                    <Select title={"Kun"} extraClass={cls.lessonPlan__header_selects_select}/>
                </div>
            </div>


            <div className={cls.lessonPlan__middle}>
                <Input title={"Objective (Maqsad)"}/>
                <div className={cls.lessonPlan__middle_items}>
                    <Textarea required register={register} name={"homework"} title={"Homework"} />
                    <Textarea required register={register} name={"resources"} title={"Resources"} />
                    <Textarea required register={register} name={"main_lesson"} title={"Main Lesson"} />
                    <Textarea required register={register} name={"activities"} title={"Activities"} />
                    <Textarea required register={register} name={"assessment"} title={"Assessment"} />
                </div>

            </div>

            <div className={cls.lessonPlan__list}>
                {students && students.filter(item => item.comment).map((item , id) => (
                    <div key={id} className={cls.lessonPlan__list_user}>
                        <div className={cls.lessonPlan__list_user_info}>
                            <img src={defaultImg} alt=""/>
                            <div className={cls.lessonPlan__list_info}>
                                <h2>{item.name} </h2>
                                <h2>{item.surname}</h2>
                            </div>
                        </div>
                        <h2>{item.comment}</h2>
                    </div>


                ))
                }
            </div>
                <Button extraClass={cls.lessonPlan__btn} onClick={handleSubmit(onClick)} type={"simple"}>Tastiqlash</Button>


            <Modal active={activeModal} setActive={setActiveModal}>
                <h1>Students</h1>
                <div className={cls.modal__list}>
                    {students.map((item) => (
                        <Accordion
                            key={item.id}
                            title={`${item.name} ${item.surname}`}
                            backOpen={activeAccordion === item.id}
                            setBackOpen={() => handleAccordionToggle(item.id)}
                        >
                            <Textarea
                                value={
                                    item.comment
                                }
                                onChange={(e) =>
                                    onChangeStudents(e, item.id)
                                }
                            />
                        </Accordion>
                    ))}
                </div>
            </Modal>
        </div>
    );
};
