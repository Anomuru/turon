import React, {useEffect} from 'react';
import {useSelector} from "react-redux";
import {getBranch} from "features/branchSwitcher";
import {useNavigate} from "react-router";

const Branch404 = () => {

    const branch = useSelector(getBranch)
    const navigate = useNavigate()


    useEffect(() => {
       if (branch && branch.id) {
           navigate(-2)
       }
    },[branch?.id,navigate])



    return (
        <div>
            <h1>Branch tanlanmagan</h1>
        </div>
    );
};

export default Branch404;