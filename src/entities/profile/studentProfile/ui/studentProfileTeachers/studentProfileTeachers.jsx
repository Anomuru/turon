import React, {memo, useCallback} from 'react';
import {useNavigate} from "react-router";
import {EditableCard} from "shared/ui/editableCard";
import cls from "./studentProfileTeachers.module.sass";
import defaultUserImage from "shared/assets/images/user_image.png";
import {API_URL_DOC} from "shared/api/base";
export const StudentProfileTeachers = memo(({data}) => {

    const navigation = useNavigate()

    const API_URL_IMAGE = `${API_URL_DOC}`;
    const renderGroupTeachers = useCallback(() => {
        const teachers = Array.isArray(data)
            ? data.flatMap(group => group.teacher || [])
            : (data?.teacher ? data.teacher : []);



        return teachers.map((item, index) => (
            <div key={index} className={cls.items__inner}>
                {!item.user?.profile_img ? <img
                        onClick={() => navigation(`../teacher/teacherProfile/${item?.id}`)}
                        src={defaultUserImage}
                    /> :
                    <img
                        onClick={() => navigation(`../teacher/teacherProfile/${item?.id}`)}
                        className={cls.userImage}
                        src={`${API_URL_IMAGE}${item.user?.profile_img}`}
                        alt=""
                    />
                }

                <h3>{item.user?.name} {item.user?.surname}</h3>
                <p>{item.subject[0]?.name}</p>
            </div>
        ));
    }, [data]);

    const renderedTeachers = renderGroupTeachers();

    return (
        <EditableCard
            extraClass={cls.teacher}
        >
            <h1>O’qituvchilari</h1>
            <div className={cls.items}>
                {renderedTeachers.length > 0 ? (
                    renderedTeachers
                ) : (
                    <p style={{
                        alignSelf: "center",
                        marginTop: 30+"px",
                        fontSize: 21+"px",
                        color: "#d7d9de"
                    }}>O’qituvchi mavjud emas</p>
                )}
            </div>
        </EditableCard>
    );
});
