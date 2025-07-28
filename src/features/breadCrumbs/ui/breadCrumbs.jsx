import {useLocation, useParams} from "react-router";
import {useCallback, useEffect, useMemo, useState} from "react";

import {Link} from "shared/ui/link";

import cls from "./breadCrumbs.module.sass";
import {useSelector} from "react-redux";
import {getBranch} from "../../branchSwitcher";

export const BreadCrumbs = ({defaultLink}) => {

    const location = useLocation()
    // const {id} = useParams()
    const {id} = useSelector(getBranch)
    const [crumbsData, setCrumbsData] = useState([])
    const [locationHistory, setLocationHistory] = useState("")
    const [crumbsStory, setCrumbsStory] = useState([])
    // let uniqueCrumbsStory = useMemo(() => [...new Set(crumbsStory)], [crumbsStory])

    useEffect(() => {
        // if (locationHistory !== changeLocations.pathname) {
        //     setLocationHistory(changeLocations.pathname)
            setCrumbsData(
                location.pathname.split('/')
                    .filter(crumb => crumb !== "")
            )
        // }
    }, [location, id])


    // useEffect(() => {
    //     setCrumbsStory(
    //         arr => uniqueCrumbsStory[1] === crumbsData[1] ? [...arr, ...crumbsData] : crumbsData
    //     )
    // }, [crumbsData])

    let currentLink= ''

    const renderCrumbs = useCallback(() => {
        // return uniqueCrumbsStory.map((crumb, index) => {
        return crumbsData.map((crumb, index) => {

            currentLink += `/${crumb}`

            if (crumb === defaultLink) return null
            return (
                <div
                    key={index}
                    className={cls.breadCrumbs__item}
                >
                    <Link
                        to={currentLink}
                        extraClass={cls.breadCrumbs__item}
                    >
                        {crumb}
                    </Link>
                    {crumbsData.length - 1 === index ? null : <span>/</span>}
                    {/*{uniqueCrumbsStory.length - 1 === index ? null : <span>/</span>}*/}
                </div>
            )
        })
    }, [crumbsData])

    const crumbs = renderCrumbs()

    return (
        <div className={cls.breadCrumbs}>
            {crumbs}
        </div>
    );
};