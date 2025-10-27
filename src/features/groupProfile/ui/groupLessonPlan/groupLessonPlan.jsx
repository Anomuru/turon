import cls from "./groupLessonPlan.module.sass"
import {Button} from "shared/ui/button";
import {useEffect, useState} from "react";
import {Modal} from "shared/ui/modal";
import {Accordion} from "shared/ui/accardion/accardion.jsx";
import {Textarea} from "shared/ui/textArea";
import defaultImg from "shared/assets/images/user_image.png"
import {Input} from "shared/ui/input/index.js";
import {useForm} from "react-hook-form";
import {Select} from "shared/ui/select/index.js";
import {API_URL, headers, useHttp} from "shared/api/base.js";
import {useParams} from "react-router";
import {onAddAlertOptions} from "features/alert/model/slice/alertSlice.js";
import {useDispatch} from "react-redux";


export const GroupLessonPlan = () => {
    const [activeModal, setActiveModal] = useState(false);
    const [activeAccordion, setActiveAccordion] = useState(null);
    const {register, handleSubmit, setValue} = useForm()

    const [year, setYear] = useState()
    const [years, setYears] = useState([])

    const [month, setMonth] = useState()
    const [months, setMonths] = useState([])
    const [planId, setPlanId] = useState()


    const [day, setDay] = useState()
    const [days, setDays] = useState([])
    const [students, setStudents] = useState([])
    const {id} = useParams()
    const dispatch = useDispatch()

    const {request} = useHttp()
    useEffect(() => {
        if (id) {
            request(`${API_URL}Lesson_plan/lesson_plan_list/${id}/`, "GET", null, headers())
                .then(res => {
                    if (res.month_list.length === 1) {
                        setMonth(res.month_list[0])
                    }
                    setMonths(res.month_list)

                    if (res.years_list.length === 1) {
                        setYear(res.years_list[0])
                    }
                    setYears(res.years_list)

                    setMonth(res.month)
                    setYear(res.year)
                })
        }
    }, [id])

    useEffect(() => {
        if (id && year && month) {
            request(`${API_URL}Lesson_plan/lesson_plan_list/${id}/${year}-${month}/`, "GET", null, headers())
                .then(res => {
                    if (res.days.length === 1) {
                        setDay(res.days[0])
                    } else {
                        setDay(res.days[res.days.length - 1])
                    }
                    setDays(res.days)
                })
        }
    }, [id, month, year])



    useEffect(() => {
        if (year && month && day) {
            const params = new URLSearchParams({
                year,
                month,
                day,
                group_id: id
            });

            request(`${API_URL}Lesson_plan/get_lesson_plan/?${params.toString()}`, "GET", null, headers())
                .then(res => {
                    setValue("homework", res.lesson_plan.homework)
                    setValue("objective", res.lesson_plan.objective)
                    setValue("assessment", res.lesson_plan.assessment)
                    setValue("resources", res.lesson_plan.resources)
                    setValue("main_lesson", res.lesson_plan.main_lesson)
                    setValue("activities", res.lesson_plan.activities)
                    setStudents(res.lesson_plan.students)
                    setPlanId(res.lesson_plan.id)
                })
        }
    }, [month, year, day, id])



    const handleAccordionToggle = (id) => {
        setActiveAccordion((prev) => (prev === id ? null : id));
    };

    const onChangeStudents = (text, id) => {
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
        request(`${API_URL}teacher/change_lesson_plan/${planId}`, "POST", JSON.stringify({
            ...data,
            students
        }), headers())
            .then(res => {
                const alert = {
                    active: true,
                    message: res.msg,
                    type: "success"
                }
                dispatch(onAddAlertOptions({
                    type: "success",
                    status: true,
                    msg: res.msg
                }))
            })
    }

    return (
        <div className={cls.lessonPlan}>
            <div className={cls.lessonPlan__header}>
                <div className={cls.lessonPlan__header_info}>
                    <h1>Lesson Plan</h1>
                    <Button onClick={() => setActiveModal(true)}>Students</Button>
                </div>
                <div className={cls.lessonPlan__header_selects}>
                    <Select defaultValue={year} options={years} onChangeOption={setYear} title={"Yil"}
                            extraClass={cls.lessonPlan__header_selects_select}/>
                    <Select options={months} defaultValue={month} title={"Oy"} onChangeOption={setMonth}
                            extraClass={cls.lessonPlan__header_selects_select}/>
                    <Select title={"Kun"} options={days} defaultValue={day} onChangeOption={setDay}
                            extraClass={cls.lessonPlan__header_selects_select}/>
                </div>
            </div>


            <div className={cls.lessonPlan__middle}>
                <Input name={"objective"} register={register} title={"Objective (Maqsad)"}/>
                <div className={cls.lessonPlan__middle_items}>
                    <Textarea required register={register} name={"homework"} title={"Homework"}/>
                    <Textarea required register={register} name={"resources"} title={"Resources"}/>
                    <Textarea required register={register} name={"main_lesson"} title={"Main Lesson"}/>
                    <Textarea required register={register} name={"activities"} title={"Activities"}/>
                    <Textarea required register={register} name={"assessment"} title={"Assessment"}/>
                </div>

            </div>

            <div className={cls.lessonPlan__list}>
                {students && students.filter(item => item.comment).map((item, id) => (
                    <div key={id} className={cls.lessonPlan__list_user}>
                        <div className={cls.lessonPlan__list_user_info}>
                            <img src={defaultImg} alt=""/>
                            <div className={cls.lessonPlan__list_info}>
                                <h2>{item?.student?.name} </h2>
                                <h2>{item?.student?.surname}</h2>
                            </div>
                        </div>
                        <h2>{item.comment}</h2>
                    </div>


                ))
                }
            </div>
            {/*<Button extraClass={cls.lessonPlan__btn} onClick={handleSubmit(onClick)} type={"simple"}>Tastiqlash</Button>*/}


            <Modal active={activeModal} setActive={setActiveModal}>
                <h1>Students</h1>
                <div className={cls.modal__list}>
                    {students.map((item) => (
                        <Accordion
                            key={item.id}
                            title={`${item?.student?.name} ${item?.student?.surname}`}
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
