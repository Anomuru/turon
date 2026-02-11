import imgDef from "shared/assets/images/user_image.png"
import cls from "./comment.module.sass"

import topIcon from "shared/assets/icons/“.svg"
import starImg from "shared/assets/icons/mingcute_star-fill.svg"
import React from "react";
import Slider from "react-slick";

import idea from "../../../../shared/assets/icons/turonIdea.png";

const data = [
    {
        descr: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged...",
        user: "Sardor Ikromov",
        img: imgDef,
        star: [true, true]
    },
    {
        descr: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged...",
        user: "Sardor Ikromov",
        img: imgDef,
        star: [true, true, true]
    },
    {
        descr: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged...",
        user: "Sardor Ikromov",
        img: imgDef,
        star: [true, true, true, true]
    },
    {
        descr: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged...",
        user: "Sardor Ikromov",
        img: imgDef,
        star: [true, true]
    },
    {
        descr: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged...",
        user: "Sardor Ikromov",
        img: imgDef,
        star: [true, true, true]
    },
    {
        descr: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged...",
        user: "Sardor Ikromov",
        img: imgDef,
        star: [true, true, true, true]
    }
]
const render = () => {
    return data.map((item, i) => (

        // <div>
        //     <img
        //         className={cls.items__image}
        //         src={idea}
        //         alt=""
        //     />
        //     <h2 className={cls.items__title}>{item.descr}</h2>
        //     <p className={cls.items__more}>
        //         <div className={cls.box_commentStar}>
        //             {
        //                 item?.star.map(() =>
        //                     (
        //                         <img src={starImg} alt=""/>
        //                     )
        //                 )
        //             }
        //         </div>
        //     </p>
        // </div>
        <div className={cls.box_main}>
            <div className={cls.box}>
                <div className={cls.topIcon}>
                    <img src={topIcon} alt=""/>
                </div>
                <div className={cls.box_descr}>
                    {item.descr}
                </div>
                <div className={cls.box_commentStar}>
                    {
                        item?.star.map(() =>
                            (
                                <img src={starImg} alt=""/>
                            )
                        )
                    }
                </div>
            </div>
            <div className={cls.box_main_item}><img src={item.img} alt=""/> {item.user}</div>
        </div>
    ))
}

export const SchoolParentesComment = () => {

    const settings = {
        infinite: false,
        dots: true,
        speed: 900,


        slidesToShow: 3,
        slidesToScroll: 1,
        className: cls.homeSlider,
        arrows: false,
        // responsive: [
        //     {
        //         breakpoint: 1350,
        //         settings: {
        //             slidesToShow: 3,
        //             slidesToScroll: 1,
        //
        //         }
        //     },
        //     {
        //         breakpoint: 1024,
        //         settings: {
        //             slidesToShow: 3,
        //             slidesToScroll: 1,
        //
        //         }
        //     },
        //     {
        //         breakpoint: 830,
        //         settings: {
        //             slidesToShow: 2,
        //             slidesToScroll: 1,
        //
        //         }
        //     },
        //     {
        //         breakpoint: 650,
        //         settings: {
        //             slidesToShow: 2,
        //             slidesToScroll: 1,
        //
        //         }
        //     },
        //     {
        //         breakpoint: 500,
        //         settings: {
        //             slidesToShow: 1,
        //             slidesToScroll: 1
        //         }
        //     }
        // ]

    }

    return (
        <div className={cls.comment}>
            <div className={cls.comment_title}>
                Testimonial
            </div>
            <div className={cls.boxes}>
                <Slider {...settings}>
                    {render()}
                </Slider>
            </div>
        </div>


    );
};

