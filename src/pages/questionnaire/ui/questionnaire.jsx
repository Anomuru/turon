// import cls from "./questionnaire.module.sass"
// import {Button} from "shared/ui/button/index.js";
// import {useState} from "react";
// import {Input} from "shared/ui/input/index.js";
//
//
// const btnTypes = ["So’rovnoma qo'shish", "So’rovnoma natijalari"]
//
//
// export const Questionnaire = () => {
//
//     const [activeBtn, setActiveBtn] = useState(btnTypes[0])
//
//     return (
//         <div className={cls.container}>
//
//             <div className={cls.container__header}>
//
//                 <h1>
//                     So’rovnoma
//                 </h1>
//
//                 <div className={cls.container__header_btn}>
//                     {btnTypes.map(item => (
//                         <Button onClick={() => setActiveBtn(item)} type={item === activeBtn ? "active" : ""}>
//                             {item}
//                         </Button>
//
//                     ))}
//                 </div>
//             </div>
//
//             <div className={cls.container__body}>
//
//
//                 {activeBtn === "So’rovnoma qo'shish" && <QuestionnaireAdd/>}
//
//
//             </div>
//
//
//         </div>
//     );
// };
//
// const QuestionnaireAdd = () => {
//     const [activeCheck , setActiveCheck] = useState(false);
//
//     console.log(activeCheck)
//     return (
//         <div className={cls.container__question}>
//
//             <div className={cls.container__question_header}>
//                 <div style={{gap: "10px" , display: "flex", alignItems: "center" }}>
//                     <h2>Anonim</h2>
//                     <Input onChange={(e) => setActiveCheck(e.target.checked)} extraClassName={cls.input} type={"checkbox"}/>
//                 </div>
//                 <div className={cls.container__question_input}>
//                     {!activeCheck && <Input extraClassName={cls.input2}  placeholder={"Ism Familiya"}/>}
//                     <Input extraClassName={cls.input2}  placeholder={"Yangi Savol"}/>
//                 </div>
//
//             </div>
//         </div>
//     )
// }
//
//
//
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Button} from "shared/ui/button";
import cls from "./questionnaire.module.sass"
import {Input} from "shared/ui/input";
import {Select as SelectMulti} from "antd"
import {Select} from "shared/ui/select";
import classNames from "classnames";
import {
    fetchPoll,
    onQuestionnaireDelete,
    onQuestionnaireProfile
} from "pages/questionnaire/model/questionnaireSlice.js";
import {API_URL, headers, useHttp} from "shared/api/base.js";


export const Questionnaire = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchPoll())
    }, []);

    const [view, setView] = useState('list');
    const {questions, questionsID} = useSelector(state => state.questionnaireSlice)


    const [questionnaires, setQuestionnaires] = useState([]);
    const [stats, setStats] = useState(questionsID);
    useEffect(() => {
        setQuestionnaires(questions)
    }, [questions]);
    const {request} = useHttp()


    const handleViewStats = (q) => {
        request(`${API_URL}surveys/admin/surveys/${q.id}/` , "GET" , null , headers())
            .then(res => {
                dispatch(onQuestionnaireProfile(res))
                setView('stats');

            })
    };

    return (
        <div className={cls.container}>
            <QuestionnaireHeader
                view={view}
                setView={setView}
            />

            {view === 'list' && (
                <QuestionnaireList
                    data={questionnaires}
                    onStats={handleViewStats}
                />
            )}

            {view === 'create' && (
                <QuestionnaireCreate
                    questionnaires={questionnaires}
                    setQuestionnaires={setQuestionnaires}
                    setView={setView}
                    dispatch={dispatch}
                />
            )}

            {view === 'stats' && (
                <QuestionnaireStats
                    questionnaires={questionnaires}
                    setQuestionnaires={setQuestionnaires}
                    setView={setView}
                    dispatch={dispatch}
                    data={questionsID}
                />
            )}
        </div>
    );
};
const QuestionnaireHeader = ({view, setView}) => {
    return (
        <div className={cls.container__header}>
            <h1>So'rovnomalar</h1>

            <div className={cls.container__header_btn}>
                <Button type={view === "list" && "active"} onClick={() => {
                    setView('list')

                }}>Ro'yxat</Button>
                <Button type={view === "create" && "active"} onClick={() => {

                    setView('create')
                }}>Yaratish</Button>

                {view === "stats" && (
                    <Button type={view === "stats" && "active"} onClick={() => setView('stats')}>
                        Statistika
                    </Button>
                )}
            </div>
        </div>
    );
};

const QuestionnaireList = ({data, onStats}) => {
    if (data.length === 0) {
        return <p>So'rovnomalar yo'q</p>;
    }

    return (
        <div className={cls.list}>
            {data.map(q => (
                <div className={cls.list__box} key={q.id}>
                    <div>
                        <h3>{q.title}</h3>
                        <p>{q.questions_count} ta savol</p>
                    </div>

                    <Button onClick={() => onStats(q)}>
                        Statistika
                    </Button>
                </div>
            ))}
        </div>
    );
}


const options = [
    {value: "all", label: "Hammaga"},
    {value: "student", label: "O'quvchilarga"},
    {value: "teacher", label: "O'qituvchilarga"},
    {value: "parent", label: "Ota-onalarga "},
];


const QuestionnaireCreate = ({
                                 questionnaires,
                                 setQuestionnaires,
                                 setView,
                                 dispatch
                             }) => {

    const [title, setTitle] = useState("So'rovnoma");
    const [deadLine, setDeadLine] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [selectOption, setSelectOption] = useState([]);
    const {request} = useHttp()

    const handleAddQuestion = () => {
        setQuestions([...questions, {
            id: Date.now(),
            type: 'yes_no',
            text: '',
            options: ['']
        }]);
    };

    const handleSave = () => {
        if (!title.trim() || questions.length === 0) return;

        const newQ = {
            title,
            target_role: selectOption,
            deadline: deadLine,
            questions: questions.map((q, qi) => ({
                ...q,
                order: qi + 1,
                options: q.type === "yes_no"
                    ? [
                        {text: "Ha", order: 1},
                        {text: "Yo'q", order: 2}
                    ]
                    : q.options.map((opt, oi) => ({
                        text: opt,
                        order: oi + 1
                    }))
            }))
        };

        request(
            `${API_URL}surveys/admin/surveys/`,
            "POST",
            JSON.stringify(newQ),
            headers()
        ).then(res => {
            console.log(res);
            const updated = [res, ...questionnaires];

            setQuestionnaires(updated);
            setView('list');
        });
    };

    return (
        <div className={cls.add}>
            <div className={cls.add_header}>
                <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <div style={{display: "flex", gap: "1rem", alignItems: "center"}}>
                    <SelectMulti

                        // mode="multiple"
                        allowClear
                        style={{maxWidth: "400px"}}
                        placeholder="Please select"
                        defaultValue={options[0]}
                        onChange={setSelectOption}
                        options={options}
                    />
                    <Input onChange={(e) => setDeadLine(e.target.value)}
                           styleInput={{width: "150px", height: "30px", marginBottom: "0", borderRadius: "5px"}}
                           type={"date"}/>
                    <button className={cls.add_btn} onClick={handleAddQuestion}>
                        + Savol qo'shish
                    </button>

                </div>
            </div>


            <div className={cls.box}>
                {questions.map(q => (
                    <QuestionCard
                        key={q.id}
                        q={q}
                        questions={questions}
                        setQuestions={setQuestions}
                    />
                ))}
            </div>


            {deadLine && <Button onClick={handleSave}>
                Saqlash
            </Button>}
        </div>
    );
}

const questionTypes = [
    {value: 'yes_no', name: "Ha / Yo'q"},
    {value: 'star', name: "5 yulduz"},
    {value: 'test', name: "Test (Variantlar)"},
    {value: 'short_answer', name: "Qisqa javob (AI)"}
];
const QuestionCard = ({q, questions, setQuestions}) => {

    const update = (field, value) => {
        setQuestions(prev =>
            prev.map(item => {
                if (item.id !== q.id) return item;

                // 🔥 agar type o'zgarsa
                if (field === "type") {
                    let newOptions = [];

                    if (value === "test") {
                        newOptions = [''];
                    }

                    return {
                        ...item,
                        type: value,
                        options: newOptions
                    };
                }

                return {
                    ...item,
                    [field]: value
                };
            })
        );
    };

    const handleUpdateOption = (qId, optIndex, value) => {
        setQuestions(questions.map(q => {
            if (q.id !== qId) return q;
            const newOptions = [...q.options];
            newOptions[optIndex] = value;
            return {...q, options: newOptions};
        }));
    };
    const handleRemoveOption = (qId, optIndex) => {
        console.log(optIndex)
        setQuestions(questions.map(q =>
            q.id === qId ? {...q, options: q.options.filter((_, i) => i !== optIndex)} : q
        ));
    };
    const handleAddOption = (qId) => {
        setQuestions(questions.map(q =>
            q.id === qId ? {...q, options: [...q.options, '']} : q
        ));
    };
    const handleRemoveQuestion = (qId) => {
        setQuestions(prev =>
            prev.filter(item => item.id !== qId)
        );
    };

    return (
        <div className={cls.add__box}>
            <div className={cls.add__select}>
                <Input
                    value={q.text}
                    placeholder={"Savol nomi"}
                    onChange={(e) => update('text', e.target.value)}
                />

                <Select
                    extraClass={cls.select}
                    value={q.type}
                    options={questionTypes}
                    onChangeOption={(val) => update('type', val)}
                />
                {q.type === "test" && <button
                    className={cls.addOptionBtn}
                    onClick={() => handleAddOption(q.id)}
                >
                    + Variant qo'shish
                </button>}
                <i onClick={() => handleRemoveQuestion(q.id)}
                   className={classNames(cls.optionRemove2, "fa fa-trash-arrow-up")}/>
            </div>
            {q.type === 'yes_no' && (
                <div className={cls.binaryPreview}>
                    <span className={cls.binaryBtn}>Ha</span>
                    <span className={cls.binaryDivider}>/</span>
                    <span className={cls.binaryBtn}>Yo'q</span>
                </div>
            )}
            {q.type === 'star' && (
                <div className={cls.stars}>
                    {[1, 2, 3, 4, 5].map(n => (
                        <i key={n} className="fas fa-star"/>
                    ))}
                </div>
            )}
            {q.type === 'short_answer' && (
                <div>
                    <span className={classNames(cls.typeTag, cls.typeShort)}>
                                            <i className="fas fa-robot"/> AI tahlil
                                        </span>

                </div>
            )}
            {q.type === 'test' && (
                <div className={cls.optionsList}>
                    {q.options.map((opt, oi) => (
                        <div key={oi} className={cls.optionRow}>
                            <span className={cls.optionIndex}>{String.fromCharCode(65 + oi)}</span>
                            <Input
                                styleInput={{width: opt.length ? `${opt.length * 7 + 150}px` : 150}}

                                value={opt?.text ?? opt}
                                onChange={(e) => handleUpdateOption(q.id, oi, e.target.value)}
                                placeholder={`Variant ${oi + 1}`}
                            />
                            <i
                                className={classNames(cls.optionRemove, "fa fa-trash")}
                                onClick={() => handleRemoveOption(q.id, oi)}
                            />

                        </div>
                    ))}

                </div>
            )}
        </div>
    );
};


const TestOptions = ({q, questions, setQuestions}) => {

    const updateOption = (i, val) => {
        setQuestions(questions.map(item => {
            if (item.id !== q.id) return item;

            const opts = [...item.options];
            opts[i] = val;

            return {...item, options: opts};
        }));
    };

    return (
        <div>
            {q.options.map((opt, i) => (
                <Input
                    key={i}
                    value={opt}
                    onChange={(e) => updateOption(i, e.target.value)}
                />
            ))}
        </div>
    );
};
const QuestionnaireStats = ({data, questionnaires, setView, dispatch, setQuestionnaires}) => {
    const [title, setTitle] = useState("So'rovnoma");
    const [deadLine, setDeadLine] = useState(null);
    const [questions, setQuestions] = useState(data.questions);
    const [selectOption, setSelectOption] = useState([]);
    const {request} = useHttp()

    useEffect(() => {
        if (data) {
            setTitle(data?.title)
            setSelectOption(data?.target_role)
            setDeadLine(data?.deadline)
        }
    }, [data])

    const handleAddQuestion = () => {
        setQuestions([...questions, {
            id: Date.now(),
            type: 'yes_no',
            text: '',
            options: ['']
        }]);
    };

    const handleSave = () => {
        const newQ = {
            id: data.id,
            title,
            target_role: selectOption,
            deadline: deadLine,
            questions: questions.map((q, qi) => ({
                ...q,
                order: qi + 1,
                options: q.type === "yes_no"
                    ? [
                        {text: "Ha", order: 1},
                        {text: "Yo'q", order: 2}
                    ]
                    : q.options.map((opt, oi) => ({
                        text: opt,
                        order: oi + 1
                    }))
            }))
        };

        request(
            `${API_URL}surveys/admin/surveys/${data.id}/`,
            "PUT",
            JSON.stringify(newQ),
            headers()
        ).then(res => {
            const updated = [res, ...questionnaires];

            setQuestionnaires(updated);
            setView('list');
        });
    };
    const handleDelete = () => {
        request(
            `${API_URL}surveys/admin/surveys/${data.id}/`,
            "DELETE",
            null ,
            headers()
        )
            .then(res => {
                setView('list');
                dispatch(onQuestionnaireDelete(data.id))
            })
    }
    return (
        <div className={cls.add}>
            <div className={cls.add_header}>
                <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <div style={{display: "flex", gap: "1rem", alignItems: "center"}}>
                    <SelectMulti

                        // mode="multiple"
                        allowClear
                        style={{maxWidth: "400px"}}
                        placeholder="Please select"
                        defaultValue={data.target_role}
                        onChange={setSelectOption}
                        options={options}
                    />
                    <Input onChange={(e) => setDeadLine(e.target.value)}
                           styleInput={{width: "150px", height: "30px", marginBottom: "0", borderRadius: "5px"}}
                           type={"date"}/>
                    <button className={cls.add_btn} onClick={handleAddQuestion}>
                        + Savol qo'shish
                    </button>

                </div>
            </div>


            <div className={cls.box}>
                {questions.map(q => (
                    <QuestionCard
                        key={q.id}
                        q={q}
                        questions={questions}
                        setQuestions={setQuestions}
                    />
                ))}
            </div>


             <div style={{display: "flex", gap: "1rem", alignItems: "center"}}>
                 <Button onClick={handleSave}>
                     Saqlash
                 </Button>
                 <Button type={"danger"} onClick={handleDelete}>
                     O'chirish
                 </Button>
             </div>
        </div>
    );
};