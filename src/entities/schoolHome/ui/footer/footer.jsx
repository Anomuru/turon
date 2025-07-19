import cls from "./footer.module.sass"

import turonLogo from "shared/assets/logo/turonLogo.png";
import turonLogoText from "shared/assets/logo/turonLogoText.png";

export const Footer = () => {
    return (
        <div className={cls.footer}>
            {/*<div className={cls.footer_top}>*/}
            {/*    <div className={cls.footer_top_item}>*/}
            {/*        <h2>About us</h2>*/}
            {/*        <ul>*/}
            {/*            <li>Teaching and assesment</li>*/}
            {/*            <li>Student learning and Well-being</li>*/}
            {/*            <li>Community and Home Partnership</li>*/}
            {/*            <li>Premises</li>*/}
            {/*            <li>Staffing</li>*/}
            {/*            <li>Governance Ownership </li>*/}
            {/*        </ul>*/}
            {/*    </div>*/}
            {/*    <div className={cls.footer_top_item}>*/}
            {/*        <h2>Other links</h2>*/}
            {/*        <ul>*/}
            {/*            <li>Education</li>*/}
            {/*            <li>News</li>*/}
            {/*            <li>News</li>*/}
            {/*            <li>Work with us</li>*/}
            {/*            <li>Campus life</li>*/}
            {/*            <li>Academic Calendar</li>*/}
            {/*            <li>Apply</li>*/}
            {/*        </ul>*/}
            {/*    </div>*/}
            {/*    <div className={cls.footer_top_item}>*/}
            {/*        <h2>Contact</h2>*/}
            {/*        <ul>*/}
            {/*            <li>Register</li>*/}
            {/*            <li>Instagram</li>*/}
            {/*            <li>Telegram</li>*/}
            {/*            <li>Facebook</li>*/}
            {/*        </ul>*/}
            {/*    </div>*/}
            {/*</div>*/}
            {/*<hr className={cls.hr}/>*/}
            <div className={cls.footer_bottom}>
                <div className={cls.footer_logo}>
                    <img src={turonLogo} alt=""/>
                    <img src={turonLogoText} alt=""/>
                </div>
                <div className={cls.footer_contact}>
                    <div className={cls.footer__number}>
                        <i className={"fa-solid fa-phone "}/> +998 20 000 55 55
                    </div>

                    <ul className={cls.footer_bottom_ul}>
                        <li className={cls.list}>Social Media</li>
                        <li><a target={"_blank"} href="https://www.instagram.com/turon_international_school/"><i className="fab fa-telegram"/> </a></li>
                        <li><a target={"_blank"} href="https://t.me/tis_info">  <i className="fab fa-instagram"/> </a></li>
                    </ul>

                </div>


            </div>
        </div>
    );
};

