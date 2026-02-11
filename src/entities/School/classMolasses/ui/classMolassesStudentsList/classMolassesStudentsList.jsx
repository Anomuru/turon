import {memo} from 'react';
import Slider from "react-slick";

import {ClassMolassesStudentsListItem} from "../classMolassesStudentsListItem/classMolassesStudentsListItem";

import cls from "./classMolassesStudentsList.module.sass";
import defaultUser from "shared/assets/images/user_image.png";

const list = [
    {
        title: "Ingliz tili",
        data: [
            {
                image: defaultUser,
                fullName: "Sevinch Kasimxodjayeva",
                progress: 20
            },
            {
                image: defaultUser,
                fullName: "Sevinch Kasimxodjayeva",
                progress: 20
            },
            {
                image: defaultUser,
                fullName: "Sevinch Kasimxodjayeva",
                progress: 20
            },
            {
                image: defaultUser,
                fullName: "Sevinch Kasimxodjayeva",
                progress: 20
            },
            {
                image: defaultUser,
                fullName: "Sevinch Kasimxodjayeva",
                progress: 20
            },
            {
                image: defaultUser,
                fullName: "Sevinch Kasimxodjayeva",
                progress: 20
            },
            {
                image: defaultUser,
                fullName: "Sevinch Kasimxodjayeva",
                progress: 20
            }

        ]
    },
    {
        title: "IT",
        data: [
            {
                image: defaultUser,
                fullName: "Sevinch Kasimxodjayeva",
                progress: 20
            },
            {
                image: defaultUser,
                fullName: "Sevinch Kasimxodjayeva",
                progress: 20
            },
            {
                image: defaultUser,
                fullName: "Sevinch Kasimxodjayeva",
                progress: 20
            },
            {
                image: defaultUser,
                fullName: "Sevinch Kasimxodjayeva",
                progress: 20
            },
            {
                image: defaultUser,
                fullName: "Sevinch Kasimxodjayeva",
                progress: 20
            },
            {
                image: defaultUser,
                fullName: "Sevinch Kasimxodjayeva",
                progress: 20
            },
            {
                image: defaultUser,
                fullName: "Sevinch Kasimxodjayeva",
                progress: 20
            }

        ]
    },
    {
        title: "Biologiya",
        data: [
            {
                image: defaultUser,
                fullName: "Sevinch Kasimxodjayeva",
                progress: 20
            },
            {
                image: defaultUser,
                fullName: "Sevinch Kasimxodjayeva",
                progress: 20
            },
            {
                image: defaultUser,
                fullName: "Sevinch Kasimxodjayeva",
                progress: 20
            },
            {
                image: defaultUser,
                fullName: "Sevinch Kasimxodjayeva",
                progress: 20
            },
            {
                image: defaultUser,
                fullName: "Sevinch Kasimxodjayeva",
                progress: 20
            },
            {
                image: defaultUser,
                fullName: "Sevinch Kasimxodjayeva",
                progress: 20
            },
            {
                image: defaultUser,
                fullName: "Sevinch Kasimxodjayeva",
                progress: 20
            }

        ]
    },
    {
        title: "Ingliz tili",
        data: [
            {
                image: defaultUser,
                fullName: "Sevinch Kasimxodjayeva",
                progress: 20
            },
            {
                image: defaultUser,
                fullName: "Sevinch Kasimxodjayeva",
                progress: 20
            },
            {
                image: defaultUser,
                fullName: "Sevinch Kasimxodjayeva",
                progress: 20
            },
            {
                image: defaultUser,
                fullName: "Sevinch Kasimxodjayeva",
                progress: 20
            },
            {
                image: defaultUser,
                fullName: "Sevinch Kasimxodjayeva",
                progress: 20
            },
            {
                image: defaultUser,
                fullName: "Sevinch Kasimxodjayeva",
                progress: 20
            },
            {
                image: defaultUser,
                fullName: "Sevinch Kasimxodjayeva",
                progress: 20
            }

        ]
    },
    {
        title: "Ingliz tili",
        data: [
            {
                image: defaultUser,
                fullName: "Sevinch Kasimxodjayeva",
                progress: 20
            },
            {
                image: defaultUser,
                fullName: "Sevinch Kasimxodjayeva",
                progress: 20
            },
            {
                image: defaultUser,
                fullName: "Sevinch Kasimxodjayeva",
                progress: 20
            },
            {
                image: defaultUser,
                fullName: "Sevinch Kasimxodjayeva",
                progress: 20
            },
            {
                image: defaultUser,
                fullName: "Sevinch Kasimxodjayeva",
                progress: 20
            },
            {
                image: defaultUser,
                fullName: "Sevinch Kasimxodjayeva",
                progress: 20
            },
            {
                image: defaultUser,
                fullName: "Sevinch Kasimxodjayeva",
                progress: 20
            }

        ]
    },
    {
        title: "Ingliz tili",
        data: [
            {
                image: defaultUser,
                fullName: "Sevinch Kasimxodjayeva",
                progress: 60
            },
            {
                image: defaultUser,
                fullName: "Sevinch Kasimxodjayeva",
                progress: 80
            },
            {
                image: defaultUser,
                fullName: "Sevinch Kasimxodjayeva",
                progress: 20
            },
            {
                image: defaultUser,
                fullName: "Sevinch Kasimxodjayeva",
                progress: 70
            },
            {
                image: defaultUser,
                fullName: "Sevinch Kasimxodjayeva",
                progress: 20
            },
            {
                image: defaultUser,
                fullName: "Sevinch Kasimxodjayeva",
                progress: 50
            },
            {
                image: defaultUser,
                fullName: "Sevinch Kasimxodjayeva",
                progress: 20
            }

        ]
    }
]

export const ClassMolassesStudentsList = memo(() => {

    const settings = {
        dots: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3,
        infinite: false
    }

    const renderStudentsList = () => {
        return list.map(item =>
            <ClassMolassesStudentsListItem
                title={item.title}
                data={item.data}
            />
        )
    }

    const render = renderStudentsList()

    return (
        <div className={cls.studentsList}>
            <Slider {...settings}>
                {render}
            </Slider>
        </div>
    )
})
