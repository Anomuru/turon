import { onAddAlertOptions } from "features/alert/model/slice/alertSlice.js";
import { getParentsInfo } from "features/parentsProfile/model/parentsProfileSelector.js";
import { onEditUser } from "features/parentsProfile/model/parentsProfileSlice.js";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { API_URL, headers, useHttp } from "shared/api/base.js";
import { Button } from "shared/ui/button/index.js";
import { Input } from "shared/ui/input/index.js";
import cls from "./parentProfileInfo.module.sass";
import profilePic from "shared/assets/images/user_image.png";

export const ParentsProfileInfo = () => {
    const [disabled, setDisabled] = useState(true);

    const parentInfo = useSelector(getParentsInfo);
    const [username, setUsername] = useState("");

    const [usernameMessage, setUsernameMessage] = useState("");
    const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);

    const { id } = useParams();
    const { request } = useHttp();
    const dispatch = useDispatch();

    const { register, handleSubmit, setValue } = useForm();

    /* =========================
       INIT DATA FROM BACKEND
    ========================== */
    useEffect(() => {
        if (parentInfo) {
            setUsername(parentInfo.username || "");

            setValue("surname", parentInfo.surname);
            setValue("name", parentInfo.name);
            setValue("phone", parentInfo.phone);
            setValue("birth_date", parentInfo.birth_date);
            setValue("address", parentInfo.branch);
        }
    }, [parentInfo, setValue]);

    /* =========================
       USERNAME CHECK LOGIC
    ========================== */
    useEffect(() => {
        if (!parentInfo) return;

        // ❗ Agar username o'zgarmagan bo'lsa — check qilma
        if (username === parentInfo.username) {
            setUsernameMessage("");
            setIsUsernameAvailable(true);
            return;
        }

        // ❗ Bo'sh username
        if (!username) {
            setUsernameMessage(
                <p className={cls.errorMess}>Username kiriting</p>
            );
            setIsUsernameAvailable(false);
            return;
        }

        const checkUsername = async () => {
            try {
                const data = await request(
                    `${API_URL}Users/username-check/`,
                    "POST",
                    JSON.stringify({ username }),
                    headers()
                );

                if (data.exists) {
                    setUsernameMessage(
                        <p className={cls.errorMess}>
                            <i className="fa-solid fa-circle-exclamation" />
                            Username band
                        </p>
                    );
                    setIsUsernameAvailable(false);
                } else {
                    setUsernameMessage(
                        <p className={cls.successMess}>
                            <i className="fa-solid fa-circle-check" />
                            Username bo'sh
                        </p>
                    );
                    setIsUsernameAvailable(true);
                }
            } catch (err) {
                setIsUsernameAvailable(false);
            }
        };

        checkUsername();
    }, [username, parentInfo, request]);

    /* =========================
       SUBMIT
    ========================== */
    const onSubmit = (data) => {
        const payload = {
            ...data,
            username,
        };

        request(
            `${API_URL}parents/detail/${id}/`,
            "PATCH",
            JSON.stringify(payload),
            headers()
        ).then((res) => {
            setDisabled(true);

            dispatch(onEditUser(res.user));
            dispatch(
                onAddAlertOptions({
                    status: true,
                    type: "success",
                    msg: "Muvofaqqiyatli o'zgartirildi",
                })
            );
        })
            .catch(err => {
                dispatch(
                    onAddAlertOptions({
                        status: true,
                        type: "error",
                        msg: "Xatolik yuz berdi",
                    })
                );
            })
    };

    return (
        <div className={cls.info}>
            <i
                onClick={() => setDisabled(!disabled)}
                className={`fa fa-pen ${cls.pen}`}
            />

            <img src={profilePic} className={cls.info__img} alt="" />

            {/* USERNAME */}
            <Input
                disabled={disabled}
                title={
                    disabled
                        ? "Username"
                        : usernameMessage || "Username"
                }
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />

            <Input
                name="surname"
                register={register}
                disabled={disabled}
                title="Familiya"
            />

            <Input
                name="name"
                register={register}
                disabled={disabled}
                title="Ism"
            />

            <Input
                name="phone"
                register={register}
                disabled={disabled}
                title="Tel raqam"
            />

            <Input
                type="date"
                name="birth_date"
                register={register}
                disabled={disabled}
                title="Tug'ilgan kuni"
            />

            <Input
                name="address"
                register={register}
                disabled={disabled}
                title="Manzil"
            />

            {!disabled && (
                <Button
                    type={!isUsernameAvailable ? "disabled" : "simple"}
                    onClick={handleSubmit(onSubmit)}
                >
                    O'zgartirish
                </Button>
            )}
        </div>
    );
};
