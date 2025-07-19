import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";


import {getSelectedLocationsByIds} from "features/locations/model/selector/locationsSelector";
import {MultiPageList} from "../MultiPageList/MultiPageList";


import cls from "./MultiPage.module.sass"
import {Routes} from "react-router-dom";
import {Outlet, Route, useNavigate} from "react-router";
import {onChangedPage, onChangedOldPage, onChangedOldLength} from "../../model/slice/multiPageSlice";
import {
    getMultiChangePage,
    getMultiPageData,
    getMultiOldPage,
    getMultiOldLength
} from "../../model/selector/multiPageSelector";
import {fetchMultiPageDataThunk} from "../../model/thunk/multiPageThunk";
import {getBranch} from "features/branchSwitcher";


export const MultiPage = ({types, children, page, id = true, isMultiPage = false}) => {

    // console.log("render2")


    const dispatch = useDispatch()

    const locations = useSelector(getSelectedLocationsByIds)
    const branch = useSelector(getBranch)
    const data = useSelector(getMultiPageData)
    const changedPage = useSelector(getMultiChangePage)
    const oldPage = useSelector(getMultiOldPage)
    const currentOldLength = useSelector(getMultiOldLength)
    const navigate = useNavigate()
    const [oldLength, setOldLength] = useState(null)

    useEffect(() => {
        if (locations.length > 1 && page !== oldPage) {


            dispatch(onChangedPage(true))
            dispatch(onChangedOldPage(page))
        }
    }, [locations.length, types, page, oldPage])


    useEffect(() => {

        if (!changedPage) {
            navigate(".", {relative: "path"})

        } else {
            dispatch(onChangedPage(false))
        }
    }, [changedPage])


    useEffect(() => {
        const data = {
            types,
            locations
        }
        if (locations.length > 1 && oldLength !== locations.length) {
            setOldLength(locations.length)
            // dispatch(onChangedOldLength(locations.length))
            dispatch(fetchMultiPageDataThunk(data))
        }
    }, [oldLength, locations.length])

    useEffect(() => {
        if (locations.length !== currentOldLength) {
            dispatch(onChangedOldLength(locations.length))
        }
    }, [locations.length])


    // useEffect(() => {
    //     if (locations.length < 2 && branch?.id ) {
    //         navigate(`./${branch.id}`, {relative: "path"})
    //     }
    // },[branch?.id,locations])


    if (locations.length < 2) {
        return children
    }


    if (id) {
        return (
            <div className={cls.locations}>
                <Routes>
                    <Route
                        index
                        element={
                            <MultiPageList id={id} data={data}/>
                        }
                    />
                    <Route path={"*"} element={<ChildComponent children={children}/>}/>
                </Routes>
                <Outlet/>
            </div>
        );
    } else {
        return (
            <MultiPageList id={id} data={data}/>
        )
    }


};


const ChildComponent = ({children}) => {

    return children
}

