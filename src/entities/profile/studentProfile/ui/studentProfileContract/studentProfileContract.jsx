import { Form } from "shared/ui/form";
import { Input } from "shared/ui/input";
import cls from "./studentProfileContract.module.sass";
import { useForm } from "react-hook-form";
import { EditableCard } from "shared/ui/editableCard";
import { memo, useState, useEffect } from "react";
import classNames from "classnames";
import { FileUploader } from 'react-drag-drop-files';
import { Button } from "../../../../../shared/ui/button";
import { useDispatch, useSelector } from "react-redux";
import {
    studentContractThunk,
    getStudentContract,
    studentContractUploadThunk
} from "../../../../../features/studentPayment";
import { API_URL } from "../../../../../shared/api/base";

export const StudentProfileContract = memo(({ setActive, active }) => {
    const { register, handleSubmit, setValue } = useForm();
    const fileTypes = ["PDF", "JPG", "PNG", "DOCX"];
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [fatherName, setFatherName] = useState("");
    const [passportNum, setPassportNum] = useState("");
    const [giveTime, setGiveTime] = useState(Date.now());
    const [location, setLocation] = useState("");
    const [giveLocation, setGiveLocation] = useState("");
    const [fromDate, setFromDate] = useState(Date.now());
    const [untilDate, setUnitlDate] = useState("");
    const [contractLink, setContractLink] = useState(null);
    const [files, setFiles] = useState(null);

    const getLink = useSelector(getStudentContract);
    const pathArray = window.location.pathname.split('/');
    const lastId = pathArray[pathArray.length - 1];
    const dispatch = useDispatch();

    useEffect(() => {
        if (getLink && getLink.file) {
            setContractLink(`${API_URL}${getLink.file}`);
        }
    }, [getLink]);

    const handleAddContract = async () => {
        const data = {
            name: name,
            surname: surname,
            fatherName: fatherName,
            passportSeries: passportNum,
            givenTime: giveTime,
            place: location,
            givenPlace: giveLocation,
            date: {
                ot: fromDate,
                do: untilDate
            }
        };

        dispatch(studentContractThunk({ id: lastId, data }));
    };

    const handleUploadfile = async () => {
        if (files) {

            dispatch(studentContractUploadThunk({ id: lastId, file: files }));
        }
    };

    const handleFileChange = (file) => {
        setFiles(file);
        setValue("contract", file);
    };

    return (
        <EditableCard titleType={"cross"} extraClass={classNames(cls.contractMain, {
            [cls.active]: active === "contract"
        })}
                      onClick={() => setActive(!"contract")}>
            <div className={cls.form}>
                <Form extraClassname={cls.btn} onSubmit={handleSubmit(handleAddContract)}>
                    <Input extraClassName={cls.input} {...register("name")} title={"Ism"} onChange={(e) => setName(e.target.value)} />
                    <Input {...register("surname")} title={"Familiya"} required onChange={(e) => setSurname(e.target.value)} />
                    <Input {...register("father_name")} title={"Otasining ismi"} required onChange={(e) => setFatherName(e.target.value)} />
                    <Input {...register("passport_number")} title={"Passport seriyasi"} defaultValue={"AD"} required onChange={(e) => setPassportNum(e.target.value)} />
                    <Input {...register("give_time")} title={"Berilgan vaqti"} required onChange={(e) => setGiveTime(e.target.value)} type={"time"} defaultValue={Date.now} />
                    <Input {...register("giveLocation")} title={"Berilgan joyi"} required onChange={(e) => setGiveLocation(e.target.value)} />
                    <Input {...register("location")} title={"Manzil"} required onChange={(e) => setLocation(e.target.value)} />
                    <Input {...register("fromDate")} title={"Dan"} required type={"date"} onChange={(e) => setFromDate(e.target.value)} />
                    <Input {...register("untile_date")} title={"Gacha"} type={"date"} required onChange={(e) => setUnitlDate(e.target.value)} />
                </Form>

                {contractLink && (
                    <div className={cls.contractLink}>
                        <Button extraClass={cls.btnDown}>
                            <i className={"fa-solid fa-download"}></i>
                            <a style={{ color: "white" }} className={cls.linkUrl} href={contractLink} target="_blank" >
                                Shartnomani yuklab oling
                            </a>
                        </Button>
                    </div>
                )}

                <Form extraclassName={cls.fileDrop} onSubmit={handleSubmit(handleUploadfile)}>
                    <FileUploader
                        handleChange={handleFileChange}
                        name="file"
                        types={fileTypes}
                        classes={cls.fileUploader}
                        label="Pdf fayl kiriting yoki bu yerga tortib qo'ying"
                    />
                </Form>

            </div>
        </EditableCard>
    );
});
