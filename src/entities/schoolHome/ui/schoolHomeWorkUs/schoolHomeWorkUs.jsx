import classNames from "classnames";
import React, {memo} from 'react';
import cls from "./schoolHomeWorkUs.module.sass";
import backgroundImg from "shared/assets/images/workUs.png";
import Slider from "react-slick";
import slideImg from 'shared/assets/images/slideImg.png'
export const SchoolHomeWorkUs = memo(() => {

    const myStyle = {
        background: `url(${backgroundImg})`
    }

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        initialSlide: 0,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            }
        ]

    }

    return (
        <div className={cls.mainWorkBox} style={myStyle}>
            <div className={cls.gallery}>
                <h2 className={cls.gallery__title}>WE WORK HARD, WE PLAY HARD</h2>
                <h3 className={cls.gallery__titles}>Work With Us</h3>
                <div className={cls.gallery__container}>
                    <div
                        className={classNames(cls.itemMain, {
                            [cls.active]: false
                        })}
                    >
                        <div className={cls.container}>
                            <Slider {...settings}>
                                <div className={cls.sliderBox}>
                                    <img className={cls.imgBox} src={slideImg} alt=""/>
                                    <h2>Teacher</h2>
                                </div>
                                <div className={cls.sliderBox}>
                                    <img className={cls.imgBox} src={slideImg} alt=""/>
                                    <h2>Teacher</h2>
                                </div>
                                <div className={cls.sliderBox}>
                                    <img className={cls.imgBox} src={slideImg} alt=""/>
                                    <h2>Teacher</h2>
                                </div>
                                <div className={cls.sliderBox}>
                                    <img className={cls.imgBox} src={slideImg} alt=""/>
                                    <h2>Teacher</h2>
                                </div>
                            </Slider>
                        </div>

                    </div>
                </div>
            </div>
        </div>

    )
})
