import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {getSelectedLocations} from "features/locations";
import {getBranch} from "features/branchSwitcher";
import {getBranchLoading, getBranchStatus} from "features/branchSwitcher/model/selector/brachSwitcherSelector";
import {useLocation, useNavigate, useParams} from "react-router";
import {useSearchParams} from "react-router-dom";
import {DefaultLoader, DefaultPageLoader} from "shared/ui/defaultLoader";
import {MiniLoader} from "shared/ui/miniLoader";

const RequireBranch = ({children}) => {

    const locations = useSelector(getSelectedLocations)
    const branch = useSelector(getBranch)
    const branchStatus = useSelector(getBranchLoading)
    const {idBranch,id} = useParams()

    const navigate = useNavigate()

    useEffect(() => {
        if (locations.length < 2 && branch?.id && idBranch) {
            navigate(`../${branch.id}` , {relative: "path"})
        }
        // else if (locations.length < 2 && branch?.id && id)  {
        //     navigate(`./${branch.id}`, {relative: "path"})
        // }
    },[branch?.id,locations,navigate,idBranch])


    if (branchStatus) {
        return <DefaultLoader/>
    }

    if (!branch?.id) {
        return <div style={{width: "100%", height: "100%",display: "flex", alignItems: "center", justifyContent: "center"}}>
            <h1 style={{color: "red", fontSize: "3rem"}}>Branch yo'q</h1>
        </div>
    }

    return (
        children
    );
};

export default RequireBranch;