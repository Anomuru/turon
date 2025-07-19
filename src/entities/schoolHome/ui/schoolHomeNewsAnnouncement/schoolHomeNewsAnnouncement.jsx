import React, {useCallback, useEffect, useRef, useState} from 'react';
import {motion} from "framer-motion";
import {isMobile} from "react-device-detect";

import cls from "./schoolHomeNewsAnnouncement.module.sass";
import image from "shared/assets/images/tagFood.png";
import carImage from "shared/assets/images/sliderCar.png";
import computerImage from "shared/assets/images/sliderComputer.png";
import sportImage from "shared/assets/images/postSport.png";

const tagList = [
    {
        name: "#food",
        image: image
    },
    {
        name: "#food",
        image: image
    },
    {
        name: "#food",
        image: image
    },
    {
        name: "#food",
        image: image
    },
    {
        name: "#food",
        image: image
    },
    {
        name: "#food",
        image: image
    },
    {
        name: "#food",
        image: image
    }, {
        name: "#food",
        image: image
    }, {
        name: "#food",
        image: image
    }, {
        name: "#food",
        image: image
    }, {
        name: "#food",
        image: image
    }, {
        name: "#food",
        image: image
    },
]
const sliderList = [
    {
        image: carImage,
        title: "How to Drive a Car Safely",
        text: "Ah, the joy of the open road—it’s a good feeling. But if " +
            "you’re new to driving, you may feel a little nervous about " +
            "getting behind the wheel. Don’t worry. While it’s true that" +
            " accidents can happen to anybody, there are things you can " +
            "do to drive safely and do your best to avoid them. "
    }, {
        image: carImage,
        title: "How to Drive a Car Safely",
        text: "Ah, the joy of the open road—it’s a good feeling. But if " +
            "you’re new to driving, you may feel a little nervous about " +
            "getting behind the wheel. Don’t worry. While it’s true that" +
            " accidents can happen to anybody, there are things you can " +
            "do to drive safely and do your best to avoid them. "
    },
    {
        image: computerImage,
        title: "Why I Stopped Using Multiple Monitor",
        text: "A Single Monitor Manifesto — Many developers believe " +
            "multiple monitors improve productivity. Studies have " +
            "proven it, right? Well, keep in mind, many of those studies" +
            " are commissioned from monitor manufacturers like"
    },
]
const postsList = [
    {
        image: sportImage,
        title: "Opening Day of Boating Season, Seattle WA",
        text: "Of course the Puget Sound is very watery, and where there is water, " +
            "there are boats. Today is the Grand Opening of Boating Season when traffic" +
            " gets stalled in the University District (UW) while the Montlake Bridge"
    }, {
        image: sportImage,
        title: "Opening Day of Boating Season, Seattle WA",
        text: "Of course the Puget Sound is very watery, and where there is water, " +
            "there are boats. Today is the Grand Opening of Boating Season when traffic" +
            " gets stalled in the University District (UW) while the Montlake Bridge"
    }, {
        image: sportImage,
        title: "Opening Day of Boating Season, Seattle WA",
        text: "Of course the Puget Sound is very watery, and where there is water, " +
            "there are boats. Today is the Grand Opening of Boating Season when traffic" +
            " gets stalled in the University District (UW) while the Montlake Bridge"
    }, {
        image: sportImage,
        title: "Opening Day of Boating Season, Seattle WA",
        text: "Of course the Puget Sound is very watery, and where there is water, " +
            "there are boats. Today is the Grand Opening of Boating Season when traffic" +
            " gets stalled in the University District (UW) while the Montlake Bridge"
    }, {
        image: sportImage,
        title: "Opening Day of Boating Season, Seattle WA",
        text: "Of course the Puget Sound is very watery, and where there is water, " +
            "there are boats. Today is the Grand Opening of Boating Season when traffic" +
            " gets stalled in the University District (UW) while the Montlake Bridge"
    }, {
        image: sportImage,
        title: "Opening Day of Boating Season, Seattle WA",
        text: "Of course the Puget Sound is very watery, and where there is water, " +
            "there are boats. Today is the Grand Opening of Boating Season when traffic" +
            " gets stalled in the University District (UW) while the Montlake Bridge"
    },
]

export const SchoolHomeNewsAnnouncement = () => {

    const tagCarousel = useRef()
    const postCarousel = useRef()
    const sliderCarousel = useRef()
    const [tagWidth, setTagWidth] = useState(null)
    const [postWidth, setPostWidth] = useState(null)
    const [sliderWidth, setSliderWidth] = useState(null)

    useEffect(() => {
        setTagWidth(tagCarousel.current?.scrollWidth - tagCarousel.current?.offsetWidth)
    }, [tagList?.length])

    useEffect(() => {
        setPostWidth(postCarousel.current?.scrollWidth - postCarousel.current?.offsetWidth)
    }, [postsList?.length])

    useEffect(() => {
        setSliderWidth(sliderCarousel.current?.scrollWidth - sliderCarousel.current?.offsetWidth)
    }, [sliderList?.length])

    const renderTagsList = useCallback(() => {
        return tagList.map(item => {
            return (
                <motion.div
                    transition={{duration: 1}}
                    className={cls.tags__item}
                >
                    <img src={item.image} alt=""/>
                    <div className={cls.tags__title}>
                        <h2>{item.name}</h2>
                    </div>
                </motion.div>
            )
        })
    }, [tagList])

    const renderSliderList = useCallback(() => {
        return sliderList.map((item, i) => {
            return (
                <motion.div
                    transition={{duration: 1}}
                    className={cls.slider__item}
                >
                    <img src={item.image} alt=""/>
                    <div
                        className={cls.slider__info}
                        style={isMobile ? null : {paddingRight: (i + 1) % 3 === 0 ? "18rem" : ""}}
                    >
                        <h2>{item.title.length > 25 ? `${item.title.slice(0, 25)}...` : item.title}</h2>
                        <p>{`${
                            isMobile ?
                                item.text.slice(0, 67) :
                                item.text.slice(0, ((i + 1) % 3 === 0 ? 151 : 101))
                        }...`}</p>
                    </div>
                </motion.div>
            )
        })
    }, [sliderList])

    const renderPostsList = useCallback(() => {
        return postsList.map(item => {
            return (
                <motion.div
                    transition={{duration: 1}}
                    className={cls.posts__item}
                >
                    <img src={item?.image} alt=""/>
                    <div className={cls.posts__info}>
                        <h2>{isMobile ? `${item?.title.slice(0, 25)}...` : item?.title}</h2>
                        <p>{item?.text?.slice(0, 93)}...</p>
                    </div>
                </motion.div>
            )
        })
    }, [postsList])


    return (
        <div className={cls.announcement}>
            <div className={cls.title}>
                <h1>News Announcement</h1>
                <div className={cls.title__container}>
                    <span>Chirchir</span>
                    <span>Sergili</span>
                    <span>Xo’jakent</span>
                </div>
            </div>
            <motion.div
                ref={tagCarousel}
                className={cls.tags}
            >
                <motion.div
                    className={cls.tags__wrapper}
                    drag={"x"}
                    dragConstraints={{left: -tagWidth, right: 0}}
                >
                    {renderTagsList()}
                </motion.div>
                <div className={cls.tags__end}/>
            </motion.div>
            <motion.div
                className={cls.slider}
                ref={sliderCarousel}
            >
                <motion.div
                    className={cls.slider__wrapper}
                    drag={"x"}
                    dragConstraints={{left: -sliderWidth, right: 0}}
                >
                    {renderSliderList()}
                </motion.div>
            </motion.div>
            <div className={cls.posts}>
                <div className={cls.posts__pseudo}/>
                <h2 className={cls.posts__title}>Popular posts</h2>
                <motion.div
                    ref={postCarousel}
                    className={cls.posts__container}
                >
                    <motion.div
                        className={cls.posts__wrapper}
                        drag={"x"}
                        dragConstraints={{left: -postWidth, right: 0}}
                    >
                        {renderPostsList()}
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
