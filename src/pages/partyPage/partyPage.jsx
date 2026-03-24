import cls from "./partyPage.module.sass"
import {Radio} from "shared/ui/radio/index.js";
import {useEffect, useMemo, useState} from "react";
import {Button} from "shared/ui/button/index.js";
import {ColorPicker, Modal, Select, Space} from "antd";
import {Input} from "shared/ui/input/index.js";
import {Textarea} from "shared/ui/textArea/index.js";
import {Award, ClipboardList, Medal, Plus, Save, Search, Trash2, Trophy, Upload, UserPlus, Users, X} from "lucide-react";
import {useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import {
    fetchParty,
    fetchPartyCompetitions,
    fetchPartyReyting,
    fetchPartyTask
} from "pages/partyPage/model/partyThunk.js";
import {getParty, getPartyCompetitions, getPartyReyting, getPartyTask} from "pages/partyPage/model/partySelector.js";
import {
    onAddCompetitions,
    onAddParty,
    onAddPartyTask,
    onUpdateCompetitionResult,
    onDeleteCompetitionResult ,
    onAddCompetitionResult
} from "pages/partyPage/model/partySlice.js";
import {API_URL, headers, headersImg, useHttp} from "shared/api/base.js";

const partyHeader = [
    "Partiyalar",
    "Topshiriqlar",
    "Reyting",
    "Musobaqalar"
]


export const PartyPage = () => {
    const branchId = localStorage.getItem("branchId");
    const [selectedHeader, setSelectedHeader] = useState(partyHeader[0]);
    const [createParty, setCreateParty] = useState(false)
    const [assigment, setCreateAssigment] = useState(false)
    const [createComp, setCreateComp] = useState(false)

    const data = useSelector(getParty)
    const dataTask = useSelector(getPartyTask)



    const dispatch = useDispatch();
    useEffect(() => {
        if (selectedHeader === "Partiyalar") {
            dispatch(fetchParty(branchId))
        } else if (selectedHeader === "Topshiriqlar") {
            dispatch(fetchPartyTask(branchId))
        } else if (selectedHeader === "Musobaqalar") {
            dispatch(fetchPartyCompetitions(branchId))
        }
        else if (selectedHeader === "Reyting") {
            dispatch(fetchPartyReyting(branchId))
        }
    }, [selectedHeader]);


    return (
        <div className={cls.party}>

            <div className={cls.party__header}>
                <div className={cls.party__header_left}>
                    {partyHeader.map(item =>
                        <Radio children={item} onChange={() => setSelectedHeader(item)}
                               checked={selectedHeader === item}/>
                    )}
                </div>
                {selectedHeader === "Partiyalar" &&
                    <Button onClick={() => setCreateParty(true)}>Yangi partiya qushish</Button>}
                {selectedHeader === "Topshiriqlar" &&
                    <Button onClick={() => setCreateAssigment(true)}>Yangi topshiriq yaratish</Button>}
                {selectedHeader === "Reyting" && null}
                {selectedHeader === "Musobaqalar" && <Button onClick={() => setCreateComp(true)}>Yangi musobaqa turi</Button>}
            </div>


            {selectedHeader === "Partiyalar" && <Party data={data}/>}
            {selectedHeader === "Topshiriqlar" && <Assigment dataTask={dataTask}/>}
            {selectedHeader === "Reyting" && <Reyting/>}
            {selectedHeader === "Musobaqalar" && <Competitions createComp={createComp} setCreateComp={setCreateComp}/>}
            <ModalPartyAdd createParty={createParty} setCreateParty={setCreateParty}/>
            <ModalAssignmentCreate assigment={assigment} setCreateAssigment={setCreateAssigment}/>
        </div>
    );
};


const AVATAR_COLORS = ["#4f8ef7", "#8b5cf6", "#ec4899", "#10b981", "#f59e0b", "#06b6d4", "#ef4444", "#84cc16"];

const avatarColor = (i) => AVATAR_COLORS[i % AVATAR_COLORS.length];

//topshiriq modal
const ModalAssignmentCreate = ({assigment, setCreateAssigment}) => {
    const branchId = localStorage.getItem("branchId");

    const {register, handleSubmit, setValue} = useForm();
    const [selectedParty, setSelectedParty] = useState([]);
    const {request} = useHttp()
    const formData = new FormData()
    const dispatch= useDispatch()
    const [options , setOption] = useState([]);
    useEffect(() => {
        request(`${API_URL}Parties/parties/select-options/?branch_id=${branchId}` , "GET", null , headers())
            .then(res => {
                setOption(res)
            })
    }, []);


    const onSubmit = (data) => {
        const res = {
            ...data,
            parties: selectedParty
        }
        request(`${API_URL}Parties/party-tasks/?branch_id=${branchId}` , "POST", JSON.stringify(res) , headers())
            .then(res => {
                dispatch(onAddPartyTask(res))
                setCreateAssigment(false)
                setValue("name" , "")
                setValue("desc" , "")
                setValue("ball" , "")
                setValue("deadline" , "")
            })

    }
    return (
        <Modal okText={"Yaratish"} cancelText={"Bekor qilish"} onOk={handleSubmit(onSubmit)}
               title={"Yangi Topshiriq Yaratish"} okType={"default"} open={assigment}
               onCancel={() => setCreateAssigment(false)}>

            <Input name={"name"} register={register} extraClassName={cls.input} title={"Nomi"}/>
            <Textarea extraClassName={cls.input} register={register} name={"desc"} title={"Tafsif"}
                      defaultValue={"Qisqacha tasfif"}/>
            <Input extraClassName={cls.input} title={"Muddat"} type={"date"} name={"deadline"} register={register}/>
            <Input extraClassName={cls.ball} type={"number"} title={"Ball"} name={"ball"} register={register}/>
            <Select
                mode="multiple"
                style={{width: '100%'}}
                placeholder="Partiyalar"
                defaultValue={options[0]?.value}
                onChange={(value) => {
                    setSelectedParty(value)
                }}
                options={options}
                optionRender={(option) => (
                    <Space>

                        {option.data.label}
                    </Space>
                )}
            />

        </Modal>
    )
}
//partiya modal
const ModalPartyAdd = ({createParty, setCreateParty}) => {

    const [partyImage, setPartyImage] = useState(null)
    const [partyImage2, setPartyImage2] = useState(null)
    const {register, setValue, handleSubmit,} = useForm()
    const [colorHex, setColorHex] = useState('#111F4C');
    const [formatHex, setFormatHex] = useState('hex');
    const formData = new FormData()
    const branchId = localStorage.getItem("branchId");

    const {request} = useHttp()


    const dispatch = useDispatch();
    const hexString = useMemo(
        () => (typeof colorHex === 'string' ? colorHex : colorHex?.toHexString()),
        [colorHex]
    );


    const handleImageChange = (e) => {
        // console.log(e.target.files[0])
        const file = e.target.files?.[0];
        if (file) {
            setPartyImage2(file)
            const reader = new FileReader();
            reader.onloadend = () => {
                setPartyImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleModalClose = (data) => {


        formData.append("name", data.name)
        formData.append("image", partyImage2)
        formData.append("color", hexString)
        formData.append("desc", data.desc)
        request(`${API_URL}Parties/parties/?branch_id=${branchId}`, "POST", formData, headersImg())
            .then(res => {
                dispatch(onAddParty(res))
                setCreateParty(false);
                setPartyImage(null);
                setValue("name" , "")
                setValue("desc" , "")
                setColorHex("#111F4C")

            })


    };

    return (
        <Modal title={"Yangi Partiya Yaratish"} okType={"default"} open={createParty}
               onOk={handleSubmit(handleModalClose)} onCancel={() => setCreateParty(false)}>

            <Input extraClassName={cls.input} register={register} name={"name"} title={"Partiya Nomi"}/>
            <Textarea extraClassName={cls.input} title={"Tavsif"} register={register} name={"desc"}
                      placeholder={"Partiya haqida qisqacha"}/>

            <div style={{marginTop: "16px", marginBottom: "16px"}}>
                <h3 style={{marginBottom: "8px"}}>Rasm tanlang</h3>
                <label style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    padding: "16px",
                    border: "2px dashed #d9d9d9",
                    borderRadius: "4px",
                    cursor: "pointer",
                    transition: "all 0.3s"
                }} onMouseEnter={(e) => e.currentTarget.style.borderColor = "#40a9ff"}
                       onMouseLeave={(e) => e.currentTarget.style.borderColor = "#d9d9d9"}>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{display: "none"}}
                    />

                    {partyImage ? (
                        <img
                            src={partyImage}
                            alt="Tanlangan rasm"
                            style={{
                                marginTop: "12px",
                                maxWidth: "100%",
                                maxHeight: "200px",
                                borderRadius: "4px",
                                objectFit: "cover"
                            }}
                        />
                    ) : <span style={{display: "flex", alignItems: "center", gap: "8px", color: "#666"}}>
                        <Upload size={20}/>
                        Rasmni tanlang
                    </span>}
                </label>

            </div>

            <div className={cls.party__colorPicker}>
                <h3>Rang tanlang</h3>
                <ColorPicker
                    format={formatHex}
                    value={colorHex}
                    onChange={setColorHex}
                    onFormatChange={setFormatHex}
                />
            </div>
        </Modal>

    )
}

const PARTY_COLORS = [
    {bg: "linear-gradient(135deg,#4f8ef7 0%,#6c63ff 100%)", accent: "#4f8ef7", light: "#eef2ff"},
    {bg: "linear-gradient(135deg,#10b981 0%,#059669 100%)", accent: "#10b981", light: "#ecfdf5"},
    {bg: "linear-gradient(135deg,#f59e0b 0%,#d97706 100%)", accent: "#f59e0b", light: "#fffbeb"},
    {bg: "linear-gradient(135deg,#ec4899 0%,#db2777 100%)", accent: "#ec4899", light: "#fdf2f8"},
    {bg: "linear-gradient(135deg,#06b6d4 0%,#0891b2 100%)", accent: "#06b6d4", light: "#ecfeff"},
];




const PartyDetailModal = ({party, color, onClose , setSelectedParty}) => {
    const [search, setSearch] = useState("");
    const [activeAddModal, setActiveAddModal] = useState(false);

    if (!party) return null;

    const filteredMembers = party.memberships.filter(m =>
        m.student_name.toLowerCase().includes(search.toLowerCase())
    );


    const barWidth = (ball) => Math.min(100, Math.round((ball / 320) * 100)) + "%";

    return (
        <div className={cls.detailOverlay}>
            <div className={cls.detailModal} onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className={cls.detailModal_header} style={{background: party.color}}>
                    <div className={cls.detailModal_header_left}>
                        <div className={cls.detailModal_header_avatar}>{party.emoji}</div>
                        <div>
                            <h2 className={cls.detailModal_header_name}>{party.name} Partiyasi</h2>
                            <p className={cls.detailModal_header_desc}>{party.desc}</p>
                            <div className={cls.detailModal_header_stars}>
                                {"★".repeat(Math.floor(party.rating))}{"☆".repeat(5 - Math.floor(party.rating))}
                                <span>{party.rating}/5.0</span>
                            </div>
                        </div>
                    </div>
                    <div className={cls.detailModal_header_actions}>
                        <button onClick={() => setActiveAddModal(true)} className={cls.detailModal_header_btn_outline}>
                            <UserPlus size={13}/>O'quvchi qo'shmoq
                        </button>
                        {/*<button className={cls.detailModal_header_btn_outline}><Star size={14} /> Baho Bermoq</button>*/}
                    </div>
                    <button className={cls.detailModal_close} onClick={onClose}><X size={18}/></button>
                </div>

                {/* Stats */}
                <div className={cls.detailModal_stats}>
                    {[
                        {val: party?.ball?.toLocaleString(), label: "Umumiy Ball", color: party.color},
                        {val: party?.wins, label: "G'alabalar", icon: "🏆"},
                        {val: party?.members, label: "Jami A'zo", icon: "👥"},
                        {val: "3", label: "Faol A'zo", icon: "✅"},
                        {val: party?.tasks, label: "Topshiriq", icon: "📋"},
                        {val: "280", label: "O'rt. Ball", icon: "📊"},
                    ].map((s, i) => (
                        <div key={i} className={cls.detailModal_stat}>
                            <span className={cls.detailModal_stat_val} style={party.color ? {color: party.color} : {}}>
                                {s.icon ? s.icon + " " : ""}{s.val}
                            </span>
                            <span className={cls.detailModal_stat_label}>{s.label}</span>
                        </div>
                    ))}
                </div>

                {/* Assignments */}
                {/*<div className={cls.detailModal_section}>*/}
                {/*    <div className={cls.detailModal_section_title}><ClipboardList size={16}/> Topshiriqlar*/}
                {/*        ({MOCK_TASKS.length})*/}
                {/*    </div>*/}
                {/*    <div style={{height: "11rem", overflow: "auto"}}>*/}
                {/*        {MOCK_TASKS.map(t => (*/}
                {/*            <div key={t.id} className={cls.detailModal_task}>*/}
                {/*            <span className={cls.detailModal_task_badge} style={{*/}
                {/*                background: t.level === "yuqori" ? "#fef3c7" : "",*/}
                {/*                color: t.level === "yuqori" ? "#d97706" : "#10b981"*/}
                {/*            }}>{t.level.toUpperCase()}</span>*/}
                {/*                <span className={cls.detailModal_task_name}>{t?.name}</span>*/}
                {/*                <span className={cls.detailModal_task_date}>📅 {t?.deadline}</span>*/}
                {/*                <span className={cls.detailModal_task_ball}*/}
                {/*                      style={{color: party.color}}>+{t?.ball}</span>*/}
                {/*                <div className={cls.detailModal_task_bar}>*/}
                {/*                    <div style={{width: t?.done + "%", background: party.color}}/>*/}
                {/*                </div>*/}
                {/*                <span className={cls.detailModal_task_pct}>{t?.done}%</span>*/}
                {/*            </div>*/}
                {/*        ))}*/}
                {/*    </div>*/}
                {/*</div>*/}

                {/* Members */}
                <div className={cls.detailModal_section}>
                    <div className={cls.detailModal_section_header}>
                        <div className={cls.detailModal_section_title}><Users size={16}/> A'zolar Ro'yxati
                            ({party.memberships?.length})
                        </div>
                        <div className={cls.detailModal_search}>
                            <Search size={14}/>
                            <input placeholder="Qidirish..." value={search} onChange={e => setSearch(e.target.value)}/>
                        </div>
                        {/*<button className={cls.detailModal_addBtn} style={{ background: color.accent }}>*/}
                        {/*    <UserPlus size={13} /> O'quvchi*/}
                        {/*</button>*/}
                    </div>
                    <div style={{height: "20rem", overflowY: "auto"}}>
                        <table className={cls.detailModal_table}>
                            <thead>
                            <tr>
                                {["#", "O'QUVCHI ISM FAMILIYA", "SINF", ""].map(h => <th
                                    key={h}>{h}</th>)}
                            </tr>
                            </thead>
                            <tbody>
                            {filteredMembers.map((m, idx) => (
                                <tr key={m.id}>
                                    <td>{idx + 1}</td>
                                    <td>
                                        <div className={cls.detailModal_member}>
                                            <div className={cls.detailModal_member_av}
                                                 style={{
                                                     background: color?.light,
                                                     color: color?.accent
                                                 }}>{m?.avatar}</div>
                                            <span>{m?.student_name}</span>
                                        </div>
                                    </td>
                                    <td>{m?.student_class}</td>
                                    <td>
                                        <div className={cls.detailModal_actions}>
                                            <button className={cls.detailModal_act_del}><Trash2 size={11}/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <AddStudentsParty partyId={party.id} setActiveAddModal={setActiveAddModal} activeAddModal={activeAddModal} setSelectedParty={setSelectedParty}/>
        </div>
    );
};

const Party = ({data}) => {
    const [selectedParty, setSelectedParty] = useState(null);
    const selectedColor = selectedParty ? PARTY_COLORS[(selectedParty.id - 1) % PARTY_COLORS.length] : null;
    const branchId = localStorage.getItem("branchId");

    const {request} = useHttp()

    const onClick = (id) => {
        request(`${API_URL}Parties/parties/${id}/?branch_id=${branchId}` , "GET" , null , headers())
            .then(res => {
                setSelectedParty(res);
            })
    }
    return (
        <>
            <div className={cls.party__body}>
                {data.map((party, i) => {
                    const color = PARTY_COLORS[i % PARTY_COLORS.length];
                    const progress = Math.min(100, Math.round((party.ball / 2850) * 100));
                    return (
                        <div key={party.id} className={cls.party__body_box} onClick={() => onClick(party.id)}
                             style={{"--accent": color.accent, "--light": color.light}}>
                            {/* Card top banner */}
                            <div className={cls.party__body_box_banner} style={{background: party.color}}>
                                <div className={cls.party__body_box_banner_emoji}><img src={party?.image} alt=""/></div>
                                <div className={cls.party__body_box_banner_rank}>#{i + 1}</div>
                            </div>

                            {/* Card body */}
                            <div className={cls.party__body_box_content}>
                                <div className={cls.party__body_box_name}>{party?.name}</div>
                                <div className={cls.party__body_box_desc2}>{party?.desc}</div>

                                {/* Stars */}
                                <div className={cls.party__body_box_stars}>
                                    <span style={{color: "#f59e0b"}}>{"★".repeat(Math.floor(party?.rating))}</span>
                                    <span style={{color: "#cbd5e1"}}>{"★".repeat(5 - Math?.floor(party?.rating))}</span>
                                    <span className={cls.party__body_box_stars_val}>{party?.rating}</span>
                                </div>

                                {/* Mini stats */}
                                <div className={cls.party__body_box_chips}>
                                    <div className={cls.party__body_box_chip}
                                         style={{background: party.color, color: "white"}}>
                                        <Users size={12}/> {party?.members} a'zo
                                    </div>
                                    <div className={cls.party__body_box_chip}
                                         style={{background: party.color, color: "white"}}>
                                        <Trophy size={12}/> {party?.wins} g'alaba
                                    </div>
                                    <div className={cls.party__body_box_chip}
                                         style={{background: party.color, color: "white"}}>

                                        <ClipboardList size={12}/> {party?.tasks} topshiriq
                                    </div>
                                </div>

                                {/* Ball + progress */}
                                <div className={cls.party__body_box_footer}>
                                    <div className={cls.party__body_box_ball}>
                                        <span style={{color: party.color}}>{party?.ball?.toLocaleString()}</span>
                                        <span>ball</span>
                                    </div>
                                    <div className={cls.party__body_box_progress}>
                                        <div style={{width: progress + "%", background: party.color}}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {selectedParty && (
                <PartyDetailModal
                    setSelectedParty={setSelectedParty}
                    party={selectedParty}
                    color={selectedColor}
                    onClose={() => setSelectedParty(null)}
                />
            )}
        </>
    );
}

//topshiriq page
const Assigment = ({dataTask}) => {
    // grades: { taskId -> { partyId -> ball } }
    const [grades, setGrades] = useState({});
    const [savedGrades, setSavedGrades] = useState({});
    const branchId = localStorage.getItem("branchId");

    const setGrade = (taskId, partyId, val) => {
        setGrades(prev => ({
            ...prev,
            [taskId]: {...(prev[taskId] || {}), [partyId]: val}
        }));
    };

    const saveGrade = async (taskId) => {
        const taskGrades = grades[taskId] || {};

        // 🔥 kerakli formatga o'tkazish
        const payload = {
            grades: Object.entries(taskGrades).map(([partyId, ball]) => ({
                party: Number(partyId),
                ball: Number(ball)
            }))
        };

        try {
            const res = await fetch(`${API_URL}Parties/party-tasks/${taskId}/bulk-grade/?branch_id=${branchId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error("Xatolik bor");

            // success bo‘lsa local save
            setSavedGrades(prev => ({
                ...prev,
                [taskId]: taskGrades
            }));

            console.log("Yuborildi:", payload);
        } catch (err) {
            console.error("Xatolik:", err);
        }
    };


    return (
        <div className={cls.party__assigment}>
            {dataTask.map((item) => (
                <div key={item.id} className={cls.party__assigment_box}>
                    <div className={cls.party__assigment_box_title}>
                        <span>{item.name}</span>
                        <span>📅 {item.deadline || "Muddatsiz"}</span>
                    </div>

                    {item?.desc && <p className={cls.party__assigment_desc}>{item.desc}</p>}

                    <div className={cls.party__assigment_gradeSection}>
                        <div className={cls.party__assigment_gradeTitle}>
                            <Trophy size={14} /> Baholash
                        </div>

                        {item.parties_info.map(party => {
                            const saved = savedGrades[item.id]?.[party.id];
                            const current = grades[item.id]?.[party.id] ?? "";
                            const maxBall =  100;
                            const progress = Math.min(100, (Number(current) / maxBall) * 100);

                            return (
                                <div key={party.id} className={cls.party__assigment_partyCard}>
                                    <div className={cls.party__assigment_partyHeader}>
                                        <div className={cls.party__assigment_partyName}>
                                            <Users size={14} style={{color: party.color || "#94a3b8"}}/>
                                            {party.name}
                                        </div>
                                        <div className={cls.party__assigment_status}>
                                            {saved !== undefined ? (
                                                <span className={cls.party__assigment_savedBall}>
                                                    <Medal size={12} /> {saved}
                                                </span>
                                            ) : (
                                                <span style={{color: "#cbd5e1"}}>Baholanmagan</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className={cls.party__assigment_inputs}>
                                        <div className={cls.party__assigment_ballInput}>
                                            <Input
                                                extraClassName={cls.party__assigment_inputField}
                                                type="number"
                                                min="0"

                                                max={maxBall}
                                                placeholder="Ball..."
                                                defaultValue={party.ball}
                                                onChange={e => setGrade(item.id, party.id, e.target.value)}
                                            />
                                            <span className={cls.party__assigment_maxBall}>{party.ball}/{maxBall}</span>
                                        </div>
                                    </div>

                                    <div className={cls.party__assigment_progressWrap}>
                                        <div
                                            className={cls.party__assigment_progressBar}
                                            style={{
                                                width: `${progress}%`,
                                                background: party.color || "#4f8ef7"
                                            }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <Button
                        extraClassName={cls.party__assigment_saveBtn}
                        onClick={() => saveGrade(item.id)}
                    >
                        <Save size={18} /> Saqlash
                    </Button>
                </div>
            ))}
        </div>
    )
}



//reyting
const Reyting = () => {
    const branchId = localStorage.getItem("branchId");

    const reyting = useSelector(getPartyReyting)
    const [students, setStudents] = useState([]);
    const {request} = useHttp()
    useEffect(() => {
        request(`${API_URL}Parties/members/?branch_id=${branchId}` , "GET" , null , headers())
            .then(res => {
                setStudents(res)})
    }, []);


    return (
        <div className={cls.party__rating}>
            <div className={cls.party__rating_party}>
                <div className={cls.party__rating_party_title}>
                    Umumiy Reyting
                </div>
                <div className={cls.party__rating_party_list}>
                    {reyting.map((item, index) => (
                        <div className={cls.party__rating_party_list_box}>
                            <div className={cls.party__rating_party_list_box_info}>

                                <div className={cls.party__rating_party_list_box_order}>
                                    {index + 1}
                                </div>
                                <div className={cls.party__rating_party_list_box_info_img}>

                                </div>
                                <div className={cls.party__rating_party_list_box_info_title}>
                                    {item.name}
                                </div>
                            </div>

                            <div className={cls.party__rating_party_list_box_score}>
                                <div className={cls.party__rating_party_list_box_score_ball}>
                                    Ball: {item.ball}
                                </div>
                                <div className={cls.party__rating_party_list_box_score_rating}>
                                    <div style={{width: item.ball + "%"}}>

                                    </div>
                                </div>

                            </div>
                        </div>
                    ))}

                </div>
            </div>
            <div className={cls.party__rating_students}>

                <div style={{
                    fontFamily: "'Unbounded',sans-serif",
                    fontSize: "1.8rem",
                    fontWeight: 700,
                    marginBottom: 10
                }}>🏅 Top O'quvchilar
                </div>
                <div style={{
                    background: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: 12,
                    overflow: "auto",
                    height: "calc(100vh - 16rem)",
                    boxShadow: "0 1px 8px rgba(0,0,0,.05)",
                    width: "100%"
                }}>
                    <table style={{width: "100%", borderCollapse: "collapse"}}>
                        <thead>
                        <tr style={{background: "#f0f2f8", borderBottom: "1px solid #e2e8f0"}}>
                            {["#", "O'QUVCHI", "SINF", "PARTIYA", "BALL"].map(h => (
                                <th key={h} style={{
                                    padding: "9px 14px",
                                    textAlign: "left",
                                    fontSize: "1rem",
                                    fontWeight: 700,
                                    textTransform: "uppercase",
                                    letterSpacing: ".6px",
                                    color: "#64748b",
                                    whiteSpace: "nowrap"
                                }}>{h}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {students.map((item, idx) => {
                            const ac = avatarColor(idx);
                            // if (!item.student) return null;
                            return (
                                <tr key={idx} style={{borderBottom: "1px solid #f1f5f9"}}>
                                    <td style={{
                                        padding: "10px 14px",
                                        fontFamily: "'Unbounded',sans-serif",
                                        fontSize: "1.4rem",
                                        fontWeight: 700,
                                        color: "#64748b"
                                    }}>{idx + 1}</td>
                                    <td style={{padding: "10px 14px"}}>
                                        <div style={{display: "flex", alignItems: "center", gap: 8}}>
                                            <div style={{
                                                width: 28,
                                                height: 28,
                                                borderRadius: "50%",
                                                background: `${ac}18`,
                                                color: ac,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: 10,
                                                fontWeight: 700,
                                                flexShrink: 0
                                            }}>{item.avatar}</div>
                                            <span style={{fontWeight: 600, fontSize: "1.4rem"}}>{item.student_name}</span>
                                        </div>
                                    </td>
                                    <td style={{
                                        padding: "10px 14px",
                                        fontSize: "1.3rem",
                                        fontWeight: 600,
                                        color: "#64748b"
                                    }}>{item.student_class}</td>
                                    <td style={{
                                        padding: "10px 14px",
                                        fontSize: "1.3rem",
                                        color: "#64748b"
                                    }}>{item.party_name}</td>
                                    <td style={{
                                        padding: "10px 14px",
                                        fontFamily: "'Unbounded',sans-serif",
                                        fontSize: "1.2rem",
                                        fontWeight: 700,
                                        color: item.color
                                    }}>{item.ball}
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>


            </div>
        </div>
    )
}


const AddStudentsParty = ({activeAddModal, setActiveAddModal , partyId , setSelectedParty}) => {
    const [selectedIds, setSelectedIds] = useState([]);
    const [students, setStudents] = useState([]);
    const allChecked = selectedIds.length === students.length;
    const indeterminate = selectedIds.length > 0 && !allChecked;

    const branchId = localStorage.getItem("branchId");
    const {request} = useHttp()
    useEffect(() => {
        if (activeAddModal){
            request(`${API_URL}Parties/students/?branch_id=${branchId}` , "GET" , null , headers())
                .then(res =>{

                    setStudents(res)
                })

        }
    }, [activeAddModal]);

    const toggleAll = () => setSelectedIds(allChecked ? [] : students.map(s => s.id));
    const toggleOne = (id) => setSelectedIds(prev =>
        prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );

    const handleOk = () => {

        const res = {
            party: partyId ,
            students: selectedIds,
        }
        request(`${API_URL}Parties/members/?branch_id=${branchId}` , "POST" , JSON.stringify(res) , headers())
            .then(res => {
                setActiveAddModal(false)
                request(`${API_URL}Parties/parties/${partyId}/?branch_id=${branchId}` , "GET" , null , headers())
                    .then(res => {
                        setSelectedParty(res);
                        setSelectedIds([])
                    })
            })
    };


    return (
        <Modal open={activeAddModal} onCancel={() => setActiveAddModal(false)} onOk={handleOk}
               selectedCount={selectedIds.length} okText={"Qo'shish"} okType={"default"} cancelText={"Bekor qilish"}>
            {/* Stats */}
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 24px 6px"
            }}>
          <span style={{fontSize: 13, color: "#999"}}>
            Jami: <strong style={{color: "#1a1a2e"}}>{students.length}</strong> o'quvchi
          </span>
                {selectedIds.length > 0 && (
                    <span style={{
                        fontSize: 12, fontWeight: 700, padding: "3px 12px", borderRadius: 20,
                        background: "#ede9fe", color: "#7c3aed"
                    }}>✓ {selectedIds.length} tanlandi</span>
                )}
            </div>

            {/* Table */}
            <div style={{maxHeight: "500px", overflowY: "auto"}}>
                <table style={{width: "100%", borderCollapse: "collapse", fontSize: 14}}>
                    <thead>
                    <tr style={{
                        background: "#f5f3ff",
                        borderTop: "1px solid #ede9fe",
                        borderBottom: "1px solid #ede9fe",
                        position: "sticky",
                        top: 0,
                        zIndex: 1
                    }}>
                        <th style={{width: 50, padding: "11px 0 11px 24px", textAlign: "center"}}>
                            <input
                                type="checkbox" checked={allChecked}
                                ref={el => {
                                    if (el) el.indeterminate = indeterminate;
                                }}
                                onChange={toggleAll}
                                style={{width: 16, height: 16, cursor: "pointer", accentColor: "#667eea"}}
                            />
                        </th>
                        {["#", "Ism Familya"].map(h => (
                            <th key={h} style={{
                                padding: "11px 14px",
                                textAlign: "left",
                                fontSize: 11,
                                fontWeight: 700,
                                color: "#a0a0b0",
                                textTransform: "uppercase",
                                letterSpacing: "0.05em"
                            }}>{h}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {students.map((student, i) => {
                        const sel = selectedIds.includes(student.id);
                        return (
                            <tr
                                key={student.id}
                                onClick={() => toggleOne(student.id)}
                                style={{
                                    cursor: "pointer", borderBottom: "1px solid #f3f3f3",
                                    background: sel ? "linear-gradient(90deg,#ede9fe,#f5f3ff)" : i % 2 === 0 ? "#fff" : "#fafafa",
                                    transition: "background 0.15s"
                                }}
                                onMouseEnter={e => {
                                    if (!sel) e.currentTarget.style.background = "#f5f3ff";
                                }}
                                onMouseLeave={e => {
                                    if (!sel) e.currentTarget.style.background = i % 2 === 0 ? "#fff" : "#fafafa";
                                }}
                            >
                                <td style={{padding: "10px 0 10px 24px", textAlign: "center"}}>
                                    <input
                                        type="checkbox" checked={sel}
                                        onChange={() => toggleOne(student.id)}
                                        onClick={e => e.stopPropagation()}
                                        style={{width: 16, height: 16, cursor: "pointer", accentColor: "#667eea"}}
                                    />
                                </td>
                                <td style={{padding: "10px 14px", color: "#bbb", fontWeight: 500}}>{i + 1}</td>
                                <td style={{
                                    padding: "10px 14px",
                                    color: "#1a1a2e",
                                    fontWeight: sel ? 600 : 400
                                }}>{student.label}</td>

                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>

        </Modal>

    )
}
//lesson observe
//statsitic teacher face id
//2ta haftadan 1ta sida uqtuvchila uchun pdi
//students bahop quyish page filter

// ─── Musobaqalar (Competition Scores) ────────────────────────────────────────



const QUARTERS = ["1-chorak", "2-chorak", "3-chorak", "4-chorak"];


const COMP_COLORS = ["#10b981","#4f8ef7","#f59e0b","#8b5cf6","#ef4444","#06b6d4","#ec4899","#84cc16"];

// Modal: new competition type
const ModalCompCreate = ({open, onClose, onAdd}) => {
    const [name, setName]   = useState("");
    const [color, setColor] = useState(COMP_COLORS[0]);



    const handleAdd = () => {
        if (!name.trim()) return;
        onAdd({name: name.trim(), emoji: "🏆", color});
        setName(""); setColor(COMP_COLORS[0]);

        onClose();
    };

    if (!open) return null;
    return (
        <div className={cls.musob__overlay} onClick={onClose}>
            <div className={cls.musob__modal} onClick={e => e.stopPropagation()}>
                <button className={cls.musob__modal_close} onClick={onClose}><X size={16}/></button>
                <div className={cls.musob__modal_title}>Yangi Musobaqa Turi</div>

                <div className={cls.musob__modal_label}>Musobaqa Nomi</div>
                <input
                    className={cls.musob__modal_input}
                    type="text" placeholder="masalan: Matematika olimpiadasi"
                    value={name} onChange={e => setName(e.target.value)}
                />

                <div className={cls.musob__modal_label}>Rang Tanlang</div>
                <div className={cls.musob__modal_colorRow}>
                    {COMP_COLORS.map(c => (
                        <button key={c}
                            className={cls.musob__modal_colorDot + (color === c ? " " + cls.musob__modal_colorDot_active : "")}
                            style={{background: c}}
                            onClick={() => setColor(c)}
                        />
                    ))}
                </div>

                <button className={cls.musob__modal_ok} onClick={handleAdd} disabled={!name.trim()}>
                    Qo'shish
                </button>
            </div>
        </div>
    );
};



const Competitions = ({createComp, setCreateComp}) => {
    const parties = useSelector(getParty);
    // partiyalarni house formatiga o'tkazamiz
    const houses = parties.map(p => ({
        id: p.id,
        name: p.name,
        color: p.color || "#4f8ef7",
        light: (p.color || "#4f8ef7") + "22",
    }));
    const competitions = useSelector(getPartyCompetitions)

    const [activeQuarter, setActiveQuarter] = useState(QUARTERS[0]);
    // accordion: which comp is open
    const [openComp, setOpenComp] = useState(null);
    // modal state
    const [addModal, setAddModal] = useState(null); // { compId }
    const [modalHouse, setModalHouse] = useState(null);
    const [modalBall, setModalBall] = useState("");
    const [modalNote, setModalNote] = useState("");
    const [scoreMode, setScoreMode] = useState("add");
    const dispatch = useDispatch();
    const branchId = localStorage.getItem("branchId");

    const {request} = useHttp()

    // yangi musobaqa turi qo'shish
    const handleAddCompetition = (newComp) => {
        request(`${API_URL}Parties/competitions/?branch_id=${branchId}` , "POST" , JSON.stringify(newComp))
            .then(res => {
                dispatch(onAddCompetitions(res))
            })

    };

    // sum balls per house for a quarter based on all competitions
    const quarterTotals = (quarter) => {
        const totals = {};
        houses.forEach(h => totals[h.id] = 0);
        competitions.forEach(comp => {
            (comp.results || []).forEach(res => {
                if (res.quarter === quarter) {
                    const pId = res.party;
                    if (pId) {
                        totals[pId] = (totals[pId] || 0) + Number(res.ball);
                    }
                }
            });
        });
        return totals;
    };

    const getWinner = (quarter) => {
        const totals = quarterTotals(quarter);
        let maxBall = 0; let winnerId = null;
        Object.entries(totals).forEach(([hid, b]) => { if (b > maxBall) { maxBall = b; winnerId = hid; } });
        if (!winnerId || maxBall === 0) return null;
        // WinnerId is key of totals, which is string. Find matching house.
        return {house: houses.find(h => String(h.id) === String(winnerId)), ball: maxBall};
    };

    const openAdd = (compId) => {
        setAddModal({compId});
        setModalHouse(null); setModalBall(""); setModalNote(""); setScoreMode("add");
    };

    const handleAdd = () => {
        if (!modalHouse || !modalBall || Number(modalBall) <= 0) return;

        const comp = competitions.find(c => c.id === addModal.compId);

        const existing = comp?.results?.find(r =>
            String(r.party) === String(modalHouse) &&
            r.quarter === activeQuarter
        );

        const newBall = Number(modalBall);

        // 🔁 UPDATE (agar oldin bor bo‘lsa)
        if (existing) {
            const updatedBall =
                scoreMode === "add"
                    ? Number(existing.ball) + newBall
                    : newBall;

            request(
                `${API_URL}Parties/competition-results/${existing.id}/?branch_id=${branchId}`,
                "PATCH",
                JSON.stringify({
                    ball: updatedBall,
                    note: modalNote
                })
            ).then(res => {
                // 🔥 competitions ni update qilamiz
                dispatch(onUpdateCompetitionResult({
                    compId: addModal.compId,
                    resultId: existing.id,
                    data: res
                }));

                setAddModal(null);
            });

        } else {
            // ➕ CREATE (yangi bo‘lsa)
            const payload = {
                competition: addModal.compId,
                party: modalHouse,
                quarter: activeQuarter,
                ball: newBall,
                note: modalNote,
                is_winner: false
            };

            request(
                `${API_URL}Parties/competition-results/?branch_id=${branchId}`,
                "POST",
                JSON.stringify(payload)
            ).then(res => {
                dispatch(onAddCompetitionResult({
                    compId: addModal.compId,
                    result: res
                }));

                setAddModal(null);
            });
        }
    };

    const deleteResult = (compId, resultId) => {
        request(`${API_URL}Parties/competition-results/${resultId}/?branch_id=${branchId}` , "DELETE" , null , headers())

                dispatch(onDeleteCompetitionResult({compId, resultId}));


        // setScores(prev => {
        //     const next = JSON.parse(JSON.stringify(prev));
        //     next[activeQuarter][compId] = next[activeQuarter][compId]?.filter(r => r.id !== resultId);
        //     return next;
        // });
    };

    const winner = getWinner(activeQuarter);
    const totals = quarterTotals(activeQuarter);
    const maxBall = Math.max(...Object.values(totals), 1);

    return (
        <div className={cls.musob}>
            {/* Quarter tabs */}
            <div className={cls.musob__tabs}>
                {QUARTERS.map(q => (
                    <button key={q}
                        className={cls.musob__tab + (activeQuarter === q ? " " + cls.musob__tab_active : "")}
                        onClick={() => setActiveQuarter(q)}
                    >{q}</button>
                ))}
            </div>

            <div className={cls.musob__main}>
                {/* Left: accordion competition cards */}
                <div className={cls.musob__left}>
                    {competitions.map(comp => {
                        const results = (comp.results || []).filter(r => r.quarter === activeQuarter);
                        const isOpen = openComp === comp.id;

                        return (
                            <div key={comp.id} className={cls.musob__compCard}>
                                {/* Accordion header */}
                                <div className={cls.musob__compCard_header}
                                     style={{background: comp.color, cursor: "pointer"}}
                                     onClick={() => setOpenComp(isOpen ? null : comp.id)}>
                                    <span className={cls.musob__compCard_emoji}>{comp.emoji}</span>
                                    <span className={cls.musob__compCard_name}>{comp.name}</span>
                                    <span className={cls.musob__compCard_ball}>
                                        {results.length} ta natija · {results.reduce((s, r) => s + Number(r.ball), 0)} ball
                                    </span>
                                    <button className={cls.musob__compCard_addBtn}
                                            onClick={e => { e.stopPropagation(); openAdd(comp.id); }}>
                                        <Plus size={13}/> Natija qo'shish
                                    </button>
                                    <span className={cls.musob__compCard_chevron}
                                          style={{transform: isOpen ? "rotate(180deg)" : "rotate(0deg)"}}>▾</span>
                                </div>

                                {/* Accordion body */}
                                {isOpen && (
                                    <div className={cls.musob__compCard_body}>
                                        {results.length === 0 ? (
                                            <div className={cls.musob__compCard_empty}>
                                                Hali natija kiritilmagan. "Natija qo'shish" tugmasini bosing.
                                            </div>
                                        ) : (
                                            <>

                                                <table className={cls.musob__table}>
                                                    <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Xaus</th>
                                                        <th>Ball</th>
                                                        <th>Izoh</th>
                                                        <th></th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {results.map((r, idx) => {
                                                        const h = houses.find(x => String(x.id) === String(r.party));
                                                        return (
                                                            <tr key={r.id}>
                                                                <td style={{color: "#94a3b8"}}>{idx + 1}</td>
                                                                <td>
                                                                    <div className={cls.musob__houseTag}
                                                                         style={{background: h?.light, color: comp?.color}}>
                                                                        {r?.party_name}
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <span className={cls.musob__ballVal}
                                                                          style={{color: comp.color}}>{r.ball}</span>
                                                                </td>
                                                                <td style={{color: "#64748b", fontSize: "1.2rem"}}>{r.note || "—"}</td>
                                                                <td>
                                                                    <button className={cls.musob__resetBtn}
                                                                            onClick={() => deleteResult(comp.id, r.id)}>
                                                                        <Trash2 size={11}/>
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                    </tbody>
                                                </table>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Right: leaderboard */}
                <div className={cls.musob__right}>
                    {winner ? (
                        <div className={cls.musob__winner}
                             style={{background: `linear-gradient(135deg, ${winner.house.color} 0%, ${winner.house.color}cc 100%)`}}>
                            <Trophy size={28} color="#fde68a"/>
                            <div className={cls.musob__winner_label}>Hozirgi Golib</div>
                            <div className={cls.musob__winner_name}>{winner.house.name}</div>
                            <div className={cls.musob__winner_ball}>{winner.ball} ball</div>
                        </div>
                    ) : (
                        <div className={cls.musob__winner_empty}>
                            <Trophy size={32} color="#cbd5e1"/>
                            <span>Natijalar yo'q</span>
                        </div>
                    )}

                    <div className={cls.musob__leaderboard}>
                        <div className={cls.musob__leaderboard_title}>
                            <Medal size={16}/> {activeQuarter} Reytingi
                        </div>
                        {houses.map(h => ({...h, ball: totals[h.id] || 0}))
                            .sort((a, b) => b.ball - a.ball)
                            .map((h, idx) => (
                                <div key={h.id} className={cls.musob__lb_row}>
                                    <span className={cls.musob__lb_rank} style={idx === 0 ? {color: "#f59e0b"} : {}}>
                                        {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : idx + 1}
                                    </span>
                                    <span className={cls.musob__lb_name}>{h.name}</span>
                                    <div className={cls.musob__lb_bar}>
                                        <div style={{width: Math.round((h.ball / maxBall) * 100) + "%", background: h.color}}/>
                                    </div>
                                    <span className={cls.musob__lb_ball} style={{color: h.color}}>{h.ball}</span>
                                </div>
                            ))
                        }
                    </div>

                    <div className={cls.musob__summary}>
                        <div className={cls.musob__leaderboard_title}>
                            <Award size={16}/> Barcha Chorak Reytingi
                        </div>
                        {(() => {
                            const allTotals = {};
                            houses.forEach(h => allTotals[h.id] = 0);
                            QUARTERS.forEach(q => {
                                const qt = quarterTotals(q);
                                houses.forEach(h => { allTotals[h.id] += qt[h.id] || 0; });
                            });
                            const allMax = Math.max(...Object.values(allTotals), 1);
                            return houses.map(h => ({...h, ball: allTotals[h.id]}))
                                .sort((a, b) => b.ball - a.ball)
                                .map((h, idx) => (
                                    <div key={h.id} className={cls.musob__lb_row}>
                                        <span className={cls.musob__lb_rank} style={idx === 0 ? {color: "#f59e0b"} : {}}>{idx + 1}</span>
                                        <span className={cls.musob__lb_name}>{h.name}</span>
                                        <div className={cls.musob__lb_bar}>
                                            <div style={{width: Math.round((h.ball / allMax) * 100) + "%", background: h.color}}/>
                                        </div>
                                        <span className={cls.musob__lb_ball} style={{color: h.color}}>{h.ball}</span>
                                    </div>
                                ));
                        })()}
                    </div>
                </div>
            </div>

            {/* Add Result Modal */}
            {addModal && (
                <div className={cls.musob__overlay} onClick={() => setAddModal(null)}>
                    <div className={cls.musob__modal} onClick={e => e.stopPropagation()}>
                        <button className={cls.musob__modal_close} onClick={() => setAddModal(null)}><X size={16}/></button>
                        <div className={cls.musob__modal_title}>
                            {/*{COMPETITIONS.find(c => c.id === addModal.compId)?.emoji}{" "}*/}
                            {competitions.find(c => c.id === addModal.compId)?.name} — {activeQuarter}
                        </div>

                        <div className={cls.musob__modal_label}>G'olib / Ball olgan Partiya</div>
                        <div className={cls.musob__modal_houses}>
                            {houses.map(h => (
                                <button key={h.id}
                                    className={cls.musob__modal_houseBtn + (modalHouse === h.id ? " " + cls.musob__modal_houseBtn_active : "")}
                                    style={modalHouse === h.id ? {background: h.color, color: "#fff", borderColor: h.color} : {borderColor: h.color, color: h.color}}
                                    onClick={() => setModalHouse(h.id)}
                                >{h.name}</button>
                            ))}
                        </div>

                        {/*{(() => {*/}
                        {/*    const comp = competitions.find(c => c.id === addModal?.compId);*/}

                        {/*    const existing = comp?.results?.find(r =>*/}
                        {/*        String(r.party) === String(modalHouse) &&*/}
                        {/*        r.quarter === activeQuarter*/}
                        {/*    );*/}

                        {/*    if (!existing) return null;*/}
                        {/*    return (*/}
                        {/*        <div style={{*/}
                        {/*            background: "#f0f9ff",*/}
                        {/*            padding: "1rem",*/}
                        {/*            borderRadius: "10px",*/}
                        {/*            marginBottom: "1.5rem",*/}
                        {/*            border: "1px solid #bae6fd"*/}
                        {/*        }}>*/}
                        {/*            <div style={{fontSize: "1.2rem", color: "#0369a1", marginBottom: "0.8rem", fontWeight: 600}}>*/}
                        {/*                ⚠️ Ushbu partiyada allaqachon natija bor: <strong>{existing.ball} ball</strong>*/}
                        {/*            </div>*/}
                        {/*            <div style={{display: "flex", gap: "10px"}}>*/}
                        {/*                <button*/}
                        {/*                    onClick={() => setScoreMode("add")}*/}
                        {/*                    style={{*/}
                        {/*                        flex: 1, padding: "8px", borderRadius: "6px", border: "1.5px solid",*/}
                        {/*                        cursor: "pointer", fontSize: "1.1rem", fontWeight: 700,*/}
                        {/*                        background: scoreMode === "add" ? "#0369a1" : "transparent",*/}
                        {/*                        color: scoreMode === "add" ? "#fff" : "#0369a1",*/}
                        {/*                        borderColor: "#0369a1"*/}
                        {/*                    }}*/}
                        {/*                >Ballga qo'shish</button>*/}
                        {/*                <button*/}
                        {/*                    onClick={() => setScoreMode("replace")}*/}
                        {/*                    style={{*/}
                        {/*                        flex: 1, padding: "8px", borderRadius: "6px", border: "1.5px solid",*/}
                        {/*                        cursor: "pointer", fontSize: "1.1rem", fontWeight: 700,*/}
                        {/*                        background: scoreMode === "replace" ? "#0369a1" : "transparent",*/}
                        {/*                        color: scoreMode === "replace" ? "#fff" : "#0369a1",*/}
                        {/*                        borderColor: "#0369a1"*/}
                        {/*                    }}*/}
                        {/*                >Ballni yangilash</button>*/}
                        {/*            </div>*/}
                        {/*        </div>*/}
                        {/*    );*/}
                        {/*})()}*/}

                        <div className={cls.musob__modal_label}>Ball miqdori</div>
                        <input className={cls.musob__modal_input}
                               type="number" min="1" placeholder="masalan: 10"
                               value={modalBall} onChange={e => setModalBall(e.target.value)}/>

                        <div className={cls.musob__modal_label}>Izoh (ixtiyoriy)</div>
                        <input className={cls.musob__modal_input}
                               type="text" placeholder="masalan: Futbol finalida g'alaba"
                               value={modalNote} onChange={e => setModalNote(e.target.value)}/>

                        <button className={cls.musob__modal_ok} onClick={handleAdd}
                                disabled={!modalHouse || !modalBall || Number(modalBall) <= 0}>
                            Saqlash
                        </button>
                    </div>
                </div>
            )}

            {/* Musobaqa turi yaratish modali */}
            <ModalCompCreate
                open={createComp}
                onClose={() => setCreateComp(false)}
                onAdd={handleAddCompetition}
            />
        </div>
    );
};







