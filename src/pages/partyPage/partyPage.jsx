import cls from "./partyPage.module.sass"
import {Radio} from "shared/ui/radio/index.js";
import {useEffect, useMemo, useState} from "react";
import {Button} from "shared/ui/button/index.js";
import {ColorPicker, Modal, Select, Space} from "antd";
import {Input} from "shared/ui/input/index.js";
import {Textarea} from "shared/ui/textArea/index.js";
import {ClipboardList, Search, Trash2, Trophy, Upload, UserPlus, Users, X} from "lucide-react";
import {useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import {fetchParty, fetchPartyTask} from "pages/partyPage/model/partyThunk.js";
import {getParty, getPartyTask} from "pages/partyPage/model/partySelector.js";
import {onAddParty, onAddPartyTask} from "pages/partyPage/model/partySlice.js";
import {API_URL, headers, headersImg, useHttp} from "shared/api/base.js";

const partyHeader = [
    "Partiyalar",
    "Topshiriqlar",
    "Reyting"
]


export const PartyPage = () => {
    const [selectedHeader, setSelectedHeader] = useState(partyHeader[0]);
    const [createParty, setCreateParty] = useState(false)
    const [assigment, setCreateAssigment] = useState(false)

    const data = useSelector(getParty)
    const dataTask = useSelector(getPartyTask)


    console.log(data , "suhrob")
    const dispatch = useDispatch();
    useEffect(() => {
        if (selectedHeader === "Partiyalar") {
            dispatch(fetchParty())
        } else if (selectedHeader === "Topshiriqlar") {
            dispatch(fetchPartyTask())
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
                {selectedHeader === "Pariyalar" &&
                    <Button onClick={() => setCreateParty(true)}>Yangi partiya qushish</Button>}
                {selectedHeader === "Topshiriqlar" &&
                    <Button onClick={() => setCreateAssigment(true)}>Yangi topshiriq yaratish</Button>}
                {selectedHeader === "Reyting" && null}
            </div>


            {selectedHeader === "Partiyalar" && <Party data={data}/>}
            {selectedHeader === "Topshiriqlar" && <Assigment dataTask={dataTask}/>}
            {selectedHeader === "Reyting" && <Reyting/>}
            <ModalPartyAdd createParty={createParty} setCreateParty={setCreateParty}/>
            <ModalAssignmentCreate assigment={assigment} setCreateAssigment={setCreateAssigment}/>
        </div>
    );
};


const AVATAR_COLORS = ["#4f8ef7", "#8b5cf6", "#ec4899", "#10b981", "#f59e0b", "#06b6d4", "#ef4444", "#84cc16"];

const avatarColor = (i) => AVATAR_COLORS[i % AVATAR_COLORS.length];

//topshiriq modal
const ModalAssignmentCreate = ({assigment, setCreateAssigment}) => {

    const {register, handleSubmit, setValue} = useForm();
    const [selectedParty, setSelectedParty] = useState([]);
    const {request} = useHttp()
    const formData = new FormData()
    const dispatch= useDispatch()
    const [options , setOption] = useState([]);
    useEffect(() => {
        request(`${API_URL}parties/parties/select-options/` , "GET", null , headers())
            .then(res => {
                setOption(res)
            })
    }, []);


    const onSubmit = (data) => {
        const res = {
            ...data,
            parties: selectedParty
        }
        request(`${API_URL}parties/party-tasks/` , "POST", JSON.stringify(res) , headers())
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
        request(`${API_URL}parties/parties/`, "POST", formData, headersImg())
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


const MOCK_TASKS = [
    {id: 1, name: "Tarix olimpiadasiga tayyorgarlik", deadline: "2025-05-01", ball: 200, done: 60, level: "yuqori"},
    {id: 2, name: "Guruh prezentatsiyasi", deadline: "2025-04-25", ball: 150, done: 40, level: "o'rta"},
];

const MOCK_MEMBERS = [
    {
        id: 1,
        avatar: "AK",
        name: "Aziz Karimov",
        cls: "10-A",
        role: "Kapitan",
        ball: 320,
        level: "Ustoz",
        status: "Faol",
        statusColor: "#10b981"
    },
    {
        id: 2,
        avatar: "MY",
        name: "Malika Yusupova",
        cls: "10-A",
        role: "A'zo",
        ball: 290,
        level: "Ilg'or",
        status: "Faol",
        statusColor: "#10b981"
    },
    {
        id: 3,
        avatar: "BR",
        name: "Bobur Rahimov",
        cls: "10-B",
        role: "A'zo",
        ball: 270,
        level: "Ilg'or",
        status: "Faol",
        statusColor: "#10b981"
    },
    {
        id: 4,
        avatar: "DN",
        name: "Dilorom Nazarova",
        cls: "10-B",
        role: "A'zo",
        ball: 240,
        level: "Ilg'or",
        status: "Ogohlantirish",
        statusColor: "#f59e0b"
    },
];

const PartyDetailModal = ({party, color, onClose}) => {
    const [search, setSearch] = useState("");
    const [activeAddModal, setActiveAddModal] = useState(false);

    if (!party) return null;

    const filteredMembers = MOCK_MEMBERS.filter(m =>
        m.name.toLowerCase().includes(search.toLowerCase())
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
                <div className={cls.detailModal_section}>
                    <div className={cls.detailModal_section_title}><ClipboardList size={16}/> Topshiriqlar
                        ({MOCK_TASKS.length})
                    </div>
                    <div style={{height: "11rem", overflow: "auto"}}>
                        {MOCK_TASKS.map(t => (
                            <div key={t.id} className={cls.detailModal_task}>
                            <span className={cls.detailModal_task_badge} style={{
                                background: t.level === "yuqori" ? "#fef3c7" : "",
                                color: t.level === "yuqori" ? "#d97706" : "#10b981"
                            }}>{t.level.toUpperCase()}</span>
                                <span className={cls.detailModal_task_name}>{t?.name}</span>
                                <span className={cls.detailModal_task_date}>📅 {t?.deadline}</span>
                                <span className={cls.detailModal_task_ball}
                                      style={{color: party.color}}>+{t?.ball}</span>
                                <div className={cls.detailModal_task_bar}>
                                    <div style={{width: t?.done + "%", background: party.color}}/>
                                </div>
                                <span className={cls.detailModal_task_pct}>{t?.done}%</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Members */}
                <div className={cls.detailModal_section}>
                    <div className={cls.detailModal_section_header}>
                        <div className={cls.detailModal_section_title}><Users size={16}/> A'zolar Ro'yxati
                            ({MOCK_MEMBERS.length})
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
                                {["#", "O'QUVCHI", "SINF", "LAVOZIM", "BALL", "DARAJA", "HOLAT", "AMAL"].map(h => <th
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
                                            <span>{m?.name}</span>
                                        </div>
                                    </td>
                                    <td>{m?.cls}</td>
                                    <td>{m?.role}</td>
                                    <td>
                                        <div className={cls.detailModal_ball_wrap}>
                                            <div className={cls.detailModal_ball_bar}>
                                                <div style={{width: barWidth(m?.ball), background: party.color}}/>
                                            </div>
                                            <span>{m?.ball}</span>
                                        </div>
                                    </td>
                                    <td><span className={cls.detailModal_level}>{m?.level}</span></td>
                                    <td><span className={cls.detailModal_status}
                                              style={{color: m?.statusColor}}>● {m?.status}</span></td>
                                    <td>
                                        <div className={cls.detailModal_actions}>
                                            <button className={cls.detailModal_act_plus}>+10</button>
                                            <button className={cls.detailModal_act_minus}>-10</button>
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
            <AddStudentsParty setActiveAddModal={setActiveAddModal} activeAddModal={activeAddModal}/>
        </div>
    );
};

const Party = ({data}) => {
    const [selectedParty, setSelectedParty] = useState(null);
    const selectedColor = selectedParty ? PARTY_COLORS[(selectedParty.id - 1) % PARTY_COLORS.length] : null;

    return (
        <>
            <div className={cls.party__body}>
                {data.map((party, i) => {
                    const color = PARTY_COLORS[i % PARTY_COLORS.length];
                    const progress = Math.min(100, Math.round((party.ball / 2850) * 100));
                    return (
                        <div key={party.id} className={cls.party__body_box} onClick={() => setSelectedParty(party)}
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
    return (
        <div className={cls.party__assigment}>

            {dataTask.map((item, i) => (
                <div className={cls.party__assigment_box}>


                    <div className={cls.party__assigment_box_title}>
                        <span>{item.name}</span>
                        <span>22.22.2222</span>
                    </div>
                    {item?.desc}
                    <div className={cls.party__assigment_box_parties}>
                        {item.parties_info.map(item => (
                            <div>
                                {item.name}
                            </div>
                        ))}
                    </div>
                    {/*<h3>Bajarilish</h3>*/}
                    {/*<div className={cls.party__assigment_box_score}>*/}

                    {/*    <div style={{width: i * 2 * 10 + "%"}}>*/}

                    {/*    </div>*/}
                    {/*</div>*/}


                </div>
            ))}
        </div>
    )
}


const allSt = [
    {id: 1, name: "Aziz Karimov", avatar: "AK", class: "10-A"},
    {id: 2, name: "Malika Yusupova", avatar: "MY", class: "10-A"},
    {id: 3, name: "Bobur Rahimov", avatar: "BR", class: "10-B"},
    {id: 4, name: "Dilorom Nazarova", avatar: "DN", class: "10-B"},
    {id: 5, name: "Eldor Toshmatov", avatar: "ET", class: "11-A"},
    {id: 6, name: "Gulnora Isoqova", avatar: "GI", class: "11-A"},
    {id: 7, name: "Hamid Olimov", avatar: "HO", class: "11-B"},
    {id: 8, name: "Iroda Qosimova", avatar: "IQ", class: "11-B"},
    {id: 9, name: "Jasur Mirzaev", avatar: "JM", class: "10-A"},
    {id: 10, name: "Kamola Ergasheva", avatar: "KE", class: "10-A"},
    {id: 11, name: "Lochin Sultanov", avatar: "LS", class: "10-B"},
    {id: 12, name: "Muazzam Toxirova", avatar: "MT", class: "10-B"},
    {id: 13, name: "Nodir Holmatov", avatar: "NH", class: "11-A"},
    {id: 14, name: "Ozoda Yo'ldosheva", avatar: "OY", class: "11-A"},
    {id: 15, name: "Parvin Nazarov", avatar: "PN", class: "11-B"},
    {id: 16, name: "Qodir Ismoilov", avatar: "QI", class: "11-B"},
    {id: 17, name: "Rano Askarova", avatar: "RA", class: "10-A"},
    {id: 18, name: "Sarvar Kalandarov", avatar: "SK", class: "10-A"},
    {id: 19, name: "Tabassum Rustamova", avatar: "TR", class: "10-B"},
    {id: 20, name: "Umid Ibragimov", avatar: "UI", class: "10-B"},
    {id: 21, name: "Venera Yusupova", avatar: "VY", class: "11-A"},
    {id: 22, name: "Xurshid Normatov", avatar: "XN", class: "11-A"},
    {id: 23, name: "Yulduz Tosheva", avatar: "YT", class: "11-B"},
    {id: 24, name: "Zulfiya Karimova", avatar: "ZK", class: "11-B"},
];

//reyting
const Reyting = () => {


    return (
        <div className={cls.party__rating}>
            <div className={cls.party__rating_party}>
                <div className={cls.party__rating_party_title}>
                    Umumiy Reyting
                </div>
                <div className={cls.party__rating_party_list}>
                    {[1, 2, 3, 4, 5].map((item, index) => (
                        <div className={cls.party__rating_party_list_box}>
                            <div className={cls.party__rating_party_list_box_info}>

                                <div className={cls.party__rating_party_list_box_order}>
                                    {index + 1}
                                </div>
                                <div className={cls.party__rating_party_list_box_info_img}>

                                </div>
                                <div className={cls.party__rating_party_list_box_info_title}>
                                    Yulbars
                                </div>
                            </div>

                            <div className={cls.party__rating_party_list_box_score}>
                                <div className={cls.party__rating_party_list_box_score_ball}>
                                    Ball: 2 234 324
                                </div>
                                <div className={cls.party__rating_party_list_box_score_rating}>
                                    <div>

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
                        {allSt.map((item, idx) => {
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
                                            <span style={{fontWeight: 600, fontSize: "1.4rem"}}>{item.name}</span>
                                        </div>
                                    </td>
                                    <td style={{
                                        padding: "10px 14px",
                                        fontSize: "1.3rem",
                                        fontWeight: 600,
                                        color: "#64748b"
                                    }}>{item.class}</td>
                                    <td style={{
                                        padding: "10px 14px",
                                        fontSize: "1.3rem",
                                        color: "#64748b"
                                    }}>{item.emoji} {item.name}</td>
                                    <td style={{
                                        padding: "10px 14px",
                                        fontFamily: "'Unbounded',sans-serif",
                                        fontSize: "1.2rem",
                                        fontWeight: 700,
                                        color: item.color
                                    }}>3213213
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

const STUDENTS = [
    {id: 1, firstName: "Jasur", lastName: "Toshmatov"},
    {id: 2, firstName: "Malika", lastName: "Rahimova"},
    {id: 3, firstName: "Bobur", lastName: "Karimov"},
    {id: 4, firstName: "Nilufar", lastName: "Yusupova"},
    {id: 5, firstName: "Sardor", lastName: "Ergashev"},
    {id: 6, firstName: "Zulfiya", lastName: "Nazarova"},
    {id: 7, firstName: "Otabek", lastName: "Mirzayev"},
    {id: 8, firstName: "Shahlo", lastName: "Hamidova"},
];
const AddStudentsParty = ({activeAddModal, setActiveAddModal}) => {
    const [selectedIds, setSelectedIds] = useState([]);
    const allChecked = selectedIds.length === STUDENTS.length;
    const indeterminate = selectedIds.length > 0 && !allChecked;

    const toggleAll = () => setSelectedIds(allChecked ? [] : STUDENTS.map(s => s.id));
    const toggleOne = (id) => setSelectedIds(prev =>
        prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );

    const handleOk = () => {
        console.log("Tanlangan o'quvchilar ID lari:", selectedIds);
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
            Jami: <strong style={{color: "#1a1a2e"}}>{STUDENTS.length}</strong> o'quvchi
          </span>
                {selectedIds.length > 0 && (
                    <span style={{
                        fontSize: 12, fontWeight: 700, padding: "3px 12px", borderRadius: 20,
                        background: "#ede9fe", color: "#7c3aed"
                    }}>✓ {selectedIds.length} tanlandi</span>
                )}
            </div>

            {/* Table */}
            <div style={{maxHeight: 300, overflowY: "auto"}}>
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
                        {["#", "Ism", "Familya"].map(h => (
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
                    {STUDENTS.map((student, i) => {
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
                                }}>{student.firstName}</td>
                                <td style={{
                                    padding: "10px 14px",
                                    color: "#1a1a2e",
                                    fontWeight: sel ? 600 : 400
                                }}>{student.lastName}</td>
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