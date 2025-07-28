import cls from "./schoolNews.module.sass"

import homeNews from "shared/assets/icons/news.svg"
import {Button} from "../../../../shared/ui/button";

const data = [
    {
        newsImg: homeNews,
        descr: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever" +
            "since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
        title: "What is Lorem Ipsum?"
    },
    {
        newsImg: homeNews,
        descr: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever" +
            "since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
        title: "What is Lorem Ipsum?"
    },
    {
        newsImg: homeNews,
        descr: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever" +
            "since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
        title: "What is Lorem Ipsum?"
    },
]
export const SchoolNews = () => {

    const renderTable = () => {
        return data.map((item , i ) => (
            <div className={cls.news_box}>
                <div className={cls.news_img}>
                    <img src={item.newsImg} alt=""/>
                </div>

                <div className={cls.news_box_item}>
                    <div className={cls.news_date}>
                        11/11/2022 from admin
                    </div>
                    <div className={cls.news_title}>
                        {item.title}
                    </div>
                    <div className={cls.news_descr}>
                        {item.descr}
                    </div>
                    <Button>
                        Read <i className={"fa fa-angle-right"}/>
                    </Button>
                </div>
            </div>
        ))
    }

    const render = renderTable()
    return (
        <div className={cls.news}>
            <div className={cls.news_header_title}>
                Latest news
            </div>
            <div className={cls.news_wrapper}>
                {render}
            </div>
        </div>
    );
};

